// src/components/landing/ContinuousScene.tsx
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface ContinuousSceneProps {
  scrollProgressRef: React.MutableRefObject<number>;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// ═══════════════════════════════════════════════════════════════════════════════
// ─── STAGE 1: iPhone-17 Grade Liquid Glass Collaborative Spatial Document UI ──
// ═══════════════════════════════════════════════════════════════════════════════
function Stage1LiquidGlassWorkspace({ opacity }: { opacity: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const splineRef = useRef<THREE.Mesh>(null);
  const cursor1Ref = useRef<THREE.Group>(null);
  const cursor2Ref = useRef<THREE.Group>(null);
  const waveMeshRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const edgeGlowRef = useRef<THREE.Mesh>(null);

  const splineCurve = useMemo(() => {
    const points = [
      new THREE.Vector3(-1.0, -0.35, 0.18),
      new THREE.Vector3(-0.45, 0.42, 0.22),
      new THREE.Vector3(0.1, -0.22, 0.25),
      new THREE.Vector3(0.65, 0.38, 0.2),
      new THREE.Vector3(1.05, -0.08, 0.24),
    ];
    return new THREE.CatmullRomCurve3(points);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.PI / 9 + Math.sin(t * 0.28) * 0.055;
      groupRef.current.rotation.x = Math.PI / 15 + Math.cos(t * 0.22) * 0.04;
      groupRef.current.position.y = Math.sin(t * 0.75) * 0.05;
    }
    if (cursor1Ref.current) {
      cursor1Ref.current.position.x = -0.48 + Math.sin(t * 1.35) * 0.48;
      cursor1Ref.current.position.y = 0.22 + Math.cos(t * 1.08) * 0.28;
      cursor1Ref.current.position.z = 0.36;
    }
    if (cursor2Ref.current) {
      cursor2Ref.current.position.x = 0.42 + Math.cos(t * 1.15) * 0.42;
      cursor2Ref.current.position.y = -0.18 + Math.sin(t * 1.52) * 0.32;
      cursor2Ref.current.position.z = 0.4;
    }
    if (waveMeshRef.current) {
      const geo = waveMeshRef.current.geometry as THREE.PlaneGeometry;
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const u = pos.getX(i);
        const v = pos.getY(i);
        const z = Math.sin(u * 3.5 + t * 2.0) * Math.cos(v * 3.5 + t * 1.7) * 0.055;
        pos.setZ(i, z);
      }
      pos.needsUpdate = true;
    }
    if (haloRef.current) {
      haloRef.current.rotation.z = t * 0.18;
      const s = 1 + Math.sin(t * 1.2) * 0.04;
      haloRef.current.scale.set(s, s, 1);
    }
    if (edgeGlowRef.current) {
      const mat = edgeGlowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = (0.18 + Math.sin(t * 2.5) * 0.08) * opacity;
    }
  });

  return (
    <group ref={groupRef} scale={opacity * 0.95} visible={opacity > 0.01}>
      <mesh ref={haloRef} position={[0, 0, -0.15]}>
        <planeGeometry args={[3.6, 2.8]} />
        <meshBasicMaterial color="#a5b4fc" transparent opacity={0.18 * opacity} />
      </mesh>

      <mesh ref={edgeGlowRef} position={[0, 0, -0.05]}>
        <ringGeometry args={[1.3, 1.65, 64]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.18 * opacity} side={THREE.DoubleSide} />
      </mesh>

      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.7, 1.86, 0.06]} />
        <meshPhysicalMaterial
          color="#f8faff"
          emissive="#818cf8"
          emissiveIntensity={0.18 * opacity}
          roughness={0.0}
          metalness={0.0}
          transmission={0.97}
          thickness={2.8}
          ior={1.58}
          clearcoat={1.0}
          clearcoatRoughness={0.0}
          iridescence={0.35}
          iridescenceIOR={1.3}
          transparent
          opacity={0.96 * opacity}
        />
      </mesh>

      <mesh ref={waveMeshRef} position={[0, 0, 0.025]}>
        <planeGeometry args={[2.56, 1.72, 32, 32]} />
        <meshPhysicalMaterial
          color="#bfdbfe"
          emissive="#60a5fa"
          emissiveIntensity={0.28 * opacity}
          roughness={0.05}
          transmission={0.92}
          thickness={1.2}
          iridescence={0.5}
          iridescenceIOR={1.4}
          transparent
          opacity={0.6 * opacity}
        />
      </mesh>

      <mesh position={[0, 0, 0.72]}>
        <boxGeometry args={[2.44, 0.22, 0.04]} />
        <meshPhysicalMaterial
          color="#e0e7ff"
          emissive="#6366f1"
          emissiveIntensity={0.22 * opacity}
          roughness={0.0}
          transmission={0.92}
          thickness={0.8}
          ior={1.5}
          clearcoat={1.0}
          iridescence={0.3}
          transparent
          opacity={0.9 * opacity}
        />
      </mesh>
      <Text position={[-0.9, 0.72, 0.16]} fontSize={0.068} color="#1e3a8a">
        CanvasSync / document-alpha.canvas
      </Text>

      <group position={[0.88, 0.72, 0.16]}>
        <mesh position={[-0.24, 0, 0]}>
          <circleGeometry args={[0.062, 24]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <mesh position={[-0.07, 0, 0]}>
          <circleGeometry args={[0.062, 24]} />
          <meshBasicMaterial color="#ec4899" />
        </mesh>
        <mesh position={[0.1, 0, 0]}>
          <circleGeometry args={[0.062, 24]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
      </group>

      <mesh position={[-0.65, -0.15, 0.22]}>
        <boxGeometry args={[1.02, 0.82, 0.04]} />
        <meshPhysicalMaterial
          color="#dbeafe"
          emissive="#3b82f6"
          emissiveIntensity={0.25 * opacity}
          roughness={0.0}
          transmission={0.94}
          thickness={1.0}
          ior={1.52}
          clearcoat={1.0}
          iridescence={0.25}
          transparent
          opacity={0.92 * opacity}
        />
      </mesh>
      <Text position={[-0.65, 0.1, 0.25]} fontSize={0.068} color="#1e40af">
        Multiplayer State
      </Text>
      <Text position={[-0.65, -0.08, 0.25]} fontSize={0.05} color="#475569">
        Peer-to-Peer CRDT Active
      </Text>
      <Text position={[-0.65, -0.22, 0.25]} fontSize={0.044} color="#059669">
        ● 3 Replicas Synced (0.4ms)
      </Text>

      <mesh ref={splineRef}>
        <tubeGeometry args={[splineCurve, 80, 0.022, 12, false]} />
        <meshStandardMaterial
          color="#a5b4fc"
          emissive="#818cf8"
          emissiveIntensity={3.5 * opacity}
          roughness={0.0}
          metalness={0.5}
          transparent
          opacity={0.9 * opacity}
        />
      </mesh>

      <group ref={cursor1Ref} position={[-0.48, 0.22, 0.36]}>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <coneGeometry args={[0.055, 0.18, 4]} />
          <meshStandardMaterial color="#0284c7" emissive="#38bdf8" emissiveIntensity={3.0 * opacity} />
        </mesh>
        <mesh position={[0.24, -0.04, 0]}>
          <boxGeometry args={[0.38, 0.13, 0.02]} />
          <meshPhysicalMaterial
            color="#0284c7"
            transmission={0.3}
            roughness={0.1}
            transparent
            opacity={0.88 * opacity}
          />
        </mesh>
        <Text position={[0.24, -0.04, 0.02]} fontSize={0.054} color="#ffffff">
          Alex (Live)
        </Text>
      </group>

      <group ref={cursor2Ref} position={[0.42, -0.18, 0.4]}>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <coneGeometry args={[0.055, 0.18, 4]} />
          <meshStandardMaterial color="#db2777" emissive="#f472b6" emissiveIntensity={3.0 * opacity} />
        </mesh>
        <mesh position={[0.28, -0.04, 0]}>
          <boxGeometry args={[0.44, 0.13, 0.02]} />
          <meshPhysicalMaterial
            color="#db2777"
            transmission={0.3}
            roughness={0.1}
            transparent
            opacity={0.88 * opacity}
          />
        </mesh>
        <Text position={[0.28, -0.04, 0.02]} fontSize={0.054} color="#ffffff">
          Subash (Sync)
        </Text>
      </group>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── STAGE 2: Prismatic Icy-Glass Möbius Ribbon & Levitating Titanium Core ───
// ═══════════════════════════════════════════════════════════════════════════════
function Stage2PrismaticGlassHelix({ opacity }: { opacity: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const glassRibbonRef = useRef<THREE.Mesh>(null);
  const chromeCoreRef = useRef<THREE.Mesh>(null);
  const orbitHaloRef = useRef<THREE.Mesh>(null);
  const bubblesGroupRef = useRef<THREE.Group>(null);

  const bubbles = useMemo(() => {
    return [
      { pos: [-0.95, 0.7, 0.2] as [number, number, number], r: 0.09 },
      { pos: [0.85, -0.65, 0.35] as [number, number, number], r: 0.11 },
      { pos: [-0.75, -0.6, -0.2] as [number, number, number], r: 0.07 },
      { pos: [0.9, 0.6, -0.15] as [number, number, number], r: 0.08 },
      { pos: [0.1, 1.05, 0.1] as [number, number, number], r: 0.095 },
      { pos: [-0.3, -1.0, 0.25] as [number, number, number], r: 0.085 },
    ];
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = -Math.PI / 10 + Math.cos(t * 0.2) * 0.07;
      groupRef.current.rotation.x = Math.PI / 14 + Math.sin(t * 0.16) * 0.05;
      groupRef.current.position.y = Math.cos(t * 0.65) * 0.05;
    }
    if (glassRibbonRef.current) {
      glassRibbonRef.current.rotation.x = t * 0.32;
      glassRibbonRef.current.rotation.y = t * 0.28;
      glassRibbonRef.current.rotation.z = Math.sin(t * 0.35) * 0.18;
    }
    if (chromeCoreRef.current) {
      chromeCoreRef.current.rotation.y = -t * 0.55;
      chromeCoreRef.current.rotation.x = t * 0.38;
      const s = 0.48 + Math.sin(t * 2.2) * 0.04;
      chromeCoreRef.current.scale.set(s, s, s);
    }
    if (orbitHaloRef.current) {
      orbitHaloRef.current.rotation.z = -t * 0.22;
      orbitHaloRef.current.rotation.x = Math.sin(t * 0.25) * 0.25;
    }
    if (bubblesGroupRef.current) {
      bubblesGroupRef.current.rotation.y = t * 0.14;
    }
  });

  return (
    <group ref={groupRef} scale={opacity * 0.96} visible={opacity > 0.01}>
      <mesh position={[0, 0, -0.4]}>
        <sphereGeometry args={[1.7, 32, 32]} />
        <meshBasicMaterial color="#bfdbfe" transparent opacity={0.16 * opacity} />
      </mesh>

      <mesh ref={glassRibbonRef}>
        <torusKnotGeometry args={[0.82, 0.22, 160, 32, 2, 3]} />
        <meshPhysicalMaterial
          color="#f0f9ff"
          emissive="#60a5fa"
          emissiveIntensity={0.32 * opacity}
          roughness={0.02}
          metalness={0.05}
          transmission={0.98}
          thickness={2.4}
          ior={1.55}
          clearcoat={1.0}
          clearcoatRoughness={0.01}
          iridescence={0.85}
          iridescenceIOR={1.4}
          transparent
          opacity={0.95 * opacity}
        />
      </mesh>

      <mesh ref={chromeCoreRef}>
        <octahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#38bdf8"
          emissiveIntensity={1.8 * opacity}
          roughness={0.08}
          metalness={0.98}
          transparent
          opacity={0.96 * opacity}
        />
      </mesh>

      <mesh ref={orbitHaloRef}>
        <torusGeometry args={[1.4, 0.016, 16, 64]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#60a5fa"
          emissiveIntensity={3.2 * opacity}
          transparent
          opacity={0.85 * opacity}
        />
      </mesh>

      <group ref={bubblesGroupRef}>
        {bubbles.map((b, i) => (
          <mesh key={i} position={b.pos}>
            <sphereGeometry args={[b.r, 24, 24]} />
            <meshPhysicalMaterial
              color="#ffffff"
              emissive="#93c5fd"
              emissiveIntensity={0.5 * opacity}
              roughness={0.02}
              transmission={0.96}
              thickness={1.5}
              ior={1.52}
              clearcoat={1.0}
              iridescence={0.6}
              transparent
              opacity={0.92 * opacity}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── STAGE 3: Transparent Liquid Glass Orb & Ultra-Visible Sparkling Glitter ──
// ─── (Pure Crystal Liquid Glass Core + Rotating High-Visibility Glitter Belts) ─
// ═══════════════════════════════════════════════════════════════════════════════
function Stage3LiquidGlassParticleOrb({ opacity }: { opacity: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const ringGroupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const sparkleRef = useRef<THREE.Points>(null);

  const sparkleCount = 80;
  const { sparklePositions, sparkleColors } = useMemo(() => {
    const positions = new Float32Array(sparkleCount * 3);
    const colors = new Float32Array(sparkleCount * 3);
    const softCyan = new THREE.Color('#dff9ff');
    const skyBlue = new THREE.Color('#9fe7ff');

    for (let i = 0; i < sparkleCount; i++) {
      const theta = (i / sparkleCount) * Math.PI * 2;
      const radius = 0.85 + (i % 5) * 0.18;
      const y = (Math.random() - 0.5) * 0.8;

      positions[i * 3] = Math.cos(theta) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(theta) * radius;

      const color = i % 2 === 0 ? softCyan : skyBlue;
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return { sparklePositions: positions, sparkleColors: colors };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.16;
      groupRef.current.rotation.x = Math.sin(t * 0.5) * 0.16;
      groupRef.current.position.y = Math.sin(t * 0.7) * 0.05;
    }

    if (ringGroupRef.current) {
      ringGroupRef.current.rotation.z = t * 0.2;
      ringGroupRef.current.rotation.x = Math.PI / 2.3 + Math.sin(t * 0.5) * 0.15;
    }

    if (glowRef.current) {
      glowRef.current.scale.set(1, 1, 1);
    }

    if (sparkleRef.current) {
      sparkleRef.current.rotation.y = -t * 0.3;
      sparkleRef.current.rotation.x = t * 0.15;
    }
  });

  return (
    <group ref={groupRef} scale={1} visible={opacity > 0.01}>
      <mesh ref={glowRef} position={[0, 0, -0.6]}>
        <sphereGeometry args={[1.85, 32, 32]} />
        <meshBasicMaterial color="#9dd5ff" transparent opacity={0.12 * opacity} />
      </mesh>

      <group ref={ringGroupRef}>
        {[0, 1, 2, 3].map((index) => (
          <mesh
            key={index}
            rotation={[Math.PI / 2.6 + index * 0.22, 0.38 + index * 0.1, index * 0.4]}
            position={[0, (index - 1.5) * 0.18, 0]}
          >
            <torusGeometry args={[1.02 - index * 0.14, 0.18 + index * 0.03, 28, 140]} />
            <meshPhysicalMaterial
              color="#d8f0ff"
              emissive="#8ad9ff"
              emissiveIntensity={0.8 * opacity}
              roughness={0.08}
              metalness={0.04}
              transmission={0.97}
              thickness={3.5}
              ior={1.5}
              clearcoat={1.0}
              transparent
              opacity={0.7 * opacity}
            />
          </mesh>
        ))}

        <mesh position={[0, 0, 0.2]}>
          <sphereGeometry args={[0.52, 32, 32]} />
          <meshPhysicalMaterial
            color="#edfaff"
            emissive="#a5f3fc"
            emissiveIntensity={0.8 * opacity}
            roughness={0.04}
            metalness={0.05}
            transmission={0.96}
            thickness={2.5}
            ior={1.48}
            clearcoat={1.0}
            transparent
            opacity={0.22 * opacity}
          />
        </mesh>
      </group>

      <points ref={sparkleRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={sparkleCount} array={sparklePositions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={sparkleCount} array={sparkleColors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          vertexColors
          transparent
          opacity={0.5 * opacity}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── STAGE 4: Completely Liquid Glass Kinetic Armillary Chronosphere ──────────
// ─── (Pure Refractive Liquid Glass Rings & Levitating Prismatic Crystal Gem) ──
// ═══════════════════════════════════════════════════════════════════════════════
function Stage4PureLiquidGlassArmillary({ opacity }: { opacity: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const glassGemRef = useRef<THREE.Mesh>(null);
  const dropletsGroupRef = useRef<THREE.Group>(null);
  const stardustRef = useRef<THREE.Points>(null);

  const starCount = 90;
  const starPositions = useMemo(() => {
    const pos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const theta = (i / starCount) * Math.PI * 2;
      const r = 1.3 + (i % 4) * 0.14;
      pos[i * 3] = Math.cos(theta) * r;
      pos[i * 3 + 1] = Math.sin(theta) * r * 0.35 + Math.sin(i * 2) * 0.08;
      pos[i * 3 + 2] = Math.sin(theta) * 0.45;
    }
    return pos;
  }, []);

  // Orbiting liquid glass droplets
  const glassDroplets = useMemo(() => {
    return [
      { pos: [1.45, 0, 0] as [number, number, number], r: 0.09 },
      { pos: [-1.45, 0, 0] as [number, number, number], r: 0.09 },
      { pos: [0, 1.45, 0] as [number, number, number], r: 0.1 },
      { pos: [0, -1.45, 0] as [number, number, number], r: 0.085 },
      { pos: [0.9, 0.9, 0.3] as [number, number, number], r: 0.075 },
      { pos: [-0.9, -0.9, -0.3] as [number, number, number], r: 0.075 },
    ];
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.18;
      groupRef.current.rotation.x = Math.sin(t * 0.14) * 0.12;
      groupRef.current.position.y = Math.cos(t * 0.65) * 0.05;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.38;
      ring1Ref.current.rotation.y = t * 0.22;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -t * 0.32;
      ring2Ref.current.rotation.z = t * 0.28;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z = -t * 0.42;
      ring3Ref.current.rotation.x = t * 0.2;
    }
    if (glassGemRef.current) {
      glassGemRef.current.rotation.y = -t * 0.55;
      glassGemRef.current.rotation.x = t * 0.35;
      const s = 0.52 + Math.sin(t * 2.8) * 0.04;
      glassGemRef.current.scale.set(s, s, s);
    }
    if (dropletsGroupRef.current) {
      dropletsGroupRef.current.rotation.y = t * 0.4;
      dropletsGroupRef.current.rotation.z = Math.sin(t * 0.3) * 0.15;
    }
    if (stardustRef.current) {
      stardustRef.current.rotation.z = t * 0.22;
    }
  });

  return (
    <group ref={groupRef} scale={opacity * 0.98} visible={opacity > 0.01}>
      {/* Volumetric Sunset Rose-Lavender Glow */}
      <mesh position={[0, 0, -0.4]}>
        <sphereGeometry args={[1.75, 32, 32]} />
        <meshBasicMaterial color="#f472b6" transparent opacity={0.16 * opacity} />
      </mesh>

      {/* ─── Outer Liquid Glass Torus Ring 1 (Sunset Rose-Crystal) ─── */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.42, 0.065, 24, 64]} />
        <meshPhysicalMaterial
          color="#fdf4ff"
          emissive="#f472b6"
          emissiveIntensity={0.55 * opacity}
          roughness={0.02}
          metalness={0.02}
          transmission={0.98}
          thickness={2.4}
          ior={1.56}
          clearcoat={1.0}
          clearcoatRoughness={0.01}
          iridescence={0.9}
          iridescenceIOR={1.4}
          transparent
          opacity={0.95 * opacity}
        />
      </mesh>

      {/* ─── Middle Liquid Glass Torus Ring 2 (Lavender-Amethyst Glass) ─── */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[1.12, 0.055, 24, 64]} />
        <meshPhysicalMaterial
          color="#f5f3ff"
          emissive="#c084fc"
          emissiveIntensity={0.6 * opacity}
          roughness={0.02}
          metalness={0.02}
          transmission={0.98}
          thickness={2.2}
          ior={1.55}
          clearcoat={1.0}
          clearcoatRoughness={0.01}
          iridescence={0.85}
          iridescenceIOR={1.4}
          transparent
          opacity={0.95 * opacity}
        />
      </mesh>

      {/* ─── Inner Liquid Glass Torus Ring 3 (Peach-Gold Crystal) ─── */}
      <mesh ref={ring3Ref}>
        <torusGeometry args={[0.82, 0.045, 24, 64]} />
        <meshPhysicalMaterial
          color="#fffbeb"
          emissive="#fde047"
          emissiveIntensity={0.7 * opacity}
          roughness={0.02}
          metalness={0.02}
          transmission={0.98}
          thickness={2.0}
          ior={1.54}
          clearcoat={1.0}
          clearcoatRoughness={0.01}
          iridescence={0.8}
          iridescenceIOR={1.35}
          transparent
          opacity={0.95 * opacity}
        />
      </mesh>

      {/* ─── Central Levitating Faceted Liquid Glass Gem Monolith ─── */}
      <mesh ref={glassGemRef}>
        <dodecahedronGeometry args={[0.5, 0]} />
        <meshPhysicalMaterial
          color="#ffffff"
          emissive="#ec4899"
          emissiveIntensity={0.95 * opacity}
          roughness={0.02}
          metalness={0.05}
          transmission={0.98}
          thickness={2.8}
          ior={1.58}
          clearcoat={1.0}
          iridescence={0.95}
          iridescenceIOR={1.45}
          transparent
          opacity={0.96 * opacity}
        />
      </mesh>

      {/* Orbiting Liquid Glass Droplets */}
      <group ref={dropletsGroupRef}>
        {glassDroplets.map((d, i) => (
          <mesh key={i} position={d.pos}>
            <sphereGeometry args={[d.r, 24, 24]} />
            <meshPhysicalMaterial
              color="#ffffff"
              emissive="#fde047"
              emissiveIntensity={0.7 * opacity}
              roughness={0.02}
              transmission={0.97}
              thickness={1.6}
              ior={1.54}
              clearcoat={1.0}
              transparent
              opacity={0.94 * opacity}
            />
          </mesh>
        ))}
      </group>

      {/* Orbiting Golden Stardust Field */}
      <points ref={stardustRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={starCount} array={starPositions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.055} color="#fde047" transparent opacity={0.85 * opacity} sizeAttenuation />
      </points>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── MASTER CONTINUOUS 3D SCENE CONTROLLER ────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
function MasterContinuousSpatialScene({ scrollProgressRef }: { scrollProgressRef: React.MutableRefObject<number> }) {
  const { pointer, viewport } = useThree();
  const masterGroupRef = useRef<THREE.Group>(null);

  const op1 = useRef(1);
  const op2 = useRef(0);
  const op3 = useRef(0);
  const op4 = useRef(0);

  useFrame(() => {
    const progress = scrollProgressRef.current;
    const isMobile = viewport.width < 6;

    const fade = (value: number, start: number, end: number) => {
      if (value <= start) return 0;
      if (value >= end) return 1;
      return (value - start) / (end - start);
    };

    if (progress <= 1) {
      op1.current = easeInOutCubic(1 - progress);
      op2.current = easeInOutCubic(progress);
      op3.current = 0;
      op4.current = 0;
    } else if (progress < 2) {
      op1.current = 0;
      op2.current = easeInOutCubic(1 - fade(progress, 1, 2));
      op3.current = easeInOutCubic(fade(progress, 1, 2));
      op4.current = 0;
    } else if (progress < 3) {
      op1.current = 0;
      op2.current = 0;
      op3.current = easeInOutCubic(1 - fade(progress, 2, 3));
      op4.current = easeInOutCubic(fade(progress, 2, 3));
    } else {
      op1.current = 0;
      op2.current = 0;
      op3.current = 0;
      op4.current = 1;
    }

    if (masterGroupRef.current) {
      let targetX = 1.3;
      if (progress < 1) {
        targetX = lerp(1.3, -1.3, easeInOutCubic(progress));
      } else if (progress < 2) {
        targetX = lerp(-1.3, 1.3, easeInOutCubic(progress - 1));
      } else if (progress < 3) {
        targetX = lerp(1.3, -1.3, easeInOutCubic(progress - 2));
      } else {
        targetX = -1.3;
      }

      if (isMobile) targetX = 0;

      const mouseX = pointer.x * 0.28;
      const mouseY = pointer.y * 0.2;

      masterGroupRef.current.position.x = lerp(masterGroupRef.current.position.x, targetX + mouseX, 0.08);
      masterGroupRef.current.position.y = lerp(masterGroupRef.current.position.y, (isMobile ? -0.2 : 0) + mouseY, 0.08);
    }
  });

  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight position={[5, 8, 5]} intensity={2.0} color="#ffffff" />
      <pointLight position={[-6, 4, 4]} intensity={1.6} color="#a5b4fc" />
      <pointLight position={[6, -4, 4]} intensity={1.4} color="#f472b6" />
      <pointLight position={[0, 6, -2]} intensity={1.2} color="#38bdf8" />
      <pointLight position={[0, -5, 3]} intensity={0.9} color="#fde047" />

      <group ref={masterGroupRef} position={[1.3, 0, 0]}>
        <Stage1LiquidGlassWorkspace opacity={op1.current} />
        <Stage2PrismaticGlassHelix opacity={op2.current} />
        <Stage3LiquidGlassParticleOrb opacity={op3.current} />
        <Stage4PureLiquidGlassArmillary opacity={op4.current} />
      </group>
    </>
  );
}

export default function ContinuousScene({ scrollProgressRef }: ContinuousSceneProps) {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-10">
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <MasterContinuousSpatialScene scrollProgressRef={scrollProgressRef} />
      </Canvas>
    </div>
  );
}
