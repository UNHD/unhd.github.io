import "./ui-glitch.css";
import { signalFallMarkup } from "./signal-field";

const textTargets = [
  ".brand b",
  "#record-title",
  "#specimen-code",
  "#record-number",
  ".stage-index",
  "#rail-number",
  ".top-status > span",
  ".category-code",
  ".file-chip.selected > span",
  ".detail-identity h1",
  ".detail-identity .micro",
  ".viewer-record",
  ".viewer-header b",
  ".dialog-header h2",
  "#part-count",
  ".footer time",
].join(",");
const lineTargets = ".title-rule, .mini-rule, .chapter-progress, .signal-rule";

/** Brief local signal faults. Text and hit targets keep their real content. */
export class UiGlitch {
  private layer = document.createElement("div");
  private downlink = document.createElement("div");
  private active = new Set<Animation>();
  private timer?: ReturnType<typeof setTimeout>;
  private reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  private lastInput = -Infinity;
  private lastSelection = -Infinity;
  private lastTarget?: HTMLElement;

  constructor(private root: HTMLElement) {
    this.layer.className = "ui-signal-layer";
    this.layer.setAttribute("aria-hidden", "true");
    this.downlink.className = "ui-downlink";
    this.downlink.setAttribute("aria-hidden", "true");
    this.downlink.innerHTML = signalFallMarkup(4);
    root.appendChild(this.downlink);
    root.dataset.uiPaused = String(document.hidden);
    root.appendChild(this.layer);
    root.addEventListener("pointerover", this.onInteraction);
    root.addEventListener("focusin", this.onInteraction);
    document.addEventListener("lycoris:selection", this.onSelection);
    document.addEventListener("visibilitychange", this.onVisibility);
    this.schedule();
  }

  setReduced(reduced: boolean) {
    this.reduced = reduced;
    this.root.dataset.uiMotion = reduced ? "reduced" : "full";
    this.stop();
    this.schedule();
  }

  private get paused() {
    return this.reduced || document.hidden || this.root.inert;
  }

  private available(selector: string) {
    const scope =
      this.root.querySelector<HTMLDialogElement>("dialog[open]") ?? this.root;
    return Array.from(scope.querySelectorAll<HTMLElement>(selector)).filter(
      (element) => {
        const rect = element.getBoundingClientRect();
        return (
          rect.width > 0 &&
          rect.height > 0 &&
          rect.bottom > 0 &&
          rect.top < innerHeight &&
          !element.closest("[inert]")
        );
      },
    );
  }

  private schedule() {
    if (this.reduced || document.hidden) return;
    this.timer = setTimeout(
      () => {
        if (!this.paused && this.active.size < 2) {
          const line = Math.random() < 0.24;
          const candidates = this.available(
            line ? lineTargets : textTargets,
          ).filter((element) => element !== this.lastTarget);
          const target =
            candidates[Math.floor(Math.random() * candidates.length)];
          if (target) {
            this.lastTarget = target;
            this.pulse(target, line);
            if (Math.random() < 0.45) this.scratch(target);
          }
        }
        this.schedule();
      },
      2100 + Math.random() * 3200,
    );
  }

  private track(animation: Animation, finish = () => {}) {
    this.active.add(animation);
    const cleanup = () => {
      this.active.delete(animation);
      finish();
    };
    animation.onfinish = cleanup;
    animation.oncancel = cleanup;
  }

  private pulse(target: HTMLElement, line = false) {
    if (this.paused || this.active.size >= 2) return;
    const cyan = this.root.dataset.flowerColor === "cyan";
    const warm = cyan ? "rgb(93 221 224 / .30)" : "rgb(232 97 83 / .28)";
    const cool = "rgb(139 207 215 / .23)";
    const frames: Keyframe[] = line
      ? [
          { opacity: 1, translate: "0 0", clipPath: "inset(0 0 0 0)" },
          {
            opacity: 0.7,
            translate: "1px 0",
            clipPath: "inset(0 16% 0 34%)",
            offset: 0.28,
          },
          {
            opacity: 0.9,
            translate: "-.5px 0",
            clipPath: "inset(0 7% 0 0)",
            offset: 0.54,
          },
          { opacity: 1, translate: "0 0", clipPath: "inset(0 0 0 0)" },
        ]
      : [
          { textShadow: "none", translate: "0 0", opacity: 1 },
          {
            textShadow: `.7px 0 ${warm}, -.7px 0 ${cool}`,
            translate: "-.35px 0",
            opacity: 0.97,
            offset: 0.25,
          },
          {
            textShadow: `-.5px 0 ${warm}, .5px 0 ${cool}`,
            translate: ".4px 0",
            opacity: 1,
            offset: 0.52,
          },
          { textShadow: "none", translate: "0 0", opacity: 1, offset: 0.76 },
          {
            textShadow: ".25px 0 " + cool,
            translate: "0 0",
            opacity: 1,
            offset: 0.88,
          },
          { textShadow: "none", translate: "0 0", opacity: 1 },
        ];
    this.track(
      target.animate(frames, {
        duration: 140 + Math.random() * 70,
        easing: "steps(1,end)",
      }),
    );
  }

  private scratch(target: HTMLElement) {
    if (this.paused || this.active.size >= 4) return;
    const bounds = target.getBoundingClientRect();
    const origin = this.root.getBoundingClientRect();
    const fragment = document.createElement("span");
    fragment.className = "ui-signal-fragment";
    fragment.style.left = `${Math.max(8, bounds.left - origin.left - 24)}px`;
    fragment.style.top = `${Math.max(0, bounds.top - origin.top - 48)}px`;
    fragment.textContent = "4C\n59\n..\n01\n↓";
    this.layer.appendChild(fragment);
    this.track(
      fragment.animate(
        [
          { opacity: 0, transform: "translateY(-12px)" },
          { opacity: 0.52, transform: "translateY(8px)", offset: 0.16 },
          { opacity: 0.26, transform: "translateY(68px)", offset: 0.66 },
          { opacity: 0, transform: "translateY(118px)" },
        ],
        { duration: 1500, easing: "linear" },
      ),
      () => fragment.remove(),
    );
  }

  private onInteraction = (event: Event) => {
    const target = (event.target as Element).closest<HTMLElement>(
      "button, .brand",
    );
    const now = performance.now();
    if (!target || now - this.lastInput < 850 || this.paused) return;
    if (
      event instanceof PointerEvent &&
      target.contains(event.relatedTarget as Node | null)
    )
      return;
    this.lastInput = now;
    this.pulse(target);
  };

  /** Duplicate only a title's ink, never its controls or accessible content. */
  private textEcho(target: HTMLElement) {
    if (this.paused || this.active.size >= 4) return;
    const bounds = target.getBoundingClientRect();
    const origin = this.root.getBoundingClientRect();
    const style = getComputedStyle(target);
    const echo = document.createElement("span");
    echo.className = "ui-text-echo";
    echo.textContent = target.textContent;
    Object.assign(echo.style, {
      left: `${bounds.left - origin.left}px`,
      top: `${bounds.top - origin.top}px`,
      width: `${bounds.width}px`,
      height: `${bounds.height}px`,
      font: style.font,
      letterSpacing: style.letterSpacing,
      textAlign: style.textAlign,
      overflowWrap: style.overflowWrap,
    });
    this.layer.appendChild(echo);
    this.track(
      echo.animate(
        [
          {
            opacity: 0,
            transform: "translate(0,0)",
            clipPath: "inset(15% 0 68%)",
          },
          {
            opacity: 0.5,
            transform: "translate(4px,1px)",
            clipPath: "inset(15% 0 68%)",
            offset: 0.2,
          },
          {
            opacity: 0.3,
            transform: "translate(-2px,3px)",
            clipPath: "inset(48% 0 38%)",
            offset: 0.45,
          },
          {
            opacity: 0.22,
            transform: "translate(3px,4px)",
            clipPath: "inset(75% 0 12%)",
            offset: 0.7,
          },
          {
            opacity: 0,
            transform: "translate(0,6px)",
            clipPath: "inset(90% 0 0)",
          },
        ],
        { duration: 380, easing: "steps(1,end)" },
      ),
      () => echo.remove(),
    );
  }

  revealContent(target: HTMLElement) {
    if (this.paused || this.active.size >= 4) return;
    this.track(
      target.animate(
        [
          {
            opacity: 0.25,
            transform: "translateY(-8px)",
            clipPath: "inset(0 0 65%)",
          },
          {
            opacity: 0.82,
            transform: "translateY(-2px)",
            clipPath: "inset(0 0 12%)",
            offset: 0.5,
          },
          { opacity: 1, transform: "translateY(0)", clipPath: "inset(0)" },
        ],
        { duration: 620, easing: "cubic-bezier(.2,.7,.2,1)" },
      ),
    );
    this.scratch(target);
  }

  private onSelection = () => {
    const now = performance.now();
    if (this.paused || now - this.lastSelection < 160) return;
    this.lastSelection = now;
    for (const animation of this.active) animation.cancel();
    const target = this.available("#record-title, .detail-identity h1")[0];
    if (target) {
      this.pulse(target);
      this.textEcho(target);
      this.scratch(target);
    }
  };

  private onVisibility = () => {
    this.root.dataset.uiPaused = String(document.hidden);
    this.stop();
    this.schedule();
  };

  private stop() {
    clearTimeout(this.timer);
    this.timer = undefined;
    for (const animation of this.active) animation.cancel();
    this.active.clear();
    this.layer.replaceChildren();
  }

  dispose() {
    this.stop();
    this.layer.remove();
    this.downlink.remove();
    this.root.removeEventListener("pointerover", this.onInteraction);
    this.root.removeEventListener("focusin", this.onInteraction);
    document.removeEventListener("lycoris:selection", this.onSelection);
    document.removeEventListener("visibilitychange", this.onVisibility);
  }
}
