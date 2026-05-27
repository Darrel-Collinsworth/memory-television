import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useWorldStore } from '../store/useWorldStore';

interface InspectableArtifactProps {
  id: string;
  title: string;
  type: string;
  color: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number] | number;
  children: React.ReactNode;
  
  // Optional drift physics props (for Hubworld fragments)
  driftSpeed?: number;
  driftAmp?: number;
  rotationSpeed?: [number, number, number];
  bobSpeed?: number;
  bobAmp?: number;
  idx?: number;

  // Optional callbacks for parent state reaction
  onPointerOver?: (e: any) => void;
  onPointerOut?: (e: any) => void;
}

export const InspectableArtifact: React.FC<InspectableArtifactProps> = ({
  id,
  position,
  rotation = [0, 0, 0],
  children,
  
  // Drift props
  driftSpeed = 0,
  driftAmp = 0,
  rotationSpeed = [0, 0, 0],
  bobSpeed = 0,
  bobAmp = 0,
  idx = 0,

  onPointerOver,
  onPointerOut
}) => {
  const groupRef = useRef<THREE.Group>(null);

  const selectedArtifactId = useWorldStore((s) => s.selectedArtifactId);
  const setSelectedArtifactId = useWorldStore((s) => s.setSelectedArtifactId);
  const triggerSound = useWorldStore((s) => s.triggerSound);

  // Clean up cursor on unmount
  useEffect(() => {
    return () => {
      document.body.style.cursor = 'default';
    };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!groupRef.current) return;

    // 1. Gently bob Y position if bob parameters are active
    const bobOffset = idx * 0.73;
    let targetY = position[1] + (bobSpeed > 0 ? Math.sin(t * bobSpeed + bobOffset) * bobAmp : 0);

    // 2. Drift X and Z sways horizontally
    const swayOffset = idx * 1.48;
    let targetX = position[0] + (driftSpeed > 0 ? Math.sin(t * driftSpeed + swayOffset) * driftAmp : 0);
    let targetZ = position[2] + (driftSpeed > 0 ? Math.cos(t * driftSpeed * 0.7 + swayOffset) * (driftAmp * 0.4) : 0);

    // --- SPATIAL DISPERSION / OUTWARD DRIFT ---
    // Non-selected artifacts glide outward by 1.2 units when focus mode is active
    if (selectedArtifactId && selectedArtifactId !== id) {
      const dirX = position[0] >= 0 ? 1 : -1;
      const dirZ = position[2] >= 0 ? 1 : -1;
      targetX += dirX * 1.2;
      targetZ += dirZ * 1.2;
    }

    // Smoothly interpolate positions with a relaxed, jolt-free easing factor (0.016 instead of 0.04)
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.016);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.016);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.016);

    // 3. Slowly spin rotations (if rotationSpeed set, else keep initial rotation)
    if (rotationSpeed[0] !== 0 || rotationSpeed[1] !== 0 || rotationSpeed[2] !== 0) {
      groupRef.current.rotation.x = t * rotationSpeed[0];
      groupRef.current.rotation.y = t * rotationSpeed[1];
      groupRef.current.rotation.z = t * rotationSpeed[2];
    } else {
      // Retain standard initial rotation smoothly
      groupRef.current.rotation.set(rotation[0], rotation[1], rotation[2]);
    }
  });

  return (
    <group
      ref={groupRef}
      onClick={(e) => {
        e.stopPropagation();
        if (selectedArtifactId === id) {
          setSelectedArtifactId(null);
          triggerSound('thunk');
        } else {
          setSelectedArtifactId(id);
          triggerSound('thunk');
        }
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (!selectedArtifactId || selectedArtifactId === id) {
          document.body.style.cursor = 'pointer';
          triggerSound('tick');
          if (onPointerOver) onPointerOver(e);
        }
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'default';
        if (onPointerOut) onPointerOut(e);
      }}
    >
      {/* Visual content scale and opacity handles inside */}
      <group>
        {children}
      </group>
    </group>
  );
};
