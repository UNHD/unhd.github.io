import type { SpecimenScene } from "./scene";

export function bootPhase(time: number) {
  return time < 2.2
    ? "access"
    : time < 4.6
      ? "identity"
      : time < 7.8
        ? "scan"
        : time < 10.2
          ? "welcome"
          : "reveal";
}
export class BootSequence {
  running = false;
  private element?: HTMLElement;
  private startTime = 0;
  private frame = 0;
  private previousFocus: HTMLElement | null = null;
  constructor(
    private scene: SpecimenScene,
    private reduced: boolean,
    private symbol: string,
  ) {}
  start() {
    if (this.reduced) {
      this.scene.revealScene();
      return;
    }
    this.previousFocus = document.activeElement as HTMLElement;
    this.running = true;
    this.scene.hideScene();
    this.element = document.createElement("section");
    this.element.id = "boot-sequence";
    this.element.className = "boot-sequence";
    this.element.setAttribute("aria-label", "彼岸终端启动序列");
    this.element.innerHTML = `<div class="boot-top"><span>LYCORIS / RESEARCH DIVISION</span><span>TERMINAL 001</span></div><div class="boot-grid" aria-hidden="true"></div><div class="boot-center"><div class="boot-access"><span class="boot-prompt">&gt; </span><span id="boot-typed"></span><i></i></div><div class="boot-emblem">${this.symbol}</div><div class="boot-brand">LYCORIS<span>彼岸标本室</span></div><div class="boot-scan" aria-hidden="true"><div></div><div></div><div></div><i></i></div><div class="boot-welcome"><span>WELCOME TO THE OTHER SHORE</span><strong>彼岸</strong><p>那些短暂而永恒的盛放</p></div><div class="boot-status" role="status"><span id="boot-status-label">建立档案连接</span><small id="boot-status-code">INITIALIZING CONNECTION</small></div></div><div class="boot-bottom"><span id="boot-phase-number">01 / 04</span><div class="boot-progress"><i></i></div><button id="boot-skip">进入标本室 <span>ENTER ↗</span></button></div>`;
    document.body.appendChild(this.element);
    document.querySelector<HTMLElement>("#stage")!.inert = true;
    this.element
      .querySelector<HTMLButtonElement>("#boot-skip")!
      .addEventListener("click", () => this.finish());
    this.element.querySelector<HTMLButtonElement>("#boot-skip")!.focus();
    this.startTime = performance.now();
    this.update();
  }
  private update = () => {
    if (!this.running || !this.element) return;
    const t = (performance.now() - this.startTime) / 1000;
    const phase = bootPhase(t);
    this.element.dataset.phase = phase;
    this.element.style.setProperty(
      "--boot-progress",
      String(Math.min(1, t / 11.6)),
    );
    const typed = "ACCESS LYCORIS.ARCHIVE / REQUEST PERMISSION";
    this.element.querySelector("#boot-typed")!.textContent = typed.slice(
      0,
      Math.floor(Math.max(0, t - 0.25) * 27),
    );
    const labels =
      phase === "access"
        ? ["01 / 04", "建立档案连接", "CONNECTING TO LOCAL ARCHIVE"]
        : phase === "identity"
          ? ["02 / 04", "观察者身份已确认", "OBSERVER ID / AUTHORIZED"]
          : phase === "scan"
            ? [
                "03 / 04",
                t < 6.5 ? "扫描访问权限" : "权限扫描完成",
                `SCANNING OPTICAL SIGNATURE / ${String(Math.min(100, Math.floor(((t - 4.6) / 3.2) * 100))).padStart(3, "0")}%`,
              ]
            : ["04 / 04", "欢迎来到彼岸", "40 ARCHIVES / ALL SYSTEMS READY"];
    this.element.querySelector("#boot-phase-number")!.textContent = labels[0];
    this.element.querySelector("#boot-status-label")!.textContent = labels[1];
    this.element.querySelector("#boot-status-code")!.textContent = labels[2];
    if (t >= 9.8) this.scene.revealScene();
    if (t >= 11.6) {
      this.finish();
      return;
    }
    this.frame = requestAnimationFrame(this.update);
  };
  finish() {
    if (!this.running) return;
    this.running = false;
    cancelAnimationFrame(this.frame);
    this.scene.revealScene();
    document.querySelector<HTMLElement>("#stage")!.inert = false;
    this.element?.remove();
    this.element = undefined;
    if (this.previousFocus?.isConnected) this.previousFocus.focus();
    else document.querySelector<HTMLElement>('[data-action="open"]')?.focus();
  }
  dispose() {
    this.finish();
  }
}
