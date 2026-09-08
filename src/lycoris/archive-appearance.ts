import * as THREE from "three";
import { records } from "./data.ts";
import { applyCyanFlower } from "./specimen-color.ts";

// Glitch is now a masked image pass; it never displaces model vertices.
export const MAX_GLITCH_SHIFT = 0;
export const DORMANT_GLASS_OPACITY = 0.72;
export const DORMANT_GLASS_ROUGHNESS = 0.66;
type Shader = Parameters<THREE.Material["onBeforeCompile"]>[0];
type ArchiveUniforms = {
  uArchiveTime: { value: number };
  uArchiveSelect: { value: number };
  uArchiveAge: { value: number };
  uArchiveFault: { value: number };
  uArchiveSeed: { value: number };
  uArchiveShell: { value: number };
  uArchiveOrganic: { value: number };
  uArchiveFocus: { value: THREE.Vector3 };
};
export type ArchiveSurface = {
  cyan: boolean;
  amount: number;
  selected: boolean;
  selectedAt: number;
  uniforms: ArchiveUniforms[];
  materials: THREE.MeshStandardMaterial[];
};

const declarations = /* glsl */ `
uniform float uArchiveTime;
uniform float uArchiveSelect;
uniform float uArchiveAge;
uniform float uArchiveFault;
uniform float uArchiveSeed;
uniform float uArchiveShell;
uniform float uArchiveOrganic;
uniform vec3 uArchiveFocus;
varying vec3 vArchiveLocal;
varying float vArchiveDepth;
varying float vArchiveFocusDistance;
varying float vArchiveCap;
float archiveHash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
`;

/** Stable physical surfaces; animated signals live in the flower-only post pass. */
export function patchArchiveShader(shader: Shader, uniforms: ArchiveUniforms) {
  Object.assign(shader.uniforms, uniforms);
  shader.vertexShader = declarations + shader.vertexShader;
  shader.vertexShader = shader.vertexShader.replace(
    "#include <begin_vertex>",
    /* glsl */ `#include <begin_vertex>
    vArchiveLocal = position;
    vArchiveCap = abs(normal.y);
    `,
  );
  shader.vertexShader = shader.vertexShader.replace(
    "#include <project_vertex>",
    /* glsl */ `#include <project_vertex>
    vArchiveDepth = -mvPosition.z;
    vec4 archiveAnchor = vec4(0.0, 0.0, 0.0, 1.0);
    #ifdef USE_INSTANCING
      archiveAnchor = instanceMatrix * archiveAnchor;
    #endif
    vArchiveFocusDistance = distance((modelMatrix * archiveAnchor).xyz, uArchiveFocus);
    `,
  );
  shader.fragmentShader = declarations + shader.fragmentShader;
  shader.fragmentShader = shader.fragmentShader.replace(
    "#include <color_fragment>",
    /* glsl */ `#include <color_fragment>
    float focusDepth = -(viewMatrix * vec4(uArchiveFocus, 1.0)).z;
    float archiveDepth = smoothstep(-3.0, 18.0, vArchiveDepth - focusDepth);
    float archiveNeighborhood = 1.0 - smoothstep(3.0, 13.0, vArchiveFocusDistance);
    float archiveClarity = (1.0 - archiveDepth) * 0.45 + archiveNeighborhood * 0.55;
    float archivedLuma = dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722));
    diffuseColor.rgb = mix(vec3(archivedLuma), diffuseColor.rgb, uArchiveSelect);
    `,
  );
  shader.fragmentShader = shader.fragmentShader.replace(
    "#include <roughnessmap_fragment>",
    /* glsl */ `#include <roughnessmap_fragment>
    float frostGrain = archiveHash(floor(vArchiveLocal.xy * 170.0) + vArchiveLocal.z * 43.0);
    float softFrost = mix(0.76, 0.58, archiveClarity) + frostGrain * 0.025;
    roughnessFactor = mix(roughnessFactor, softFrost, uArchiveShell * (1.0 - uArchiveSelect));
    `,
  );
  shader.fragmentShader = shader.fragmentShader.replace(
    "#include <opaque_fragment>",
    /* glsl */ `#include <opaque_fragment>
    // Give the rough transmission enough blend weight to actually blur the
    // flower. The cap stays lighter without suppressing the entire glass wall.
    float archiveRim = pow(1.0 - abs(dot(normal, normalize(vViewPosition))), 2.3);
    float layerLight = mix(0.53, 0.90, archiveClarity);
    gl_FragColor.rgb *= mix(layerLight, 1.0, uArchiveSelect);
    // Desaturate after lighting as well, so the red rim light and emissive base
    // cannot color the dormant specimen. Selection restores the source color.
    float litLuma = dot(gl_FragColor.rgb, vec3(0.2126, 0.7152, 0.0722));
    gl_FragColor.rgb = mix(vec3(litLuma), gl_FragColor.rgb, uArchiveSelect);
    if (uArchiveShell > 0.5) {
      float veil = mix(0.80, 1.0, archiveRim) * mix(1.0, 0.45, vArchiveCap);
      gl_FragColor.a *= mix(veil, 1.0, uArchiveSelect);
    }
    `,
  );
}

export class ArchiveAppearance {
  private focus = { value: new THREE.Vector3() };
  private sources = new Map<
    THREE.Material,
    { source: THREE.MeshStandardMaterial; part: string }
  >();
  private dormantMaterials: THREE.Material[] = [];

  private uniforms(
    part: string,
    shell: boolean,
    seed: number,
  ): ArchiveUniforms {
    return {
      uArchiveTime: { value: 0 },
      uArchiveSelect: { value: 0 },
      uArchiveAge: { value: 0 },
      uArchiveFault: { value: 0 },
      uArchiveSeed: { value: seed },
      uArchiveShell: { value: shell ? 1 : 0 },
      uArchiveOrganic: {
        value: ["petals", "stamens", "stem", "pedicels"].includes(part) ? 1 : 0,
      },
      uArchiveFocus: this.focus,
    };
  }

  private material(source: THREE.MeshStandardMaterial, part: string, seed = 0) {
    const shell = source.name.includes("Glass");
    const material = shell
      ? new THREE.MeshPhysicalMaterial({
          color: 0xd6dcdc,
          roughness: DORMANT_GLASS_ROUGHNESS,
          metalness: 0,
          transmission: 0.94,
          ior: 1.43,
          thickness: 0.22,
          attenuationColor: new THREE.Color(0xd3d9d9),
          attenuationDistance: 5,
          transparent: true,
          opacity: DORMANT_GLASS_OPACITY,
          depthWrite: false,
          side: THREE.FrontSide,
          clearcoat: 0.02,
          envMapIntensity: 0.32,
        })
      : source.clone();
    material.name = source.name + "__ArchiveSurface";
    if (!shell) {
      material.roughness = Math.max(material.roughness, 0.35);
      material.envMapIntensity = 0.45;
    }
    const uniforms = this.uniforms(part, shell, seed);
    material.onBeforeCompile = (shader) => patchArchiveShader(shader, uniforms);
    material.customProgramCacheKey = () => "lycoris-static-frost-04";
    return { material, uniforms };
  }

  dormant(source: THREE.MeshStandardMaterial, part: string) {
    const { material } = this.material(source, part);
    this.sources.set(material, { source, part });
    this.dormantMaterials.push(material);
    return material;
  }

  setFocus(position: [number, number, number]) {
    this.focus.value.set(...position);
    this.focus.value.y += 0.12;
  }

  prepare(model: THREE.Group, index: number, time: number): ArchiveSurface {
    const state: ArchiveSurface = {
      cyan: records[index]?.flowerColor === "cyan",
      amount: 0,
      selected: false,
      selectedAt: time,
      uniforms: [],
      materials: [],
    };
    for (const object of model.children) {
      if (!(object instanceof THREE.Mesh) || Array.isArray(object.material))
        continue;
      const source = this.sources.get(object.material);
      if (!source) continue;
      const surface = this.material(
        source.source,
        source.part,
        index * 1.618 + 0.7,
      );
      if (state.cyan) applyCyanFlower(surface.material, source.part);
      object.material = surface.material;
      state.uniforms.push(surface.uniforms);
      state.materials.push(surface.material);
    }
    return state;
  }

  update(
    state: ArchiveSurface,
    selected: boolean,
    time: number,
    dt: number,
    reduced: boolean,
  ) {
    if (selected && !state.selected) state.selectedAt = time;
    state.selected = selected;
    const target = selected ? 1 : 0;
    state.amount = reduced
      ? target
      : THREE.MathUtils.lerp(
          state.amount,
          target,
          1 - Math.exp(-dt * (selected ? 3.4 : 2.8)),
        );
    const age = Math.max(0, time - state.selectedAt);
    const interval = (age + 0.6) % 3.7;
    const fault = reduced
      ? 0
      : Math.max(
          Math.exp(-age * 3.6),
          interval < 0.23 ? Math.sin((interval / 0.23) * Math.PI) * 0.48 : 0,
        );
    state.uniforms.forEach((uniforms, i) => {
      uniforms.uArchiveTime.value = reduced ? 0 : time;
      uniforms.uArchiveSelect.value = state.amount;
      uniforms.uArchiveAge.value = reduced ? 4 : age;
      uniforms.uArchiveFault.value = fault;
      const material = state.materials[i];
      if (uniforms.uArchiveShell.value) {
        material.opacity = THREE.MathUtils.lerp(
          DORMANT_GLASS_OPACITY,
          0.028,
          state.amount,
        );
        material.roughness = THREE.MathUtils.lerp(
          DORMANT_GLASS_ROUGHNESS,
          0.16,
          state.amount,
        );
      }
    });
  }

  release(state: ArchiveSurface) {
    for (const material of state.materials) material.dispose();
  }
  dispose() {
    for (const material of this.dormantMaterials) material.dispose();
    this.dormantMaterials = [];
    this.sources.clear();
  }
}
