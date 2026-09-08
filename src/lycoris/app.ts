import "@kitlangton/rolling-number/styles.css";
import { createRollingNumber } from "@kitlangton/rolling-number";
import "./style.css";
import { SpecimenScene } from "./scene";
import { ArchiveSelection, categories, records } from "./data";
import { ScrubTitle } from "../scrub-title";

const root = document.querySelector<HTMLDivElement>("#stage")!;
export const symbol =
  '<svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M20 3v34M3 20h34M8 8l24 24M8 32L32 8M20 3l4 9-4 8-4-8 4-9ZM37 20l-9 4-8-4 8-4 9 4ZM20 37l-4-9 4-8 4 8-4 9ZM3 20l9-4 8 4-8 4-9-4Z" stroke="currentColor" stroke-width="1.2"/></svg>';
root.innerHTML = `
  <header class="topbar">
    <a class="brand" href="${import.meta.env.BASE_URL}" aria-label="彼岸标本室首页">${symbol}<span><b>彼岸<span class="brand-divider"> / </span>LYCORIS</b><small>BOTANICAL ARCHIVE SYSTEM</small></span></a>
    <nav aria-label="主导航"><button class="nav-active" data-action="archive">标本档案 <span>ARCHIVE</span></button><button data-action="search">档案检索 <span>INDEX ↗</span></button><button data-action="saved">我的收藏 <span id="saved-count">00</span></button></nav>
    <div class="top-status"><i></i><span>系统在线</span><button class="icon-button" data-action="settings" aria-label="偏好设置">☷</button></div>
  </header>
  <div class="workspace">
    <aside class="sidebar"><div class="side-head"><span>COLLECTION</span><b>馆藏目录</b></div><div class="category-list">${categories.map((c, i) => `<button data-category="${i}" class="${i === 0 ? "active" : ""}"><span class="category-code">${c.code}</span><span>${c.name}<small>${c.en}</small></span><em>08</em></button>`).join("")}</div><div class="sidebar-bottom"><button class="code-archive-entry" data-result="32"><span>LY-033 / 青色馆藏</span><b>C# Analyzers ↗</b></button><div class="archive-total">40<span>份研究档案</span></div><div class="mini-rule"></div><span>VOL. 01 — AUTUMN</span><p>记录那些<br>短暂而永恒的盛放。</p><span class="side-coordinates">N 30° 16′ / E 120° 08′</span></div></aside>
    <section class="specimen-stage" aria-label="三维标本观察区">
      <div class="stage-topline"><span><i class="red-dot"></i> ARCHIVE ARRAY <span class="muted">/ 标本阵列</span></span><span class="stage-index">01 — 40</span></div>
      <div class="stage-watermark" aria-hidden="true">彼<br>岸</div>
      <div id="scene"></div>
      <div class="stage-coordinate" aria-hidden="true"><span>Y +</span><span>+</span><span>X +</span></div>
      <div class="specimen-label"><span class="micro" id="specimen-code">LY-001</span><span id="specimen-title">赤色石蒜</span><small>石蒜数字标本 / 六组结构</small></div>
      <button class="inspection-entry" data-action="inspect"><span>⤢</span> 360° 观察 <span>↗</span></button>
      <div class="stage-bottomline"><span id="stage-hint">点击选择 · 双击抽取检视</span><button data-action="rotate" aria-label="抽取标本并切换自动旋转" aria-pressed="false"><i class="rotate-indicator"></i> 自动旋转</button><span id="model-status">载入标本…</span></div>
      <div class="stage-loading" id="model-loading"><div class="loading-cross">${symbol}</div><span>正在读取数字标本</span><small id="load-progress">PREPARING OPTICAL CHAMBER</small></div>
    </section>
    <aside class="dossier" aria-label="当前档案"><div class="dossier-top"><span>档案预览</span><span id="record-category">BOTANICAL / 01</span></div><div class="file-code"><span>NO.</span><span id="record-number">001</span><button class="bookmark" data-action="bookmark" aria-label="收藏当前档案">＋</button></div><div class="title-rule"></div><div class="record-heading"><div class="record-tag"><span>LYCORIS COLLECTION</span><span class="red-dot"></span></div><h1 id="record-title">赤色石蒜</h1><p id="record-en">Lycoris radiata</p></div><div class="record-meta"><div><span>档案编号</span><b id="record-id">LY-001</b></div><div><span>所属分类</span><b id="record-class">植物档案</b></div><div><span>记录时间</span><b id="record-date">2026.09.08</b></div><div><span>档案状态</span><b class="status-value"><i></i> 已归档</b></div></div><p class="record-summary" id="record-summary"></p><div class="record-actions"><button class="primary-button" data-action="open">读取完整档案 <span>ACCESS FILE</span><b>↗</b></button><button class="text-button" data-action="inspect">查看标本结构 <span>06 PARTS →</span></button></div><div class="dossier-note"><span>研究用途 / DEMONSTRATION</span><small>花叶错落，各有其时。</small></div></aside>
    <section class="archive-rail" aria-label="档案快速翻阅"><div class="rail-heading"><span><b id="rail-category">植物档案</b><span class="muted"> / ARCHIVE SEQUENCE</span></span><span class="rail-nav"><button data-action="prev" aria-label="上一个档案">←</button><span id="rail-number">01 / 08</span><button data-action="next" aria-label="下一个档案">→</button></span></div><div id="file-rail" class="file-rail"></div></section>
  </div>
  <footer class="footer"><span><span class="red-dot"></span> LYCORIS RESEARCH DIVISION <span class="footer-divider">/</span> 非官方艺术实验 · 数字馆藏</span><span class="keyboard-hint">↑ ↓ 翻阅 <i>·</i> ← → 切类 <i>·</i> ENTER 读取</span><button data-action="replay">重播启动序列 ↗</button><time id="clock"></time></footer>
  <div id="overlay-root"></div><div id="toast" role="status"></div>
`;
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
let toastTimer: ReturnType<typeof setTimeout>;
export function toast(message: string) {
  $("#toast").textContent = message;
  $("#toast").classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("#toast").classList.remove("visible"), 2300);
}
export function updateRecord(animated = !scene.reduced) {
  const r = selection.record;
  $("#specimen-code").textContent = r.id;
  $("#specimen-title").textContent = r.title;
  $(".stage-index").textContent =
    `${String(selection.index + 1).padStart(2, "0")} — 40`;
  number.update({ value: selection.index + 1, animated });
  title.update(r.title, animated);
  $("#record-en").textContent = r.en;
  $("#record-id").textContent = r.id;
  $("#record-class").textContent = categories[r.category].name;
  $("#record-date").textContent = r.date;
  $("#record-category").textContent =
    categories[r.category].en + " / " + categories[r.category].code;
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
        `<button class="file-chip ${x.id === r.id ? "selected" : ""}" data-record="${records.indexOf(x)}"><span>${x.id}<i>↗</i></span><b>${x.title}</b><small>${x.en}</small><div class="chip-bars" aria-hidden="true"></div></button>`,
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
    $("#model-loading").hidden = true;
    if (!document.querySelector("#boot-sequence")) scene.revealScene();
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
