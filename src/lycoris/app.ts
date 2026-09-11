import "@kitlangton/rolling-number/styles.css";
import { createRollingNumber } from "@kitlangton/rolling-number";
import "./style.css";
import "./garden.css";
import { gardenLayout } from "./garden-layout";
import { SpecimenScene } from "./scene";
import { ArchiveSelection, categories, records } from "./data";
import { ScrubTitle } from "../scrub-title";
import { UiGlitch } from "./ui-glitch";
import { BootSequence } from "./boot";
import { prefs } from "./preferences";
import flowerMark from "./flower-mark.svg?raw";

const root = document.querySelector<HTMLDivElement>("#stage")!;
export const symbol = flowerMark;
root.innerHTML = gardenLayout(symbol);
export const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
  document.querySelector<T>(selector)!;
export const selection = new ArchiveSelection();
export const scene = new SpecimenScene($("#scene"));
const number = createRollingNumber($("#record-number"), {
  value: 1,
  format: { minimumIntegerDigits: 3, useGrouping: false },
  duration: 550,
  motionBlur: true,
});
const title = new ScrubTitle($("#record-title"));
export const uiGlitch = new UiGlitch(root);
export const boot = new BootSequence(scene);
scene.reduced = prefs.reduced;
scene.setQuality(prefs.quality);
uiGlitch.setReduced(prefs.reduced);
document.body.classList.toggle("reduce-motion", prefs.reduced);
// Mount the opening in the initial module, before either model downloads or
// the optional interaction chunk can finish. Explicit scene links bypass it.
if (
  !["archive", "detail", "inspect"].includes(
    new URLSearchParams(location.search).get("scene") ?? "",
  )
)
  boot.start();
let toastTimer: ReturnType<typeof setTimeout>;
export function toast(message: string) {
  $("#toast").textContent = message;
  $("#toast").classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("#toast").classList.remove("visible"), 2300);
}
export function updateRecord(animated = !scene.reduced) {
  const r = selection.record;
  root.dataset.flowerColor = r.flowerColor ?? "red";
  $("#specimen-code").textContent = r.id;
  $("#specimen-title").textContent = r.title;
  $(".stage-index").textContent =
    `${String(selection.index + 1).padStart(2, "0")} — 40`;
  number.update({ value: selection.index + 1, animated });
  title.update(r.title, animated);
  $("#record-en").textContent = r.en;
  $("#record-date").textContent = r.date;
  $("#record-category").textContent =
    "其" +
    ["一", "二", "三", "四", "五"][r.category] +
    " · " +
    categories[r.category].name;
  root.dataset.longTitle = String(r.title.length > 4);
  root.style.setProperty("--chapter-index", String(r.category));
  $("#record-summary").textContent = r.summary;
  $("#rail-category").textContent = categories[r.category].name;
  $("#rail-number").textContent = String(r.number).padStart(2, "0") + " / 08";
  document.querySelectorAll<HTMLElement>("[data-category]").forEach((b) => {
    b.classList.toggle("active", Number(b.dataset.category) === r.category);
    b.setAttribute(
      "aria-pressed",
      String(Number(b.dataset.category) === r.category),
    );
  });
  $("#file-rail").innerHTML = records
    .filter((x) => x.category === r.category)
    .map(
      (x) =>
        `<button class="file-chip ${x.id === r.id ? "selected" : ""}" data-record="${records.indexOf(x)}" aria-label="${x.id} ${x.title}" aria-pressed="${x.id === r.id}" title="${x.title}"><span>${String(x.number).padStart(2, "0")}</span></button>`,
    )
    .join("");
  scene.select(selection.index, selection.laneTravel, selection.rowTravel);
  document.dispatchEvent(new CustomEvent("lycoris:selection"));
}
scene.onSelect = (index, cell) => {
  selection.select(index, cell);
  updateRecord();
};
scene.onOpen = () => $("[data-action='open']").click();
scene.onPhaseChange = (phase) => {
  const hints: Record<string, [string, string]> = {
    browsing: ["点击选择 · 双击抽取检视", "ARRAY / READY"],
    extracting: ["标本升起 · 镜头跟随", "EXTRACTING"],
    ready: ["拖动旋转 · ESC 归位", "INSPECTION"],
    aligning: ["标本转正 · 即将归位", "ALIGNING"],
    returning: ["标本归位 · 可继续翻阅", "RETURNING"],
  };
  const hint = hints[phase];
  if (hint) {
    $("#stage-hint").textContent = scene.reduced
      ? "动态效果已暂停 · 可在偏好设置中开启"
      : hint[0];
    $("#model-status").textContent = hint[1];
  }
  if (scene.mode === "archive") {
    const rotate = $("[data-action='rotate']");
    rotate.classList.remove("active");
    rotate.setAttribute("aria-pressed", "false");
  }
};
scene.ready
  .then(() => {
    $("#model-status").textContent = "3D / CONNECTED";
    const loading = $("#model-loading");
    if (scene.reduced) loading.hidden = true;
    else {
      loading.style.pointerEvents = "none";
      loading.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 650,
        easing: "ease-out",
        fill: "forwards",
      }).onfinish = () => {
        loading.hidden = true;
      };
    }
  })
  .catch((error) => {
    $("#model-status").textContent = "MODEL UNAVAILABLE";
    $("#load-progress").textContent =
      "模型载入失败，请刷新重试。档案仍可读取。";
    console.error(error);
  });
updateRecord(false);
setInterval(() => {
  $("#clock").textContent = new Date().toLocaleTimeString("en-GB", {
    hour12: false,
  });
}, 1000);
void import("./interactions").then((m) => m.installInteractions());
