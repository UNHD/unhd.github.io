# 彼岸 / LYCORIS

石蒜主题的三维标本档案终端，使用 TypeScript、Three.js 与 Vite。

[进入标本室](https://unhd.github.io/) · [打开青色代码标本](https://unhd.github.io/?specimen=LY-033&scene=detail)

馆藏包含五类各八份档案，可检索、收藏、导出，也可抽取标本并查看、拆解六组结构。网页直接加载 GLB，无需后端、Blender 或 API Key。

## 旧站内容

旧首页的 `hello there !` 和 C# Analyzers 配置已收录到「彼岸手记」的 **LY-033 / C# Analyzers**。这份档案使用专属青色花体与数据流，提供配置原文阅读和原文件下载。

- [原始配置下载](https://unhd.github.io/Directory.Build.props)：保留原地址和原内容。
- [旧首页快照](https://unhd.github.io/legacy/)：保留原问候与配置链接。
- 根目录 `Directory.Build.props` 保留在原有 Git 历史中，网页副本位于 `public/Directory.Build.props`。

其他 39 份档案为艺术实验的演示内容，植物条目共用石蒜模型，不代表对应物种的形态复原。

## 本地开发

需要 Node.js 24 或更新版本。

```sh
npm ci
npm run dev
npm run build
npm run check
npm run preview
```

`npm run build` 先导出 40 份 TXT 档案，再执行 TypeScript 检查和 Vite 构建，结果位于 `dist/`。

## 发布

仓库 Settings → Pages → Source 使用 **Deploy from a branch**，选择 **gh-pages / (root)**。`main` 保存网页源码，`gh-pages` 保存已通过构建和检查的 `dist/` 内容。

更新时运行 `npm run build` 和 `npm run check`，将 `dist/` 内容提交并推送到 `gh-pages`；GitHub Pages 随后自动发布。`public/.nojekyll` 随构建复制，避免 Jekyll 处理静态文件。只推送 `main` 不会更新线上网页。

当前账号凭据没有新增 Actions 工作流所需的 `workflow` 权限，因此采用分支发布，不依赖额外授权。

## 来源

交互参考 [LBEILC/RhineLabUI](https://github.com/LBEILC/RhineLabUI)，石蒜模型由 Blender 制作。参考与许可说明见 [THIRD_PARTY.md](THIRD_PARTY.md)。
