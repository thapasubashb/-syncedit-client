// src/components/landing/CollaborationScene.tsx
// Slide 2 — 3D floating collaborative canvas with multi-user elements
import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';

// ─── Floating Canvas Panel ───
function CanvasPanel({ position, rotation, color, width = 2, height = 1.4 }: {
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
  width?: number;
  height?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.0005;
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.06}
        side={THREE.DoubleSide}
        emissive={color}
        emissiveIntensity={0.1}
      />
    </mesh>
  );
}

// ─── User Cursor ───
function UserCursor({ position, color, label }: {
  position: [number, number, number];
  color: string;
  label: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const basePos = useRef(position);

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime;
      groupRef.current.position.x = basePos.current[0] + Math.sin(t * 0.7 + basePos.current[0]) * 0.3;
      groupRef.current.position.y = basePos.current[1] + Math.cos(t * 0.5 + basePos.current[1]) * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Cursor arrow */}
      <mesh>
        <coneGeometry args={[0.05, 0.12, 4]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
      </mesh>
      {/* Label */}
      <Text
        position={[0.15, -0.08, 0]}
        fontSize={0.06}
        color={color}
        anchorX="left"
        anchorY="middle"
        font={undefined}
      >
        {label}
      </Text>
      {/* Glow */}
      <mesh>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color={color} transparent opacity={0.12} emissive={color} emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}

// ─── Text Fragment ───
function TextLine({ position, width = 0.6 }: { position: [number, number, number]; width?: number }) {
  return (
    <mesh position={position}>
      <planeGeometry args={[width, 0.025]} />
      <meshStandardMaterial color="#7BA5E6" transparent opacity={0.3} emissive="#7BA5E6" emissiveIntensity={0.2} />
    </mesh>
  );
}

// ─── Shape Element ───
function ShapeElement({ position, type, color }: {
  position: [number, number, number];
  type: 'rect' | 'circle';
  color: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3 + position[0]) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      {type === 'rect' ? (
        <planeGeometry args={[0.3, 0.2]} />
      ) : (
        <circleGeometry args={[0.12, 24]} />
      )}
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.15}
        emissive={color}
        emissiveIntensity={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ─── Selection Box ───
function SelectionBox({ position, width, height, color }: {
  position: [number, number, number];
  width: number;
  height: number;
  color: string;
}) {
  const points = useMemo(() => {
    const w = width / 2;
    const h = height / 2;
    return new Float32Array([
      -w, -h, 0,  w, -h, 0,
       w, -h, 0,  w,  h, 0,
       w,  h, 0, -w,  h, 0,
      -w,  h, 0, -w, -h, 0,
    ]);
  }, [width, height]);

  return (
    <group position={position}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={8} array={points} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={0.4} linewidth={1} />
      </lineSegments>
    </group>
  );
}

// ─── Mouse-Reactive Group ───
function InteractiveGroup({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += (pointer.x * 0.15 - groupRef.current.rotation.y) * 0.02;
      groupRef.current.rotation.x += (-pointer.y * 0.1 - groupRef.current.rotation.x) * 0.02;
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

// ─── Main Scene ───
function Scene() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[4, 4, 4]} intensity={0.5} color="#279CFB" />
      <pointLight position={[-4, -2, 3]} intensity={0.3} color="#DAE6E2" />

      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.3}>
        <InteractiveGroup>
          {/* Main canvas panel */}
          <CanvasPanel position={[0, 0, 0]} rotation={[0.1, -0.2, 0]} color="#279CFB" width={2.8} height={1.8} />
          
          {/* Background panels */}
          <CanvasPanel position={[-0.3, 0.2, -0.5]} rotation={[0.15, -0.3, 0.05]} color="#DAE6E2" width={2.2} height={1.5} />
          <CanvasPanel position={[0.2, -0.15, -1]} rotation={[0.05, -0.1, -0.05]} color="#EBD7CE" width={1.8} height={1.2} />

          {/* Text fragments on the main canvas */}
          <TextLine position={[-0.6, 0.4, 0.02]} width={0.8} />
          <TextLine position={[-0.6, 0.3, 0.02]} width={1.0} />
          <TextLine position={[-0.6, 0.2, 0.02]} width={0.6} />
          <TextLine position={[-0.6, 0.05, 0.02]} width={0.9} />
          <TextLine position={[-0.6, -0.05, 0.02]} width={0.7} />

          {/* Shape elements */}
          <ShapeElement position={[0.5, 0.3, 0.02]} type="rect" color="#279CFB" />
          <ShapeElement position={[0.7, -0.1, 0.02]} type="circle" color="#DAE6E2" />
          <ShapeElement position={[-0.1, -0.4, 0.02]} type="rect" color="#EBD7CE" />

          {/* Selection box around a shape */}
          <SelectionBox position={[0.5, 0.3, 0.03]} width={0.38} height={0.28} color="#279CFB" />

          {/* User cursors */}
          <UserCursor position={[0.3, 0.15, 0.05]} color="#7BA5E6" label="User A" />
          <UserCursor position={[-0.2, -0.2, 0.05]} color="#F9AAB8" label="User B" />
          <UserCursor position={[0.6, -0.35, 0.05]} color="#19C9C9" label="User C" />
        </InteractiveGroup>
      </Float>
    </>
  );
}

// ─── Export ───
export default function CollaborationScene() {
  return (
    <div style={{ position: 'absolute', top: 0, right: 0, width: '55%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
