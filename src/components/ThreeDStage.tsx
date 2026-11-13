import { ThreeCanvas } from "@remotion/three";
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EDITORIAL_EASE } from "../utils/motion";

export type ThreeDMode = "monoliths" | "neural-core" | "globe-hub";

type ThreeDStageProps = {
  readonly mode: ThreeDMode;
  readonly accentColor?: string;
  readonly secondaryColor?: string;
  readonly cameraZoom?: number;
};

const MONOLITH_TOWERS = [
  { x: -2.4, z: -1.8, targetH: 4.8, w: 0.75, gold: false },
  { x: -1.35, z: -0.6, targetH: 6.4, w: 0.85, gold: true },
  { x: -0.15, z: 0.2, targetH: 8.2, w: 0.95, gold: true },
  { x: 1.15, z: -0.4, targetH: 7.4, w: 0.88, gold: true },
  { x: 2.3, z: -1.5, targetH: 5.2, w: 0.78, gold: false },
  { x: -1.9, z: -3.2, targetH: 5.8, w: 0.7, gold: false },
  { x: 1.7, z: -3.0, targetH: 6.0, w: 0.72, gold: false },
];

export const ThreeDStage: React.FC<ThreeDStageProps> = ({
  mode,
  accentColor = "#D4AF37",
  secondaryColor = "#10B981",
  cameraZoom = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;

  const introProg = interpolate(frame, [0, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EDITORIAL_EASE,
  });

  // Deterministic 3D camera sweep driven strictly by frame
  const camX = Math.sin(t * 0.45) * 1.4;
  const camY = mode === "monoliths" ? interpolate(introProg, [0, 1], [1.9, 3.1]) : 0.8 + Math.cos(t * 0.4) * 0.3;
  const camZ = (mode === "monoliths" ? interpolate(introProg, [0, 1], [14.5, 10.6]) : 8.6) / cameraZoom;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ position: [camX, camY, camZ], fov: 46 }}
      >
        <ambientLight intensity={0.45} />
        <directionalLight position={[6, 10, 8]} intensity={1.8} color="#FFF7E6" />
        <pointLight position={[-5, 4, 4]} intensity={2.2} color={accentColor} />
        <pointLight position={[5, 2, -3]} intensity={1.4} color={secondaryColor} />

        {mode === "monoliths" ? (
          <group position={[0, -2.8, 0]} rotation={[0, Math.sin(t * 0.25) * 0.18, 0]}>
            {/* Reflective architectural grid base */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, -1]}>
              <planeGeometry args={[28, 28]} />
              <meshStandardMaterial color="#0A0B10" metalness={0.85} roughness={0.35} />
            </mesh>

            {/* Orbiting golden capital ring */}
            <mesh
              position={[0, 3.8, -0.4]}
              rotation={[Math.PI / 2.4, t * 0.35, 0]}
            >
              <torusGeometry args={[3.9, 0.045, 16, 96]} />
              <meshStandardMaterial
                color={accentColor}
                emissive={accentColor}
                emissiveIntensity={0.75}
                metalness={0.9}
                roughness={0.2}
              />
            </mesh>

            {/* Rising 3D valuation monoliths */}
            {MONOLITH_TOWERS.map((tower, idx) => {
              const rise = interpolate(
                frame,
                [idx * 3, 28 + idx * 3],
                [0.2, tower.targetH],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: EDITORIAL_EASE,
                },
              );
              return (
                <mesh
                  key={idx}
                  position={[tower.x, rise / 2, tower.z]}
                >
                  <boxGeometry args={[tower.w, rise, tower.w]} />
                  <meshStandardMaterial
                    color={tower.gold ? accentColor : "#1E222E"}
                    emissive={tower.gold ? accentColor : "#000000"}
                    emissiveIntensity={tower.gold ? 0.18 : 0}
                    metalness={0.85}
                    roughness={tower.gold ? 0.22 : 0.45}
                  />
                </mesh>
              );
            })}
          </group>
        ) : null}

        {mode === "neural-core" ? (
          <group position={[0, -0.4, 0]}>
            <mesh rotation={[t * 0.45, t * 0.7, 0]}>
              <icosahedronGeometry args={[1.9, 1]} />
              <meshStandardMaterial
                color={accentColor}
                wireframe
                emissive={accentColor}
                emissiveIntensity={0.8}
              />
            </mesh>
            <mesh rotation={[-t * 0.3, t * 0.5, 0]}>
              <icosahedronGeometry args={[1.15, 0]} />
              <meshStandardMaterial
                color="#091526"
                metalness={0.9}
                roughness={0.18}
              />
            </mesh>
            <mesh rotation={[Math.PI / 3, t * 0.6, 0]}>
              <torusGeometry args={[3.1, 0.04, 16, 80]} />
              <meshStandardMaterial
                color={secondaryColor}
                emissive={secondaryColor}
                emissiveIntensity={0.7}
              />
            </mesh>
            {[0, 1, 2, 3, 4, 5].map((idx) => {
              const angle = t * 0.85 + (idx * Math.PI * 2) / 6;
              return (
                <mesh
                  key={idx}
                  position={[
                    Math.cos(angle) * 3.1,
                    Math.sin(angle * 2) * 0.65,
                    Math.sin(angle) * 3.1,
                  ]}
                  rotation={[t + idx, t * 0.8, 0]}
                >
                  <boxGeometry args={[0.28, 0.28, 0.28]} />
                  <meshStandardMaterial
                    color={accentColor}
                    emissive={accentColor}
                    emissiveIntensity={0.65}
                  />
                </mesh>
              );
            })}
          </group>
        ) : null}

        {mode === "globe-hub" ? (
          <group position={[0, -0.5, 0]}>
            <mesh rotation={[0.25, t * 0.4, 0]}>
              <sphereGeometry args={[2.2, 24, 18]} />
              <meshStandardMaterial
                color="#12263A"
                wireframe
                emissive="#38BDF8"
                emissiveIntensity={0.35}
              />
            </mesh>
            <mesh rotation={[0.25, t * 0.4, 0]}>
              <sphereGeometry args={[2.12, 24, 18]} />
              <meshStandardMaterial
                color="#0D1C2E"
                metalness={0.6}
                roughness={0.6}
              />
            </mesh>
            <mesh rotation={[Math.PI / 2.2, -0.3, t * 0.5]}>
              <torusGeometry args={[2.95, 0.045, 16, 96]} />
              <meshStandardMaterial
                color={accentColor}
                emissive={accentColor}
                emissiveIntensity={0.7}
              />
            </mesh>
          </group>
        ) : null}
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

