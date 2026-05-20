import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useWorldStore } from '../store/useWorldStore';

// ----- Feel constants -----
const MAX_YAW        = 0.65;  // ~37° horizontal
const MAX_PITCH_UP   = 0.38;  // ~22° upward
const MAX_PITCH_DOWN = 0.22;  // ~13° downward
const LERP_SPEED     = 0.05;  // camera lag — lower = smoother/lazier
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
 */
export const CameraController = () => {
  const { camera } = useThree();
  const tvRaised    = useWorldStore((s) => s.tvRaised);
  const currentWorld = useWorldStore((s) => s.currentWorld);
  const debugMode   = useWorldStore((s) => s.debugMode);

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

  // Reset smoothed state when mode changes
  useEffect(() => {
    currentYaw.current   = 0;
    currentPitch.current = 0;
  }, [tvRaised, currentWorld, debugMode]);

  useFrame(() => {
    const isHome  = currentWorld === 'home';
    const canLook = !tvRaised && !isHome && !debugMode;

    let targetYaw   = 0;
    let targetPitch = 0;

    if (canLook) {
      const { x, y } = rawMouse.current;
      targetYaw   = -x * MAX_YAW;
      targetPitch = y * (y >= 0 ? MAX_PITCH_UP : MAX_PITCH_DOWN);
    }

    const speed = canLook ? LERP_SPEED : RETURN_SPEED;
    currentYaw.current   = THREE.MathUtils.lerp(currentYaw.current,   targetYaw,   speed);
    currentPitch.current = THREE.MathUtils.lerp(currentPitch.current, targetPitch, speed);

    // Apply via YXZ order (standard FPS — yaw first, then pitch, no roll)
    camera.rotation.order = 'YXZ';
    camera.rotation.y = currentYaw.current;
    camera.rotation.x = currentPitch.current;
    camera.rotation.z = 0;
  });

  return null;
};
