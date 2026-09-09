import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  Box3,
  Camera,
  Frustum,
  Matrix4,
  Vector3,
  Vector4,
  PerspectiveCamera,
  Raycaster,
} from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import {
  ArchiveSelection,
  records,
  CODE_ARCHIVE_ID,
  parts,
} from "../src/lycoris/data.ts";
import {
  ArchiveMotion,
  cellKey,
  fileAtCell,
  selectionWave,
  INSPECTION_LIFT,
  PREVIEW_LIFT,
  ARRAY_COLUMNS,
  ARRAY_ROWS,
} from "../src/lycoris/archive-motion.ts";
import { SpecimenArray } from "../src/lycoris/archive-array.ts";
import {
  FlowerPostEffects,
  cropFlowerCamera,
} from "../src/lycoris/flower-post.ts";
import { updateArchiveCamera } from "../src/lycoris/archive-camera.ts";
import { fitInspectorBounds } from "../src/lycoris/inspector-framing.ts";
import {
  MAX_GLITCH_SHIFT,
  DORMANT_GLASS_OPACITY,
  DORMANT_GLASS_ROUGHNESS,
} from "../src/lycoris/archive-appearance.ts";

const close = (actual, expected, tolerance = 1e-6) =>
  assert.ok(
    Math.abs(actual - expected) < tolerance,
    actual + " != " + expected,
  );
function advance(motion, seconds, each = () => {}, fps = 60) {
  for (let i = 0; i < seconds * fps; i++) {
    motion.step(1 / fps);
    each(1 / fps);
  }
}
function settled() {
  const motion = new ArchiveMotion();
  motion.revealScene();
  advance(motion, 6);
  return motion;
}
const source = readFile(
  new URL("../public/assets/lycoris-specimen.glb", import.meta.url),
)
  .then((buffer) =>
    new GLTFLoader().parseAsync(
      buffer.buffer.slice(
        buffer.byteOffset,
        buffer.byteOffset + buffer.byteLength,
      ),
      "",
    ),
  )
  .then((gltf) => gltf.scene);

test("structure framing keeps the production flower and all six expanded parts inside wide and mobile views", async () => {
  const model = (await source).clone(true);
  model.rotation.y = 0.3;
  const bounds = new Box3().setFromObject(model);
  model.traverse((mesh) => {
    if (!mesh.isMesh) return;
    const part = parts.find((part) => part.id === mesh.userData.assemblyPart);
    if (part) mesh.position.add(new Vector3().fromArray(part.offset));
  });
  bounds.union(new Box3().setFromObject(model));
  for (const aspect of [0.65, 1, 3.3]) {
    const camera = new PerspectiveCamera(34, aspect, 0.1, 150);
    const target = new Vector3();
    camera.position.set(5.3, 2.5, 9.8);
    camera.lookAt(target);
    const direction = camera.getWorldDirection(new Vector3());
    fitInspectorBounds(camera, target, bounds);
    assert.ok(
      camera.getWorldDirection(new Vector3()).distanceTo(direction) < 1e-6,
    );
    for (const x of [bounds.min.x, bounds.max.x])
      for (const y of [bounds.min.y, bounds.max.y])
        for (const z of [bounds.min.z, bounds.max.z]) {
          const point = new Vector3(x, y, z).project(camera);
          assert.ok(
            Math.abs(point.x) <= 0.85,
            `horizontal clipping at aspect ${aspect}`,
          );
          assert.ok(
            Math.abs(point.y) <= 0.85,
            `vertical clipping at aspect ${aspect}`,
          );
          assert.ok(point.z > -1 && point.z < 1);
        }
  }
});

test("buttons, category memory, search and picking resolve the same physical archive cell", () => {
  const selection = new ArchiveSelection();
  for (let i = 0; i < 160; i++) {
    selection.stepRow(i % 3 === 0 ? -1 : 1);
    if (i % 9 === 0) selection.stepCategory(-1);
    if (i % 13 === 0) selection.stepCategory(1);
    assert.equal(
      fileAtCell({ lane: selection.laneTravel, row: selection.rowTravel }),
      selection.index,
    );
  }
  selection.select(37);
  assert.equal(
    fileAtCell({ lane: selection.laneTravel, row: selection.rowTravel }),
    37,
  );
  const clicked = { lane: -11, row: 23 };
  selection.select(fileAtCell(clicked), clicked);
  assert.deepEqual(
    { lane: selection.laneTravel, row: selection.rowTravel },
    clicked,
  );
  const row = selection.rowTravel;
  selection.stepRow(1);
  assert.equal(selection.rowTravel, row + 1);
  assert.equal(selection.index, 32);
});

test("extraction changes elevation at the selected slot and enables rotation only after clearance", () => {
  const motion = settled();
  const selected = motion.selected;
  close(selected.lift.value, PREVIEW_LIFT);
  assert.equal(motion.canRotate, false);
  motion.setDetail(true);
  let unlocked = false;
  advance(motion, 5, () => {
    assert.equal(motion.selected, selected);
    const position = motion.position(selected);
    const slot = motion.slotPosition(selected.cell);
    close(position[0], slot[0]);
    close(position[2], slot[2]);
    if (motion.canRotate) {
      assert.ok(motion.clearance > 0.3);
      assert.ok(selected.lift.value > 3.7);
      unlocked = true;
    }
  });
  assert.ok(unlocked);
  close(selected.lift.value, INSPECTION_LIFT);
  assert.equal(motion.phase, "ready");
});

test("return holds world height until aligned, then descends and pulls the camera back", () => {
  for (const fps of [30, 60, 120]) {
    const motion = settled();
    motion.setDetail(true);
    advance(motion, 4, undefined, fps);
    motion.rotationTarget = 1.5;
    advance(motion, 2, undefined, fps);
    motion.setDetail(false);
    const held = motion.position(motion.selected)[1];
    let aligned = false;
    advance(
      motion,
      2,
      () => {
        if (motion.selected.rotation !== 0) {
          close(motion.position(motion.selected)[1], held);
          assert.equal(motion.phase, "aligning");
          assert.ok(motion.detail > 0.98);
        } else aligned = true;
      },
      fps,
    );
    assert.ok(aligned);
    advance(motion, 4, undefined, fps);
    close(motion.selected.lift.value, PREVIEW_LIFT);
    assert.equal(motion.selected.rotation, 0);
    assert.ok(motion.detail < 0.001);
  }
});

test("changing selection preserves outgoing alignment and rapid reselect reuses its exact pose", () => {
  const motion = settled();
  motion.setDetail(true);
  advance(motion, 4);
  motion.rotationTarget = -2.1;
  advance(motion, 2);
  motion.setDetail(false);
  const first = motion.selected;
  const y = motion.position(first)[1];
  motion.select({ lane: 0, row: 1 });
  assert.equal(motion.outgoing[0], first);
  advance(motion, 0.3, () => close(motion.position(first)[1], y));
  const pose = structuredClone(first);
  motion.select({ lane: 0, row: 0 });
  assert.equal(motion.selected, first);
  assert.deepEqual(first, pose);
  assert.ok(!motion.outgoing.includes(first));
  motion.setDetail(true);
  advance(motion, 6);
  assert.equal(motion.outgoing.length, 0);
  assert.ok(motion.canRotate);
});

test("the production GLB array owns exactly one visible copy of each selected and returning cell", async () => {
  const array = new SpecimenArray(await source);
  const motion = settled();
  motion.setBounds(array.bounds.min.y, array.bounds.max.y);
  array.sync(motion);
  assert.equal(array.instances.length, 10);
  assert.equal(array.shells.length, ARRAY_COLUMNS * ARRAY_ROWS);
  assert.equal(array.cells.length, ARRAY_COLUMNS * ARRAY_ROWS);
  const first = motion.selected;
  const extracted = array.models.get(first);
  for (const instance of [...array.instances, array.shells[0]])
    assert.ok(
      extracted.children.some((mesh) => mesh.geometry === instance.geometry),
    );
  motion.setDetail(true);
  advance(motion, 4, () => array.sync(motion));
  assert.equal(array.models.get(first), extracted);
  close(extracted.position.y, motion.position(first)[1]);
  motion.rotationTarget = 1.2;
  advance(motion, 2, () => array.sync(motion));
  motion.setDetail(false);
  motion.select({ lane: 1, row: 0 });
  const matrix = new Matrix4();
  let returnsToInstance = false;
  advance(motion, 7, () => {
    array.sync(motion);
    const owned = new Set(
      [motion.selected, ...motion.outgoing].map((c) => cellKey(c.cell)),
    );
    const rendered = new Set(array.renderedCells.map(cellKey));
    assert.equal(rendered.size, array.instances[0].count);
    array.renderedCells.forEach((cell, i) => {
      array.instances[0].getMatrixAt(i, matrix);
      close(
        new Vector3()
          .setFromMatrixPosition(matrix)
          .distanceTo(new Vector3(...motion.slotPosition(cell))),
        0,
        0.00001,
      );
      assert.deepEqual(array.cellFromHit({ instanceId: i }), cell);
    });
    array.cells.forEach((cell, i) => {
      const visible = rendered.has(cellKey(cell));
      assert.equal(visible, !owned.has(cellKey(cell)));
      assert.equal(
        array.shells[i].visible,
        visible,
        "a transparent shell overlaps its extracted copy",
      );
      if (cellKey(cell) === cellKey(first.cell) && visible)
        returnsToInstance = true;
    });
    if (motion.outgoing.includes(first))
      assert.equal(array.models.get(first), extracted);
  });
  assert.ok(returnsToInstance);
  assert.equal(array.models.size, 1);
  assert.ok(!array.models.has(first));
});

test("actual camera projection keeps the complete specimen framed throughout lift, rotation and return", async () => {
  const array = new SpecimenArray(await source);
  array.bounds.expandByVector(new Vector3(MAX_GLITCH_SHIFT, 0, 0));
  const corners = [];
  for (const x of [array.bounds.min.x, array.bounds.max.x])
    for (const y of [array.bounds.min.y, array.bounds.max.y])
      for (const z of [array.bounds.min.z, array.bounds.max.z])
        corners.push(new Vector3(x, y, z));
  for (const aspect of [0.65, 1.2, 2.0]) {
    const motion = settled();
    const camera = new PerspectiveCamera(34, aspect, 0.1, 150);
    camera.position.set(-16.8, 14, 14.5);
    const aim = new Vector3(0, -0.4, -1);
    advance(motion, 3, (dt) => updateArchiveCamera(camera, aim, motion, dt));
    const wide = camera.position.clone();
    motion.setDetail(true);
    const checkFrame = (dt) => {
      updateArchiveCamera(camera, aim, motion, dt);
      const position = new Vector3(...motion.position(motion.selected));
      const rotation = new Matrix4().makeRotationY(motion.selected.rotation);
      for (const corner of corners) {
        const projected = corner
          .clone()
          .applyMatrix4(rotation)
          .add(position)
          .project(camera);
        assert.ok(
          Math.abs(projected.x) < 1 && Math.abs(projected.y) < 1,
          "specimen clipped at aspect " + aspect + ": " + projected.toArray(),
        );
        assert.ok(projected.z > -1 && projected.z < 1);
      }
    };
    advance(motion, 5, checkFrame);
    assert.ok(camera.position.distanceTo(wide) > 12);
    motion.rotationTarget = Math.PI * 1.75;
    advance(motion, 4, checkFrame);
    motion.setDetail(false);
    advance(motion, 7, checkFrame);
  }
});

test("idle rows keep visibly undulating after entrance and without further input", async () => {
  const motion = settled();
  const array = new SpecimenArray(await source);
  const camera = new PerspectiveCamera(34, 1.2, 0.1, 150);
  camera.position.set(-16.8, 14, 14.5);
  const aim = new Vector3(0, -0.4, -1);
  const matrix = new Matrix4();
  const pixels = [],
    heights = [],
    neighborDifferences = [];
  advance(motion, 6, (dt) => {
    array.sync(motion);
    updateArchiveCamera(camera, aim, motion, dt);
    const i = array.renderedCells.findIndex(
      (cell) => cell.lane === 0 && cell.row === 1,
    );
    array.instances[0].getMatrixAt(i, matrix);
    const point = new Vector3(0, array.bounds.max.y, 0).applyMatrix4(matrix);
    heights.push(point.y);
    pixels.push(point.project(camera).y * 350);
    neighborDifferences.push(
      motion.field({ lane: 0, row: 1 }) - motion.field({ lane: 0, row: 2 }),
    );
  });
  const span = (values) => Math.max(...values) - Math.min(...values);
  assert.ok(span(heights) > 1.0, "idle movement is too small to read");
  assert.ok(
    span(pixels) > 24,
    "idle movement projects to less than 24 pixels at 700px stage height",
  );
  assert.ok(
    span(neighborDifferences) > 0.65,
    "rows move together instead of carrying a wave",
  );
  motion.setDetail(true);
  advance(motion, 5);
  advance(motion, 10, () =>
    assert.ok(
      motion.canRotate,
      "the ongoing swell interrupts inspection clearance",
    ),
  );
});

test("frost dissolves only on the selected specimen, then returns without sharing its animated material", async () => {
  const array = new SpecimenArray(await source);
  const motion = settled();
  array.sync(motion);
  const dormantGlass = array.shells[0].material;
  assert.ok(dormantGlass.isMeshPhysicalMaterial);
  assert.equal(dormantGlass.roughness, DORMANT_GLASS_ROUGHNESS);
  assert.ok(dormantGlass.transmission > 0.9);
  assert.ok(dormantGlass.opacity > 0.65 && dormantGlass.opacity < 0.8);
  assert.ok(dormantGlass.ior > 1.4 && dormantGlass.thickness > 0.2);
  const first = motion.selected;
  advance(motion, 2, () => array.sync(motion));
  const state = array.surfaces.get(first);
  const glassIndex = state.uniforms.findIndex(
    (u) => u.uArchiveShell.value === 1,
  );
  const glass = state.materials[glassIndex];
  const uniforms = state.uniforms[glassIndex];
  assert.notEqual(glass, dormantGlass);
  assert.ok(glass.opacity < 0.04 && glass.roughness < 0.2);
  assert.ok(uniforms.uArchiveSelect.value > 0.99);
  assert.ok(uniforms.uArchiveAge.value > 1.9);
  const time = uniforms.uArchiveTime.value;
  advance(motion, 0.3, () => array.sync(motion));
  assert.ok(
    uniforms.uArchiveTime.value > time,
    "the data stream clock stopped",
  );
  motion.select({ lane: 0, row: 1 });
  advance(motion, 0.6, () => array.sync(motion));
  assert.ok(glass.opacity > 0.55 && glass.roughness > 0.55);
  assert.equal(dormantGlass.opacity, DORMANT_GLASS_OPACITY);
  motion.select({ lane: 0, row: 0 });
  array.sync(motion);
  assert.equal(array.surfaces.get(first), state);
  advance(motion, 1.5, () => array.sync(motion));
  assert.ok(uniforms.uArchiveSelect.value > 0.99);
  motion.reduced = true;
  advance(motion, 1, () => array.sync(motion));
  assert.equal(uniforms.uArchiveFault.value, 0);
  assert.equal(uniforms.uArchiveTime.value, 0);
  assert.ok(
    glass.opacity < 0.04,
    "reduced motion should preserve the selected appearance",
  );
});

test("transparent chambers have separate world depths and picking keeps the nearest physical cell", async () => {
  const array = new SpecimenArray(await source);
  const motion = settled();
  array.sync(motion);
  array.updateMatrixWorld(true);
  const visible = array.shells.filter((shell) => shell.visible);
  assert.ok(
    visible.every((shell) => !shell.isInstancedMesh && shell.renderOrder === 0),
  );
  const depths = visible.map(
    (shell) => new Vector3().setFromMatrixPosition(shell.matrixWorld).z,
  );
  assert.ok(new Set(depths).size >= ARRAY_ROWS);
  const ray = new Raycaster(new Vector3(4.2, -1.3, 30), new Vector3(0, 0, -1));
  const hits = ray.intersectObjects(visible);
  assert.ok(hits.length > 1);
  assert.deepEqual(array.cellFromHit(hits[0]), { lane: 1, row: 4 });
  const current = array.surfaces.get(motion.selected);
  const focus = current.uniforms[0].uArchiveFocus.value;
  const position = motion.position(motion.selected);
  close(focus.x, position[0]);
  close(focus.y, position[1] + 0.12);
  close(focus.z, position[2]);
});

test("post effects follow only the selected GLB flower through extraction, reselection and the structure view", async () => {
  const array = new SpecimenArray(await source);
  const motion = settled();
  const post = new FlowerPostEffects();
  const sync = () => {
    array.sync(motion);
    post.update(
      array.models.get(motion.selected),
      array.surfaces.get(motion.selected),
      1 / 60,
      false,
      array.shells,
    );
  };
  sync();
  const first = motion.selected;
  const firstModel = array.models.get(first);
  assert.equal(post.mask.flowers.size, 6);
  assert.deepEqual(
    new Set(
      [...post.mask.flowers.keys()].map((mesh) => mesh.userData.assemblyPart),
    ),
    new Set(["petals", "stamens", "pedicels", "stem"]),
  );
  motion.setDetail(true);
  advance(motion, 4, () => {
    sync();
    for (const [flower, proxy] of post.mask.flowers) {
      assert.equal(proxy.geometry, flower.geometry);
      assert.deepEqual(proxy.matrix.elements, flower.matrixWorld.elements);
      assert.equal(flower.parent, firstModel);
    }
  });
  motion.select({ lane: 1, row: 0 });
  sync();
  for (const flower of post.mask.flowers.keys()) {
    assert.equal(flower.parent, array.models.get(motion.selected));
    assert.notEqual(flower.parent, firstModel);
  }
  const inspector = (await source).clone(true);
  inspector.position.set(2, 3, -1);
  inspector.rotation.y = 0.8;
  const petal = inspector.children.find(
    (mesh) => mesh.userData.assemblyPart === "petals",
  );
  petal.position.x += 1.7;
  post.update(inspector, array.surfaces.get(motion.selected), 1 / 60, false);
  for (const [flower, proxy] of post.mask.flowers) {
    assert.equal(flower.parent, inspector);
    assert.deepEqual(proxy.matrix.elements, flower.matrixWorld.elements);
  }
  assert.ok(post.mask.bounds.max.x > 3);
  post.update(undefined, undefined, 0, false);
  assert.equal(post.mask.flowers.size, 0);
  assert.equal(post.mask.scene.children.length, 0);
  post.dispose();
});

test("frustum compaction retains every visible full-detail flower through camera and selection transitions", async () => {
  const array = new SpecimenArray(await source);
  const motion = settled();
  const camera = new PerspectiveCamera(34, 1.6, 0.1, 150);
  const aim = new Vector3(0, -0.4, -1);
  const frustum = new Frustum();
  const box = new Box3();
  let minimumCount = 63;
  for (const aspect of [1.6, 0.6]) {
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    motion.select({ lane: 3, row: -4 });
    motion.setDetail(aspect === 0.6);
    advance(motion, 4, (dt) => {
      updateArchiveCamera(camera, aim, motion, dt);
      array.sync(motion, camera);
      minimumCount = Math.min(minimumCount, array.instances[0].count);
      frustum.setFromProjectionMatrix(
        new Matrix4().multiplyMatrices(
          camera.projectionMatrix,
          camera.matrixWorldInverse,
        ),
      );
      const owned = new Set(
        [motion.selected, ...motion.outgoing].map((card) => cellKey(card.cell)),
      );
      const rendered = new Set(array.renderedCells.map(cellKey));
      for (const cell of motion.cells) {
        if (owned.has(cellKey(cell))) {
          assert.ok(!rendered.has(cellKey(cell)));
          continue;
        }
        box
          .copy(array.bounds)
          .translate(new Vector3(...motion.slotPosition(cell)));
        if (frustum.intersectsBox(box))
          assert.ok(rendered.has(cellKey(cell)), "a visible flower was culled");
      }
      array.renderedCells.forEach((cell, i) =>
        assert.deepEqual(array.cellFromHit({ instanceId: i }), cell),
      );
    });
  }
  assert.ok(minimumCount < 40, "off-screen geometry is still submitted");
});

test("cropped flower mask preserves screen pixel correspondence and scene depth", () => {
  const camera = new PerspectiveCamera(34, 1.6, 0.1, 150);
  camera.position.set(-16, 14, 14);
  camera.lookAt(0, -0.4, -1);
  camera.updateMatrixWorld();
  const maskCamera = new Camera();
  for (const rect of [
    new Vector4(0, 0, 1, 1),
    new Vector4(0.25, 0.15, 0.3, 0.5),
    new Vector4(0.8, 0.6, 0.2, 0.4),
  ]) {
    cropFlowerCamera(camera, maskCamera, rect);
    maskCamera.updateMatrixWorld();
    for (const point of [
      new Vector3(0, 1, 0),
      new Vector3(2, -1, -2),
      new Vector3(-3, 4, 5),
    ]) {
      const main = point.clone().project(camera);
      const mask = point.clone().project(maskCamera);
      close((mask.x + 1) / 2, ((main.x + 1) / 2 - rect.x) / rect.z);
      close((mask.y + 1) / 2, ((main.y + 1) / 2 - rect.y) / rect.w);
      close(mask.z, main.z, 1e-10);
    }
  }
});

test("distant source curves preserve specimen bounds and keep selected and nearby flowers at full detail", async () => {
  const bytes = await readFile(
    new URL("../public/assets/lycoris-distant.glb", import.meta.url),
  );
  const distant = await new GLTFLoader().parseAsync(
    bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
    "",
  );
  const array = new SpecimenArray(await source);
  array.setDistantSource(distant.scene);
  assert.equal(array.distantInstances.length, array.instances.length);
  const triangles = (instances) =>
    instances.reduce((sum, mesh) => sum + mesh.geometry.index.count / 3, 0);
  assert.ok(
    triangles(array.distantInstances) < triangles(array.instances) * 0.6,
  );
  array.distantInstances.forEach((mesh, i) => {
    mesh.geometry.computeBoundingBox();
    const original = array.instances[i];
    original.geometry.computeBoundingBox();
    assert.ok(
      mesh.geometry.boundingBox.min.distanceTo(
        original.geometry.boundingBox.min,
      ) < 0.04,
    );
    assert.ok(
      mesh.geometry.boundingBox.max.distanceTo(
        original.geometry.boundingBox.max,
      ) < 0.04,
    );
  });
  const motion = settled();
  const camera = new PerspectiveCamera(34, 1.6, 0.1, 150);
  const aim = new Vector3();
  updateArchiveCamera(camera, aim, motion, 10);
  array.sync(motion, camera);
  assert.ok(array.distantCells.length > 0);
  assert.ok(array.renderedCells.length > 0);
  const selectedFar = { ...array.distantCells[0] };
  motion.select(selectedFar);
  motion.setDetail(true);
  advance(motion, 5, (dt) => {
    updateArchiveCamera(camera, aim, motion, dt);
    array.sync(motion, camera);
    const focus = motion.slotPosition(motion.selected.cell);
    for (const cell of array.distantCells) {
      const position = new Vector3(...motion.slotPosition(cell));
      assert.ok(position.distanceTo(camera.position) > 24);
      assert.ok(
        Math.hypot(position.x - focus[0], position.z - focus[2]) >= 6.5,
      );
    }
    const keys = [...array.renderedCells, ...array.distantCells].map(cellKey);
    assert.equal(new Set(keys).size, keys.length);
    assert.ok(!keys.includes(cellKey(motion.selected.cell)));
    array.distantCells.forEach((cell, i) =>
      assert.deepEqual(
        array.cellFromHit({ object: array.distantInstances[0], instanceId: i }),
        cell,
      ),
    );
  });
  const selected = array.models.get(motion.selected);
  for (const mesh of array.instances)
    assert.ok(
      selected.children.some((part) => part.geometry === mesh.geometry),
    );
});

test("reduced-motion rendering can rest and wakes for selection, extraction, rotation and return", () => {
  const motion = new ArchiveMotion();
  motion.reduced = true;
  for (const action of [
    () => motion.revealScene(),
    () => motion.select({ lane: 2, row: 3 }),
    () => motion.setDetail(true),
    () => {
      motion.rotationTarget = 1.2;
    },
    () => motion.setDetail(false),
  ]) {
    action();
    assert.ok(motion.transitioning);
    advance(motion, 2);
    assert.ok(
      !motion.transitioning,
      "a settled reduced-motion scene keeps drawing",
    );
  }
});

test("flower post clock advances independently of a stationary inspector and reduced motion preserves a static selected signal", async () => {
  const array = new SpecimenArray(await source);
  const motion = settled();
  advance(motion, 2, () => array.sync(motion));
  const post = new FlowerPostEffects();
  const model = array.models.get(motion.selected);
  const state = array.surfaces.get(motion.selected);
  post.setSize(900, 700);
  for (let i = 0; i < 180; i++) post.update(model, state, 1 / 60, false);
  close(post.uniforms.uTime.value, 3);
  close(post.uniforms.uAge.value, 3);
  assert.ok(post.uniforms.uStrength.value > 0.99);
  post.update(model, state, 1 / 60, true);
  assert.equal(post.uniforms.uTime.value, 0);
  assert.equal(post.uniforms.uFault.value, 0);
  assert.equal(post.uniforms.uAge.value, 4);
  assert.ok(post.uniforms.uStrength.value > 0.99);
  assert.deepEqual(post.uniforms.uResolution.value.toArray(), [900, 700]);
  post.dispose();
});

test("the code archive has a cyan flower without recoloring other records or its chamber", async () => {
  const array = new SpecimenArray(await source);
  const motion = settled();
  array.sync(motion);
  const red = array.models.get(motion.selected);
  const colors = red.children.map((mesh) => mesh.material.color.clone());
  const selection = new ArchiveSelection();
  selection.select(
    records.findIndex((record) => record.id === CODE_ARCHIVE_ID),
  );
  motion.select({ lane: selection.laneTravel, row: selection.rowTravel });
  array.sync(motion);
  const cyan = array.models.get(motion.selected);
  const state = array.surfaces.get(motion.selected);
  assert.equal(state.cyan, true);
  cyan.children.forEach((mesh, index) => {
    const part = mesh.userData.assemblyPart;
    assert.ok(red.children[index].material.color.equals(colors[index]));
    if (["petals", "stamens", "pedicels", "stem"].includes(part)) {
      const color = mesh.material.color;
      assert.ok(color.g > color.r && color.b > color.r, part);
    } else assert.ok(mesh.material.color.equals(colors[index]), part);
  });
  const post = new FlowerPostEffects();
  post.update(cyan, state, 1 / 60, false);
  assert.equal(post.uniforms.uCyan.value, 1);
  motion.select({ lane: 0, row: 1 });
  array.sync(motion);
  const next = array.models.get(motion.selected);
  next.children.forEach((mesh, index) => {
    assert.ok(mesh.material.color.equals(colors[index]));
  });
  post.update(next, array.surfaces.get(motion.selected), 1 / 60, false);
  assert.equal(post.uniforms.uCyan.value, 0);
  post.dispose();
});

test("wave keeps its negative trough and reduced motion still completes extraction and return", () => {
  const values = Array.from({ length: 80 }, (_, i) =>
    selectionWave(i / 10, 0.4),
  );
  assert.ok(Math.min(...values) < 0);
  assert.ok(Math.max(...values) > 0);
  const motion = settled();
  motion.reduced = true;
  motion.setDetail(true);
  advance(motion, 1);
  close(motion.selected.lift.value, INSPECTION_LIFT);
  motion.rotationTarget = 1.4;
  advance(motion, 0.5);
  motion.setDetail(false);
  advance(motion, 1);
  close(motion.selected.lift.value, PREVIEW_LIFT);
  assert.equal(motion.selected.rotation, 0);
  assert.equal(motion.phase, "browsing");
});
