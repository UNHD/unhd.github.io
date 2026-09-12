import "./signal-field.css";

export const signalByte = (seed: number, offset: number) =>
  ((seed * 47 + offset * 29 + 76) % 256)
    .toString(16)
    .toUpperCase()
    .padStart(2, "0");

/** Fine byte remnants share the same anatomy in the margin and on interaction. */
export function signalPacketMarkup(seed = 0) {
  const byte = (offset: number) => signalByte(seed, offset);
  return `<span class="signal-thread"></span><span class="signal-cipher"><span>${byte(0)}<small>${byte(3)}</small></span><span>${byte(1)}</span><span>${byte(2)}<small>·</small></span></span><span class="signal-terminal"><b>${byte(4)}</b><small>${String((seed * 13 + 7) % 100).padStart(2, "0")}</small></span>`;
}

/** Staggered transmissions descend, resolve briefly, and leave a long silence. */
export function signalFallMarkup(count = 8) {
  const columns = [
    2.8, 96.4, 13.2, 86.7, 7.5, 91.8, 29.4, 70.2, 39.3, 60.8, 21.6, 79.1,
  ];
  return `<div class="signal-fall" aria-hidden="true">${columns
    .slice(0, count)
    .map(
      (left, i) =>
        `<i class="signal-packet" style="left:${left}%;--fall-duration:${17 + ((i * 7) % 13)}s;--fall-delay:${-((i * 5.3 + 3.2) % 27)}s;--packet-tail:${24 + ((i * 17) % 43)}px;--packet-gain:${i % 3 === 0 ? 1 : 0.64};--packet-gap:${6 + (i % 3) * 3}px">${signalPacketMarkup(i)}</i>`,
    )
    .join("")}</div>`;
}
