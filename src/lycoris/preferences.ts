export type Preferences = {
  sound: boolean;
  reduced: boolean;
  quality: boolean;
};

export function readStored(key: string): unknown {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "null");
  } catch {
    return null;
  }
}

// Startup and the settings panel share one snapshot, including reduced motion.
export const prefs: Preferences = {
  sound: false,
  reduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
  quality: true,
};
const stored = readStored("lycoris.preferences") as Partial<Preferences> | null;
for (const key of Object.keys(prefs) as (keyof Preferences)[])
  if (typeof stored?.[key] === "boolean") prefs[key] = stored[key]!;
