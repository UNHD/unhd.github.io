import { records, categories } from "../src/lycoris/data.ts";
import { mkdir, writeFile } from "node:fs/promises";
const folder = new URL("../public/archives/", import.meta.url);
await mkdir(folder, { recursive: true });
await Promise.all(
  records.map((r) =>
    writeFile(
      new URL(`${r.id}.txt`, folder),
      `\ufeff彼岸 / LYCORIS\n${r.id} — ${r.title}\n${r.en}\n${r.date} / ${categories[r.category].name}\n\n${r.summary}\n\n${r.paragraphs.join("\n\n")}\n\n${r.attachment ? `个人站点归档 / 原文件：${r.attachment}` : "非官方艺术实验 / 原创演示数据"}\n`,
      "utf8",
    ),
  ),
);
console.log(`Prepared ${records.length} Lycoris archive exports.`);
