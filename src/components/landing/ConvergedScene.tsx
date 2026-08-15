// src/components/landing/ConvergedScene.tsx
// Slide 4 — Immersive 3D Converged Shared State (Offline + Online recovery)
import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';

// ─── Converged Stable Core ───
function ConvergedCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.15;
      meshRef.current.rotation.x = t * 0.1;
      const s = 1.2 + Math.sin(t * 0.5) * 0.05;
      meshRef.current.scale.setScalar(s);
    }
    if (outerRef.current) {
      outerRef.current.rotation.y = -t * 0.08;
      outerRef.current.rotation.z = t * 0.05;
      const s = 1.5 + Math.cos(t * 0.5) * 0.08;
      outerRef.current.scale.setScalar(s);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Central crystalline multi-layered structure */}
      <mesh ref={meshRef}>
        <dodecahedronGeometry args={[0.35, 1]} />
        <meshStandardMaterial
          color="#AF7FD2"
          emissive="#6344D5"
          emissiveIntensity={0.8}
          roughness={0.1}
          metalness={0.9}
          transparent
          opacity={0.8}
        />
      </mesh>
      {/* Outer structural lattice */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[0.42, 1]} />
        <meshStandardMaterial
          color="#F9AAB8"
          wireframe
          transparent
          opacity={0.3}
          emissive="#F9AAB8"
          emissiveIntensity={0.4}
        />
      </mesh>
      {/* Outer energy shell */}
      <mesh>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial
          color="#AF7FD2"
          transparent
          opacity={0.04}
          emissive="#AF7FD2"
          emissiveIntensity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// ─── Connected Node around Core ───
function CollaboratorNode({ position, color, label, speed = 1 }: {
  position: [number, number, number];
  color: string;
  label: string;
  speed?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime * speed;
      // Orbiting slightly
      const r = Math.sqrt(position[0]**2 + position[2]**2);
      const angle = Math.atan2(position[2], position[0]) + t * 0.05;
      groupRef.current.position.x = r * Math.cos(angle);
      groupRef.current.position.z = r * Math.sin(angle);
      groupRef.current.position.y = position[1] + Math.sin(t * 0.5 + position[0]) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.13, 8, 8]} />
        <meshStandardMaterial color={color} transparent opacity={0.12} emissive={color} emissiveIntensity={0.3} />
      </mesh>
      <Text
        position={[0, -0.22, 0]}
        fontSize={0.055}
        color={color}
        anchorX="center"
        anchorY="middle"
        font={undefined}
      >
        {label}
      </Text>
    </group>
  );
}

// ─── Connecting Lattice Lines ───
function StableLattice({ nodes }: { nodes: [number, number, number][] }) {
  const latticeRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (latticeRef.current) {
      latticeRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Line) {
          const mat = child.material as THREE.LineBasicMaterial;
          mat.opacity = 0.12 + Math.sin(state.clock.elapsedTime * 0.6 + i * 0.2) * 0.06;
        }
      });
    }
  });

  return (
    <group ref={latticeRef}>
      {/* Lines connecting each node to the center core */}
      {nodes.map((node, i) => {
        const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(...node)];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        return (
          <line key={`to-core-${i}`} geometry={geometry}>
            <lineBasicMaterial color="#AF7FD2" transparent opacity={0.18} />
          </line>
        );
      })}

      {/* Rings connecting nodes to each other sequentially */}
      {nodes.map((node, i) => {
        const nextNode = nodes[(i + 1) % nodes.length];
        const points = [new THREE.Vector3(...node), new THREE.Vector3(...nextNode)];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        return (
          <line key={`to-node-${i}`} geometry={geometry}>
            <lineBasicMaterial color="#F9AAB8" transparent opacity={0.12} />
          </line>
        );
      })}
    </group>
  );
}

// ─── Sync Status Text ───
function SyncStatusLabel({ text, position, color }: { text: string; position: [number, number, number]; color: string }) {
  return (
    <group position={position}>
      <Text
        fontSize={0.06}
        color={color}
        anchorX="center"
        anchorY="middle"
        font={undefined}
      >
        {text}
      </Text>
    </group>
  );
}

// ─── Mouse-Reactive Group ───
function InteractiveGroup({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += (pointer.x * 0.2 - groupRef.current.rotation.y) * 0.02;
      groupRef.current.rotation.x += (-pointer.y * 0.15 - groupRef.current.rotation.x) * 0.02;
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

// ─── Main Scene ───
function Scene() {
  const collaborators: [number, number, number][] = useMemo(() => [
    [-1.4, 0.7, 0.5],
    [1.3, 0.8, -0.4],
    [-1.2, -0.8, -0.6],
    [1.5, -0.6, 0.7],
    [0.1, 1.2, 0.2],
    [-0.2, -1.3, 0.4]
  ], []);

  const colors = ['#7BA5E6', '#F9AAB8', '#BAB8E4', '#19C9C9', '#AF7FD2', '#CBD4DB'];

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[4, 4, 4]} intensity={0.6} color="#AF7FD2" />
      <pointLight position={[-4, -3, 3]} intensity={0.4} color="#F9AAB8" />
      <pointLight position={[0, 4, -4]} intensity={0.25} color="#BAB8E4" />

      <Float speed={1.0} rotationIntensity={0.1} floatIntensity={0.25}>
        <InteractiveGroup>
          {/* Central Stable Core */}
          <ConvergedCore />

          {/* Collaborator Nodes around Core */}
          {collaborators.map((pos, i) => (
            <CollaboratorNode
              key={i}
              position={pos}
              color={colors[i % colors.length]}
              label={`NODE ${String.fromCharCode(65 + i)}`}
              speed={0.6 + i * 0.1}
            />
          ))}

          {/* Stable lattice structure connecting nodes */}
          <StableLattice nodes={collaborators} />

          {/* Sync status labels */}
          <SyncStatusLabel text="100% CONVERGED" position={[0, 1.7, 0]} color="#19C9C9" />
          <SyncStatusLabel text="LOCAL INDEXEDDB PERSISTED" position={[-1.8, -1.8, 0]} color="#BAB8E4" />
          <SyncStatusLabel text="WEBRTC CONNECTED" position={[1.8, -1.8, 0]} color="#7BA5E6" />
        </InteractiveGroup>
      </Float>
    </>
  );
}

// ─── Export ───
export default function ConvergedScene() {
  return (
    <div style={{ position: 'absolute', top: 0, right: 0, width: '55%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
