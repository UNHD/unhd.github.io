export const renderProfiles = [
  {
    name: "light",
    pixels: 1_000_000,
    pixelRatio: 1,
    samples: 2,
    transmission: 0,
    distantAt: 17,
  },
  {
    name: "balanced",
    pixels: 2_000_000,
    pixelRatio: 1.25,
    samples: 2,
    transmission: 0.5,
    distantAt: 23,
  },
  {
    name: "fine",
    pixels: 4_000_000,
    pixelRatio: 1.75,
    samples: 4,
    transmission: 0.75,
    distantAt: 28,
  },
] as const;
export type RenderProfile = (typeof renderProfiles)[number];

export function previewPixelRatio(
  profile: RenderProfile,
  width: number,
  height: number,
  deviceRatio: number,
) {
  return Math.min(
    deviceRatio,
    profile.pixelRatio,
    Math.sqrt(profile.pixels / (width * height)),
  );
}

/** Sustained frame pressure lowers the budget; it never oscillates mid-view. */
export class AdaptiveQuality {
  tier: number;
  enabled = true;
  private initial: number;
  private warmup = 3;
  private slow = 0;

  constructor(cores = 8, memory = 8) {
    this.initial = cores <= 4 || memory <= 4 ? 1 : 2;
    this.tier = this.initial;
  }

  get profile(): RenderProfile {
    return renderProfiles[this.tier];
  }

  setEnabled(enabled: boolean) {
    if (enabled === this.enabled) return;
    this.enabled = enabled;
    this.tier = enabled ? this.initial : 0;
    this.warmup = 3;
    this.slow = 0;
  }

  sample(seconds: number) {
    if (!this.enabled || this.tier === 0) return false;
    // Ignore startup stalls, tab suspension and invalid timing samples.
    if (!Number.isFinite(seconds) || seconds <= 0 || seconds > 1) {
      this.slow = 0;
      return false;
    }
    seconds = Math.min(seconds, 0.1);
    if (this.warmup > 0) {
      this.warmup -= seconds;
      return false;
    }
    this.slow = Math.max(
      0,
      this.slow + seconds * (seconds > 1 / 42 ? 1 : -0.5),
    );
    if (this.slow < 2.5) return false;
    this.tier--;
    this.slow = 0;
    this.warmup = 4;
    return true;
  }
}
