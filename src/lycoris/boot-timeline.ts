export const OPENING_DURATION = 17.6;
export const GARDEN_REVEAL_AT = 11.0;

export type OpeningReadiness = "loading" | "ready" | "failed";

/** Keep the veil in place until the model has produced a visible scene frame. */
export class OpeningPlayback {
  elapsed = 0;
  ambientTime = 0;
  private skipAt: number | null = null;
  private revealed = false;

  skip() {
    this.skipAt ??= this.ambientTime;
  }

  advance(dt: number, readiness: OpeningReadiness, presented: boolean) {
    this.ambientTime += dt;
    const waiting =
      readiness === "loading" ||
      (readiness === "ready" && (!this.revealed || !presented));
    this.elapsed = waiting
      ? Math.min(this.elapsed + dt, GARDEN_REVEAL_AT)
      : this.elapsed + dt;
    const requestReveal =
      !this.revealed &&
      ((this.elapsed >= GARDEN_REVEAL_AT && readiness !== "loading") ||
        this.skipAt !== null);
    if (requestReveal) this.revealed = true;
    const skip =
      this.skipAt === null
        ? 0
        : openingEase(this.ambientTime - this.skipAt, 0, 0.65);
    return {
      time: this.elapsed,
      skip,
      requestReveal,
      complete: this.elapsed >= OPENING_DURATION || skip === 1,
    };
  }
}

/** Quintic easing has no velocity or acceleration jump at either end. */
export function openingEase(time: number, start: number, end: number) {
  const t = Math.max(0, Math.min(1, (time - start) / (end - start)));
  return Math.max(0, Math.min(1, t * t * t * (t * (t * 6 - 15) + 10)));
}

export function openingWindow(
  time: number,
  enter: number,
  hold: number,
  leave: number,
  end: number,
) {
  return openingEase(time, enter, hold) * (1 - openingEase(time, leave, end));
}

export function openingFrame(time: number) {
  return {
    phase: time < 5.2 ? "signal" : time < 10.8 ? "identity" : "garden",
    signal: openingWindow(time, 0, 0.8, 4.1, 6.2),
    heart: openingEase(time, 6.15, 9.25),
    ink: 1 - openingEase(time, 11.2, 16.5),
    pattern: openingWindow(time, 3.3, 7.8, 12.6, 16.4),
    patternTravel: openingEase(time, 4, 16.4),
    flower: openingWindow(time, 4.5, 6.4, 11.6, 14.2),
    title: openingWindow(time, 5.9, 8.0, 10.7, 13.3),
    titleIn: openingEase(time, 5.9, 8.0),
    titleOut: openingEase(time, 10.7, 13.3),
    identityOut: openingEase(time, 11.2, 14.2),
    subtitle: openingWindow(time, 7.05, 8.65, 10.6, 12.6),
    chrome: openingWindow(time, 0.35, 1.4, 15.0, 17.25),
    ui: openingEase(time, 14.0, OPENING_DURATION),
    progress: Math.max(0, Math.min(1, time / OPENING_DURATION)),
    captions: [
      openingWindow(time, 0.9, 1.9, 4.05, 5.35),
      openingWindow(time, 5.4, 6.8, 9.8, 11.3),
      openingWindow(time, 11.1, 12.5, 14.7, 16.3),
    ],
  } as const;
}

export const SIGNAL_LINES = [
  "LY-001   /   35.42 N   139.46 E   /   AUTUMN",
  "COROLLA.06  ::  FILAMENT.36  ::  STYLE.06",
  "[ MEMORY FRAGMENTS / PETAL BY PETAL ]",
  "FLOWER : PRESENT      LEAF : ABSENT",
  "L Y C O R I S",
  "R E C A L L I N G   T H E   O T H E R   S H O R E",
  "01001100  01011001  01000011  01001111",
  "HERBARIUM / 040     PHENOLOGY / AUTUMN",
  "[ THE NIGHT REMEMBERS WHAT BLOOMS ]",
] as const;

export function signalLineFrame(time: number, row: number) {
  const order = [4, 2, 6, 0, 8, 3, 5, 1, 7].indexOf(row);
  const enter = 0.12 + order * 0.14;
  const exit = 4.05 + Math.abs(row - 4) * 0.13;
  const reveal = openingEase(time, enter, enter + 1.0);
  const dissolve = openingEase(time, exit, exit + 1.25);
  return {
    opacity: reveal * (1 - dissolve),
    reveal,
    dissolve,
    resolve: openingEase(time, enter + 0.4, 3.2 + order * 0.07),
  };
}

const GLYPHS = "01/:._+*#<>[]-";
/** Deterministic, width-preserving decoding; the resolved text stays still. */
export function openingSignalText(text: string, time: number, row: number) {
  const state = signalLineFrame(time, row);
  const tick = Math.floor(time * 13);
  return Array.from(text, (char, i) => {
    if (char === " ") return char;
    const threshold = ((i * 17 + row * 11) % 43) / 43;
    if (state.resolve >= 1 || threshold < state.resolve) return char;
    return GLYPHS[(i * 7 + row * 3 + tick * ((i % 3) + 1)) % GLYPHS.length];
  }).join("");
}

export function filamentProgress(time: number, delay: number) {
  return openingEase(time, 4.25 + delay * 0.6, 6.8 + delay * 0.6);
}
