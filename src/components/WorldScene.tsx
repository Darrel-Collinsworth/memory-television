import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { useWorldStore } from '../store/useWorldStore';
import { worlds } from '../data/worlds';
import { InspectableArtifact } from './InspectableArtifact';

export const WorldScene = () => {
  const currentWorld = useWorldStore((state) => state.currentWorld);
  const selectedArtifactId = useWorldStore((state) => state.selectedArtifactId);
  const elementsGroupRef = useRef<THREE.Group>(null);
  const artworksGroupRef = useRef<THREE.Group>(null);

  // Animate the floating environmental elements and artwork planes
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Soft floating movement for abstract background geometry
    if (elementsGroupRef.current) {
      elementsGroupRef.current.position.y = Math.sin(time * 0.4) * 0.15;
      elementsGroupRef.current.rotation.y = time * 0.05;
    }

    // Soft floating movement for individual artwork panels
    if (artworksGroupRef.current) {
      artworksGroupRef.current.position.y = Math.cos(time * 0.5) * 0.08;
    }
  });

  if (currentWorld === 'home') return null;

  const activeWorld = worlds[currentWorld];

  return (
    <group>
      {/* --- VOLUMETRIC SCENE LIGHTING --- */}
      <ambientLight intensity={activeWorld.ambientIntensity} />
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={1.2} 
        color={activeWorld.themeColor} 
        castShadow 
      />
      <pointLight 
        position={[0, 4, -2]} 
        intensity={1.5} 
        distance={10} 
        color={activeWorld.themeColor} 
      />

      {/* --- DYNAMIC ENVIRONMENT GEOMETRY --- */}
      <group ref={elementsGroupRef}>
        {activeWorld.id === 'nostalgia-nihilism' && (
          // Nostalgia Nihilism: Floating dark industrial pillars and cubes
          <>
            {[-4, -1, 3].map((x, i) => (
              <mesh key={`nn-mesh-1-${i}`} position={[x, -2, -6]} castShadow>
                <boxGeometry args={[0.8, 4.0, 0.8]} />
                <meshStandardMaterial color="#1a1a1f" roughness={0.9} metalness={0.1} />
              </mesh>
            ))}
            {[
              [-3, 2, -5],
              [3, 3, -6],
              [-1, 4, -8],
            ].map((pos, i) => (
              <mesh key={`nn-mesh-2-${i}`} position={pos as [number, number, number]} rotation={[Math.PI / (i + 1), 0.8 * i, 0.5]} castShadow>
                <boxGeometry args={[0.6, 0.6, 0.6]} />
                <meshStandardMaterial color="#3a0c14" emissive="#ff2d55" emissiveIntensity={0.08} roughness={0.7} />
              </mesh>
            ))}
          </>
        )}

        {activeWorld.id === 'vhs-dreams' && (
          // VHS Dreams: Synthwave wireframe grids and glowing neon shapes
          <>
            {/* Retro Sun Plane behind everything */}
            <mesh position={[0, 4, -10]} rotation={[0, 0, 0]}>
              <circleGeometry args={[4, 32]} />
              <meshBasicMaterial color="#f43f5e" transparent opacity={0.65} />
            </mesh>
            
            {/* Floating wireframe toruses */}
            {[
              [-4, 1.5, -4.5],
              [4, 2.5, -5],
            ].map((pos, i) => (
              <mesh key={`vd-mesh-1-${i}`} position={pos as [number, number, number]} rotation={[0.4, 0.5 * i, 0]}>
                <torusGeometry args={[0.7, 0.15, 8, 24]} />
                <meshStandardMaterial wireframe color="#d946ef" emissive="#d946ef" emissiveIntensity={0.6} />
              </mesh>
            ))}
          </>
        )}

        {activeWorld.id === 'portland-worlds' && (
          // PORTLAND Worlds: Glowing organic crystal prisms and golden elements
          <>
            {/* Giant Central floating golden ring */}
            <mesh position={[0, 2.5, -7]} rotation={[0.4, 0.4, 0]}>
              <torusGeometry args={[2.5, 0.08, 6, 40]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} emissive="#fbbf24" emissiveIntensity={0.2} />
            </mesh>
            
            {/* Emerald Crystals */}
            {[
              [-3.5, 0, -4.5],
              [3.5, 1.8, -4.5],
            ].map((pos, i) => (
              <mesh key={`pw-mesh-1-${i}`} position={pos as [number, number, number]} rotation={[0, 0.8 * i, 0]}>
                <octahedronGeometry args={[0.5]} />
                <meshStandardMaterial color="#10b981" roughness={0.1} metalness={0.8} emissive="#10b981" emissiveIntensity={0.4} />
              </mesh>
            ))}
          </>
        )}
      </group>

      {/* --- FLOATING HOLOGRAPHIC ARTWORK PANELS --- */}
      <group ref={artworksGroupRef}>
        {activeWorld.artworks.map((art) => {
          const isSelected = selectedArtifactId === art.id;
          const currentOpacity = selectedArtifactId ? (isSelected ? 1.0 : 0.22) : 1.0;

          return (
            <InspectableArtifact
              key={art.id}
              id={art.id}
              title={art.title}
              type="artwork"
              color={art.color}
              position={art.position}
              rotation={art.rotation as [number, number, number]}
            >
              {/* Holographic frame backdrop to anchor correct occlusion */}
              <mesh castShadow receiveShadow>
                <planeGeometry args={art.scale} />
                <meshBasicMaterial transparent opacity={0} color="#000" depthWrite={false} />
              </mesh>

              {/* Injected HTML Artwork Panel */}
              <Html
                transform
                distanceFactor={3.2}
                occlude="blending"
                style={{
                  pointerEvents: 'auto',
                  color: art.color,
                  opacity: currentOpacity,
                  transition: 'opacity 0.6s ease'
                }}
              >
                <div 
                  className="artwork-html-frame" 
                  style={{ 
                    color: art.color,
                    borderColor: `${art.color}33`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = art.color;
                    e.currentTarget.style.boxShadow = `0 10px 40px rgba(0,0,0,0.9), 0 0 25px ${art.color}66`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.07)';
                    e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.9)';
                  }}
                >
                  {/* Visual Artwork Placeholder */}
                  <div className="artwork-visual-placeholder">
                    {/* Generate a stylized CSS pattern utilizing the active accent color */}
                    <div 
                      className="artwork-visual-glitch"
                      style={{
                        background: `linear-gradient(135deg, #020205 0%, ${art.color}22 50%, #020205 100%)`,
                      }}
                    />
                    <div 
                      className="artwork-visual-pattern"
                      style={{
                        backgroundImage: `radial-gradient(circle, ${art.color} 1px, transparent 1px)`,
                        backgroundSize: '20px 20px',
                      }}
                    />
                    {/* Procedural glyph design */}
                    <div 
                      style={{
                        fontSize: '3rem',
                        fontFamily: 'monospace',
                        fontWeight: 'bold',
                        color: art.color,
                        opacity: 0.8,
                        textShadow: `0 0 10px ${art.color}`,
                        zIndex: 3
                      }}
                    >
                      ✦
                    </div>
                  </div>

                  {/* Artwork Metadata Box */}
                  <div className="artwork-info">
                    <div className="artwork-title" style={{ textShadow: `0 0 8px ${art.color}66` }}>
                      {art.title}
                    </div>
                    <div className="artwork-meta">
                      <span>{art.year}</span>
                      <span>{art.medium}</span>
                    </div>
                  </div>
                </div>
              </Html>
            </InspectableArtifact>
          );
        })}
      </group>
    </group>
  );
};
