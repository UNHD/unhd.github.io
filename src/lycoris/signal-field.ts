import "./signal-field.css";

/** Short descending fragments, with quiet gaps instead of a continuous curtain. */
export function signalFallMarkup(count = 8) {
  const columns = [3, 96, 18, 82, 9, 91, 31, 69, 42, 58, 24, 76];
  const fragments = [
    "4C\n59\n43\n00\n01",
    "36\n06\n..\nA9\n↓",
    "01\n10\n01\n..\nLY",
  ];
  return `<div class="signal-fall" aria-hidden="true">${columns
    .slice(0, count)
    .map(
      (left, i) =>
        `<i style="left:${left}%;--fall-duration:${12 + ((i * 7) % 11)}s;--fall-delay:${-((i * 3.7) % 19)}s"><span>${fragments[i % fragments.length]}</span></i>`,
    )
    .join("")}</div>`;
}
