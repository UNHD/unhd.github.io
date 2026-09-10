import * as THREE from "three";
import {
  BASE_Y,
  COLUMN_SPACING,
  ROW_SPACING,
  type ArchiveCell,
  type ArchiveMotion,
} from "./archive-motion.ts";

const edges = [
  [0, 1],
  [2, 3],
  [4, 5],
  [6, 7],
  [0, 2],
  [1, 3],
  [4, 6],
  [5, 7],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
] as const;

/** Recycle beyond the view or the native fog, never at a fixed array edge. */
export class ArchiveWindow {
  private corners = Array.from({ length: 8 }, () => new THREE.Vector3());
  private footprint = new THREE.Box3();
  private cellBounds = new THREE.Box3();
  private point = new THREE.Vector3();
  private center = new THREE.Vector3();
  private halfSize = new THREE.Vector3();
  private range = "";
  private candidates: ArchiveCell[] = [];
  private visible: ArchiveCell[] = [];

  update(
    motion: ArchiveMotion,
    camera: THREE.Camera,
    bounds: THREE.Box3,
    fogFar: number,
    frustum: THREE.Frustum,
  ) {
    let index = 0;
    for (const far of [false, true])
      for (const y of [-1, 1])
        for (const x of [-1, 1]) {
          const point = this.corners[index++];
          point
            .set(x, y, far ? 1 : -1)
            .applyMatrix4(camera.projectionMatrixInverse);
          if (far && -point.z > fogFar) point.multiplyScalar(fogFar / -point.z);
          point.applyMatrix4(camera.matrixWorld);
        }

    // Include the complete entrance/idle waves and the refraction margin.
    // Exact moving mesh bounds are checked below before a cell is submitted.
    const minY = BASE_Y + bounds.min.y - 4;
    const maxY = BASE_Y + bounds.max.y + 4;
    this.footprint.makeEmpty();
    for (const point of this.corners)
      if (point.y >= minY && point.y <= maxY)
        this.footprint.expandByPoint(point);
    for (const [a, b] of edges)
      for (const height of [minY, maxY]) {
        const start = this.corners[a],
          end = this.corners[b];
        if (Math.abs(end.y - start.y) < 0.000001) continue;
        const t = (height - start.y) / (end.y - start.y);
        if (t >= 0 && t <= 1)
          this.footprint.expandByPoint(this.point.copy(start).lerp(end, t));
      }
    this.visible.length = 0;
    if (this.footprint.isEmpty()) return this.visible;
    const margin =
      Math.max(
        Math.abs(bounds.min.x),
        bounds.max.x,
        Math.abs(bounds.min.z),
        bounds.max.z,
      ) + 1;
    this.footprint.expandByScalar(margin);
    const revealOffset = 14 * (1 - motion.reveal);
    const minLane = Math.floor(
      this.footprint.min.x / COLUMN_SPACING + motion.trackLane.value,
    );
    const maxLane = Math.ceil(
      this.footprint.max.x / COLUMN_SPACING + motion.trackLane.value,
    );
    const minRow = Math.floor(
      (this.footprint.min.z + revealOffset) / ROW_SPACING +
        motion.trackRow.value,
    );
    const maxRow = Math.ceil(
      (this.footprint.max.z + revealOffset) / ROW_SPACING +
        motion.trackRow.value,
    );
    const range = `${minLane}:${maxLane}:${minRow}:${maxRow}`;
    if (range !== this.range) {
      this.range = range;
      this.candidates = [];
      for (let lane = minLane; lane <= maxLane; lane++)
        for (let row = minRow; row <= maxRow; row++)
          this.candidates.push({ lane, row });
    }

    const view = camera.matrixWorldInverse.elements;
    for (const cell of this.candidates) {
      this.point.set(...motion.slotPosition(cell));
      this.cellBounds.copy(bounds).translate(this.point).expandByScalar(1);
      if (!frustum.intersectsBox(this.cellBounds)) continue;
      this.cellBounds.getCenter(this.center);
      this.cellBounds.getSize(this.halfSize).multiplyScalar(0.5);
      const nearestDepth =
        -(
          view[2] * this.center.x +
          view[6] * this.center.y +
          view[10] * this.center.z +
          view[14]
        ) -
        Math.abs(view[2]) * this.halfSize.x -
        Math.abs(view[6]) * this.halfSize.y -
        Math.abs(view[10]) * this.halfSize.z;
      const nearestSide =
        Math.abs(
          view[0] * this.center.x +
            view[4] * this.center.y +
            view[8] * this.center.z +
            view[12],
        ) -
        Math.abs(view[0]) * this.halfSize.x -
        Math.abs(view[4]) * this.halfSize.y -
        Math.abs(view[8]) * this.halfSize.z;
      // Match the shader's view-XZ distance. This lower bound on the complete
      // padded box only permits recycling once even its nearest point is fogged.
      const depth = Math.max(0, nearestDepth);
      const side = Math.max(0, nearestSide);
      if (depth * depth + side * side < fogFar * fogFar)
        this.visible.push(cell);
    }
    return this.visible;
  }
}
