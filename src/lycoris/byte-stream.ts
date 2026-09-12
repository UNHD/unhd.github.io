const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};
const hash = (seed: number) => {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
};
const bytes = ["4C", "59", "43", "4F", "52", "49", "53", "06", "24"];

type Surface = {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
};

/** Individual bytes receive, resolve and decay in place.
 * The opening or scene owns the clock; this layer never starts an animation loop. */
export class ByteStream {
  private surfaces: Surface[];
  private frame = -1;
  private resizeObserver: ResizeObserver;

  constructor(
    host: HTMLElement,
    private mode: "opening" | "interface" = "opening",
  ) {
    this.surfaces = ["left", "right"].map((side) => {
      const canvas = document.createElement("canvas");
      const prefix = mode === "opening" ? "bloom" : "ui";
      canvas.className = `${prefix}-byte-field ${prefix}-byte-field-${side}`;
      canvas.setAttribute("aria-hidden", "true");
      host.appendChild(canvas);
      return { canvas, context: canvas.getContext("2d")!, width: 0, height: 0 };
    });
    this.resize();
    this.resizeObserver = new ResizeObserver(this.resize);
    this.resizeObserver.observe(host);
  }

  private resize = () => {
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    for (const surface of this.surfaces) {
      const rect = surface.canvas.getBoundingClientRect();
      if (surface.width === rect.width && surface.height === rect.height)
        continue;
      surface.width = rect.width;
      surface.height = rect.height;
      surface.canvas.width = Math.round(rect.width * ratio);
      surface.canvas.height = Math.round(rect.height * ratio);
      surface.context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }
    this.frame = -1;
  };

  update(time: number, light = false, cyan = false) {
    const fps = this.mode === "opening" ? 24 : light ? 12 : 20;
    const frame = Math.floor(time * fps);
    if (frame === this.frame) return;
    this.frame = frame;
    this.surfaces.forEach((surface, side) =>
      this.draw(surface, side, time, light, cyan),
    );
  }

  private draw(
    { context: ctx, width, height }: Surface,
    side: number,
    time: number,
    light: boolean,
    cyan: boolean,
  ) {
    ctx.clearRect(0, 0, width, height);
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    const narrow = width < 110;
    const ambient = this.mode === "interface";
    const lanes = ambient ? (light || width < 55 ? 1 : 2) : narrow ? 2 : 3;
    const entry = ease(time / 1.2);

    for (let lane = 0; lane < lanes; lane++) {
      const seed = lane * 17 + side * 31;
      const span = (ambient ? 9 : 7.2) + hash(seed + 1) * 2.1;
      const clock = time + hash(seed + 2) * span;
      const cycle = Math.floor(clock / span);
      const phase = clock / span - cycle;
      const transmit = phase * 1.55 - 0.12;
      const rows = Math.max(12, Math.floor(height / (narrow ? 25 : 23)));
      const x = Math.round(
        width * (0.18 + lane * (narrow || ambient ? 0.5 : 0.32)),
      );
      const gain = (lane === 1 ? 0.42 : 0.64) * entry * (ambient ? 0.72 : 1);

      for (let row = 0; row < rows; row++) {
        const key = seed + row * 13;
        // Broken groups with irregular gaps, never a complete vertical curtain.
        if (hash(key + cycle * 7) < 0.34) continue;
        const y = Math.round(height * (0.07 + (0.86 * row) / rows));
        const age = (transmit - row / rows) * span;
        if (age < 0 || age > 2.6) continue;
        const receiving = ease(age / 0.13);
        const fading = 1 - ease((age - 0.28) / 2.25);
        const edge =
          ease(y / (height * 0.16)) * ease((height - y) / (height * 0.19));
        const alpha = receiving * fading * gain * edge;
        if (alpha < 0.008) continue;

        const fine = hash(key + 3) < 0.55;
        const fontSize = fine ? 7 : 8;
        ctx.font = `${fontSize}px Consolas, monospace`;
        const decoding = age < 0.24;
        const tick = decoding ? Math.floor(age * 18) : 0;
        const text = bytes[(row + lane + cycle + tick * 3) % bytes.length];
        // The illuminated byte settles to cold ink; only rare arrivals carry red.
        const red = decoding && hash(key + 8) > 0.79;
        ctx.fillStyle = red
          ? cyan
            ? "#82ccc5"
            : "#c28076"
          : age < 0.34
            ? "#d9dace"
            : "#8c9f96";
        ctx.globalAlpha = alpha * (fine ? 0.65 : 1);
        const slip = decoding && tick === 2 ? (side ? -2 : 2) : 0;
        const settle = Math.round(
          (1 - ease(age / 0.24)) * -3 + ease((age - 1.2) / 1.4) * 3,
        );
        ctx.fillText(text, x + slip, y + settle);

        if (decoding && tick === 2) {
          // One clipped echo, one frame of misregistration, then clean letterforms.
          ctx.save();
          ctx.beginPath();
          ctx.rect(x - 3, y - 2, 23, 1);
          ctx.clip();
          ctx.fillStyle = cyan ? "#6abdb8" : "#c26c69";
          ctx.globalAlpha = alpha * 0.5;
          ctx.fillText(text, x - slip, y + settle);
          ctx.restore();
        }
        // A few fractional bits dissolve before the byte, instead of a fixed tail.
        if (hash(key + 5) > 0.6) {
          ctx.globalAlpha = alpha * 0.3 * (1 - ease((age - 0.3) / 0.9));
          ctx.fillRect(x + 17, y - 3, 2, 1);
          ctx.fillRect(x + 21, y, 1, 1);
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  dispose() {
    this.resizeObserver.disconnect();
    for (const { canvas } of this.surfaces) {
      canvas.remove();
      canvas.width = canvas.height = 0;
    }
  }
}
