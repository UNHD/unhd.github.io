import * as THREE from "three";
import {
  ARRAY_COLUMNS,
  ARRAY_ROWS,
  MODEL_SCALE,
  cellKey,
  fileAtCell,
  type ArchiveCard,
  type ArchiveMotion,
  type ArchiveCell,
} from "./archive-motion.ts";
import {
  ArchiveAppearance,
  type ArchiveSurface,
} from "./archive-appearance.ts";

/** Array, extracted file and returning files share the exact GLB geometry. */
export class SpecimenArray extends THREE.Group {
  readonly instances: THREE.InstancedMesh[] = [];
  readonly distantInstances: THREE.InstancedMesh[] = [];
  readonly distantCells: ArchiveCell[] = [];
  readonly shells: THREE.Mesh[] = [];
  readonly models = new Map<ArchiveCard, THREE.Group>();
  readonly surfaces = new Map<ArchiveCard, ArchiveSurface>();
  readonly template = new THREE.Group();
  readonly bounds: THREE.Box3;
  cells: ArchiveCell[] = [];
  private dummy = new THREE.Object3D();
  private arrayLabels: THREE.Object3D[] = [];
  private label?: (index: number) => THREE.Object3D;
  private appearance = new ArchiveAppearance();
  private lastTime = 0;
  readonly renderedCells: ArchiveCell[] = [];
  private frustum = new THREE.Frustum();
  private viewProjection = new THREE.Matrix4();
  private cellBounds = new THREE.Box3();
  private distantKeys = new Set<string>();

  constructor(source: THREE.Group, label?: (index: number) => THREE.Object3D) {
    super();
    this.label = label;
    source.updateMatrixWorld(true);
    const count = ARRAY_COLUMNS * ARRAY_ROWS;
    source.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      let geometry = object.geometry
        .clone()
        .applyMatrix4(object.matrixWorld)
        .scale(MODEL_SCALE, MODEL_SCALE, MODEL_SCALE);
      const sourceMaterial = object.material as THREE.MeshStandardMaterial;
      if (sourceMaterial.name.includes("Glass")) {
        geometry.computeBoundingBox();
        const { min, max } = geometry.boundingBox!;
        const cover = new THREE.CylinderGeometry(
          max.x,
          max.x,
          max.y - min.y,
          64,
          12,
        );
        cover.translate(0, (min.y + max.y) / 2, 0);
        geometry.dispose();
        geometry = cover;
      }
      const material = this.appearance.dormant(
        sourceMaterial,
        object.userData.assemblyPart,
      );
      const mesh = new THREE.Mesh(geometry, material);
      mesh.userData = { ...object.userData };
      this.template.add(mesh);
      if (sourceMaterial.name.includes("Glass")) {
        // Transparent shells need individual depth sorting with the extracted
        // specimen. A single instanced draw cannot interleave those surfaces.
        for (let i = 0; i < count; i++) {
          const shell = new THREE.Mesh(geometry, material);
          this.shells.push(shell);
          this.add(shell);
        }
      } else {
        const instanced = new THREE.InstancedMesh(geometry, material, count);
        instanced.userData = { ...object.userData };
        instanced.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        instanced.frustumCulled = false;
        this.instances.push(instanced);
        this.add(instanced);
      }
    });
    this.bounds = new THREE.Box3().setFromObject(this.template);
    if (label)
      for (let i = 0; i < count; i++) {
        const anchor = new THREE.Group();
        anchor.userData.record = -1;
        this.arrayLabels.push(anchor);
        this.add(anchor);
      }
  }

  /** Re-sampled source curves are used only for distant, frosted specimens. */
  setDistantSource(source: THREE.Group) {
    source.updateMatrixWorld(true);
    const materialKey = (name: string) =>
      name.split("__")[0].replace(/\.\d+$/, "");
    source.traverse((mesh) => {
      if (!(mesh instanceof THREE.Mesh) || Array.isArray(mesh.material)) return;
      const original = this.instances.find(
        (instance) =>
          instance.userData.assemblyPart === mesh.userData.assemblyPart &&
          materialKey((instance.material as THREE.Material).name) ===
            materialKey((mesh.material as THREE.Material).name),
      );
      if (!original) return;
      const geometry = mesh.geometry
        .clone()
        .applyMatrix4(mesh.matrixWorld)
        .scale(MODEL_SCALE, MODEL_SCALE, MODEL_SCALE);
      const instance = new THREE.InstancedMesh(
        geometry,
        original.material,
        ARRAY_COLUMNS * ARRAY_ROWS,
      );
      instance.count = 0;
      instance.frustumCulled = false;
      instance.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      this.distantInstances.push(instance);
      this.add(instance);
    });
  }

  sync(motion: ArchiveMotion, camera?: THREE.Camera) {
    const dt = Math.min(0.05, Math.max(0, motion.time - this.lastTime));
    this.lastTime = motion.time;
    this.visible = motion.reveal > 0.001;
    this.appearance.setFocus(motion.position(motion.selected));
    const cards = [motion.selected, ...motion.outgoing];
    const live = new Set(cards);
    for (const [card, model] of this.models)
      if (!live.has(card)) {
        this.appearance.release(this.surfaces.get(card)!);
        this.surfaces.delete(card);
        this.remove(model);
        this.models.delete(card);
      }
    for (const card of cards) {
      let model = this.models.get(card);
      if (!model) {
        model = this.template.clone(true);
        if (this.label) model.add(this.label(card.index));
        model.userData.archiveCard = card;
        this.models.set(card, model);
        this.surfaces.set(
          card,
          this.appearance.prepare(model, card.index, motion.time),
        );
        this.add(model);
      }
      model.position.set(...motion.position(card));
      model.rotation.y = card.rotation;
      this.appearance.update(
        this.surfaces.get(card)!,
        card === motion.selected && motion.revealTarget > 0,
        motion.time,
        dt,
        motion.reduced,
      );
    }
    const owned = new Set(cards.map((card) => cellKey(card.cell)));
    this.cells = motion.cells;
    this.renderedCells.length = 0;
    this.distantCells.length = 0;
    const nextDistantKeys = new Set<string>();
    const focus = motion.slotPosition(motion.selected.cell);
    if (camera) {
      camera.updateMatrixWorld();
      this.viewProjection.multiplyMatrices(
        camera.projectionMatrix,
        camera.matrixWorldInverse,
      );
      this.frustum.setFromProjectionMatrix(this.viewProjection);
    }
    this.cells.forEach((cell, i) => {
      const hidden = owned.has(cellKey(cell));
      this.dummy.position.set(...motion.slotPosition(cell));
      // Keep a generous refraction margin. Only completely off-screen chambers
      // are omitted; visible flowers retain the original, full-detail geometry.
      this.cellBounds.copy(this.bounds).translate(this.dummy.position);
      this.cellBounds.expandByScalar(1);
      const visible =
        !hidden && (!camera || this.frustum.intersectsBox(this.cellBounds));
      if (visible) {
        const key = cellKey(cell);
        const nearby =
          Math.hypot(
            this.dummy.position.x - focus[0],
            this.dummy.position.z - focus[2],
          ) < 6.5;
        const distant =
          this.distantInstances.length === this.instances.length &&
          camera &&
          !nearby &&
          this.dummy.position.distanceTo(camera.position) >
            (this.distantKeys.has(key) ? 24 : 28);
        const cells = distant ? this.distantCells : this.renderedCells;
        const instances = distant ? this.distantInstances : this.instances;
        if (distant) nextDistantKeys.add(key);
        this.dummy.updateMatrix();
        for (const instance of instances)
          instance.setMatrixAt(cells.length, this.dummy.matrix);
        cells.push(cell);
      }
      const shell = this.shells[i];
      shell.visible = visible;
      shell.position.copy(this.dummy.position);
      shell.userData.archiveCell = cell;
      const anchor = this.arrayLabels[i];
      if (anchor) {
        const index = fileAtCell(cell);
        if (anchor.userData.record !== index) {
          anchor.clear();
          anchor.add(this.label!(index));
          anchor.userData.record = index;
        }
        anchor.visible = visible;
        anchor.position.copy(this.dummy.position);
      }
    });
    this.distantKeys = nextDistantKeys;
    for (const [instances, cells] of [
      [this.instances, this.renderedCells],
      [this.distantInstances, this.distantCells],
    ] as const)
      for (const instance of instances) {
        instance.count = cells.length;
        instance.instanceMatrix.clearUpdateRanges();
        if (instance.count)
          instance.instanceMatrix.addUpdateRange(0, instance.count * 16);
        instance.instanceMatrix.needsUpdate = true;
        instance.boundingSphere = null;
      }
  }

  cellFromHit(hit: THREE.Intersection): ArchiveCell | undefined {
    if (hit.instanceId !== undefined)
      return (
        this.distantInstances.includes(hit.object as THREE.InstancedMesh)
          ? this.distantCells
          : this.renderedCells
      )[hit.instanceId];
    if (hit.object.userData.archiveCell) return hit.object.userData.archiveCell;
    let object: THREE.Object3D | null = hit.object;
    while (object && object !== this) {
      if (object.userData.archiveCard) return object.userData.archiveCard.cell;
      object = object.parent;
    }
  }
}
