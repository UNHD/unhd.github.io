import type { MeshStandardMaterial } from "three";

/** Recolor cloned organic materials; the glass, platform and labels keep their finish. */
export function applyCyanFlower(material: MeshStandardMaterial, part: string) {
  if (!["petals", "stamens", "pedicels", "stem"].includes(part)) return;
  const hsl = material.color.getHSL({ h: 0, s: 0, l: 0 });
  material.color.setHSL(0.49, Math.max(0.8, hsl.s), hsl.l * 0.55);
}
