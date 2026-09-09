import { archiveCopy } from "./archive-copy.ts";

export const categories = [
  { id: "botany", name: "植物档案", en: "BOTANICAL", code: "01" },
  { id: "morphology", name: "形态研究", en: "MORPHOLOGY", code: "02" },
  { id: "phenology", name: "物候观测", en: "PHENOLOGY", code: "03" },
  { id: "habitat", name: "生境记录", en: "HABITAT", code: "04" },
  { id: "memory", name: "彼岸手记", en: "FIELD NOTES", code: "05" },
] as const;

export type ArchiveRecord = {
  id: string;
  title: string;
  en: string;
  category: number;
  number: number;
  date: string;
  summary: string;
  paragraphs: string[];
  tags: string[];
  flowerColor?: "cyan";
  attachment?: string;
};
const titles = [
  [
    "赤色石蒜",
    "忽地笑",
    "白花石蒜",
    "长筒石蒜",
    "中国石蒜",
    "换锦花",
    "香石蒜",
    "鹿葱",
  ],
  [
    "反卷的花被",
    "花丝与花药",
    "花葶的几何",
    "地下鳞茎",
    "伞形花序",
    "花色的层次",
    "花瓣表面",
    "标本的六个切面",
  ],
  [
    "第一场秋雨",
    "花葶初现",
    "盛放之前",
    "七日花期",
    "花后叶生",
    "冬季叶丛",
    "夏日休眠",
    "一个完整的年轮",
  ],
  [
    "林缘的红线",
    "河岸样方",
    "石阶缝隙",
    "山地阴坡",
    "旧庭院",
    "溪流上游",
    "土壤切片",
    "光照的边界",
  ],
  [
    "花叶不相见",
    "彼岸来信",
    "九月的标本",
    "夜间观察",
    "保存在玻璃中",
    "红色的坐标",
    "时间的切片",
    "下一次花开",
  ],
];
const english = [
  [
    "Lycoris radiata",
    "Lycoris aurea",
    "Lycoris albiflora",
    "Lycoris longituba",
    "Lycoris chinensis",
    "Lycoris sprengeri",
    "Lycoris incarnata",
    "Lycoris squamigera",
  ],
  [
    "Recurved tepals",
    "Filament & anther",
    "Scape geometry",
    "Subterranean bulb",
    "Umbel structure",
    "Chromatic layers",
    "Petal surface",
    "Six sections",
  ],
  [
    "First autumn rain",
    "Scape emergence",
    "Before the bloom",
    "Seven days in red",
    "Leaves after flowers",
    "Winter foliage",
    "Summer dormancy",
    "An annual cycle",
  ],
  [
    "At the forest edge",
    "Riverbank transect",
    "Between the stones",
    "The shaded slope",
    "An old courtyard",
    "Upstream",
    "Soil profile",
    "A boundary of light",
  ],
  [
    "Never in the same season",
    "Letters from beyond",
    "A September specimen",
    "After dark",
    "Held in glass",
    "Coordinates in red",
    "A slice of time",
    "Until the next bloom",
  ],
];
export const records: ArchiveRecord[] = titles.flatMap((row, category) =>
  row.map((title, index) => {
    const id = `LY-${String(category * 8 + index + 1).padStart(3, "0")}`;
    const copy = archiveCopy[id as keyof typeof archiveCopy];
    return {
      id,
      title,
      en: english[category][index],
      category,
      number: index + 1,
      date: `2026.09.${String(8 - index).padStart(2, "0")}`,
      summary: copy.summary,
      paragraphs: copy.paragraphs,
      tags: [categories[category].name, ...copy.tags],
    };
  }),
);

export const CODE_ARCHIVE_ID = "LY-033";
records[32] = {
  ...records[32],
  title: "C# Analyzers",
  en: "Directory.Build.props",
  flowerColor: "cyan",
  attachment: "Directory.Build.props",
};

export function wrap(n: number, count: number) {
  return ((n % count) + count) % count;
}
export function nearestOccurrence(
  value: number,
  center: number,
  period: number,
) {
  return value + Math.floor((center - value + period / 2) / period) * period;
}
export function searchRecords(
  query: string,
  category = -1,
  saved?: Set<string>,
) {
  const q = query.trim().toLocaleLowerCase();
  return records.filter(
    (r) =>
      (category < 0 || r.category === category) &&
      (!saved || saved.has(r.id)) &&
      `${r.id} ${r.title} ${r.en} ${categories[r.category].name} ${r.tags.join(" ")}`
        .toLocaleLowerCase()
        .includes(q),
  );
}
export class ArchiveSelection {
  category = 0;
  memory = [0, 0, 0, 0, 0];
  rowTravel = 0;
  laneTravel = 0;
  get index() {
    return this.category * 8 + this.memory[this.category];
  }
  get record() {
    return records[this.index];
  }
  stepRow(d: number) {
    this.memory[this.category] = wrap(this.memory[this.category] + d, 8);
    this.rowTravel += d;
  }
  stepCategory(d: number) {
    this.category = wrap(this.category + d, 5);
    this.laneTravel += d;
    this.rowTravel = nearestOccurrence(
      this.memory[this.category],
      this.rowTravel,
      8,
    );
  }
  select(index: number, cell?: { lane: number; row: number }) {
    this.category = Math.floor(index / 8);
    this.memory[this.category] = index % 8;
    this.laneTravel =
      cell?.lane ?? nearestOccurrence(this.category, this.laneTravel, 5);
    this.rowTravel =
      cell?.row ?? nearestOccurrence(index % 8, this.rowTravel, 8);
  }
}

export const parts = [
  { id: "petals", name: "花被", en: "RECURVED TEPALS", offset: [0, 1.05, 0] },
  {
    id: "stamens",
    name: "雄蕊",
    en: "FILAMENTS & ANTHERS",
    offset: [0, 2.05, 0],
  },
  { id: "pedicels", name: "花梗", en: "PEDICEL ARRAY", offset: [0, 0.38, 0] },
  { id: "stem", name: "花葶", en: "FLOWERING SCAPE", offset: [0, -0.32, 0] },
  {
    id: "chamber",
    name: "光学护罩",
    en: "OPTICAL CHAMBER",
    offset: [2.95, 0.1, 0],
  },
  {
    id: "base",
    name: "标本底座",
    en: "SPECIMEN PLATFORM",
    offset: [0, -1.2, 0],
  },
] as const;
