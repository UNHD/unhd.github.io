import { MathUtils, Vector3, type PerspectiveCamera } from "three";
import type { ArchiveMotion } from "./archive-motion.ts";

/** The camera follows extraction height; the specimen never slides forward. */
export function updateArchiveCamera(
  camera: PerspectiveCamera,
  cameraAim: Vector3,
  motion: ArchiveMotion,
  dt: number,
) {
  const detail = motion.detail;
  const aim = new Vector3(0, -0.4, -1);
  const specimen = new Vector3(...motion.position(motion.selected));
  specimen.y += 0.12;
  aim.lerp(specimen, detail);
  const direction = new Vector3(-0.64 - 0.25 * (1 - motion.reveal), 0.55, 0.53)
    .normalize()
    .lerp(new Vector3(-0.277, 0.238, 0.931).normalize(), detail)
    .normalize();
  const span = MathUtils.lerp(
    Math.max(16, 15 / camera.aspect),
    Math.max(6.2, 6 / camera.aspect),
    detail,
  );
  const distance = span / (2 * Math.tan(MathUtils.degToRad(34 / 2)));
  const target = aim.clone().addScaledVector(direction, distance);
  const blend = motion.reduced ? 1 : 1 - Math.exp(-dt * 5);
  // Lift is already spring-smoothed. Carry that elevation with the camera so
  // a second lag cannot leave the descending specimen below the close-up.
  camera.position.y += aim.y - cameraAim.y;
  cameraAim.y = aim.y;
  camera.position.lerp(target, blend);
  cameraAim.lerp(aim, blend);
  camera.lookAt(cameraAim);
  camera.updateMatrixWorld();
}
