import { useState } from 'react';
import * as THREE from 'three';
import { useWorldStore } from '../store/useWorldStore';
import { InspectableArtifact } from './InspectableArtifact';
import { HUB_ARTIFACTS } from '../data/artifacts';


// ---------------------------------------------------------------------------
// MEMORY FRAGMENT FIELD COMPONENT
// ---------------------------------------------------------------------------
export const MemoryFragmentField = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const selectedArtifactId = useWorldStore((s) => s.selectedArtifactId);

  return (
    <group>
      {HUB_ARTIFACTS.map((originalFrag, idx) => {
        const isHovered = hoveredId === originalFrag.id;
        const isSelected = selectedArtifactId === originalFrag.id;

        // Dim other fragments to 22% opacity when an artifact is focused, or highlight hovered/selected to 100%
        const opacityOverride = (originalFrag.opacity ?? 0.9) * (
          selectedArtifactId
            ? (isSelected ? 1.0 : 0.22)
            : (isHovered ? 1.0 : 0.8)
        );

        const frag = { ...originalFrag, opacity: opacityOverride };

        const isScaleArray = Array.isArray(frag.scale);
        const sX = isScaleArray ? (frag.scale as [number, number, number])[0] : (frag.scale as number);
        const sY = isScaleArray ? (frag.scale as [number, number, number])[1] : (frag.scale as number);
        const sZ = isScaleArray ? (frag.scale as [number, number, number])[2] : (frag.scale as number);

        return (
          <InspectableArtifact
            key={frag.id}
            id={frag.id}
            title={frag.title}
            type={frag.type}
            color={frag.color}
            position={frag.position}
            driftSpeed={frag.driftSpeed}
            driftAmp={frag.driftAmp}
            rotationSpeed={frag.rotationSpeed}
            bobSpeed={frag.bobSpeed}
            bobAmp={frag.bobAmp}
            idx={idx}
            onPointerOver={() => setHoveredId(frag.id)}
            onPointerOut={() => setHoveredId(null)}
          >
            
            {/* ========================================================================= */}
            {/* TYPE 1: IMAGE CARD (Polaroid / Framed Photo card with thick back border)   */}
            {/* ========================================================================= */}
            {frag.type === 'image-card' && (
              <group scale={[sX, sY, sZ]}>
                {/* 1A. Photo backing frame (light paper grey/white) */}
                <mesh castShadow receiveShadow>
                  <planeGeometry args={[1.08, 1.28]} />
                  <meshStandardMaterial
                    color="#fdfdfd"
                    roughness={0.6}
                    metalness={0.05}
                    transparent
                    opacity={frag.opacity ?? 0.9}
                    side={THREE.DoubleSide}
                  />
                </mesh>
                {/* 1B. Actual photo center image area (using flat colorful placeholder) */}
                {/* NOTE FOR FUTURE: To swap with real image asset:
                    1. Use texture loader: const tex = useLoader(TextureLoader, frag.imageUrl);
                    2. Replace map={null} with map={tex}
                */}
                <mesh position={[0, 0.08, 0.005]}>
                  <planeGeometry args={[0.96, 1.0]} />
                  <meshStandardMaterial
                    color={frag.color}
                    roughness={0.3}
                    metalness={0.1}
                    transparent
                    opacity={frag.opacity ?? 0.95}
                    side={THREE.DoubleSide}
                  />
                </mesh>
                {/* Decorative retro Polaroid shadow creasing line at the bottom */}
                <mesh position={[0, -0.48, 0.006]}>
                  <planeGeometry args={[0.92, 0.015]} />
                  <meshBasicMaterial color="#dcdcdc" transparent opacity={frag.opacity ?? 0.8} />
                </mesh>
              </group>
            )}

            {/* ========================================================================= */}
            {/* TYPE 2: PHOTO PLANE (Simple flat aspect-ratio double-sided sheet)         */}
            {/* ========================================================================= */}
            {frag.type === 'photo-plane' && (
              <group scale={[sX, sY, sZ]}>
                {/* NOTE FOR FUTURE: Swap color with texture map in this meshStandardMaterial */}
                <mesh castShadow receiveShadow>
                  <planeGeometry args={[1, 1]} />
                  <meshStandardMaterial
                    color={frag.color}
                    roughness={0.4}
                    metalness={0.08}
                    transparent
                    opacity={frag.opacity ?? 0.9}
                    side={THREE.DoubleSide}
                  />
                </mesh>
                {/* Fine golden border edge framing to represent physical art sheet */}
                <mesh position={[0, 0, -0.002]}>
                  <planeGeometry args={[1.04, 1.04]} />
                  <meshBasicMaterial
                    color="#d4af37" // soft gold border
                    transparent
                    opacity={(frag.opacity ?? 0.9) * 0.4}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              </group>
            )}

            {/* ========================================================================= */}
            {/* TYPE 3: ABSTRACT BLOB (Glassy, high-gloss organic amorphous shapes)        */}
            {/* ========================================================================= */}
            {frag.type === 'abstract-blob' && (
              <mesh
                castShadow
                scale={[sX, sY, sZ]}
              >
                {/* Low-poly icosahedron represents an organic cloud element or dream node */}
                <icosahedronGeometry args={[1, 1]} />
                <meshPhysicalMaterial
                  color={frag.color}
                  roughness={0.08}
                  metalness={0.12}
                  transmission={0.88} // highly glass-like transparent look
                  ior={1.42}
                  thickness={1.5}
                  clearcoat={1.0}
                  clearcoatRoughness={0.05}
                  transparent
                  opacity={(frag.opacity ?? 0.9) * 0.9}
                />
              </mesh>
            )}

            {/* ========================================================================= */}
            {/* TYPE 4: FLOATING FRAME (Empty geometric structures framing the sky)       */}
            {/* ========================================================================= */}
            {frag.type === 'floating-frame' && (
              <group scale={[sX, sY, sZ]}>
                {/* Hollow ring/frame built using a low-poly torus */}
                <mesh castShadow>
                  <torusGeometry args={[0.72, 0.06, 8, 20]} />
                  <meshStandardMaterial
                    color={frag.color}
                    roughness={0.5}
                    metalness={0.25}
                    transparent
                    opacity={frag.opacity ?? 0.8}
                  />
                </mesh>
                {/* Faint center cross-hair wireframes representing coordinate space */}
                <mesh rotation={[0, 0, 0]}>
                  <boxGeometry args={[1.3, 0.015, 0.015]} />
                  <meshBasicMaterial color={frag.color} transparent opacity={(frag.opacity ?? 0.8) * 0.3} />
                </mesh>
                <mesh rotation={[0, 0, Math.PI / 2]}>
                  <boxGeometry args={[1.3, 0.015, 0.015]} />
                  <meshBasicMaterial color={frag.color} transparent opacity={(frag.opacity ?? 0.8) * 0.3} />
                </mesh>
              </group>
            )}

            {/* ========================================================================= */}
            {/* TYPE 5: PAPER SHEET (Thin sketch notes / notebook pages)                  */}
            {/* ========================================================================= */}
            {frag.type === 'paper-sheet' && (
              <group scale={[sX, sY, sZ]}>
                {/* Floating paper plate */}
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[1, 1, 0.005]} />
                  <meshStandardMaterial
                    color={frag.color}
                    roughness={0.9} // extremely rough paper texture
                    metalness={0.0}
                    transparent
                    opacity={frag.opacity ?? 0.9}
                  />
                </mesh>
                {/* Decorative horizontal lines representing notebook rules */}
                {Array.from({ length: 5 }).map((_, lIdx) => {
                  const yPos = 0.35 - lIdx * 0.16;
                  return (
                    <mesh key={`rule-${lIdx}`} position={[0, yPos, 0.0035]}>
                      <planeGeometry args={[0.85, 0.008]} />
                      <meshBasicMaterial color="#a0c0e0" transparent opacity={(frag.opacity ?? 0.9) * 0.45} />
                    </mesh>
                  );
                })}
              </group>
            )}

            {/* ========================================================================= */}
            {/* TYPE 6: GEOMETRIC ARTIFACT (Metallic low-poly glinting prisms)            */}
            {/* ========================================================================= */}
            {frag.type === 'geometric-artifact' && (
              <mesh
                castShadow
                scale={[sX, sY, sZ]}
              >
                {/* Tall low-poly bicone/octahedron that reflects golden lights */}
                <octahedronGeometry args={[0.8]} />
                <meshStandardMaterial
                  color={frag.color}
                  roughness={0.06}
                  metalness={0.95} // highly metallic glinting prism
                  transparent
                  opacity={frag.opacity ?? 0.9}
                />
              </mesh>
            )}

            {/* ========================================================================= */}
            {/* TYPE 7: LOWPOLY MODEL PLACEHOLDER (Youth toys / Childhood busts prep)      */}
            {/* ========================================================================= */}
            {frag.type === 'lowpoly-model' && (
              <group scale={[sX, sY, sZ]}>
                
                {/* NOTE FOR FUTURE CUSTOM MODELS:
                    1. Use gltf loader: const { scene } = useGLTF(frag.modelUrl);
                    2. In JSX, render: <primitive object={scene} />
                    3. Delete this custom placeholder group.
                */}
                
                {/* 3D Toy-like Pedestal Bust Combination:
                    Contains a cylinder pedestal, a sphere head, and a cylinder neck/shoulders.
                */}
                <group position={[0, -0.2, 0]}>
                  {/* Pedestal Base */}
                  <mesh castShadow position={[0, -0.3, 0]}>
                    <cylinderGeometry args={[0.5, 0.6, 0.3, 8]} />
                    <meshStandardMaterial
                      color="#dcd7c9" // warm bone white
                      roughness={0.7}
                      metalness={0.1}
                      transparent
                      opacity={frag.opacity ?? 0.9}
                    />
                  </mesh>

                  {/* Toy Cart/Body Segment */}
                  <mesh castShadow position={[0, 0.05, 0]}>
                    <boxGeometry args={[0.7, 0.4, 0.5]} />
                    <meshStandardMaterial
                      color={frag.color} // warm red/pink clay
                      roughness={0.6}
                      metalness={0.1}
                      transparent
                      opacity={frag.opacity ?? 0.9}
                    />
                  </mesh>

                  {/* Low-poly Round Head Block */}
                  <mesh castShadow position={[0, 0.45, 0]}>
                    <sphereGeometry args={[0.26, 8, 8]} />
                    <meshStandardMaterial
                      color="#8ca1a5" // soft grey slate
                      roughness={0.4}
                      metalness={0.2}
                      transparent
                      opacity={frag.opacity ?? 0.9}
                    />
                  </mesh>

                  {/* Low-poly wheels / pegs representing a childhood pull-toy cart */}
                  {[-0.26, 0.26].map((wheelX, wIdx) => (
                    <mesh
                      key={`wheel-${wIdx}`}
                      castShadow
                      position={[wheelX, -0.22, 0.24]}
                      rotation={[Math.PI / 2, 0, 0]}
                    >
                      <cylinderGeometry args={[0.13, 0.13, 0.08, 6]} />
                      <meshStandardMaterial
                        color="#2b2d42" // dark charcoal plastic
                        roughness={0.9}
                        transparent
                        opacity={frag.opacity ?? 0.9}
                      />
                    </mesh>
                  ))}
                  {[-0.26, 0.26].map((wheelX, wIdx) => (
                    <mesh
                      key={`wheel-b-${wIdx}`}
                      castShadow
                      position={[wheelX, -0.22, -0.24]}
                      rotation={[Math.PI / 2, 0, 0]}
                    >
                      <cylinderGeometry args={[0.13, 0.13, 0.08, 6]} />
                      <meshStandardMaterial
                        color="#2b2d42"
                        roughness={0.9}
                        transparent
                        opacity={frag.opacity ?? 0.9}
                      />
                    </mesh>
                  ))}
                </group>
              </group>
            )}

            {/* ========================================================================= */}
            {/* TYPE 8: VHS CASSETTE (Retro floating magnetic cassette tapes)             */}
            {/* ========================================================================= */}
            {frag.type === 'vhs-cassette' && (
              <group scale={[sX, sY, sZ]}>
                {/* VHS Cassette Outer Shell (charcoal black body) */}
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[0.9, 0.5, 0.08]} />
                  <meshStandardMaterial
                    color="#151719"
                    roughness={0.7}
                    metalness={0.25}
                    transparent
                    opacity={frag.opacity ?? 0.9}
                  />
                </mesh>
                {/* Left Spool Hub (plastic white circle insert) */}
                <mesh position={[-0.2, 0, 0.042]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.11, 0.11, 0.005, 10]} />
                  <meshStandardMaterial
                    color="#eaeaea"
                    roughness={0.5}
                    transparent
                    opacity={frag.opacity ?? 0.9}
                  />
                </mesh>
                {/* Right Spool Hub (plastic white circle insert) */}
                <mesh position={[0.2, 0, 0.042]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.11, 0.11, 0.005, 10]} />
                  <meshStandardMaterial
                    color="#eaeaea"
                    roughness={0.5}
                    transparent
                    opacity={frag.opacity ?? 0.9}
                  />
                </mesh>
                {/* Cassette handwritten label sticker block */}
                <mesh position={[0, -0.12, 0.042]}>
                  <planeGeometry args={[0.62, 0.16]} />
                  <meshStandardMaterial
                    color={frag.color} // customizable color label
                    roughness={0.9}
                    transparent
                    opacity={frag.opacity ?? 0.95}
                    side={THREE.DoubleSide}
                  />
                </mesh>
                {/* Window viewport plastic */}
                <mesh position={[0, 0.11, 0.042]}>
                  <planeGeometry args={[0.5, 0.18]} />
                  <meshStandardMaterial
                    color="#0d0d0d"
                    roughness={0.15}
                    metalness={0.8}
                    transparent
                    opacity={(frag.opacity ?? 0.9) * 0.45}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              </group>
            )}

            {/* ========================================================================= */}
            {/* TYPE 9: CRT FRAGMENT (Drifting television cabinet shells)                */}
            {/* ========================================================================= */}
            {frag.type === 'crt-fragment' && (
              <group scale={[sX, sY, sZ]}>
                {/* Outer Cabinet frame (tan/wooden retro shell) */}
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[0.8, 0.8, 0.3]} />
                  <meshStandardMaterial
                    color={frag.color}
                    roughness={0.45}
                    metalness={0.15}
                    transparent
                    opacity={frag.opacity ?? 0.9}
                  />
                </mesh>
                {/* Bulbous CRT dark glass front screen */}
                <mesh position={[0, 0.04, 0.09]} scale={[1, 1, 0.55]}>
                  <sphereGeometry args={[0.33, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
                  <meshStandardMaterial
                    color="#1f2226"
                    roughness={0.06}
                    metalness={0.9}
                    transparent
                    opacity={(frag.opacity ?? 0.9) * 0.95}
                  />
                </mesh>
                {/* Analog Dial Control Knob 1 */}
                <mesh position={[0.26, -0.24, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.065, 0.065, 0.04, 8]} />
                  <meshStandardMaterial
                    color="#1c1917"
                    roughness={0.6}
                    metalness={0.7}
                    transparent
                    opacity={frag.opacity ?? 0.9}
                  />
                </mesh>
                {/* Analog Dial Control Knob 2 */}
                <mesh position={[0.26, -0.11, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.065, 0.065, 0.04, 8]} />
                  <meshStandardMaterial
                    color="#1c1917"
                    roughness={0.6}
                    metalness={0.7}
                    transparent
                    opacity={frag.opacity ?? 0.9}
                  />
                </mesh>
              </group>
            )}

            {/* ========================================================================= */}
            {/* TYPE 10: COLLAGE STACK (Slightly tilted, layered 3D fragments)            */}
            {/* ========================================================================= */}
            {frag.type === 'collage-stack' && (
              <group scale={[sX, sY, sZ]}>
                {/* Background sketch sheet (faded off-white) */}
                <mesh castShadow receiveShadow rotation={[0, 0, 0.04]}>
                  <planeGeometry args={[1.0, 1.25]} />
                  <meshStandardMaterial
                    color="#f6f3eb"
                    roughness={0.8}
                    transparent
                    opacity={frag.opacity ?? 0.9}
                    side={THREE.DoubleSide}
                  />
                </mesh>
                {/* Middle photo overlay sheet (tilted slightly opposite) */}
                <mesh position={[-0.04, 0.04, 0.005]} rotation={[0, 0, -0.07]}>
                  <planeGeometry args={[0.82, 0.82]} />
                  <meshStandardMaterial
                    color={frag.color}
                    roughness={0.35}
                    metalness={0.12}
                    transparent
                    opacity={frag.opacity ?? 0.95}
                    side={THREE.DoubleSide}
                  />
                </mesh>
                {/* Small handwritten note card at the bottom */}
                <mesh position={[0.16, -0.26, 0.010]} rotation={[0, 0, 0.10]}>
                  <planeGeometry args={[0.55, 0.38]} />
                  <meshStandardMaterial
                    color="#ece4db"
                    roughness={0.85}
                    transparent
                    opacity={(frag.opacity ?? 0.9) * 0.9}
                    side={THREE.DoubleSide}
                  />
                </mesh>
                {/* Golden tape adhesive ribbon at the top */}
                <mesh position={[0, 0.55, 0.015]} rotation={[0, 0, -0.12]}>
                  <planeGeometry args={[0.28, 0.08]} />
                  <meshStandardMaterial
                    color="#cca43b" // retro golden tape
                    roughness={0.2}
                    transparent
                    opacity={(frag.opacity ?? 0.9) * 0.7}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              </group>
            )}

            {/* ========================================================================= */}
            {/* TYPE 11: RIBBON SPOOL (Winding shiny tape ribbons & spools)                */}
            {/* ========================================================================= */}
            {frag.type === 'ribbon-spool' && (
              <group scale={[sX, sY, sZ]}>
                {/* Winding tape ribbon ring 1 */}
                <mesh castShadow>
                  <torusGeometry args={[0.58, 0.022, 8, 24, Math.PI * 1.75]} />
                  <meshStandardMaterial
                    color="#14110f" // magnetic dark iron-oxide black
                    roughness={0.1}
                    metalness={0.9}
                    transparent
                    opacity={frag.opacity ?? 0.8}
                    side={THREE.DoubleSide}
                  />
                </mesh>
                {/* Intersecting secondary ribbon ring 2 */}
                <mesh castShadow rotation={[Math.PI / 4, Math.PI / 4, 0]} position={[0.12, 0.08, 0]}>
                  <torusGeometry args={[0.46, 0.022, 8, 24, Math.PI * 1.5]} />
                  <meshStandardMaterial
                    color="#14110f"
                    roughness={0.1}
                    metalness={0.9}
                    transparent
                    opacity={frag.opacity ?? 0.8}
                    side={THREE.DoubleSide}
                  />
                </mesh>
                {/* Central spool spindle hub (plastic base cylinder) */}
                <mesh position={[0, 0, -0.01]} rotation={[0, 0, 0]}>
                  <cylinderGeometry args={[0.11, 0.11, 0.04, 10]} />
                  <meshStandardMaterial
                    color={frag.color} // spool highlight color
                    roughness={0.4}
                    transparent
                    opacity={frag.opacity ?? 0.8}
                  />
                </mesh>
              </group>
            )}

          </InspectableArtifact>
        );
      })}
    </group>
  );
};
