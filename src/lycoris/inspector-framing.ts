import { Box3, MathUtils, PerspectiveCamera, Vector3 } from "three";

/** Fit both ends of the assembly animation without changing the viewing angle. */
export function fitInspectorBounds(
  camera: PerspectiveCamera,
  target: Vector3,
  bounds: Box3,
) {
  if (bounds.isEmpty()) return;
  const center = bounds.getCenter(new Vector3());
  const direction = camera.position.clone().sub(target).normalize();
  const right = new Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
  const up = new Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
  const vertical = Math.tan(MathUtils.degToRad(camera.fov / 2)) / 1.18;
  const horizontal = vertical * camera.aspect;
  let distance = camera.position.distanceTo(target);
  for (const x of [bounds.min.x, bounds.max.x])
    for (const y of [bounds.min.y, bounds.max.y])
      for (const z of [bounds.min.z, bounds.max.z]) {
        const point = new Vector3(x, y, z).sub(center);
        const depth = point.dot(direction);
        distance = Math.max(
          distance,
          depth + Math.abs(point.dot(right)) / horizontal,
          depth + Math.abs(point.dot(up)) / vertical,
        );
      }
  target.copy(center);
  camera.position.copy(center).addScaledVector(direction, distance);
  camera.lookAt(target);
  camera.updateMatrixWorld();
}
