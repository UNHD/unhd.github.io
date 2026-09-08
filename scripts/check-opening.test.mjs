import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  OPENING_DURATION,
  GARDEN_REVEAL_AT,
  openingFrame,
  filamentProgress,
  SIGNAL_LINES,
  openingSignalText,
  signalLineFrame,
} from "../src/lycoris/boot-timeline.ts";
import { ArchiveMotion } from "../src/lycoris/archive-motion.ts";

test("opening fades overlap continuously and end with the live garden and complete interface", () => {
  const channels = (frame) => [
    frame.heart,
    frame.ink,
    frame.signal,
    frame.pattern,
    frame.patternTravel,
    frame.flower,
    frame.title,
    frame.titleIn,
    frame.titleOut,
    frame.identityOut,
    frame.subtitle,
    frame.chrome,
    frame.ui,
    frame.progress,
    ...frame.captions,
  ];
  let previous = channels(openingFrame(0));
  for (let t = 1 / 120; t <= OPENING_DURATION + 0.1; t += 1 / 120) {
    const frame = openingFrame(t);
    const values = channels(frame);
    values.forEach((value, i) => {
      assert.ok(Number.isFinite(value) && value >= 0 && value <= 1);
      assert.ok(
        Math.abs(value - previous[i]) < 0.04,
        `a cut at ${t.toFixed(3)}s`,
      );
    });
    if (t > 1)
      assert.ok(
        frame.signal + frame.flower + frame.title + (1 - frame.ink) > 0.4,
        "blank handoff",
      );
    previous = values;
  }
  const end = openingFrame(OPENING_DURATION);
  assert.equal(end.ink, 0);
  assert.equal(end.flower, 0);
  assert.equal(end.title, 0);
  assert.equal(end.chrome, 0);
  assert.equal(end.signal, 0);
  assert.equal(end.pattern, 0);
  assert.equal(end.subtitle, 0);
  assert.equal(end.ui, 1);
});

test("the physical flower sea starts opening before the veil lifts at 30, 60 and 120 fps", () => {
  for (const fps of [30, 60, 120]) {
    const motion = new ArchiveMotion();
    for (let t = 0; t <= OPENING_DURATION; t += 1 / fps) {
      if (t >= GARDEN_REVEAL_AT) motion.revealScene();
      motion.step(1 / fps);
      if (openingFrame(t).ink < 0.97) assert.ok(motion.reveal > 0.4);
    }
    assert.ok(motion.reveal > 0.999);
  }
});

test("the photo-study opening has 36 curled tepals and 42 staggered filament/style traces", async () => {
  const svg = await readFile(
    new URL("../src/lycoris/opening-flower.svg", import.meta.url),
    "utf8",
  );
  assert.equal((svg.match(/class="bloom-petal"/g) ?? []).length, 36);
  const delays = [
    ...svg.matchAll(/class="bloom-filament[^"]*" data-delay="([\d.]+)"/g),
  ].map((match) => Number(match[1]));
  assert.equal(delays.length, 42);
  assert.ok(new Set(delays).size > 20);
  const midDraw = delays.map((delay) => filamentProgress(6, delay));
  assert.ok(Math.max(...midDraw) - Math.min(...midDraw) > 0.45);
  for (const delay of delays) {
    assert.equal(filamentProgress(0, delay), 0);
    assert.equal(filamentProgress(8, delay), 1);
  }
});

test("glitch text preserves its columns, settles into readable lines, and dissolves before the title hold", () => {
  SIGNAL_LINES.forEach((source, row) => {
    for (let t = 0; t <= 4; t += 1 / 30) {
      const text = openingSignalText(source, t, row);
      assert.equal(text.length, source.length);
      Array.from(source).forEach((char, i) => {
        if (char === " ") assert.equal(text[i], " ");
      });
    }
    assert.notEqual(openingSignalText(source, 0.5, row), source);
    assert.equal(openingSignalText(source, 3.8, row), source);
    assert.equal(signalLineFrame(6.3, row).opacity, 0);
  });
  assert.equal(openingFrame(9.0).title, 1);
  assert.equal(openingFrame(9.0).subtitle, 1);
  assert.equal(openingFrame(9.0).signal, 0);
  assert.equal(openingFrame(9.0).pattern, 1);
});
