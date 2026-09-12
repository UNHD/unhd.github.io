import type { SpecimenScene } from "./scene";
import flowerSvg from "./opening-flower.svg?raw";
import flowerMark from "./flower-mark.svg?raw";
import { ByteStream } from "./byte-stream";
import "./signal-field.css";
import {
  filamentProgress,
  OpeningPlayback,
  type OpeningReadiness,
  openingEase,
  openingFrame,
  SIGNAL_LINES,
  signalLineFrame,
  openingSignalText,
} from "./boot-timeline";
import "./boot.css";

type Trace = {
  path: SVGPathElement;
  delay: number;
  samples: { x: number; y: number }[];
  tip: SVGCircleElement;
  complete: boolean;
};

/** Reuse the photo-study curves as a quiet, layered field behind the title. */
function gardenPattern() {
  const source = new DOMParser().parseFromString(flowerSvg, "image/svg+xml");
  const paths = Array.from(source.querySelectorAll("#bloom-umbel path"));
  const outlines = paths
    .map((path) => `<path d="${path.getAttribute("d")}"/>`)
    .join("");
  const clusters = [
    [110, 185, 0.68, 0.55],
    [405, 155, 0.48, 0.42],
    [755, 110, 0.38, 0.38],
    [1080, 210, 0.52, 0.5],
    [1380, 315, 0.68, 0.65],
    [180, 510, 0.62, 0.55],
    [1175, 535, 0.64, 0.58],
    [710, 565, 0.34, 0.35],
    [40, 790, 1.0, 0.88],
    [430, 770, 0.78, 0.78],
    [860, 865, 0.86, 0.85],
    [1370, 855, 1.1, 0.9],
  ];
  const layer = (start: number, end: number) =>
    clusters
      .slice(start, end)
      .map(
        ([x, y, scale, opacity], i) =>
          `<use href="#bloom-dark-umbel" transform="translate(${x} ${y}) rotate(${i % 2 ? -8 : 5}) scale(${scale})" opacity="${opacity}"/>`,
      )
      .join("");
  return `<svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><g id="bloom-dark-umbel" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">${outlines}<path d="M0 102 C-8 202 12 326 -10 465"/></g><clipPath id="bloom-fault-window"><path d="M0 155h440v16H0z M1030 300h410v22h-410z M0 736h580v12H0z"/></clipPath></defs><g class="bloom-pattern-far">${layer(0, 8)}</g><g class="bloom-pattern-near">${layer(8, 12)}</g><g class="bloom-pattern-echo" clip-path="url(#bloom-fault-window)">${layer(0, 12)}</g></svg>`;
}

export class BootSequence {
  running = false;
  private element?: HTMLElement;
  private root = document.querySelector<HTMLElement>("#stage")!;
  private traces: Trace[] = [];
  private petals: { path: SVGPathElement; delay: number; complete: boolean }[] =
    [];
  private captions: HTMLElement[] = [];
  private signals: { line: HTMLElement; text: HTMLElement }[] = [];
  private stream?: ByteStream;
  private signalTick = -1;
  private signalsComplete = false;
  private frame = 0;
  private playback = new OpeningPlayback();
  private lastTime = 0;
  private readiness: OpeningReadiness = "loading";
  private previousFocus: HTMLElement | null = null;

  constructor(private scene: SpecimenScene) {}

  start() {
    if (this.running) return;
    if (this.scene.reduced) {
      this.scene.revealScene();
      return;
    }
    this.playback = new OpeningPlayback();
    this.signalTick = -1;
    this.signalsComplete = false;
    this.readiness = "loading";
    this.previousFocus = document.activeElement as HTMLElement;
    this.running = true;
    this.scene.hideScene();
    this.element = document.createElement("section");
    this.element.id = "boot-sequence";
    this.element.className = "bloom-opening";
    this.element.setAttribute(
      "aria-label",
      "彼岸开场：文字解码、石蒜显影、夜间花庭",
    );
    this.element.innerHTML = `
      <div class="bloom-veil" aria-hidden="true"></div>
      <div class="bloom-pattern" aria-hidden="true">${gardenPattern()}</div>
      <div class="bloom-atmosphere" aria-hidden="true"></div>
      <div class="bloom-downlink" aria-hidden="true"></div>
      <div class="bloom-dust" aria-hidden="true">${Array.from({ length: 18 }, (_, i) => `<i style="left:${8 + ((i * 41) % 84)}%;top:${12 + ((i * 23) % 67)}%;--dust-index:${i}"></i>`).join("")}</div>
      <div class="bloom-top"><span>LY <i>/</i> 001</span><span>NIGHT GARDEN</span><span>秋 · 夜间观测</span></div>
      <div class="bloom-signal" aria-hidden="true"><div class="bloom-signal-heading"><i></i><span>RECONSTRUCTING A MEMORY</span><i></i></div><div class="bloom-signal-lines">${SIGNAL_LINES.map((_, i) => `<p class="bloom-signal-row${i === 4 ? " bloom-signal-major" : ""}"><span></span></p>`).join("")}</div><div class="bloom-signal-foot"><span>花开时不见叶，叶生时不见花。</span><b></b></div></div>
      <div class="bloom-marginalia" aria-hidden="true"><span>SPECIMEN / 001<br>LYCORIS RADIATA</span><span>06 / COROLLA<br>36 / FILAMENTS</span><span>MEMORY FRAGMENTS<br>35°42′ / 139°46′</span><span>AUTUMN / 09<br>ARCHIVE.040</span></div>
      <div class="bloom-identity">
        <div class="bloom-flower" aria-hidden="true">${flowerMark}</div>
        <div class="bloom-title"><p class="bloom-latin">LYCORIS RADIATA</p><h1 aria-label="彼岸"><span aria-hidden="true"><i>彼</i></span><span aria-hidden="true"><i>岸</i></span></h1></div>
        <div class="bloom-subtitle"><p>夜间花庭</p><span>THE OTHER SHORE</span><i></i></div>
      </div>
      <div class="bloom-captions" aria-hidden="true"><p><small>01 / RECOLLECTION</small><span>拾起盛放的片段</span></p><p><small>02 / RECOGNITION</small><span>花叶错落，各有其时</span></p><p><small>03 / IMMERSION</small><span>循一缕花丝，走入夜色</span></p></div>
      <div class="bloom-bottom"><span class="bloom-edition">LYCORIS <i>—</i> A NOCTURNAL HERBARIUM</span><div class="bloom-progress" aria-hidden="true"><i></i></div><button id="boot-skip"><span>进入花海</span><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 16 15 5M5 5h10v10" stroke="currentColor" stroke-width="1.2"/></svg></button></div>
      <p class="bloom-announcement" role="status">拾起盛放的片段</p>`;
    document.body.appendChild(this.element);
    this.stream = new ByteStream(
      this.element.querySelector(".bloom-downlink")!,
    );
    this.root.inert = true;
    this.root.dataset.opening = "true";
    // A restored scroll position must not leave the renderer outside its viewport.
    this.root.scrollIntoView({ block: "start", behavior: "instant" });
    const tips = this.element.querySelector(".bloom-trace-tips")!;
    this.traces = Array.from(
      this.element.querySelectorAll<SVGPathElement>(".bloom-filament"),
    ).map((path) => {
      const tip = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );
      tip.setAttribute("r", ".8");
      tips.appendChild(tip);
      const length = path.getTotalLength();
      return {
        path,
        tip,
        complete: false,
        delay: Number(path.dataset.delay),
        samples: Array.from({ length: 65 }, (_, i) => {
          const point = path.getPointAtLength((length * i) / 64);
          return { x: point.x, y: point.y };
        }),
      };
    });
    this.petals = Array.from(
      this.element.querySelectorAll<SVGPathElement>(".bloom-petal"),
    ).map((path) => ({
      path,
      delay: Number(path.dataset.delay),
      complete: false,
    }));
    this.captions = Array.from(
      this.element.querySelectorAll<HTMLElement>(".bloom-captions p"),
    );
    this.signals = Array.from(
      this.element.querySelectorAll<HTMLElement>(".bloom-signal-row"),
    ).map((line) => ({ line, text: line.querySelector<HTMLElement>("span")! }));
    const skip = this.element.querySelector<HTMLButtonElement>("#boot-skip")!;
    skip.addEventListener("click", () => this.finish());
    skip.focus({ preventScroll: true });
    void this.scene.ready.then(
      () => {
        this.readiness = "ready";
      },
      () => {
        this.readiness = "failed";
      },
    );
    document.addEventListener("visibilitychange", this.onVisibility);
    window.addEventListener("keydown", this.onKeyDown);
    this.lastTime = performance.now();
    this.update();
  }

  private update = () => {
    if (!this.running || !this.element || document.hidden) return;
    const now = performance.now();
    const dt = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;
    const playback = this.playback.advance(
      dt,
      this.readiness,
      this.scene.hasPresentedScene,
    );
    const t = playback.time;
    this.stream?.update(this.playback.ambientTime);
    const state = openingFrame(t);
    const skip = playback.skip;
    if (playback.requestReveal) this.scene.revealScene();
    const style = this.element.style;
    style.setProperty("--bloom-heart", String(state.heart));
    style.setProperty("--bloom-ink", String(state.ink * (1 - skip)));
    style.setProperty("--bloom-chrome", String(state.chrome * (1 - skip)));
    style.setProperty("--bloom-title", String(state.title * (1 - skip)));
    style.setProperty("--bloom-title-in", String(state.titleIn));
    style.setProperty("--bloom-title-out", String(state.titleOut));
    style.setProperty("--bloom-identity-out", String(state.identityOut));
    style.setProperty("--bloom-flower", String(state.flower * (1 - skip)));
    style.setProperty("--bloom-subtitle", String(state.subtitle * (1 - skip)));
    style.setProperty("--bloom-signal", String(state.signal * (1 - skip)));
    style.setProperty("--bloom-pattern", String(state.pattern * (1 - skip)));
    style.setProperty("--bloom-pattern-travel", String(state.patternTravel));
    style.setProperty("--bloom-progress", String(state.progress));
    style.setProperty(
      "--bloom-breath",
      String((1 + Math.sin(this.playback.ambientTime * 1.7 - 1.1)) / 2),
    );
    this.root.style.setProperty(
      "--opening-ui",
      String(Math.max(state.ui, skip)),
    );
    if (this.element.dataset.phase !== state.phase) {
      this.element.dataset.phase = state.phase;
      this.element.querySelector(".bloom-announcement")!.textContent = {
        signal: "拾起盛放的片段",
        identity: "彼岸，夜间花庭",
        garden: "循一缕花丝，走入夜色",
      }[state.phase];
    }
    this.captions.forEach((caption, i) => {
      const opacity = state.captions[i] * (1 - skip);
      caption.style.opacity = String(opacity);
      caption.style.translate = `0 ${(1 - opacity) * -8}px`;
      caption.style.filter = `blur(${(1 - opacity) * 4}px)`;
    });
    const tick = Math.floor(t * 13);
    if (!this.signalsComplete)
      this.signals.forEach(({ line, text }, i) => {
        const state = signalLineFrame(t, i);
        const fault =
          t < 4.0 && (tick + i * 7) % 23 === 0 ? (i % 2 ? 1 : -1) : 0;
        line.style.opacity = String(state.opacity);
        line.style.transform = `translate(${fault * 2}px, ${(1 - state.reveal) * -14 + state.dissolve * (20 + i * 2)}px)`;
        line.style.filter = `blur(${(1 - state.reveal) * 3 + state.dissolve * 4}px)`;
        line.style.setProperty("--signal-fault", String(fault));
        if (tick !== this.signalTick && t < 6.2) {
          const value = openingSignalText(SIGNAL_LINES[i], t, i);
          if (text.textContent !== value) {
            text.textContent = value;
            text.dataset.echo = value;
          }
        }
      });
    if (t >= 6.2) this.signalsComplete = true;
    this.signalTick = tick;
    for (const trace of this.traces) {
      if (trace.complete) continue;
      const p = filamentProgress(t, trace.delay);
      trace.path.style.strokeDashoffset = String(1 - p);
      const index = Math.min(63, Math.floor(p * 64));
      const fraction = p * 64 - index;
      const from = trace.samples[index],
        to = trace.samples[index + 1];
      trace.tip.setAttribute("cx", String(from.x + (to.x - from.x) * fraction));
      trace.tip.setAttribute("cy", String(from.y + (to.y - from.y) * fraction));
      trace.tip.style.opacity = String(
        openingEase(p, 0, 0.08) * (1 - openingEase(p, 0.8, 1)) * 0.75,
      );
      trace.complete = p === 1;
    }
    for (const petal of this.petals) {
      if (petal.complete) continue;
      const stroke = openingEase(
        t,
        4.9 + petal.delay * 0.5,
        7.05 + petal.delay * 0.5,
      );
      const fill = openingEase(
        t,
        6.0 + petal.delay * 0.5,
        8.25 + petal.delay * 0.5,
      );
      petal.path.style.strokeDashoffset = String(1 - stroke);
      petal.path.style.fillOpacity = String(fill * 0.38);
      petal.complete = stroke === 1 && fill === 1;
    }
    if (playback.complete) {
      this.complete();
      return;
    }
    this.frame = requestAnimationFrame(this.update);
  };

  private onVisibility = () => {
    if (this.element) this.element.dataset.paused = String(document.hidden);
    cancelAnimationFrame(this.frame);
    this.lastTime = performance.now();
    if (!document.hidden && this.running) this.update();
  };

  private onKeyDown = (event: KeyboardEvent) => {
    if (this.running && (event.key === "Enter" || event.key === "Escape")) {
      event.preventDefault();
      if (!event.repeat) this.finish();
    }
  };

  /** Explicit skip still dissolves into the live garden. */
  finish() {
    if (this.running) this.playback.skip();
  }

  private complete() {
    this.running = false;
    this.stream?.dispose();
    this.stream = undefined;
    cancelAnimationFrame(this.frame);
    document.removeEventListener("visibilitychange", this.onVisibility);
    window.removeEventListener("keydown", this.onKeyDown);
    this.scene.revealScene();
    this.root.inert = false;
    delete this.root.dataset.opening;
    this.root.style.removeProperty("--opening-ui");
    this.element?.remove();
    this.element = undefined;
    this.traces = [];
    this.petals = [];
    this.signals = [];
    this.captions = [];
    if (this.previousFocus?.isConnected)
      this.previousFocus.focus({ preventScroll: true });
    else
      this.root
        .querySelector<HTMLElement>('[data-action="open"]')
        ?.focus({ preventScroll: true });
  }

  dispose() {
    if (this.running) this.complete();
  }
}
