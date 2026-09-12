import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { parts, records } from "./data";
import { ArchiveMotion, fileAtCell, type ArchiveCell } from "./archive-motion";
import { SpecimenArray } from "./archive-array";
import { updateArchiveCamera } from "./archive-camera";
import { FlowerPostEffects } from "./flower-post";
import { applyCyanFlower } from "./specimen-color";
import { fitInspectorBounds } from "./inspector-framing";
import { withDistanceFog } from "./distance-fog";
import { AdaptiveQuality, previewPixelRatio } from "./render-quality";

export type SceneMode = "archive" | "detail" | "inspect";
const approach = (a: number, b: number, dt: number, speed = 5) =>
  THREE.MathUtils.lerp(a, b, 1 - Math.exp(-speed * dt));

export class SpecimenScene {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.PerspectiveCamera(34, 1, 0.1, 150);
  readonly controls: OrbitControls;
  readonly ready: Promise<void>;
  readonly motion = new ArchiveMotion();
  mode: SceneMode = "archive";
  private reducedMotion = false;
  get reduced() {
    return this.reducedMotion;
  }
  set reduced(value: boolean) {
    if (this.reducedMotion !== value) {
      this.reducedMotion = value;
      this.invalidate();
    }
  }
  autorotate = false;
  onSelect?: (index: number, cell: ArchiveCell) => void;
  onOpen?: () => void;
  onReady?: () => void;
  onPhaseChange?: (phase: string) => void;
  onFrame?: (dt: number, light: boolean) => void;
  private archive?: SpecimenArray;
  private flowerPost = new FlowerPostEffects();
  private quality = new AdaptiveQuality(
    navigator.hardwareConcurrency,
    (navigator as Navigator & { deviceMemory?: number }).deviceMemory,
  );
  private inspector = new THREE.Group();
  private inspectorMaterials: {
    material: THREE.MeshStandardMaterial;
    originalColor: THREE.Color;
    transmission: number;
    part: string;
  }[] = [];
  private exploded = new Set<string>();
  private partMeshes: {
    mesh: THREE.Object3D;
    part: string;
    origin: THREE.Vector3;
    progress: number;
  }[] = [];
  private raycaster = new THREE.Raycaster();
  private pointerDown = { x: 0, y: 0 };
  private lastPointerX = 0;
  private dragging = false;
  private clock = new THREE.Clock();
  private cameraAim = new THREE.Vector3(0, -0.4, -1);
  private temp = new THREE.Vector3();
  private resizeObserver: ResizeObserver;
  private intersectionObserver: IntersectionObserver;
  private inViewport = true;
  private disposed = false;
  private presented = false;
  get hasPresentedScene() {
    return this.presented;
  }
  private needsRender = true;
  private invalidate = () => {
    this.needsRender = true;
  };
  private ground = new THREE.Group();
  private ring: THREE.LineLoop;
  private labelMaterial: THREE.MeshBasicMaterial;
  private labelGeometries: THREE.PlaneGeometry[] = [];
  private environment: THREE.WebGLRenderTarget;
  private lastPhase = "";
  private inspectorRotation = 0.3;
  private inspectorTarget = 0.3;
  private archiveCamera?: {
    position: THREE.Vector3;
    aim: THREE.Vector3;
    fov: number;
  };

  constructor(private host: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
    this.renderer.transmissionResolutionScale = 0.75;
    this.renderer.setClearColor(0x090d10, 0);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    const canvas = this.renderer.domElement;
    canvas.setAttribute("aria-label", "石蒜档案阵列，点击选择，双击抽取检视");
    canvas.setAttribute("role", "img");
    host.appendChild(canvas);

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    const room = new RoomEnvironment();
    this.environment = pmrem.fromScene(room, 0.04);
    this.scene.environment = this.environment.texture;
    room.dispose();
    pmrem.dispose();
    this.scene.environmentIntensity = 0.6;
    this.scene.fog = new THREE.Fog(0x090d10, 29, 52);
    this.scene.add(new THREE.HemisphereLight(0xa7c0d8, 0x282323, 1.6));
    const key = new THREE.DirectionalLight(0xfff3f3, 3.2);
    key.position.set(3, 6, 5);
    const rim = new THREE.DirectionalLight(0xffcbd5, 1.2);
    rim.position.set(-4, 3, -3);
    const fill = new THREE.DirectionalLight(0xe7f2ed, 1.8);
    fill.position.set(-3, 1, 4);
    this.scene.add(key, rim, fill);

    this.camera.position.set(-16.8, 14.0, 14.5);
    this.camera.lookAt(this.cameraAim);
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.065;
    this.controls.minDistance = 4.2;
    this.controls.maxDistance = 22;
    this.controls.maxPolarAngle = Math.PI * 0.92;
    this.controls.enabled = false;
    this.controls.enablePan = false;
    this.controls.addEventListener("change", this.invalidate);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(160, 160),
      withDistanceFog(
        new THREE.MeshStandardMaterial({
          color: 0x0a1014,
          roughness: 0.82,
          metalness: 0.25,
        }),
      ),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -5.45;
    const grid = new THREE.GridHelper(120, 60, 0x283034, 0x172126);
    withDistanceFog(grid.material);
    grid.position.y = -5.43;
    this.ground.add(floor, grid);
    this.scene.add(this.ground);
    this.ring = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(
        Array.from(
          { length: 96 },
          (_, i) =>
            new THREE.Vector3(
              1.93 * Math.cos((i / 96) * Math.PI * 2),
              0,
              1.93 * Math.sin((i / 96) * Math.PI * 2),
            ),
        ),
      ),
      withDistanceFog(
        new THREE.LineBasicMaterial({
          color: 0xdb5c51,
          transparent: true,
          opacity: 0.65,
        }),
      ),
    );
    this.scene.add(this.ring);
    this.labelMaterial = this.createLabels();
    this.inspector.visible = false;
    this.scene.add(this.inspector);
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(host);
    this.intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        this.inViewport = entry.isIntersecting;
        if (this.inViewport) this.invalidate();
      },
      { rootMargin: "64px" },
    );
    this.intersectionObserver.observe(host);
    document.addEventListener("visibilitychange", this.invalidate);
    this.bindPointer();
    this.ready = this.load();
    this.renderer.setAnimationLoop(() => this.frame());
  }

  private createLabels() {
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 640;
    const context = canvas.getContext("2d")!;
    for (let index = 0; index < records.length; index++) {
      const x = (index % 8) * 256;
      const y = Math.floor(index / 8) * 128;
      context.fillStyle = "#161e21";
      context.fillRect(x, y, 256, 128);
      context.fillStyle = "#ee5d55";
      context.fillRect(x + 12, y + 12, 7, 104);
      context.fillStyle = "#ced4ce";
      context.font = "bold 39px monospace";
      context.fillText(records[index].id, x + 31, y + 64);
      context.fillStyle = "#95a3a4";
      context.font = "16px monospace";
      context.fillText("LYCORIS / ARCHIVE", x + 31, y + 99);
      const geometry = new THREE.PlaneGeometry(1.05, 0.525);
      const uv = geometry.attributes.uv;
      for (let vertex = 0; vertex < uv.count; vertex++)
        uv.setXY(
          vertex,
          (uv.getX(vertex) + (index % 8)) / 8,
          (uv.getY(vertex) + 4 - Math.floor(index / 8)) / 5,
        );
      this.labelGeometries.push(geometry);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
    return withDistanceFog(
      new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        toneMapped: false,
      }),
    );
  }

  private async load() {
    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync(
      `${import.meta.env.BASE_URL}assets/lycoris-specimen.glb?v=photo-study-04`,
    );
    if (this.disposed) {
      this.disposeSource(gltf.scene);
      return;
    }
    gltf.scene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];
      for (const material of materials) {
        if (!(material instanceof THREE.MeshStandardMaterial)) continue;
        material.envMapIntensity = 0.7;
        if (
          /Petals|Scarlet|Filaments|Anthers|Green_Scape/.test(material.name)
        ) {
          material.metalness = 0;
          material.envMapIntensity = 0.2;
        }
        if (material.name.includes("Glass")) {
          material.transparent = true;
          material.opacity = 0.018;
          material.depthWrite = false;
          material.side = THREE.DoubleSide;
        }
        if (/Petals|Scarlet/.test(material.name))
          material.side = THREE.DoubleSide;
      }
    });
    this.archive = new SpecimenArray(gltf.scene, (index) => {
      const label = new THREE.Mesh(
        this.labelGeometries[index],
        this.labelMaterial,
      );
      label.position.set(0, -1.57, 0.93);
      return label;
    });
    this.motion.setBounds(this.archive.bounds.min.y, this.archive.bounds.max.y);
    this.scene.add(this.archive);
    this.inspector.add(gltf.scene);
    gltf.scene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      const cloneMaterial = (source: THREE.MeshStandardMaterial) => {
        const material = withDistanceFog(source.clone());
        this.inspectorMaterials.push({
          material,
          originalColor: material.color.clone(),
          transmission:
            material instanceof THREE.MeshPhysicalMaterial
              ? material.transmission
              : 0,
          part: object.userData.assemblyPart,
        });
        return material;
      };
      object.material = Array.isArray(object.material)
        ? object.material.map(cloneMaterial)
        : cloneMaterial(object.material);
      this.partMeshes.push({
        mesh: object,
        part: object.userData.assemblyPart,
        origin: object.position.clone(),
        progress: 0,
      });
    });
    this.tintInspector(this.motion.selected.index);
    this.applyQuality();
    this.archive.sync(this.motion);
    this.resize();
    this.onReady?.();
    // The full model is already usable. Optional distant geometry must never
    // delay the opening, even if this request is slow or unavailable.
    void this.loadDistant(loader);
  }

  private async loadDistant(loader: GLTFLoader) {
    const distant = await loader
      .loadAsync(
        `${import.meta.env.BASE_URL}assets/lycoris-distant.glb?v=photo-study-04-lod1`,
      )
      .catch(() => undefined);
    if (!distant) return;
    if (!this.disposed) {
      this.archive!.setDistantSource(distant.scene);
      this.invalidate();
    }
    this.disposeSource(distant.scene);
  }

  private disposeSource(source: THREE.Object3D) {
    source.traverse((mesh) => {
      if (!(mesh instanceof THREE.Mesh)) return;
      mesh.geometry.dispose();
      for (const material of Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material])
        material.dispose();
    });
  }

  private bindPointer() {
    const canvas = this.renderer.domElement;
    canvas.addEventListener("pointerdown", (event) => {
      this.pointerDown = { x: event.clientX, y: event.clientY };
      this.lastPointerX = event.clientX;
      this.dragging =
        event.button === 0 && this.mode === "detail" && this.motion.canRotate;
      if (this.dragging) canvas.setPointerCapture(event.pointerId);
    });
    canvas.addEventListener("pointermove", (event) => {
      if (this.dragging && event.buttons === 1 && this.motion.canRotate) {
        this.motion.rotationTarget +=
          (event.clientX - this.lastPointerX) * 0.008;
        this.invalidate();
      }
      this.lastPointerX = event.clientX;
    });
    canvas.addEventListener("pointerup", (event) => {
      this.dragging = false;
      if (canvas.hasPointerCapture(event.pointerId))
        canvas.releasePointerCapture(event.pointerId);
      if (
        this.mode !== "archive" ||
        event.button !== 0 ||
        Math.hypot(
          event.clientX - this.pointerDown.x,
          event.clientY - this.pointerDown.y,
        ) > 5
      )
        return;
      const cell = this.pick(event);
      if (cell) this.onSelect?.(fileAtCell(cell), { ...cell });
    });
    canvas.addEventListener("pointercancel", () => {
      this.dragging = false;
    });
    canvas.addEventListener("dblclick", (event) => {
      if (this.mode === "archive" && this.pick(event)) this.onOpen?.();
    });
  }

  private pick(event: MouseEvent) {
    if (!this.archive || !this.archive.visible) return;
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.raycaster.setFromCamera(
      new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        (-(event.clientY - rect.top) / rect.height) * 2 + 1,
      ),
      this.camera,
    );
    // The enclosing glass provides a small raycast target for the fine flower.
    const objects: THREE.Object3D[] = this.archive.shells.filter(
      (mesh) => mesh.visible,
    );
    for (const model of this.archive.models.values()) objects.push(model);
    const hit = this.raycaster.intersectObjects(objects, true)[0];
    return hit ? this.archive.cellFromHit(hit) : undefined;
  }

  resize(refit = true) {
    this.invalidate();
    const width = this.host.clientWidth,
      height = this.host.clientHeight;
    if (!width || !height) return;
    this.renderer.setPixelRatio(
      previewPixelRatio(this.quality.profile, width, height, devicePixelRatio),
    );
    this.renderer.setSize(width, height);
    const drawingSize = this.renderer.getDrawingBufferSize(new THREE.Vector2());
    this.flowerPost.setSize(drawingSize.x, drawingSize.y);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    if (this.mode === "inspect" && refit) this.fitInspector();
  }
  revealScene() {
    this.motion.revealScene();
    this.invalidate();
  }
  hideScene() {
    this.presented = false;
    this.motion.revealTarget = 0;
    this.invalidate();
  }
  /** Opening linework meets the actual selected flower in viewport coordinates. */
  flowerScreenAnchor() {
    const model = this.archive?.models.get(this.motion.selected);
    if (!model || !this.archive?.visible) return undefined;
    model.updateWorldMatrix(true, true);
    const bounds = new THREE.Box3();
    model.traverse((object) => {
      if (
        object instanceof THREE.Mesh &&
        ["petals", "stamens", "pedicels"].includes(object.userData.assemblyPart)
      )
        bounds.union(new THREE.Box3().setFromObject(object));
    });
    if (bounds.isEmpty()) return undefined;
    const projected = new THREE.Box2();
    for (const x of [bounds.min.x, bounds.max.x])
      for (const y of [bounds.min.y, bounds.max.y])
        for (const z of [bounds.min.z, bounds.max.z]) {
          const point = new THREE.Vector3(x, y, z).project(this.camera);
          projected.expandByPoint(new THREE.Vector2(point.x, point.y));
        }
    const rect = this.host.getBoundingClientRect();
    const center = projected.getCenter(new THREE.Vector2());
    return {
      x: rect.left + ((center.x + 1) * rect.width) / 2,
      y: rect.top + ((1 - center.y) * rect.height) / 2,
      width: ((projected.max.x - projected.min.x) * rect.width) / 2,
    };
  }
  private tintInspector(index: number) {
    for (const item of this.inspectorMaterials) {
      item.material.color.copy(item.originalColor);
      if (records[index]?.flowerColor === "cyan")
        applyCyanFlower(item.material, item.part);
    }
  }

  select(index: number, lane: number, row: number) {
    this.motion.select({ lane, row });
    this.tintInspector(index);
    this.invalidate();
  }

  setMode(mode: SceneMode) {
    if (this.mode === mode) return;
    this.invalidate();
    if (mode === "inspect") {
      this.tintInspector(this.motion.selected.index);
      // The independent structure view leaves the archive's extraction frozen.
      this.archiveCamera = {
        position: this.camera.position.clone(),
        aim: this.cameraAim.clone(),
        fov: this.camera.fov,
      };
      this.exploded.clear();
      for (const item of this.partMeshes) {
        item.progress = 0;
        item.mesh.position.copy(item.origin);
      }
      this.mode = mode;
      this.controls.enabled = true;
      this.controls.enablePan = true;
      this.resetView();
    } else {
      this.controls.enabled = false;
      this.controls.enablePan = false;
      if (this.mode === "inspect" && this.archiveCamera) {
        this.camera.position.copy(this.archiveCamera.position);
        this.cameraAim.copy(this.archiveCamera.aim);
        this.camera.fov = this.archiveCamera.fov;
        this.camera.lookAt(this.cameraAim);
        this.camera.updateProjectionMatrix();
        this.archiveCamera = undefined;
      }
      this.mode = mode;
      this.motion.setDetail(mode === "detail");
      if (mode === "archive") this.autorotate = false;
    }
    this.dragging = false;
    this.inspector.visible = mode === "inspect";
    this.ground.visible = mode !== "inspect";
    this.ring.visible = mode !== "inspect";
    if (this.archive)
      this.archive.visible = mode !== "inspect" && this.motion.reveal > 0.001;
  }
  setExploded(ids: string[]) {
    this.invalidate();
    this.exploded = new Set(ids);
    if (this.mode === "inspect" && ids.length) this.fitInspector();
  }
  private fitInspector() {
    this.inspector.updateWorldMatrix(true, true);
    const bounds = new THREE.Box3();
    for (const item of this.partMeshes) {
      const current = new THREE.Box3().setFromObject(item.mesh);
      bounds.union(current);
      const end = item.origin.clone();
      const part = parts.find((part) => part.id === item.part);
      if (part && this.exploded.has(item.part))
        end.add(new THREE.Vector3().fromArray(part.offset));
      const delta = end
        .sub(item.mesh.position)
        .applyMatrix3(
          new THREE.Matrix3().setFromMatrix4(item.mesh.parent!.matrixWorld),
        );
      bounds.union(current.translate(delta));
    }
    fitInspectorBounds(this.camera, this.controls.target, bounds);
    this.controls.maxDistance = Math.max(
      22,
      this.camera.position.distanceTo(this.controls.target) * 1.3,
    );
    this.controls.update();
  }
  getExploded() {
    return [...this.exploded];
  }
  rotate(amount: number) {
    this.invalidate();
    if (this.mode === "inspect") this.inspectorTarget += amount;
    else if (this.motion.canRotate) this.motion.rotationTarget += amount;
  }
  resetView() {
    this.invalidate();
    if (this.mode !== "inspect") {
      this.motion.rotationTarget = 0;
      return;
    }
    this.camera.position.set(5.3, 2.5, 9.8);
    this.camera.fov = 34;
    this.camera.updateProjectionMatrix();
    this.controls.target.set(0, 0, 0);
    this.controls.update();
    this.inspectorRotation = this.inspectorTarget = 0.3;
    this.inspector.rotation.y = 0.3;
    this.fitInspector();
  }
  zoom(direction: number) {
    this.invalidate();
    this.temp
      .copy(this.camera.position)
      .sub(this.controls.target)
      .multiplyScalar(direction > 0 ? 0.85 : 1.18)
      .clampLength(this.controls.minDistance, this.controls.maxDistance);
    this.camera.position.copy(this.controls.target).add(this.temp);
    this.controls.update();
  }
  pan(x: number, y: number) {
    this.invalidate();
    const right = new THREE.Vector3()
      .setFromMatrixColumn(this.camera.matrix, 0)
      .multiplyScalar(x * 0.18);
    const up = new THREE.Vector3()
      .setFromMatrixColumn(this.camera.matrix, 1)
      .multiplyScalar(y * 0.18);
    right.add(up);
    this.camera.position.add(right);
    this.controls.target.add(right);
    this.controls.update();
  }
  setQuality(high: boolean) {
    this.quality.setEnabled(high);
    this.applyQuality();
  }

  private applyQuality() {
    const profile = this.quality.profile;
    this.renderer.transmissionResolutionScale = profile.transmission;
    this.flowerPost.setSamples(profile.samples);
    this.archive?.setQuality(profile);
    for (const item of this.inspectorMaterials) {
      if (!(item.material instanceof THREE.MeshPhysicalMaterial)) continue;
      const transmission = profile.transmission === 0 ? 0 : item.transmission;
      if (item.material.transmission !== transmission) {
        item.material.transmission = transmission;
        item.material.needsUpdate = true;
      }
    }
    this.host.dataset.renderQuality = profile.name;
    this.resize(false);
  }

  private frame() {
    const frameSeconds = this.clock.getDelta();
    const dt = Math.min(frameSeconds, 0.05);
    if (document.hidden || !this.inViewport) return;
    this.onFrame?.(dt, this.quality.profile.name === "light");
    if (!this.archive) return;
    if (!this.needsRender) {
      if (
        this.reduced &&
        (this.mode === "inspect" || !this.motion.transitioning)
      )
        return;
      if (
        this.mode !== "inspect" &&
        this.motion.revealTarget === 0 &&
        this.motion.reveal < 0.001
      )
        return;
    }
    if (!this.reduced && this.quality.sample(frameSeconds)) this.applyQuality();
    this.needsRender = false;
    this.motion.reduced = this.reduced;
    if (this.mode === "inspect") {
      this.archive.visible = false;
      if (this.autorotate && !this.reduced) this.inspectorTarget += dt * 0.17;
      this.inspectorRotation = this.reduced
        ? this.inspectorTarget
        : approach(this.inspectorRotation, this.inspectorTarget, dt);
      this.inspector.rotation.y = this.inspectorRotation;
      for (const item of this.partMeshes) {
        const target = this.exploded.has(item.part) ? 1 : 0;
        item.progress = this.reduced
          ? target
          : approach(item.progress, target, dt, 3.7);
        const part = parts.find((part) => part.id === item.part);
        if (part)
          item.mesh.position
            .copy(item.origin)
            .addScaledVector(this.temp.fromArray(part.offset), item.progress);
      }
      this.controls.update();
      const fog = this.scene.fog as THREE.Fog;
      fog.near = 35;
      fog.far = 70;
    } else {
      if (this.autorotate && !this.reduced && this.motion.canRotate)
        this.motion.rotationTarget += dt * 0.22;
      this.motion.step(dt);
      this.updateArchiveCamera(dt);
      this.archive.sync(this.motion, this.camera, this.scene.fog as THREE.Fog);
      this.ring.visible = this.motion.reveal > 0.05;
      this.ring.position.set(
        ...this.motion.slotPosition(this.motion.selected.cell),
      );
      this.ring.position.y += this.archive.bounds.min.y - 0.02;
      const phase = this.motion.phase;
      const phaseKey = phase + ":" + this.reduced;
      if (phaseKey !== this.lastPhase) {
        this.lastPhase = phaseKey;
        this.host.dataset.inspection = phase;
        this.host.dataset.motion = this.reduced ? "reduced" : "full";
        this.renderer.domElement.style.cursor = this.motion.canRotate
          ? "grab"
          : "pointer";
        this.onPhaseChange?.(phase);
      }
    }
    const selected =
      this.mode === "inspect"
        ? this.inspector
        : this.archive.visible
          ? this.archive.models.get(this.motion.selected)
          : undefined;
    const covers =
      this.mode === "inspect"
        ? []
        : this.archive.shells.filter((shell) => shell.visible);
    if (this.mode !== "inspect")
      for (const model of this.archive.models.values())
        for (const mesh of model.children)
          if (
            mesh instanceof THREE.Mesh &&
            !Array.isArray(mesh.material) &&
            mesh.material.name.includes("Glass")
          )
            covers.push(mesh);
    this.flowerPost.update(
      selected,
      this.archive.surfaces.get(this.motion.selected),
      dt,
      this.reduced,
      covers,
      records[this.motion.selected.index]?.flowerColor === "cyan",
      this.mode === "inspect"
        ? Math.max(
            Math.abs(this.inspectorTarget - this.inspectorRotation),
            this.partMeshes.reduce(
              (amount, item) =>
                Math.max(
                  amount,
                  Math.abs(
                    (this.exploded.has(item.part) ? 1 : 0) - item.progress,
                  ),
                ),
              0,
            ),
          )
        : Math.abs(this.motion.selected.lift.velocity) * 0.2 +
            Math.abs(this.motion.trackLane.velocity) * 0.3 +
            Math.abs(this.motion.trackRow.velocity) * 0.3 +
            Math.abs(
              this.motion.rotationTarget - this.motion.selected.rotation,
            ) *
              0.25,
    );
    this.flowerPost.render(this.renderer, this.scene, this.camera);
    if (this.motion.revealTarget > 0 && this.archive.visible)
      this.presented = true;
  }

  private updateArchiveCamera(dt: number) {
    updateArchiveCamera(this.camera, this.cameraAim, this.motion, dt);
    const detail = this.motion.detail;
    const renderedDistance = this.camera.position.distanceTo(this.cameraAim);
    const fog = this.scene.fog as THREE.Fog;
    fog.near = renderedDistance + THREE.MathUtils.lerp(-3, -2, detail);
    fog.far = renderedDistance + THREE.MathUtils.lerp(18, 15, detail);
  }

  dispose() {
    this.disposed = true;
    this.renderer.setAnimationLoop(null);
    this.controls.dispose();
    this.resizeObserver.disconnect();
    this.intersectionObserver.disconnect();
    document.removeEventListener("visibilitychange", this.invalidate);
    this.labelMaterial.map?.dispose();
    this.labelMaterial.dispose();
    for (const geometry of this.labelGeometries) geometry.dispose();
    const geometries = new Set<THREE.BufferGeometry>();
    const materials = new Set<THREE.Material>();
    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
        geometries.add(object.geometry);
        for (const material of Array.isArray(object.material)
          ? object.material
          : [object.material])
          materials.add(material);
      }
    });
    for (const geometry of geometries) geometry.dispose();
    for (const material of materials) material.dispose();
    this.environment.dispose();
    this.flowerPost.dispose();
    this.renderer.dispose();
  }
}
