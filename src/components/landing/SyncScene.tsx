// src/components/landing/SyncScene.tsx
// Slide 3 — Distributed synchronization visualization
// Shows: USER A/B/C → CRDT → SHARED STATE with WebRTC/WebSocket paths
import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';

// ─── User Node ───
function UserNode({ position, color, label }: {
  position: [number, number, number];
  color: string;
  label: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.5;
    }
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.6 + position[0]) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Core sphere */}
      <mesh>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} />
      </mesh>
      {/* Orbit ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[0.2, 0.008, 8, 32]} />
        <meshStandardMaterial color={color} transparent opacity={0.4} emissive={color} emissiveIntensity={0.3} />
      </mesh>
      {/* Glow */}
      <mesh>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial color={color} transparent opacity={0.08} emissive={color} emissiveIntensity={0.4} />
      </mesh>
      {/* Label */}
      <Text
        position={[0, -0.32, 0]}
        fontSize={0.07}
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

// ─── Central CRDT Node ───
function CRDTNode() {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (innerRef.current) {
      innerRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      innerRef.current.rotation.x = state.clock.elapsedTime * 0.2;
    }
    if (outerRef.current) {
      outerRef.current.rotation.y = -state.clock.elapsedTime * 0.15;
      outerRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Inner core */}
      <mesh ref={innerRef}>
        <octahedronGeometry args={[0.2, 0]} />
        <meshStandardMaterial
          color="#19C9C9"
          emissive="#19C9C9"
          emissiveIntensity={0.8}
          transparent
          opacity={0.85}
        />
      </mesh>
      {/* Outer wireframe */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial
          color="#19C9C9"
          wireframe
          transparent
          opacity={0.25}
          emissive="#19C9C9"
          emissiveIntensity={0.2}
        />
      </mesh>
      {/* Glow */}
      <mesh>
        <sphereGeometry args={[0.45, 16, 16]} />
        <meshStandardMaterial
          color="#19C9C9"
          transparent
          opacity={0.05}
          emissive="#19C9C9"
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* Label */}
      <Text
        position={[0, -0.55, 0]}
        fontSize={0.08}
        color="#19C9C9"
        anchorX="center"
        font={undefined}
      >
        CRDT
      </Text>
    </group>
  );
}

// ─── Shared State Node ───
function SharedStateNode() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      const s = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
      meshRef.current.scale.setScalar(s);
    }
  });

  return (
    <group position={[2, 0, 0]}>
      <mesh ref={meshRef}>
        <dodecahedronGeometry args={[0.22, 0]} />
        <meshStandardMaterial
          color="#C2E7E0"
          emissive="#19C9C9"
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.35, 12, 12]} />
        <meshStandardMaterial color="#C2E7E0" transparent opacity={0.06} emissive="#19C9C9" emissiveIntensity={0.2} />
      </mesh>
      <Text
        position={[0, -0.48, 0]}
        fontSize={0.065}
        color="#C2E7E0"
        anchorX="center"
        font={undefined}
      >
        SHARED STATE
      </Text>
    </group>
  );
}

// ─── Data Flow Particle ───
function FlowParticle({ start, end, color, speed = 1, offset = 0 }: {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
  speed?: number;
  offset?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const t = ((state.clock.elapsedTime * speed * 0.3 + offset) % 1 + 1) % 1;
      // Create a curved path using quadratic bezier
      const mid: [number, number, number] = [
        (start[0] + end[0]) / 2,
        (start[1] + end[1]) / 2 + 0.3,
        (start[2] + end[2]) / 2 + 0.2,
      ];
      const t1 = 1 - t;
      meshRef.current.position.x = t1 * t1 * start[0] + 2 * t1 * t * mid[0] + t * t * end[0];
      meshRef.current.position.y = t1 * t1 * start[1] + 2 * t1 * t * mid[1] + t * t * end[1];
      meshRef.current.position.z = t1 * t1 * start[2] + 2 * t1 * t * mid[2] + t * t * end[2];
      
      const scale = Math.sin(t * Math.PI) * 1.5;
      meshRef.current.scale.setScalar(Math.max(0.3, scale));
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.025, 8, 8]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} transparent opacity={0.9} />
    </mesh>
  );
}

// ─── Connection Curve ───
function ConnectionCurve({ start, end, color }: {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
}) {
  const points = useMemo(() => {
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...start),
      new THREE.Vector3(
        (start[0] + end[0]) / 2,
        (start[1] + end[1]) / 2 + 0.3,
        (start[2] + end[2]) / 2 + 0.2
      ),
      new THREE.Vector3(...end)
    );
    return curve.getPoints(32);
  }, [start, end]);

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={0.15} />
    </line>
  );
}

// ─── Protocol Labels ───
function ProtocolLabel({ position, text, color }: {
  position: [number, number, number];
  text: string;
  color: string;
}) {
  return (
    <Text
      position={position}
      fontSize={0.045}
      color={color}
      anchorX="center"
      anchorY="middle"
      font={undefined}
    >
      {text}
    </Text>
  );
}

// ─── Mouse-Reactive Group ───
function InteractiveGroup({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += (pointer.x * 0.12 - groupRef.current.rotation.y) * 0.02;
      groupRef.current.rotation.x += (-pointer.y * 0.08 - groupRef.current.rotation.x) * 0.02;
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

// ─── Main Scene ───
function Scene() {
  const userA: [number, number, number] = [-2, 0.8, 0];
  const userB: [number, number, number] = [-2, 0, 0];
  const userC: [number, number, number] = [-2, -0.8, 0];
  const crdt: [number, number, number] = [0, 0, 0];
  const sharedState: [number, number, number] = [2, 0, 0];

  return (
    <>
      <ambientLight intensity={0.25} />
      <pointLight position={[3, 3, 3]} intensity={0.5} color="#19C9C9" />
      <pointLight position={[-3, -2, 3]} intensity={0.3} color="#C2E7E0" />
      <pointLight position={[0, 4, -3]} intensity={0.2} color="#119898" />

      <Float speed={0.8} rotationIntensity={0.05} floatIntensity={0.15}>
        <InteractiveGroup>
          {/* User Nodes */}
          <UserNode position={userA} color="#7BA5E6" label="USER A" />
          <UserNode position={userB} color="#F9AAB8" label="USER B" />
          <UserNode position={userC} color="#BAB8E4" label="USER C" />

          {/* CRDT Node */}
          <CRDTNode />

          {/* Shared State */}
          <SharedStateNode />

          {/* Connection Curves: Users → CRDT */}
          <ConnectionCurve start={userA} end={crdt} color="#7BA5E6" />
          <ConnectionCurve start={userB} end={crdt} color="#F9AAB8" />
          <ConnectionCurve start={userC} end={crdt} color="#BAB8E4" />

          {/* Connection Curve: CRDT → Shared State */}
          <ConnectionCurve start={crdt} end={sharedState} color="#19C9C9" />

          {/* Flow Particles: Users → CRDT */}
          <FlowParticle start={userA} end={crdt} color="#7BA5E6" speed={1.2} offset={0} />
          <FlowParticle start={userA} end={crdt} color="#7BA5E6" speed={1.2} offset={0.5} />
          <FlowParticle start={userB} end={crdt} color="#F9AAB8" speed={1.0} offset={0.2} />
          <FlowParticle start={userB} end={crdt} color="#F9AAB8" speed={1.0} offset={0.7} />
          <FlowParticle start={userC} end={crdt} color="#BAB8E4" speed={0.9} offset={0.4} />
          <FlowParticle start={userC} end={crdt} color="#BAB8E4" speed={0.9} offset={0.9} />

          {/* Flow Particles: CRDT → Shared State */}
          <FlowParticle start={crdt} end={sharedState} color="#19C9C9" speed={0.8} offset={0} />
          <FlowParticle start={crdt} end={sharedState} color="#19C9C9" speed={0.8} offset={0.33} />
          <FlowParticle start={crdt} end={sharedState} color="#19C9C9" speed={0.8} offset={0.66} />

          {/* Protocol labels */}
          <ProtocolLabel position={[-1, 1.15, 0]} text="WebRTC" color="#7BA5E6" />
          <ProtocolLabel position={[-1, -0.05, 0]} text="WebSocket" color="#F9AAB8" />
          <ProtocolLabel position={[-1, -1.15, 0]} text="Lamport Clock" color="#BAB8E4" />
          <ProtocolLabel position={[1, 0.5, 0]} text="MERGE" color="#19C9C9" />
        </InteractiveGroup>
      </Float>
    </>
  );
}

// ─── Export ───
export default function SyncScene() {
  return (
    <div style={{ position: 'absolute', top: 0, right: 0, width: '55%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
