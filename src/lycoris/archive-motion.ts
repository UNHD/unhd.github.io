import { nearestOccurrence, wrap } from "./data.ts";

export type ArchiveCell = { lane: number; row: number };
export type Spring = { value: number; velocity: number };
export type ArchiveCard = {
  cell: ArchiveCell;
  index: number;
  lift: Spring;
  rotation: number;
  returnY: number | null;
};

export const ARRAY_COLUMNS = 7;
export const ARRAY_ROWS = 9;
export const COLUMN_SPACING = 4.2;
export const ROW_SPACING = 4.0;
export const MODEL_SCALE = 0.8;
export const PREVIEW_LIFT = 0.4;
export const INSPECTION_LIFT = 4.05;
export const BASE_Y = -2;
export const AMBIENT_SWELL = 0.56;
const ALIGNMENT_EPSILON = 0.001;

export const cellKey = (cell: ArchiveCell) => `${cell.lane}:${cell.row}`;
export const fileAtCell = (cell: ArchiveCell) =>
  wrap(cell.lane, 5) * 8 + wrap(cell.row, 8);
export const smooth = (value: number) => {
  const t = Math.max(0, Math.min(1, value));
  return t * t * t * (t * (t * 6 - 15) + 10);
};

// RhineLabUI's critically damped spring and signed selection wave retain the
// original rise/overshoot cadence. Distances are adapted to specimen chambers.
export function damp(s: Spring, target: number, rate: number, dt: number) {
  const delta = s.value - target;
  const impulse = s.velocity + rate * delta;
  const decay = Math.exp(-rate * dt);
  s.value = target + (delta + impulse * dt) * decay;
  s.velocity = (s.velocity - rate * impulse * dt) * decay;
}

export function returnStep(angle: number, dt: number, reduced = false) {
  const next = angle * Math.exp(-dt * (reduced ? 35 : 7));
  return Math.abs(next) <= ALIGNMENT_EPSILON ? 0 : next;
}

export function selectionWave(distance: number, age: number) {
  if (age < 0 || age > 3.2) return 0;
  const front = distance - age * 8;
  return (
    0.8 *
    smooth(age / 0.2) *
    Math.exp(-age * 1.15) *
    Math.cos(front * 0.58) *
    Math.exp(-0.5 * (front / 3.4) ** 2)
  );
}

function cardAt(cell: ArchiveCell): ArchiveCard {
  return {
    cell: { ...cell },
    index: fileAtCell(cell),
    lift: { value: 0, velocity: 0 },
    rotation: 0,
    returnY: null,
  };
}

/** Physical archive ownership is independent of camera and DOM layout. */
export class ArchiveMotion {
  selected = cardAt({ lane: 0, row: 0 });
  outgoing: ArchiveCard[] = [];
  trackLane: Spring = { value: 0, velocity: 0 };
  trackRow: Spring = { value: 0, velocity: 0 };
  detail = 0;
  detailRequested = false;
  rotationTarget = 0;
  reduced = false;
  reveal = 0;
  revealTarget = 0;
  time = 0;
  private revealedAt = -100;
  private pulses: (ArchiveCell & { time: number })[] = [];
  private pulseGain = 1;
  private focusStillness = 0;
  private minY = -2.11 * MODEL_SCALE;
  private maxY = 2.351 * MODEL_SCALE;

  setBounds(minY: number, maxY: number) {
    this.minY = minY;
    this.maxY = maxY;
  }

  revealScene() {
    if (!this.revealTarget) this.revealedAt = this.time;
    this.revealTarget = 1;
  }

  select(cell: ArchiveCell) {
    if (cellKey(cell) === cellKey(this.selected.cell)) return;
    const old = this.selected;
    if (old.lift.value > 0.00001 || old.rotation !== 0) {
      if (old.rotation !== 0 && old.returnY === null)
        old.returnY = this.position(old)[1];
      this.outgoing.push(old);
    }
    const returning = this.outgoing.findIndex(
      (card) => cellKey(card.cell) === cellKey(cell),
    );
    // Reselect the actual returning card, including its velocity and pose.
    this.selected =
      returning < 0 ? cardAt(cell) : this.outgoing.splice(returning, 1)[0];
    this.rotationTarget = 0;
    this.pulses.push({ ...cell, time: this.time });
    this.pulses = this.pulses.slice(-6);
  }

  setDetail(detail: boolean) {
    if (this.detailRequested === detail) return;
    this.detailRequested = detail;
    if (detail) this.selected.returnY = null;
    else {
      this.rotationTarget = 0;
      if (this.selected.rotation !== 0)
        this.selected.returnY = this.position(this.selected)[1];
    }
  }

  get cells(): ArchiveCell[] {
    return Array.from({ length: ARRAY_COLUMNS * ARRAY_ROWS }, (_, index) => ({
      lane: nearestOccurrence(
        Math.floor(index / ARRAY_ROWS),
        this.trackLane.value,
        ARRAY_COLUMNS,
      ),
      row: nearestOccurrence(
        index % ARRAY_ROWS,
        this.trackRow.value,
        ARRAY_ROWS,
      ),
    }));
  }

  field(cell: ArchiveCell) {
    const row = cell.row - this.trackRow.value;
    const lane = cell.lane - this.trackLane.value;
    let height = 0.65 * Math.exp(-0.5 * (row / 1.8) ** 2 - (lane / 1.1) ** 2);
    if (this.reduced) return height;
    const entrance = this.time - this.revealedAt;
    const front = row + lane * 0.65 - (entrance * 9 - 5);
    height +=
      0.65 *
      Math.exp(-0.5 * (front / 2.2) ** 2) *
      smooth(entrance / 0.25) *
      (1 - smooth((entrance - 2) / 1.2));
    // A travelling swell keeps running between selections. Adjacent rows have
    // different phases, so the visible movement is not a whole-scene bob.
    const nearFocus = Math.exp(
      -0.5 * (row / 2.5) ** 2 - 0.5 * (lane / 1.8) ** 2,
    );
    const quiet = 1 - 0.84 * this.focusStillness * nearFocus;
    height +=
      quiet *
      (AMBIENT_SWELL *
        Math.sin(this.time * 1.18 - cell.row * 0.92 + cell.lane * 0.66) +
        0.18 * Math.sin(this.time * 1.73 + cell.row * 0.47 + cell.lane * 1.21));
    let ripple = 0;
    for (const pulse of this.pulses)
      ripple += selectionWave(
        Math.hypot(cell.row - pulse.row, (cell.lane - pulse.lane) * 2.2),
        this.time - pulse.time,
      );
    height += Math.max(-0.6, Math.min(0.6, ripple)) * this.pulseGain;
    return height;
  }

  slotPosition(cell: ArchiveCell): [number, number, number] {
    return [
      (cell.lane - this.trackLane.value) * COLUMN_SPACING,
      BASE_Y + this.field(cell),
      (cell.row - this.trackRow.value) * ROW_SPACING - 14 * (1 - this.reveal),
    ];
  }

  position(card: ArchiveCard): [number, number, number] {
    const position = this.slotPosition(card.cell);
    position[1] += card.lift.value;
    return position;
  }

  get clearance() {
    const { cell } = this.selected;
    let neighborTop = -Infinity;
    for (let lane = cell.lane - 1; lane <= cell.lane + 1; lane++)
      for (let row = cell.row - 2; row <= cell.row + 2; row++) {
        if (lane === cell.lane && row === cell.row) continue;
        neighborTop = Math.max(
          neighborTop,
          this.slotPosition({ lane, row })[1] + this.maxY,
        );
      }
    for (const card of this.outgoing)
      if (
        Math.abs(card.cell.lane - cell.lane) <= 1 &&
        Math.abs(card.cell.row - cell.row) <= 2
      )
        neighborTop = Math.max(neighborTop, this.position(card)[1] + this.maxY);
    return this.position(this.selected)[1] + this.minY - neighborTop;
  }

  get canRotate() {
    return (
      this.detailRequested &&
      this.detail > 0.92 &&
      this.clearance > 0.3 &&
      this.selected.returnY === null
    );
  }

  get phase() {
    if (this.selected.returnY !== null) return "aligning";
    if (this.detailRequested) return this.canRotate ? "ready" : "extracting";
    if (this.selected.lift.value > PREVIEW_LIFT + 0.03 || this.outgoing.length)
      return "returning";
    return "browsing";
  }

  /** Ambient waves are excluded: reduced-motion mode has no travelling field. */
  get transitioning() {
    const springMoving = (spring: Spring, target: number) =>
      Math.abs(spring.value - target) > 0.00001 ||
      Math.abs(spring.velocity) > 0.00001;
    return (
      Math.abs(this.reveal - this.revealTarget) > 0.00001 ||
      Math.abs(this.detail - (this.detailRequested ? 1 : 0)) > 0.00001 ||
      springMoving(this.trackLane, this.selected.cell.lane) ||
      springMoving(this.trackRow, this.selected.cell.row) ||
      springMoving(
        this.selected.lift,
        this.detailRequested ? INSPECTION_LIFT : PREVIEW_LIFT * this.reveal,
      ) ||
      Math.abs(
        this.selected.rotation -
          (this.detailRequested ? this.rotationTarget : 0),
      ) > 0.00001 ||
      this.selected.returnY !== null ||
      this.outgoing.length > 0
    );
  }

  step(dt: number) {
    this.time += dt;
    const blend = 1 - Math.exp(-dt * (this.reduced ? 35 : 3.2));
    this.reveal +=
      (this.revealTarget - this.reveal) *
      (this.reduced ? 1 : 1 - Math.exp(-dt * 2.5));
    damp(this.trackLane, this.selected.cell.lane, this.reduced ? 35 : 3.7, dt);
    damp(this.trackRow, this.selected.cell.row, this.reduced ? 35 : 3.7, dt);
    this.pulses = this.pulses.filter((p) => this.time - p.time < 3.2);
    const inspecting =
      this.detailRequested ||
      this.selected.returnY !== null ||
      this.outgoing.some((old) => old.returnY !== null);
    this.focusStillness +=
      ((inspecting ? 1 : 0) - this.focusStillness) * (1 - Math.exp(-dt * 5));
    this.pulseGain +=
      ((this.detailRequested ||
      this.selected.returnY !== null ||
      this.outgoing.some((old) => old.returnY !== null)
        ? 0
        : 1) -
        this.pulseGain) *
      (1 - Math.exp(-dt * 8));

    const card = this.selected;
    card.rotation =
      this.detailRequested && card.returnY === null
        ? card.rotation + (this.rotationTarget - card.rotation) * blend
        : returnStep(card.rotation, dt, this.reduced);
    this.advanceLift(
      card,
      this.detailRequested ? INSPECTION_LIFT : PREVIEW_LIFT * this.reveal,
      dt,
    );
    for (const old of this.outgoing) {
      old.rotation = returnStep(old.rotation, dt, this.reduced);
      this.advanceLift(old, 0, dt);
    }
    this.outgoing = this.outgoing.filter(
      (old) =>
        old.returnY !== null || old.lift.value > 0.00001 || old.rotation !== 0,
    );

    const cameraTarget =
      card.returnY !== null
        ? this.detail
        : this.detailRequested
          ? smooth((card.lift.value - 0.8) / 2.4)
          : smooth(
              (card.lift.value - PREVIEW_LIFT) /
                (INSPECTION_LIFT - PREVIEW_LIFT),
            );
    this.detail += (cameraTarget - this.detail) * blend;
  }

  private advanceLift(card: ArchiveCard, target: number, dt: number) {
    if (card.returnY !== null) {
      // A turning card stays at the same world height even while the field moves.
      card.lift.value = card.returnY - this.slotPosition(card.cell)[1];
      card.lift.velocity = 0;
      if (card.rotation === 0) card.returnY = null;
    } else damp(card.lift, target, this.reduced ? 35 : 4.2, dt);
  }
}
