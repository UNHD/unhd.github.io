import { ShaderChunk, type Material } from "three";

type Shader = Parameters<Material["onBeforeCompile"]>[0];

/** Extend native depth fog sideways, keeping its color, range and blending. */
export function patchDistanceFog(shader: Shader) {
  const varying = /* glsl */ `
    #ifdef USE_FOG
      varying vec2 vDistanceFogXZ;
    #endif
  `;
  shader.vertexShader = varying + shader.vertexShader;
  shader.vertexShader = shader.vertexShader.replace(
    "#include <fog_vertex>",
    /* glsl */ `#include <fog_vertex>
    #ifdef USE_FOG
      vDistanceFogXZ = mvPosition.xz;
    #endif`,
  );
  shader.fragmentShader = varying + shader.fragmentShader;
  shader.fragmentShader = shader.fragmentShader.replace(
    "#include <fog_fragment>",
    // Measure after interpolation: vertex distances would fog the entire
    // four-vertex floor instead of smoothly following each visible fragment.
    /* glsl */ `
    #ifdef USE_FOG
      float distanceFogDepth = length(vDistanceFogXZ);
    #endif
    ${ShaderChunk.fog_fragment.replaceAll("vFogDepth", "distanceFogDepth")}`,
  );
}

export function withDistanceFog<T extends Material>(material: T): T {
  material.onBeforeCompile = patchDistanceFog;
  material.customProgramCacheKey = () => "lycoris-distance-fog-xz-01";
  return material;
}
