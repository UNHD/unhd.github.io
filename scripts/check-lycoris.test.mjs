import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { Box3, Vector3 } from "three";
import {
  records,
  categories,
  parts,
  ArchiveSelection,
  searchRecords,
  nearestOccurrence,
  wrap,
} from "../src/lycoris/data.ts";

test("five categories, eight readable records per category, unique IDs", () => {
  assert.equal(categories.length, 5);
  assert.equal(records.length, 40);
  assert.equal(new Set(records.map((r) => r.id)).size, 40);
  categories.forEach((_, i) =>
    assert.equal(records.filter((r) => r.category === i).length, 8),
  );
  for (const r of records) {
    assert.ok(r.title && r.en && r.summary);
    assert.equal(r.paragraphs.length, 3);
  }
});
test("forward and reverse boundary wrapping remains directional", () => {
  const s = new ArchiveSelection();
  s.stepRow(-1);
  assert.equal(s.record.id, "LY-008");
  assert.equal(s.rowTravel, -1);
  s.stepRow(1);
  assert.equal(s.record.id, "LY-001");
  assert.equal(s.rowTravel, 0);
  for (let i = 0; i < 80; i++) s.stepRow(1);
  assert.equal(s.record.id, "LY-001");
  assert.equal(s.rowTravel, 80);
  s.stepCategory(-1);
  assert.equal(s.category, 4);
  assert.equal(s.record.id, "LY-033");
  s.stepCategory(1);
  assert.equal(s.category, 0);
});
test("each category remembers its own selected record", () => {
  const s = new ArchiveSelection();
  s.stepRow(5);
  s.stepCategory(1);
  s.stepRow(3);
  s.stepCategory(-1);
  assert.equal(s.record.id, "LY-006");
  s.stepCategory(1);
  assert.equal(s.record.id, "LY-012");
  s.select(37);
  assert.equal(s.record.id, "LY-038");
  s.stepCategory(1);
  assert.equal(s.record.id, "LY-006");
});
test("recycled 3D cells stay unique and cover a continuous window", () => {
  for (const period of [7, 9])
    for (let center = -70; center < 70; center += 0.13) {
      const cells = Array.from({ length: period }, (_, i) =>
        nearestOccurrence(i, center, period),
      ).sort((a, b) => a - b);
      assert.equal(new Set(cells).size, period);
      assert.equal(cells.at(-1) - cells[0], period - 1);
      assert.ok(
        cells.every((x) => Math.abs(x - center) <= period / 2 + 0.00001),
      );
    }
  assert.equal(wrap(-1, 8), 7);
});
test("search combines keyword, category, favorites, and empty results", () => {
  assert.equal(searchRecords(" ly-001 ")[0].id, "LY-001");
  assert.equal(searchRecords("RADIATA")[0].title, "赤色石蒜");
  assert.equal(searchRecords("", 2).length, 8);
  assert.equal(searchRecords("花", 2, new Set(["LY-018", "LY-001"])).length, 1);
  assert.equal(searchRecords("a nonexistent specimen").length, 0);
  assert.equal(searchRecords("", -1, new Set()).length, 0);
});
test("Blender GLB loads with six assembly groups and finite geometry", async () => {
  const buffer = await readFile(
    new URL("../public/assets/lycoris-specimen.glb", import.meta.url),
  );
  assert.equal(buffer.readUInt32LE(0), 0x46546c67);
  assert.equal(buffer.readUInt32LE(4), 2);
  assert.equal(buffer.readUInt32LE(8), buffer.length);
  const gltf = await new GLTFLoader().parseAsync(
    buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength,
    ),
    "",
  );
  const found = new Set();
  let meshes = 0;
  gltf.scene.traverse((o) => {
    if (!o.isMesh) return;
    meshes++;
    found.add(o.userData.assemblyPart);
    const p = o.geometry.attributes.position;
    for (let i = 0; i < p.array.length; i++)
      assert.ok(Number.isFinite(p.array[i]));
  });
  assert.deepEqual([...found].sort(), parts.map((p) => p.id).sort());
  assert.equal(meshes, 11);
  const size = new Box3().setFromObject(gltf.scene).getSize(new Vector3());
  assert.ok(size.y > 4 && size.y < 5);
  assert.ok(size.x > 3 && size.x < 5);
  assert.ok(buffer.length < 3_000_000);
});
test("all 40 UTF-8 exports match their record", async () => {
  for (const record of records) {
    const text = await readFile(
      new URL(`../public/archives/${record.id}.txt`, import.meta.url),
      "utf8",
    );
    assert.ok(text.includes(record.title));
    assert.ok(text.includes(record.en));
    assert.ok(text.includes(record.id));
  }
});
