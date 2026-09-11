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
uniform vec4 uMaskRect;
uniform float uTime;
uniform float uAge;
uniform float uFault;
uniform float uDistortion;
uniform float uSeed;
uniform float uStrength;
uniform float uCyan;
uniform float uMotion;
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
  vec2 maskUV = (uv - uMaskRect.xy) / uMaskRect.zw;
  if (any(lessThan(maskUV, vec2(0.0))) || any(greaterThan(maskUV, vec2(1.0)))) return 0.0;
  float coverage = texture2D(tFlower, maskUV).r;
  float flowerDepth = texture2D(tFlowerDepth, maskUV).r;
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
  float alpha = sceneColor.a;
  vec2 pixel = 1.0 / uResolution;
  vec2 flowerSize = max(uBounds.zw, pixel);
  vec2 center = uBounds.xy + flowerSize * vec2(0.5, 0.55);
  vec2 radius = flowerSize * vec2(0.68, 0.58) + pixel * 24.0;
  vec2 fieldUV = (vUv - center) / radius;
  float field = 1.0 - smoothstep(0.55, 1.35, length(fieldUV));

  // The field includes air around the specimen. Warp the rendered image first,
  // so the actual silhouette, nearby glass and background bend together.
  if (field > 0.001) {
    float strength = field * uStrength;
    float tick = floor(uTime * 10.0);
    float band = floor((vUv.y - center.y) * uResolution.y / 11.0);
    float bandSeed = signalHash(vec2(band + uSeed, tick));
    float tear = step(0.73, bandSeed) *
      (signalHash(vec2(band + uSeed, tick + 23.0)) * 2.0 - 1.0) * uFault;
    vec2 local = (vUv - uBounds.xy) / flowerSize;
    // A read head climbs the flower, leaving short decoded packets behind it.
    // It rests between sweeps; the same phase drives the image tear and data.
    float cycle = fract(uAge * 0.16);
    float scanY = mix(-0.12, 1.16, smoothstep(0.08, 0.83, cycle));
    float scanActive = smoothstep(0.02, 0.12, cycle) * (1.0 - smoothstep(0.84, 0.98, cycle)) * uMotion;
    float scan = (1.0 - smoothstep(0.01, 0.095, abs(local.y - scanY))) * scanActive;
    float bend = sin(fieldUV.y * 5.5 + uTime * 1.65 + uSeed) *
      (0.65 + 0.35 * cos(fieldUV.x * 3.0 - uTime));
    float reach = clamp(flowerSize.x * uResolution.x * 0.09, 16.0, 46.0);
    vec2 offset = vec2(
      bend * 2.0 * uDistortion +
        tear * reach + scan * sin(fieldUV.x * 4.0) * 8.0 * uDistortion,
      sin(fieldUV.x * 5.0 - uTime * 1.1) * 0.7 * uDistortion +
        tear * 3.0
    ) * pixel * strength;
    vec2 sourceUV = clamp(vUv + offset, pixel * 0.5, 1.0 - pixel * 0.5);
    vec4 warped = texture2D(tScene, sourceUV);
    result = warped.rgb;
    alpha = warped.a;

    // Separate the channels along the tear, including at the flower's edge.
    vec2 separation = vec2((1.1 + 7.0 * uFault) * uDistortion, 0.4 * uFault) * pixel * strength;
    vec3 split = vec3(
      texture2D(tScene, clamp(sourceUV + separation, pixel * 0.5, 1.0 - pixel * 0.5)).r,
      warped.g,
      texture2D(tScene, clamp(sourceUV - separation, pixel * 0.5, 1.0 - pixel * 0.5)).b
    );
    result = mix(result, split, uDistortion * 0.8);

    float coverage = flowerCoverage(sourceUV) * uStrength;
    vec2 cells = max(uBounds.zw * uResolution / vec2(8.0, 12.0), vec2(10.0, 14.0));
    vec2 packetUV = local * cells;
    float row = floor(packetUV.y);
    float rowSeed = signalHash(vec2(row, uSeed));
    float readX = fract(uTime * (0.2 + rowSeed * 0.15) + rowSeed) * (cells.x + 12.0) - 6.0;
    float behind = readX - packetUV.x;
    float packet = smoothstep(-0.2, 0.5, behind) * (1.0 - smoothstep(3.0, 9.0, behind));
    float digit = step(0.5, signalHash(vec2(floor(packetUV.x) + uSeed, row + floor(uTime * 3.0))));
    float decoded = smoothstep(-0.02, 0.01, scanY - local.y) * (1.0 - smoothstep(0.04, 0.28, scanY - local.y));
    float stream = signalDigit(fract(packetUV), digit) * packet * (0.12 + decoded * scanActive * 0.88);
    float head = 1.0 - smoothstep(0.0, 1.6, max(0.0, behind));

    if (coverage > 0.001) {
      vec2 inkUV = local * vec2(4.0, 3.2) + uSeed;
      float warp = signalNoise(inkUV * 1.7 + vec2(uTime * 0.055, -uTime * 0.025));
      float ink = signalNoise(inkUV * 2.4 + warp * 1.4) * 0.68 + signalNoise(inkUV * 5.9 - warp) * 0.32;
      float frontier = 0.18 + 0.64 * (1.0 - exp(-uAge * 0.45));
      float wet = 1.0 - smoothstep(frontier - 0.04, frontier + 0.065, local.y + (ink - 0.5) * 0.33);
      float stain = wet * smoothstep(0.33, 0.68, ink);
      result = mix(result, mix(vec3(0.34, 0.003, 0.018), vec3(0.003, 0.28, 0.3), uCyan), stain * 0.3 * coverage);
    }

    // Detached scan fragments sample visible source flower pixels, but their
    // destination may lie outside the silhouette. Foreground occlusion remains
    // part of the source mask; no extra scene render or history buffer is needed.
    vec3 signalColor = mix(vec3(1.35, 0.035, 0.1), vec3(0.015, 0.95, 1.25), uCyan);
    // Reconstruct only the read band on a coarser raster. Outside that band the
    // flower retains its original fine filaments, with detached packet traces.
    vec2 rasterUV = (floor(sourceUV * uResolution / vec2(4.0, 3.0)) + 0.5) * vec2(4.0, 3.0) * pixel;
    vec3 raster = texture2D(tScene, clamp(rasterUV, pixel * 0.5, 1.0 - pixel * 0.5)).rgb;
    result = mix(result, raster, scan * strength * 0.42);
    float readLine = (1.0 - smoothstep(pixel.y / flowerSize.y, 3.0 * pixel.y / flowerSize.y, abs(local.y - scanY))) * scanActive;
    result += signalColor * (scan * coverage * 0.24 + readLine * strength * 0.10);
    float echo = 0.0;
    if (uFault > 0.001) {
      float fragment = step(0.56, signalHash(vec2(band + 7.0, tick + uSeed)));
      float direction = bandSeed > 0.5 ? 1.0 : -1.0;
      vec2 echoUV = sourceUV + vec2(direction * reach * (0.55 + uFault), -tear * 5.0) * pixel;
      echo = flowerCoverage(echoUV) * fragment * uFault * strength * (1.0 - coverage * 0.8);
      vec3 echoColor = texture2D(tScene, clamp(echoUV, pixel * 0.5, 1.0 - pixel * 0.5)).rgb;
      float echoLuma = dot(echoColor, vec3(0.2126, 0.7152, 0.0722));
      result += (echoColor * 0.32 + signalColor * (0.2 + echoLuma)) * echo * 0.58;
    }

    vec3 streamColor = mix(vec3(2.2, 0.09, 0.065), vec3(0.01, 0.95, 1.2), uCyan);
    vec3 headColor = mix(vec3(3.0, 1.4, 0.95), vec3(0.25, 1.6, 1.8), uCyan);
    float stray = (1.0 - coverage) * step(0.70, rowSeed) *
      (decoded * scanActive * 0.34 + uFault * 0.10) * strength;
    result += mix(streamColor, headColor, head) * stream * (coverage * 0.65 + stray);
    float hairline = pow(0.5 + 0.5 * sin(vUv.y * uResolution.y * 1.6), 14.0);
    result += signalColor * hairline * abs(tear) * strength * 0.11;
    // Emitted fragments also remain visible against the transparent scene sky.
    alpha = max(alpha, clamp(echo * 0.5 + stream * stray * 0.6 + readLine * strength * 0.07, 0.0, 1.0));
  }
  gl_FragColor = vec4(result, alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

/** Crop only x/y clip coordinates: scene and mask depth must stay identical. */
export function cropFlowerCamera(
  source: THREE.Camera,
  target: THREE.Camera,
  rect: THREE.Vector4,
) {
  target.matrixAutoUpdate = false;
  target.matrixWorldAutoUpdate = false;
  target.matrixWorld.copy(source.matrixWorld);
  target.matrixWorldInverse.copy(source.matrixWorldInverse);
  target.projectionMatrix.makeScale(1 / rect.z, 1 / rect.w, 1);
  target.projectionMatrix.setPosition(
    (1 - 2 * rect.x - rect.z) / rect.z,
    (1 - 2 * rect.y - rect.w) / rect.w,
    0,
  );
  target.projectionMatrix.multiply(source.projectionMatrix);
  target.projectionMatrixInverse.copy(target.projectionMatrix).invert();
}

/** One local image distortion field, with flower-sourced signal fragments. */
export class FlowerPostEffects {
  readonly mask = new FlowerMask();
  readonly uniforms = {
    tScene: { value: null as THREE.Texture | null },
    tSceneDepth: { value: null as THREE.Texture | null },
    tFlower: { value: null as THREE.Texture | null },
    tFlowerDepth: { value: null as THREE.Texture | null },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uBounds: { value: new THREE.Vector4() },
    uMaskRect: { value: new THREE.Vector4(0, 0, 1, 1) },
    uTime: { value: 0 },
    uAge: { value: 0 },
    uFault: { value: 0 },
    uDistortion: { value: 0 },
    uSeed: { value: 0 },
    uStrength: { value: 0 },
    uCyan: { value: 0 },
    uMotion: { value: 1 },
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
  private root?: THREE.Object3D;
  private activity = 0;
  private age = 0;
  private time = 0;
  private point = new THREE.Vector3();
  private clearColor = new THREE.Color();
  private maskCamera = new THREE.Camera();

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
    // Allocate the mask when the flower's projected size is known.
    if (
      width !== this.uniforms.uResolution.value.x ||
      height !== this.uniforms.uResolution.value.y
    )
      this.maskTarget.setSize(1, 1);
    this.uniforms.uResolution.value.set(width, height);
  }

  setSamples(samples: number) {
    for (const target of [this.sceneTarget, this.maskTarget]) {
      if (target.samples === samples) continue;
      target.samples = samples;
      target.dispose();
    }
  }

  update(
    root: THREE.Object3D | undefined,
    state: ArchiveSurface | undefined,
    dt: number,
    reduced: boolean,
    covers: THREE.Mesh[] = [],
    cyan = state?.cyan ?? false,
    activity = 0,
  ) {
    this.uniforms.uCyan.value = cyan ? 1 : 0;
    this.uniforms.uMotion.value = reduced ? 0 : 1;
    this.mask.sync(root, covers);
    if (state !== this.state || root !== this.root) {
      this.state = state;
      this.root = root;
      this.age = 0;
    }
    if (!reduced) {
      this.time += dt;
      this.age += dt;
    }
    const interval = (this.age + 0.6) % 3.7;
    this.activity +=
      (THREE.MathUtils.clamp(activity, 0, 1) - this.activity) *
      (1 - Math.exp(-Math.max(0, dt) * 9));
    this.uniforms.uTime.value = reduced ? 0 : this.time;
    this.uniforms.uAge.value = reduced ? 4 : this.age;
    this.uniforms.uFault.value = reduced
      ? 0
      : Math.max(
          Math.exp(-this.age * 3.6),
          interval < 0.23 ? Math.sin((interval / 0.23) * Math.PI) * 0.65 : 0,
          this.activity * 0.7,
        );
    this.uniforms.uDistortion.value = reduced
      ? 0
      : 0.16 + this.uniforms.uFault.value * 0.84;
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
    let crossesCamera = false;
    camera.updateMatrixWorld();
    for (const x of [box.min.x, box.max.x])
      for (const y of [box.min.y, box.max.y])
        for (const z of [box.min.z, box.max.z]) {
          this.point.set(x, y, z).applyMatrix4(camera.matrixWorldInverse);
          crossesCamera ||= this.point.z >= -0.01;
          this.point.applyMatrix4(camera.projectionMatrix);
          minX = Math.min(minX, this.point.x * 0.5 + 0.5);
          minY = Math.min(minY, this.point.y * 0.5 + 0.5);
          maxX = Math.max(maxX, this.point.x * 0.5 + 0.5);
          maxY = Math.max(maxY, this.point.y * 0.5 + 0.5);
        }
    this.uniforms.uBounds.value.set(minX, minY, maxX - minX, maxY - minY);
    if (crossesCamera) {
      minX = minY = 0;
      maxX = maxY = 1;
    }
    const { x: width, y: height } = this.uniforms.uResolution.value;
    // This mask stores undisplaced source coverage. Output tears may extend
    // beyond it; only multisample/filter footprints need extra source padding.
    const left = Math.max(0, Math.floor(minX * width) - 10);
    const bottom = Math.max(0, Math.floor(minY * height) - 10);
    const right = Math.min(width, Math.ceil(maxX * width) + 10);
    const top = Math.min(height, Math.ceil(maxY * height) + 10);
    if (right <= left || top <= bottom) {
      renderer.render(scene, camera);
      return;
    }
    const wantedWidth = Math.min(width, Math.ceil((right - left) / 64) * 64);
    const wantedHeight = Math.min(height, Math.ceil((top - bottom) / 64) * 64);
    // Grow immediately; shrink only with a substantial size change so the
    // breathing flower does not reallocate GPU attachments every few frames.
    if (
      wantedWidth > this.maskTarget.width ||
      wantedHeight > this.maskTarget.height ||
      wantedWidth < this.maskTarget.width / 2 ||
      wantedHeight < this.maskTarget.height / 2
    )
      this.maskTarget.setSize(wantedWidth, wantedHeight);
    this.uniforms.uMaskRect.value.set(
      Math.min(left, width - this.maskTarget.width) / width,
      Math.min(bottom, height - this.maskTarget.height) / height,
      this.maskTarget.width / width,
      this.maskTarget.height / height,
    );
    cropFlowerCamera(camera, this.maskCamera, this.uniforms.uMaskRect.value);
    const target = renderer.getRenderTarget();
    const alpha = renderer.getClearAlpha();
    renderer.getClearColor(this.clearColor);
    renderer.setRenderTarget(this.sceneTarget);
    renderer.render(scene, camera);
    renderer.setClearColor(0x000000, 0);
    renderer.setRenderTarget(this.maskTarget);
    renderer.render(this.mask.scene, this.maskCamera);
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
