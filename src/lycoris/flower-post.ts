import * as THREE from "three";
import { FullScreenQuad } from "three/addons/postprocessing/Pass.js";
import type { ArchiveSurface } from "./archive-appearance.ts";

const flowerParts = new Set(["petals", "stamens", "pedicels", "stem"]);

/** Exact flower geometry, in world space; chamber, caps and labels are excluded. */
export class FlowerMask {
  readonly scene = new THREE.Scene();
  readonly flowers = new Map<THREE.Mesh, THREE.Mesh>();
  readonly bounds = new THREE.Box3();
  private root?: THREE.Object3D;
  private white = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    toneMapped: false,
  });
  private covers = new Map<
    THREE.Mesh,
    THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>
  >();
  private box = new THREE.Box3();

  sync(root: THREE.Object3D | undefined, covers: THREE.Mesh[] = []) {
    if (root !== this.root) {
      for (const proxy of this.flowers.values()) this.scene.remove(proxy);
      this.flowers.clear();
      this.root = root;
      root?.traverse((object) => {
        if (
          !(object instanceof THREE.Mesh) ||
          !flowerParts.has(object.userData.assemblyPart)
        )
          return;
        const proxy = new THREE.Mesh(object.geometry, this.white);
        proxy.matrixAutoUpdate = false;
        this.flowers.set(object, proxy);
        this.scene.add(proxy);
      });
    }
    this.bounds.makeEmpty();
    for (const [source, proxy] of this.flowers) {
      source.updateWorldMatrix(true, false);
      proxy.matrix.copy(source.matrixWorld);
      proxy.matrixWorldNeedsUpdate = true;
      if (!source.geometry.boundingBox) source.geometry.computeBoundingBox();
      this.box
        .copy(source.geometry.boundingBox!)
        .applyMatrix4(source.matrixWorld);
      this.bounds.union(this.box);
    }
    const live = new Set(covers);
    for (const [source, proxy] of this.covers) {
      if (live.has(source)) continue;
      this.scene.remove(proxy);
      proxy.material.dispose();
      this.covers.delete(source);
    }
    for (const source of covers) {
      let proxy = this.covers.get(source);
      if (!proxy) {
        proxy = new THREE.Mesh(
          source.geometry,
          new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            depthWrite: false,
            toneMapped: false,
            side: THREE.FrontSide,
          }),
        );
        proxy.matrixAutoUpdate = false;
        this.covers.set(source, proxy);
        this.scene.add(proxy);
      }
      source.updateWorldMatrix(true, false);
      proxy.matrix.copy(source.matrixWorld);
      proxy.matrixWorldNeedsUpdate = true;
      proxy.visible = source.visible;
      // Front glass attenuates the mask; glass behind the flower fails depth.
      proxy.material.opacity =
        (source.material as THREE.Material).opacity * 0.8;
    }
  }

  dispose() {
    this.sync(undefined);
    this.white.dispose();
    // Proxy geometries belong to the original GLB and must not be disposed here.
  }
}

export const flowerPostVertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const flowerPostFragmentShader = /* glsl */ `
uniform sampler2D tScene;
uniform sampler2D tSceneDepth;
uniform sampler2D tFlower;
uniform sampler2D tFlowerDepth;
uniform vec2 uResolution;
uniform vec4 uBounds;
uniform float uTime;
uniform float uAge;
uniform float uFault;
uniform float uSeed;
uniform float uStrength;
uniform float uCyan;
varying vec2 vUv;

float signalHash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float signalNoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(signalHash(i), signalHash(i + vec2(1.0, 0.0)), f.x),
    mix(signalHash(i + vec2(0.0, 1.0)), signalHash(i + vec2(1.0)), f.x), f.y);
}
float flowerCoverage(vec2 uv) {
  if (any(lessThan(uv, vec2(0.0))) || any(greaterThan(uv, vec2(1.0)))) return 0.0;
  float coverage = texture2D(tFlower, uv).r;
  float flowerDepth = texture2D(tFlowerDepth, uv).r;
  float sceneDepth = texture2D(tSceneDepth, uv).r;
  // Reject flower pixels hidden by another specimen, the frame, or the floor.
  return coverage * (1.0 - step(0.000003, flowerDepth - sceneDepth));
}
float signalBox(vec2 uv, vec2 center, vec2 halfSize) {
  vec2 edge = smoothstep(halfSize, halfSize + vec2(0.07), abs(uv - center));
  return (1.0 - edge.x) * (1.0 - edge.y);
}
float signalDigit(vec2 uv, float digit) {
  float zero = signalBox(uv, vec2(0.5), vec2(0.25, 0.38)) -
    signalBox(uv, vec2(0.5), vec2(0.12, 0.25));
  float one = max(signalBox(uv, vec2(0.5), vec2(0.07, 0.38)),
    signalBox(uv, vec2(0.5, 0.17), vec2(0.22, 0.05)));
  return mix(zero, one, digit);
}
void main() {
  vec4 sceneColor = texture2D(tScene, vUv);
  vec3 result = sceneColor.rgb;
  float coverage = flowerCoverage(vUv) * uStrength;
  if (coverage > 0.001) {
    vec2 local = (vUv - uBounds.xy) / max(uBounds.zw, vec2(0.0001));
    vec2 cells = max(uBounds.zw * uResolution / vec2(9.0, 13.0), vec2(8.0, 12.0));
    float column = floor(local.x * cells.x);
    float seed = signalHash(vec2(column, uSeed));
    float scroll = local.y * cells.y + uTime * (2.5 + seed * 4.0);
    float digit = step(0.5, signalHash(vec2(column, floor(scroll) + uSeed)));
    float tail = fract(local.y * 1.2 + uTime * (0.12 + seed * 0.12) + seed);
    float trail = (1.0 - smoothstep(0.06, 0.48, tail)) * step(0.22, seed);
    float stream = signalDigit(vec2(fract(local.x * cells.x), fract(scroll)), digit) * trail;
    float head = 1.0 - smoothstep(0.0, 0.055, tail);

    vec2 inkUV = local * vec2(4.0, 3.2) + uSeed;
    float warp = signalNoise(inkUV * 1.7 + vec2(uTime * 0.055, -uTime * 0.025));
    float ink = signalNoise(inkUV * 2.4 + warp * 1.4) * 0.68 + signalNoise(inkUV * 5.9 - warp) * 0.32;
    float frontier = 0.18 + 0.64 * (1.0 - exp(-uAge * 0.45));
    float wet = 1.0 - smoothstep(frontier - 0.04, frontier + 0.065, local.y + (ink - 0.5) * 0.33);
    float stain = wet * smoothstep(0.33, 0.68, ink);
    result = mix(result, mix(vec3(0.34, 0.003, 0.018), vec3(0.003, 0.28, 0.3), uCyan), stain * 0.3);

    float band = floor(vUv.y * uResolution.y / 6.0);
    float frame = floor(uTime * 11.0);
    float glitch = step(0.7, signalHash(vec2(band, frame + uSeed))) * uFault;
    vec2 shifted = vUv + vec2((signalHash(vec2(frame, band)) * 2.0 - 1.0) * 8.0 * glitch / uResolution.x, 0.0);
    // Both ends of the image tear must be visible flower pixels. This prevents
    // dragging the lid, glass, labels or background into the effect.
    float shiftedCoverage = flowerCoverage(shifted);
    vec3 tornColor = texture2D(tScene, shifted).rgb * mix(vec3(1.5, 0.45, 0.65), vec3(0.45, 1.4, 1.5), uCyan);
    result = mix(result, tornColor, glitch * shiftedCoverage * 0.78);
    float scan = pow(0.5 + 0.5 * sin(vUv.y * uResolution.y * 2.1), 10.0);
    result += glitch * (scan + 0.22) * mix(vec3(0.9, 0.08, 0.15), vec3(0.08, 0.85, 0.9), uCyan);
    vec3 streamColor = mix(vec3(2.2, 0.09, 0.065), vec3(0.01, 0.95, 1.2), uCyan);
    vec3 headColor = mix(vec3(3.0, 1.4, 0.95), vec3(0.25, 1.6, 1.8), uCyan);
    result += mix(streamColor, headColor, head) * stream;
    result = mix(sceneColor.rgb, result, coverage);
  }
  gl_FragColor = vec4(result, sceneColor.a);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

/** Render the image once, then apply signals through the visible flower mask. */
export class FlowerPostEffects {
  readonly mask = new FlowerMask();
  readonly uniforms = {
    tScene: { value: null as THREE.Texture | null },
    tSceneDepth: { value: null as THREE.Texture | null },
    tFlower: { value: null as THREE.Texture | null },
    tFlowerDepth: { value: null as THREE.Texture | null },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uBounds: { value: new THREE.Vector4() },
    uTime: { value: 0 },
    uAge: { value: 0 },
    uFault: { value: 0 },
    uSeed: { value: 0 },
    uStrength: { value: 0 },
    uCyan: { value: 0 },
  };
  private sceneTarget = new THREE.WebGLRenderTarget(1, 1, {
    type: THREE.HalfFloatType,
  });
  private maskTarget = new THREE.WebGLRenderTarget(1, 1);
  private material = new THREE.ShaderMaterial({
    name: "LycorisFlowerPost",
    uniforms: this.uniforms,
    vertexShader: flowerPostVertexShader,
    fragmentShader: flowerPostFragmentShader,
    depthTest: false,
    depthWrite: false,
    blending: THREE.NoBlending,
  });
  private quad = new FullScreenQuad(this.material);
  private state?: ArchiveSurface;
  private age = 0;
  private time = 0;
  private point = new THREE.Vector3();
  private clearColor = new THREE.Color();

  constructor() {
    for (const target of [this.sceneTarget, this.maskTarget]) {
      target.depthTexture = new THREE.DepthTexture(1, 1, THREE.UnsignedIntType);
      target.samples = 4;
    }
    this.uniforms.tScene.value = this.sceneTarget.texture;
    this.uniforms.tSceneDepth.value = this.sceneTarget.depthTexture;
    this.uniforms.tFlower.value = this.maskTarget.texture;
    this.uniforms.tFlowerDepth.value = this.maskTarget.depthTexture;
  }

  setSize(width: number, height: number) {
    this.sceneTarget.setSize(width, height);
    this.maskTarget.setSize(width, height);
    this.uniforms.uResolution.value.set(width, height);
  }

  update(
    root: THREE.Object3D | undefined,
    state: ArchiveSurface | undefined,
    dt: number,
    reduced: boolean,
    covers: THREE.Mesh[] = [],
    cyan = state?.cyan ?? false,
  ) {
    this.uniforms.uCyan.value = cyan ? 1 : 0;
    this.mask.sync(root, covers);
    if (state !== this.state) {
      this.state = state;
      this.age = 0;
    }
    if (!reduced) {
      this.time += dt;
      this.age += dt;
    }
    const interval = (this.age + 0.6) % 3.7;
    this.uniforms.uTime.value = reduced ? 0 : this.time;
    this.uniforms.uAge.value = reduced ? 4 : this.age;
    this.uniforms.uFault.value = reduced
      ? 0
      : Math.max(
          Math.exp(-this.age * 3.6),
          interval < 0.23 ? Math.sin((interval / 0.23) * Math.PI) * 0.65 : 0,
        );
    this.uniforms.uSeed.value = state?.uniforms[0].uArchiveSeed.value ?? 0;
    this.uniforms.uStrength.value = root ? (state?.amount ?? 1) : 0;
  }

  render(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.Camera,
  ) {
    if (this.mask.bounds.isEmpty() || this.uniforms.uStrength.value < 0.001) {
      renderer.render(scene, camera);
      return;
    }
    const box = this.mask.bounds;
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    camera.updateMatrixWorld();
    for (const x of [box.min.x, box.max.x])
      for (const y of [box.min.y, box.max.y])
        for (const z of [box.min.z, box.max.z]) {
          this.point.set(x, y, z).project(camera);
          minX = Math.min(minX, this.point.x * 0.5 + 0.5);
          minY = Math.min(minY, this.point.y * 0.5 + 0.5);
          maxX = Math.max(maxX, this.point.x * 0.5 + 0.5);
          maxY = Math.max(maxY, this.point.y * 0.5 + 0.5);
        }
    this.uniforms.uBounds.value.set(minX, minY, maxX - minX, maxY - minY);
    const target = renderer.getRenderTarget();
    const alpha = renderer.getClearAlpha();
    renderer.getClearColor(this.clearColor);
    renderer.setRenderTarget(this.sceneTarget);
    renderer.render(scene, camera);
    renderer.setClearColor(0x000000, 0);
    renderer.setRenderTarget(this.maskTarget);
    renderer.render(this.mask.scene, camera);
    renderer.setClearColor(this.clearColor, alpha);
    renderer.setRenderTarget(target);
    this.quad.render(renderer);
  }

  dispose() {
    this.mask.dispose();
    this.sceneTarget.dispose();
    this.maskTarget.dispose();
    this.material.dispose();
    this.quad.dispose();
  }
}
