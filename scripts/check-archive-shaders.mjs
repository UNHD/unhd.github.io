import { mkdir, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { ShaderChunk, ShaderLib, Vector3 } from "three";
import { patchArchiveShader } from "../src/lycoris/archive-appearance.ts";
import {
  flowerPostVertexShader,
  flowerPostFragmentShader,
} from "../src/lycoris/flower-post.ts";

// Compile the customized Three.js material shaders on the local GPU without a
// browser, DOM mocks, or an additional dependency. Standard Three.js prefixes
// supply the attributes/uniforms that WebGLProgram normally adds at runtime.
const directory = new URL("../verification/archive-shaders/", import.meta.url);
await mkdir(directory, { recursive: true });
const expand = (source) =>
  source
    .replace(/#include <([\w]+)>/g, (_, name) => {
      if (!(name in ShaderChunk))
        throw Error("Unknown Three.js shader chunk " + name);
      return expand(ShaderChunk[name]);
    })
    .replace(/NUM_[A-Z_]+/g, "0")
    .replace(/UNION_CLIPPING_PLANES/g, "0");
const common = `#version 330 core
#define HIGH_PRECISION
#define USE_FOG
#define texture2D texture
#define textureCube texture
#define texture2DLodEXT textureLod
#define textureCubeLodEXT textureLod
#define texture2DGradEXT textureGrad
#define gl_FragDepthEXT gl_FragDepth
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
uniform bool isOrthographic;
`;
for (const physical of [false, true]) {
  for (const instanced of [false, true]) {
    const name =
      (physical ? "frost" : "organic") + (instanced ? "-array" : "-selected");
    const library = physical ? ShaderLib.physical : ShaderLib.standard;
    const shader = {
      uniforms: {},
      vertexShader: library.vertexShader,
      fragmentShader: library.fragmentShader,
    };
    const uniforms = Object.fromEntries(
      [
        "uArchiveTime",
        "uArchiveSelect",
        "uArchiveAge",
        "uArchiveFault",
        "uArchiveSeed",
        "uArchiveShell",
        "uArchiveOrganic",
        "uArchiveFocus",
      ].map((name) => [
        name,
        { value: name === "uArchiveFocus" ? new Vector3() : 0 },
      ]),
    );
    patchArchiveShader(shader, uniforms);
    const defines = physical
      ? "#define PHYSICAL\n#define USE_TRANSMISSION\n#define USE_CLEARCOAT\n"
      : "";
    const vertex =
      common +
      defines +
      (instanced ? "#define USE_INSTANCING\nin mat4 instanceMatrix;\n" : "") +
      `
#define attribute in
#define varying out
uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
in vec3 position;
in vec3 normal;
in vec2 uv;
` +
      expand(shader.vertexShader);
    const fragment =
      common +
      defines +
      `
#define varying in
out vec4 outputColor;
#define gl_FragColor outputColor
vec4 linearToOutputTexel(vec4 value) { return value; }
` +
      expand(shader.fragmentShader);
    await writeFile(new URL(name + ".vert", directory), vertex);
    await writeFile(new URL(name + ".frag", directory), fragment);
  }
}
await writeFile(
  new URL("flower-post.vert", directory),
  common +
    `
#define varying out
in vec3 position;
in vec2 uv;
` +
    expand(flowerPostVertexShader),
);
await writeFile(
  new URL("flower-post.frag", directory),
  common +
    `
#define varying in
#define TONE_MAPPING
out vec4 outputColor;
#define gl_FragColor outputColor
` +
    expand(
      `
#include <tonemapping_pars_fragment>
#include <colorspace_pars_fragment>
vec3 toneMapping(vec3 color) { return ACESFilmicToneMapping(color); }
vec4 linearToOutputTexel(vec4 color) { return sRGBTransferOETF(color); }
` + flowerPostFragmentShader,
    ),
);
const result = spawnSync(
  "python",
  [
    fileURLToPath(new URL("./check-glsl-windows.py", import.meta.url)),
    fileURLToPath(directory),
  ],
  { encoding: "utf8", windowsHide: true },
);
if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
