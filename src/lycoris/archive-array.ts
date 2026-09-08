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

  sync(motion: ArchiveMotion) {
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
    this.cells.forEach((cell, i) => {
      const hidden = owned.has(cellKey(cell));
      this.dummy.position.set(...motion.slotPosition(cell));
      this.dummy.scale.setScalar(hidden ? 0 : 1);
      this.dummy.updateMatrix();
      for (const instance of this.instances)
        instance.setMatrixAt(i, this.dummy.matrix);
      const shell = this.shells[i];
      shell.visible = !hidden;
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
        anchor.visible = !hidden;
        anchor.position.copy(this.dummy.position);
      }
    });
    for (const instance of this.instances) {
      instance.instanceMatrix.needsUpdate = true;
      instance.boundingSphere = null;
    }
  }

  cellFromHit(hit: THREE.Intersection): ArchiveCell | undefined {
    if (hit.instanceId !== undefined) return this.cells[hit.instanceId];
    if (hit.object.userData.archiveCell) return hit.object.userData.archiveCell;
    let object: THREE.Object3D | null = hit.object;
    while (object && object !== this) {
      if (object.userData.archiveCard) return object.userData.archiveCard.cell;
      object = object.parent;
    }
  }
}
