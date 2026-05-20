import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DustParticlesProps {
  count?: number;
  size?: number;
  speed?: number;
  areaSize?: number;
}

export const DustParticles = ({
  count = 120,
  size = 0.05,
  speed = 0.05,
  areaSize = 10,
}: DustParticlesProps) => {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate random positions and custom speeds for each dust particle
  const [positions, particleData] = useMemo(() => {
    const tempPositions = new Float32Array(count * 3);
    const tempData = [];

    for (let i = 0; i < count; i++) {
      // Position particles in a box volume around the viewer
      const x = (Math.random() - 0.5) * areaSize;
      const y = (Math.random() - 0.3) * areaSize;
      const z = (Math.random() - 0.6) * areaSize;

      tempPositions[i * 3] = x;
      tempPositions[i * 3 + 1] = y;
      tempPositions[i * 3 + 2] = z;

      // Assign custom drift vectors
      tempData.push({
        driftX: (Math.random() - 0.5) * 0.1,
        driftY: (Math.random() - 0.2) * 0.15, // float upwards mostly
        driftZ: (Math.random() - 0.5) * 0.1,
        oscSpeed: Math.random() * 2 + 0.5,
        oscOffset: Math.random() * Math.PI,
      });
    }

    return [tempPositions, tempData];
  }, [count, areaSize]);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.getElapsedTime();
    const geo = pointsRef.current.geometry;
    const posAttr = geo.getAttribute('position') as THREE.BufferAttribute;

    if (!posAttr) return;

    for (let i = 0; i < count; i++) {
      let x = posAttr.getX(i);
      let y = posAttr.getY(i);
      let z = posAttr.getZ(i);

      const data = particleData[i];

      // Update positions based on drift vectors
      x += data.driftX * speed;
      y += (data.driftY + Math.sin(time * data.oscSpeed + data.oscOffset) * 0.05) * speed;
      z += data.driftZ * speed;

      // Wrap-around particles within boundaries
      const halfArea = areaSize / 2;
      if (x < -halfArea) x = halfArea;
      if (x > halfArea) x = -halfArea;
      if (y < -halfArea + 2) y = halfArea; // don't float too deep below
      if (y > halfArea) y = -halfArea + 2;
      if (z < -halfArea) z = halfArea;
      if (z > halfArea) z = -halfArea;

      posAttr.setXYZ(i, x, y, z);
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={size}
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};
