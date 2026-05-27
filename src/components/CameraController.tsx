import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useWorldStore } from '../store/useWorldStore';

// ----- Feel constants -----
const MAX_YAW        = 1.70;  // ~97° horizontal each way (total ~194° panoramic viewing range)
const MAX_PITCH_UP   = 0.38;  // ~22° upward
const MAX_PITCH_DOWN = 0.22;  // ~13° downward
const LERP_SPEED     = 0.025; // camera lag — lower = smoother/lazier catch-up (adds ~1-1.5s drift catching time)
const RETURN_SPEED   = 0.04;  // return-to-center speed

/**
 * CameraController
 *
 * Uses raw window mousemove (not R3F state.pointer) so the camera
 * receives smooth, uninterrupted updates even when the mouse is over
 * Html overlay elements (artwork panels, TV screen, etc.).
 *
 * Mouse XY position maps directly to look direction:
 *   center of screen → look straight ahead
 *   far left/right   → pan left/right (yaw)
 *   far up/down      → tilt up/down (pitch)
 *
 * Employs a robust, simple linear interpolation (lerp) with adjusted speed
 * for an ultra-smooth, stable, cinematic drift with zero spring recoil or wiggling.
 */
export const CameraController = () => {
  const { camera } = useThree();
  const tvRaised    = useWorldStore((s) => s.tvRaised);
  const currentWorld = useWorldStore((s) => s.currentWorld);
  const debugMode   = useWorldStore((s) => s.debugMode);
  const selectedArtifactId = useWorldStore((s) => s.selectedArtifactId);

  // Raw normalized mouse position (-1 to +1), updated by window listener
  const rawMouse = useRef({ x: 0, y: 0 });

  // Current smoothed rotation state
  const currentYaw   = useRef(0);
  const currentPitch = useRef(0);

  // Listen directly on window — fires regardless of Html overlay captures
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      // Normalize to -1…+1 (center = 0, right/up = positive)
      rawMouse.current.x =  (e.clientX / window.innerWidth)  * 2 - 1;
      rawMouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1); // flip Y
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  // Reset smoothed state when channel world or debug changes, but NOT when raising/lowering TV or selecting artifacts
  useEffect(() => {
    currentYaw.current   = 0;
    currentPitch.current = 0;
  }, [currentWorld, debugMode]);

  useFrame(() => {
    const canLook = !tvRaised && !debugMode;

    let targetYaw   = 0;
    let targetPitch = 0;

    if (canLook) {
      const { x, y } = rawMouse.current;

      // Clamp inputs strictly to [-1, 1] to prevent viewport boundary overflows
      const clampedX = Math.max(-1, Math.min(1, x));
      const clampedY = Math.max(-1, Math.min(1, y));

      // Apply a smooth non-linear sine easing curve to soften limits near screen edges.
      // This dampens rotational acceleration near the boundaries so looking around feels organic.
      const easedX = Math.sin(clampedX * Math.PI / 2);
      const easedY = Math.sin(clampedY * Math.PI / 2);

      targetYaw   = -easedX * MAX_YAW;
      targetPitch = easedY * (y >= 0 ? MAX_PITCH_UP : MAX_PITCH_DOWN);
    } else if (selectedArtifactId && !debugMode) {
      // Let the viewer subtly pan the camera even in Focus Mode (damped by 80%)
      // This preserves rich 3D horizon perspective without disorienting the view.
      const { x, y } = rawMouse.current;
      const clampedX = Math.max(-1, Math.min(1, x));
      const clampedY = Math.max(-1, Math.min(1, y));
      const easedX = Math.sin(clampedX * Math.PI / 2);
      const easedY = Math.sin(clampedY * Math.PI / 2);

      targetYaw   = -easedX * MAX_YAW * 0.20;
      targetPitch = easedY * (y >= 0 ? MAX_PITCH_UP : MAX_PITCH_DOWN) * 0.20;
    }

    // When focused, we want a very stable camera drift to match the presentation posture
    const speed = canLook ? LERP_SPEED : (selectedArtifactId ? 0.035 : RETURN_SPEED);
    currentYaw.current   = THREE.MathUtils.lerp(currentYaw.current,   targetYaw,   speed);
    currentPitch.current = THREE.MathUtils.lerp(currentPitch.current, targetPitch, speed);

    // Apply via YXZ order (yaw first, then pitch, no roll)
    camera.rotation.order = 'YXZ';
    camera.rotation.y = currentYaw.current;
    camera.rotation.x = currentPitch.current;
    camera.rotation.z = 0;
  });

  return null;
};
