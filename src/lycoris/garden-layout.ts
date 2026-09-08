import { categories } from "./data";

export function gardenLayout(symbol: string) {
  return `
    <header class="topbar">
      <a class="brand" href="${import.meta.env.BASE_URL}" aria-label="彼岸夜间花庭首页"><b>彼岸</b><span>夜间花庭<small>LYCORIS</small></span></a>
      <nav aria-label="主导航"><button class="nav-active" data-action="archive">花海</button><button data-action="search">馆藏目录</button><button data-action="saved">收藏 <span id="saved-count">00</span></button><button class="garden-cyan-link" data-result="32">青色手记 ↗</button></nav>
      <div class="top-status"><span>秋 / 夜间观测</span><button class="icon-button" data-action="settings" aria-label="偏好设置">☷</button></div>
    </header>
    <div class="workspace">
      <section class="specimen-stage" aria-label="三维花海，点击标本选择，双击抽取">
        <div id="scene"></div>
        <div class="garden-shade" aria-hidden="true"></div>
        <div class="stage-topline"><span>花叶错落，各有其时。</span><span class="stage-index">01 — 40</span></div>
        <div class="specimen-label"><span class="micro" id="specimen-code">LY-001</span><span id="specimen-title">赤色石蒜</span></div>
        <div class="stage-bottomline"><span id="stage-hint">点击花海中的标本 · 双击抽取</span><button data-action="rotate" aria-label="抽取标本并切换自动旋转" aria-pressed="false"><i class="rotate-indicator"></i> 自动旋转</button><span id="model-status">载入花海…</span></div>
        <div class="stage-loading" id="model-loading"><div class="loading-cross">${symbol}</div><span>花海正在显影</span><small id="load-progress">LYCORIS / NIGHT GARDEN</small></div>
      </section>
      <aside class="dossier" aria-label="当前标本题签">
        <div class="dossier-top"><span id="record-category">其一 · 植物档案</span><div class="file-code"><span>№</span><span id="record-number">001</span></div></div>
        <div class="record-heading"><h1 id="record-title">赤色石蒜</h1><p id="record-en">Lycoris radiata</p></div>
        <div class="title-rule signal-rule" aria-hidden="true"></div>
        <p class="record-summary" id="record-summary"></p>
        <div class="record-actions"><button class="primary-button" data-action="open">展开手记 <b>↗</b></button><button class="text-button" data-action="inspect">观察结构</button><button class="bookmark" data-action="bookmark" aria-label="收藏当前档案">＋</button></div>
        <time class="garden-record-date" id="record-date">2026.09.08</time>
      </aside>
      <section class="archive-rail" aria-label="花海章节与快速翻阅">
        <nav class="category-list" aria-label="馆藏章节">${categories.map((c, i) => `<button data-category="${i}" class="${i === 0 ? "active" : ""}" aria-pressed="${i === 0}"><span class="category-code">${["一", "二", "三", "四", "五"][i]}</span><span>${["植物", "形态", "物候", "生境", "手记"][i]}</span><small>${c.en}</small></button>`).join("")}</nav>
        <div class="chapter-progress" aria-hidden="true"><i></i></div>
        <div class="rail-heading"><span id="rail-category">植物档案</span><div id="file-rail" class="file-rail"></div><span class="rail-nav"><button data-action="prev" aria-label="上一个档案">←</button><span id="rail-number">01 / 08</span><button data-action="next" aria-label="下一个档案">→</button></span></div>
      </section>
    </div>
    <footer class="footer"><span>一片花海，四十份记录。</span><span class="keyboard-hint">↑ ↓ 翻阅 <i>·</i> ← → 切类 <i>·</i> ENTER 读取</span><button data-action="replay">重看花海显影 ↗</button><time id="clock"></time></footer>
    <div id="overlay-root"></div><div id="toast" role="status"></div>
  `;
}
