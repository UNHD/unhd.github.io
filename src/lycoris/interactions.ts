import { $, selection, scene, updateRecord, toast, symbol } from "./app";
import { records, categories, searchRecords, parts } from "./data";
import archivedBuildProps from "../../public/Directory.Build.props?raw";
import { TerminalAudio } from "../audio";
import { BootSequence } from "./boot";

type Prefs = { sound: boolean; reduced: boolean; quality: boolean };
const fallbackPrefs: Prefs = {
  sound: false,
  reduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
  quality: true,
};
function read(key: string): unknown {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "null");
  } catch {
    return null;
  }
}
const storedSaved = read("lycoris.saved");
const saved = new Set<string>(
  Array.isArray(storedSaved)
    ? storedSaved.filter(
        (id): id is string =>
          typeof id === "string" && records.some((r) => r.id === id),
      )
    : [],
);
const storedPrefs = read("lycoris.preferences") as Partial<Prefs> | null;
const prefs: Prefs = { ...fallbackPrefs };
for (const key of Object.keys(prefs) as (keyof Prefs)[])
  if (typeof storedPrefs?.[key] === "boolean") prefs[key] = storedPrefs[key]!;
const audio = new TerminalAudio();
let dialog: HTMLDialogElement | null = null;
let detail = false;
let activeTab = "overview";
let isSavedSearch = false;
let query = "";
let categoryFilter = -1;
let previousFocus: HTMLElement | null = null;
let sceneParent: HTMLElement | null = null;
let boot: BootSequence | undefined;
const accessLog: { id: string; title: string; time: string }[] = [];
let previewNodes: ChildNode[] = [];
let lastWheel = 0;

function save(key: string, data: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch {
    toast("当前浏览器无法保存，本次会话内仍然有效");
    return false;
  }
}
function applyPrefs() {
  scene.reduced = prefs.reduced;
  scene.setQuality(prefs.quality);
  audio.enabled = prefs.sound;
  document.body.classList.toggle("reduce-motion", prefs.reduced);
}
function updateSaved() {
  $("#saved-count").textContent = String(saved.size).padStart(2, "0");
  document
    .querySelectorAll<HTMLElement>('[data-action="bookmark"]')
    .forEach((b) => {
      const on = saved.has(selection.record.id);
      b.classList.toggle("saved", on);
      b.setAttribute("aria-pressed", String(on));
      b.setAttribute("aria-label", on ? "取消收藏当前档案" : "收藏当前档案");
      b.innerHTML = b.classList.contains("bookmark")
        ? on
          ? "✓"
          : "＋"
        : on
          ? "✓ 已收藏"
          : "＋ 收藏档案";
    });
}
function toggleSaved() {
  const r = selection.record;
  saved.has(r.id) ? saved.delete(r.id) : saved.add(r.id);
  const persisted = save("lycoris.saved", [...saved]);
  updateSaved();
  audio.play("confirm");
  if (persisted)
    toast(saved.has(r.id) ? `${r.id} 已加入收藏` : `${r.id} 已取消收藏`);
}
function preservePreview() {
  if (!detail) previewNodes = [...$(".dossier").childNodes];
}
function restorePreview() {
  if (previewNodes.length) $(".dossier").replaceChildren(...previewNodes);
}

function createDialog(className: string, label: string, content: string) {
  closeDialog();
  previousFocus = document.activeElement as HTMLElement;
  dialog = document.createElement("dialog");
  dialog.className = className;
  dialog.setAttribute("aria-label", label);
  dialog.innerHTML = content;
  $("#overlay-root").appendChild(dialog);
  dialog.addEventListener("cancel", (e) => {
    e.preventDefault();
    closeDialog();
  });
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) {
      const r = dialog!.getBoundingClientRect();
      const ev = e as MouseEvent;
      if (
        ev.clientX < r.left ||
        ev.clientX > r.right ||
        ev.clientY < r.top ||
        ev.clientY > r.bottom
      )
        closeDialog();
    }
  });
  dialog.showModal();
  return dialog;
}
function closeDialog() {
  if (!dialog) return;
  if (sceneParent) {
    sceneParent.appendChild($("#scene"));
    sceneParent = null;
    scene.setMode(detail ? "detail" : "archive");
    scene.resize();
  }
  const d = dialog;
  dialog = null;
  d.close();
  d.remove();
  if (previousFocus?.isConnected) previousFocus.focus();
}

function openSearch(onlySaved = false) {
  isSavedSearch = onlySaved;
  query = "";
  categoryFilter = -1;
  createDialog(
    "archive-dialog",
    onlySaved ? "收藏档案" : "档案检索",
    `<div class="dialog-header"><div><span class="micro">${onlySaved ? "PERSONAL COLLECTION" : "ARCHIVE INDEX"}</span><h2>${onlySaved ? "我的收藏" : "档案检索"}</h2></div><button class="close-button" data-action="close" aria-label="关闭检索">× <small>ESC</small></button></div><div class="search-fields"><label class="search-input"><span>⌕</span><input id="archive-query" type="search" placeholder="检索编号、名称或关键词…" aria-label="检索档案" autocomplete="off"><kbd>/</kbd></label><select id="category-filter" aria-label="分类筛选"><option value="-1">全部分类</option>${categories.map((c, i) => `<option value="${i}">${c.name}</option>`).join("")}</select></div><div class="search-count" id="search-count" role="status"></div><div class="search-results" id="search-results"></div><div class="dialog-footnote">${onlySaved ? "收藏保存在当前浏览器" : "39 份演示档案 · 1 份旧站归档"}<span>LYCORIS / VOL. 01</span></div>`,
  );
  $("#archive-query").addEventListener("input", (e) => {
    query = (e.target as HTMLInputElement).value;
    renderResults();
  });
  $("#category-filter").addEventListener("change", (e) => {
    categoryFilter = Number((e.target as HTMLSelectElement).value);
    renderResults();
  });
  renderResults();
  $("#archive-query").focus();
}
function renderResults() {
  const list = searchRecords(
    query,
    categoryFilter,
    isSavedSearch ? saved : undefined,
  );
  $("#search-count").textContent =
    `${String(list.length).padStart(2, "0")} 份${isSavedSearch ? "收藏" : "匹配"}档案`;
  $("#search-results").innerHTML = list.length
    ? list
        .map(
          (r) =>
            `<button class="result-row" data-result="${records.indexOf(r)}"><span class="result-number">${r.id}</span><span><b>${r.title}</b><small>${r.en}</small></span><span class="result-category">${categories[r.category].name}</span><span class="result-saved">${saved.has(r.id) ? "◆" : "↗"}</span></button>`,
        )
        .join("")
    : `<div class="empty-state">${symbol}<h3>${isSavedSearch && !saved.size ? "还没有收藏档案" : "未找到匹配档案"}</h3><p>${isSavedSearch && !saved.size ? "点击档案旁的 ＋，把想再次阅读的记录留在这里。" : "尝试「石蒜」「LY-001」，或切换分类。"}</p></div>`;
}

function openDetail() {
  closeDialog();
  boot?.finish();
  detail = true;
  activeTab = "overview";
  accessLog.unshift({
    id: selection.record.id,
    title: selection.record.title,
    time: new Date().toLocaleTimeString("en-GB"),
  });
  scene.setMode("detail");
  document.body.classList.add("detail-mode");
  renderDetail();
  audio.play("open");
}
function renderDetail() {
  const r = selection.record;
  $(".dossier").innerHTML =
    `<button class="detail-back" data-action="back">← 返回馆藏 <span>ESC</span></button><div class="detail-identity"><span class="micro">${r.id} / ${categories[r.category].en}</span><h1>${r.title}</h1><p>${r.en}</p></div><nav class="detail-tabs" aria-label="档案内容">${[
      ["overview", "档案概述"],
      ...(r.attachment ? [["source", "配置原文"]] : []),
      ["notes", "研究记录"],
      ["log", "访问日志"],
    ]
      .map(
        ([id, name]) =>
          `<button data-tab="${id}" class="${activeTab === id ? "active" : ""}" aria-pressed="${activeTab === id}">${name}</button>`,
      )
      .join(
        "",
      )}</nav><div class="detail-reading" id="detail-reading"></div><div class="detail-bottom"><button data-action="bookmark" class="secondary-button">＋ 收藏档案</button><button data-action="export" class="secondary-button">导出 TXT ↗</button><button data-action="inspect" class="primary-button">360° 标本与结构 <b>↗</b></button></div>`;
  if (activeTab === "overview")
    $("#detail-reading").innerHTML =
      `<span class="detail-date">RECORD / ${r.date}</span><p class="detail-lead">${r.summary}</p>${r.paragraphs.map((p) => `<p>${p}</p>`).join("")}<div class="record-tags">${r.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>`;
  else if (activeTab === "source" && r.attachment) {
    $("#detail-reading").innerHTML =
      `<span class="detail-date">原站文件 / ${r.attachment}</span><div class="code-actions"><a class="secondary-button" href="${import.meta.env.BASE_URL}${r.attachment}" download="${r.attachment}">下载原文件 ↗</a></div><pre class="code-source" tabindex="0" aria-label="C# 分析器配置原文"><code id="archived-source"></code></pre>`;
    $("#archived-source").textContent = archivedBuildProps;
  } else if (activeTab === "notes" && r.attachment)
    $("#detail-reading").innerHTML =
      `<span class="detail-date">PERSONAL ARCHIVE / UNHD</span><section class="research-note"><span>01</span><div><h3>原站记录</h3><p>${r.paragraphs[0]}</p></div></section><section class="research-note"><span>02</span><div><h3>配置内容</h3><p>${r.paragraphs[1]}</p></div></section><section class="research-note"><span>03</span><div><h3>青色标本</h3><p>${r.paragraphs[2]}</p></div></section>`;
  else if (activeTab === "notes")
    $("#detail-reading").innerHTML =
      `<span class="detail-date">OBSERVATION / DEMO DATA</span>${[
        ["01", "形态记录", r.paragraphs[2]],
        [
          "02",
          "标本说明",
          "三维标本根据石蒜实拍参考重建，保留六朵反卷小花、向外伸展的长花丝与绿色花葶。六组部件可单独展开。",
        ],
        [
          "03",
          "归档备注",
          "本条记录用于界面交互与视觉实验。物种名作为档案索引，场景和观测内容不作为科研测量数据。",
        ],
      ]
        .map(
          ([n, title, text]) =>
            `<section class="research-note"><span>${n}</span><div><h3>${title}</h3><p>${text}</p></div></section>`,
        )
        .join("")}`;
  else
    $("#detail-reading").innerHTML =
      `<span class="detail-date">本次会话 / LOCAL SESSION</span>${accessLog.map((log) => `<div class="log-row"><time>${log.time}</time><span>读取 ${log.id}<small>${log.title}</small></span><i>OPEN</i></div>`).join("")}`;
  if (activeTab === "overview" && r.attachment)
    $("#detail-reading").insertAdjacentHTML(
      "beforeend",
      `<section class="code-attachment"><span class="micro">青色馆藏 / ORIGINAL FILE</span><h3>${r.attachment}</h3><div class="code-actions"><button class="secondary-button" data-tab="source">阅读配置原文</button><a class="secondary-button" href="${import.meta.env.BASE_URL}${r.attachment}" download="${r.attachment}">下载 .props ↗</a><a class="legacy-link" href="${import.meta.env.BASE_URL}legacy/" target="_blank" rel="noopener">打开旧站快照 ↗</a></div></section>`,
    );
  updateSaved();
}
function closeDetail() {
  if (!detail) return;
  closeDialog();
  detail = false;
  document.body.classList.remove("detail-mode");
  restorePreview();
  scene.setMode("archive");
  updateRecord(false);
  updateSaved();
  audio.play("back");
}

async function openInspector() {
  if (sceneParent) return;
  try {
    await scene.ready;
  } catch {
    toast("三维模型未载入，请刷新后重试");
    return;
  }
  if (sceneParent) return;
  closeDialog();
  boot?.finish();
  const d = createDialog(
    "viewer-dialog",
    "石蒜标本结构查看器",
    `<div class="viewer-header"><div>${symbol}<span><b>标本观察室</b><small>LYCORIS / STRUCTURE LAB</small></span></div><span class="viewer-record">${selection.record.id} <i>·</i> ${selection.record.flowerColor === "cyan" ? "青色代码标本" : "赤色石蒜艺术化模型"}</span><button class="close-button" data-action="close" aria-label="关闭结构查看器">× <small>ESC</small></button></div><div class="viewer-workspace"><div id="viewer-canvas"><div class="viewer-axes">Y ↑<br><br>Z ↙ &nbsp; X →</div><div class="viewer-camera-tools"><button data-action="zoom-in" aria-label="放大">＋</button><button data-action="zoom-out" aria-label="缩小">−</button><button data-action="reset">复位视角</button></div><div class="viewer-instructions">左键旋转 <i>·</i> 滚轮缩放 <i>·</i> 右键 / 方向键平移</div></div><aside class="parts-panel"><span class="micro">ASSEMBLY / 06 COMPONENTS</span><h2>一朵花的秩序</h2><p>选择部件，展开它的结构。</p><div class="parts-list">${parts.map((p, i) => `<button data-part="${p.id}" aria-pressed="false"><span>${String(i + 1).padStart(2, "0")}</span><span><b>${p.name}</b><small>${p.en}</small></span><i>＋</i></button>`).join("")}</div><div class="assembly-status"><span>结构展开</span><b id="part-count">00 / 06</b></div><button class="primary-button" data-action="explode">拆解全部结构 <b>↗</b></button><button class="secondary-button reassemble" data-action="assemble">一键重组 ↙</button><div class="parts-note">每一条曲线，都来自同一朵花。<br><span>LYCORIS RADIATA · DIGITAL SPECIMEN</span></div></aside></div>`,
  );
  sceneParent = $("#scene").parentElement;
  $("#viewer-canvas").prepend($("#scene"));
  scene.setMode("inspect");
  scene.resize();
  d.querySelector<HTMLElement>('[data-action="reset"]')?.focus();
}
function updateParts(ids: string[]) {
  scene.setExploded(ids);
  document.querySelectorAll<HTMLElement>("[data-part]").forEach((b) => {
    const on = ids.includes(b.dataset.part!);
    b.classList.toggle("active", on);
    b.setAttribute("aria-pressed", String(on));
    b.querySelector("i")!.textContent = on ? "−" : "＋";
  });
  $("#part-count").textContent = `${String(ids.length).padStart(2, "0")} / 06`;
  audio.play("confirm");
}
function openSettings() {
  createDialog(
    "settings-dialog",
    "偏好设置",
    `<div class="dialog-header"><div><span class="micro">TERMINAL PREFERENCES</span><h2>观察偏好</h2></div><button class="close-button" data-action="close" aria-label="关闭设置">× <small>ESC</small></button></div><div class="settings-options">${[
      ["sound", "界面音效", "翻阅、读取与收藏时的轻微提示音"],
      ["reduced", "减少动态效果", "简化启动、镜头移动与数字滚动"],
      ["quality", "高质量渲染", "保留更细腻的轮廓与高分辨率画面"],
    ]
      .map(
        ([id, label, description]) =>
          `<label class="preference-row"><span><b>${label}</b><small>${description}</small></span><input type="checkbox" data-pref="${id}" ${(prefs as unknown as Record<string, boolean>)[id] ? "checked" : ""}><span class="switch" aria-hidden="true"></span></label>`,
      )
      .join(
        "",
      )}</div><div class="settings-actions"><button class="secondary-button" data-action="fullscreen">切换全屏 ⤢</button><button class="secondary-button" data-action="replay">重播启动序列 ↗</button></div><p class="credits">非官方艺术实验。交互参考 <a href="https://github.com/LBEILC/RhineLabUI" target="_blank" rel="noopener">RhineLabUI ↗</a>；石蒜模型与档案内容为本项目原创。字体 <a href="${import.meta.env.BASE_URL}fonts/MiSans-license.pdf" target="_blank" rel="noopener">MiSans ↗</a>，编号滚动 <a href="${import.meta.env.BASE_URL}licenses/rolling-number.txt" target="_blank" rel="noopener">Rolling Number ↗</a>。</p>`,
  );
  dialog!.querySelectorAll<HTMLInputElement>("[data-pref]").forEach((input) =>
    input.addEventListener("change", () => {
      prefs[input.dataset.pref as keyof Prefs] = input.checked;
      save("lycoris.preferences", prefs);
      applyPrefs();
      if (!detail) updateRecord(false);
    }),
  );
}
function exportRecord() {
  const r = selection.record;
  const text = `彼岸 / LYCORIS\n${r.id} — ${r.title}\n${r.en}\n${r.date} / ${categories[r.category].name}\n\n${r.summary}\n\n${r.paragraphs.join("\n\n")}\n\n${r.attachment ? `个人站点归档 / 原文件：${r.attachment}` : "非官方艺术实验 / 原创演示数据"}\n`;
  const url = URL.createObjectURL(
    new Blob(["\ufeff" + text], { type: "text/plain;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = `${r.id}-${r.title}.txt`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast(`${r.id} 已导出`);
}
function navigate(index?: number, direction?: number, lane = false) {
  if (detail) closeDetail();
  if (index !== undefined) selection.select(index);
  else if (direction !== undefined)
    lane ? selection.stepCategory(direction) : selection.stepRow(direction);
  updateRecord();
  updateSaved();
  audio.play("tick");
}
function replay() {
  closeDialog();
  closeDetail();
  boot?.dispose();
  boot = new BootSequence(scene, prefs.reduced, symbol);
  boot.start();
}

export function installInteractions() {
  applyPrefs();
  updateSaved();
  preservePreview();
  document.addEventListener("lycoris:selection", updateSaved);
  document.addEventListener("click", (e) => {
    const button = (e.target as HTMLElement).closest<HTMLElement>("button");
    if (!button) return;
    if (button.dataset.category !== undefined) {
      const c = Number(button.dataset.category);
      navigate(c * 8 + selection.memory[c]);
      return;
    }
    if (button.dataset.record !== undefined) {
      navigate(Number(button.dataset.record));
      return;
    }
    if (button.dataset.result !== undefined) {
      closeDialog();
      navigate(Number(button.dataset.result));
      preservePreview();
      openDetail();
      return;
    }
    if (button.dataset.tab) {
      activeTab = button.dataset.tab;
      renderDetail();
      return;
    }
    if (button.dataset.part) {
      const ids = new Set(scene.getExploded());
      ids.has(button.dataset.part)
        ? ids.delete(button.dataset.part)
        : ids.add(button.dataset.part);
      updateParts([...ids]);
      return;
    }
    switch (button.dataset.action) {
      case "prev":
        navigate(undefined, -1);
        break;
      case "next":
        navigate(undefined, 1);
        break;
      case "archive":
        closeDialog();
        closeDetail();
        break;
      case "rotate":
        if (!detail) {
          preservePreview();
          openDetail();
        }
        scene.autorotate = !scene.autorotate;
        button.classList.toggle("active", scene.autorotate);
        button.setAttribute("aria-pressed", String(scene.autorotate));
        break;
      case "bookmark":
        toggleSaved();
        break;
      case "search":
        openSearch();
        break;
      case "saved":
        openSearch(true);
        break;
      case "settings":
        openSettings();
        break;
      case "open":
        preservePreview();
        openDetail();
        break;
      case "back":
        closeDetail();
        break;
      case "close":
        closeDialog();
        break;
      case "inspect":
        void openInspector();
        break;
      case "explode":
        updateParts(parts.map((p) => p.id));
        break;
      case "assemble":
        updateParts([]);
        break;
      case "reset":
        scene.resetView();
        break;
      case "zoom-in":
        scene.zoom(1);
        break;
      case "zoom-out":
        scene.zoom(-1);
        break;
      case "export":
        exportRecord();
        break;
      case "replay":
        replay();
        break;
      case "fullscreen":
        void (
          document.fullscreenElement
            ? document.exitFullscreen()
            : document.documentElement.requestFullscreen()
        ).catch(() => toast("当前浏览器不支持全屏"));
        break;
    }
  });
  window.addEventListener("keydown", (e) => {
    if (boot?.running) {
      if (["Escape", "Enter"].includes(e.key)) {
        e.preventDefault();
        boot.finish();
      }
      return;
    }
    if (
      ["INPUT", "SELECT", "TEXTAREA"].includes(
        (e.target as HTMLElement).tagName,
      )
    )
      return;
    if (sceneParent) {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
        e.preventDefault();
        scene.pan(
          e.key === "ArrowLeft" ? -1 : e.key === "ArrowRight" ? 1 : 0,
          e.key === "ArrowUp" ? 1 : e.key === "ArrowDown" ? -1 : 0,
        );
      }
      return;
    }
    if (dialog) return;
    if (e.key === "/") {
      e.preventDefault();
      openSearch();
    } else if (e.key === "Escape" && detail) {
      e.preventDefault();
      closeDetail();
    } else if (
      !detail &&
      ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)
    ) {
      e.preventDefault();
      navigate(
        undefined,
        ["ArrowLeft", "ArrowUp"].includes(e.key) ? -1 : 1,
        ["ArrowLeft", "ArrowRight"].includes(e.key),
      );
    } else if (
      e.key === "Enter" &&
      !detail &&
      !(e.target instanceof HTMLButtonElement)
    ) {
      e.preventDefault();
      preservePreview();
      openDetail();
    }
  });
  $("#file-rail").addEventListener(
    "wheel",
    (e) => {
      const w = e as WheelEvent;
      if (Math.abs(w.deltaY) < 12) return;
      w.preventDefault();
      const now = performance.now();
      if (now - lastWheel < 100) return;
      lastWheel = now;
      navigate(undefined, w.deltaY > 0 ? 1 : -1);
    },
    { passive: false },
  );
  const params = new URLSearchParams(location.search);
  const initialRecord = records.findIndex(
    (r) => r.id === params.get("specimen"),
  );
  if (initialRecord >= 0) navigate(initialRecord);
  if (params.get("scene") === "detail") {
    preservePreview();
    openDetail();
  } else if (params.get("scene") === "inspect") void openInspector();
  else if (params.get("scene") !== "archive") replay();
  registerWebMCP();
}

function registerWebMCP() {
  type Tool = {
    name: string;
    title: string;
    description: string;
    inputSchema: object;
    annotations: { readOnlyHint: boolean };
    execute: (input: unknown) => unknown;
  };
  const context = (
    document as Document & {
      modelContext?: {
        registerTool(
          tool: Tool,
          options?: { signal: AbortSignal },
        ): void | Promise<void>;
      };
    }
  ).modelContext;
  if (!context?.registerTool) return;
  const lifecycle = new AbortController();
  const tools: Tool[] = [
    {
      name: "search_lycoris_archives",
      title: "检索石蒜档案",
      description:
        "Read the local archive index, matching an optional keyword. Does not navigate or change favorites.",
      inputSchema: {
        type: "object",
        properties: { query: { type: "string" } },
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true },
      execute(input) {
        const v = input as { query?: unknown };
        if (!v || (v.query !== undefined && typeof v.query !== "string"))
          throw new Error("query must be a string");
        return searchRecords((v.query as string) ?? "").map((r) => ({
          id: r.id,
          title: r.title,
          category: categories[r.category].name,
          saved: saved.has(r.id),
        }));
      },
    },
    {
      name: "open_lycoris_archive",
      title: "读取石蒜档案",
      description:
        "Navigate to and open an archive by exact ID, updating the visible record and local session access log.",
      inputSchema: {
        type: "object",
        properties: { id: { type: "string" } },
        required: ["id"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false },
      execute(input) {
        const id = (input as { id?: unknown })?.id;
        const index = records.findIndex((r) => r.id === id);
        if (index < 0) throw new Error("Unknown archive ID");
        closeDialog();
        navigate(index);
        preservePreview();
        openDetail();
        return {
          id: selection.record.id,
          title: selection.record.title,
          paragraphs: selection.record.paragraphs,
        };
      },
    },
  ];
  for (const tool of tools) {
    try {
      void Promise.resolve(
        context.registerTool(tool, { signal: lifecycle.signal }),
      ).catch((error) =>
        console.warn("WebMCP registration unavailable", error),
      );
    } catch (error) {
      console.warn("WebMCP registration unavailable", error);
    }
  }
  window.addEventListener("pagehide", () => lifecycle.abort(), { once: true });
}
