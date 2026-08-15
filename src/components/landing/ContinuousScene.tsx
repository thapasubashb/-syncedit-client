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
  const outerGlassSphereRef = useRef<THREE.Mesh>(null);
  const innerNucleusRef = useRef<THREE.Mesh>(null);
  const glitterCloudRef = useRef<THREE.Points>(null);
  const glitterRing1Ref = useRef<THREE.Points>(null);
  const glitterRing2Ref = useRef<THREE.Points>(null);

  // 1. Swirling High-Visibility Diamond Glitter Particles
  const glitterCount = 3600;
  const { glitterPositions, glitterColors, glitterPhases } = useMemo(() => {
    const positions = new Float32Array(glitterCount * 3);
    const colors = new Float32Array(glitterCount * 3);
    const phases = new Float32Array(glitterCount * 3); // theta, phi, radius

    const whiteGlitter = new THREE.Color('#ffffff');
    const diamondSparkle = new THREE.Color('#f0fdfa');
    const cyanDiamond = new THREE.Color('#a5f3fc');
    const brightTeal = new THREE.Color('#67e8f9');

    for (let i = 0; i < glitterCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 0.88 + Math.random() * 0.38;

      phases[i * 3] = theta;
      phases[i * 3 + 1] = phi;
      phases[i * 3 + 2] = r;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Mostly pure sparkling white and bright diamond colors for high visibility
      const col = i % 3 === 0 ? whiteGlitter : i % 3 === 1 ? diamondSparkle : (i % 6 === 2 ? cyanDiamond : brightTeal);
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    return { glitterPositions: positions, glitterColors: colors, glitterPhases: phases };
  }, []);

  // 2. Concentric Orbiting White Glitter Ring Belts
  const ring1Count = 600;
  const ring1Positions = useMemo(() => {
    const pos = new Float32Array(ring1Count * 3);
    for (let i = 0; i < ring1Count; i++) {
      const theta = (i / ring1Count) * Math.PI * 2;
      const r = 1.22 + (Math.random() - 0.5) * 0.16;
      pos[i * 3] = Math.cos(theta) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.15;
      pos[i * 3 + 2] = Math.sin(theta) * r;
    }
    return pos;
  }, []);

  const ring2Count = 500;
  const ring2Positions = useMemo(() => {
    const pos = new Float32Array(ring2Count * 3);
    for (let i = 0; i < ring2Count; i++) {
      const theta = (i / ring2Count) * Math.PI * 2;
      const r = 1.38 + (Math.random() - 0.5) * 0.18;
      pos[i * 3] = Math.cos(theta) * r;
      pos[i * 3 + 1] = Math.sin(theta) * 0.35 + (Math.random() - 0.5) * 0.12;
      pos[i * 3 + 2] = Math.sin(theta) * r;
    }
    return pos;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.12;
      groupRef.current.rotation.x = Math.sin(t * 0.15) * 0.08;
      groupRef.current.position.y = Math.cos(t * 0.7) * 0.04;
    }
    if (outerGlassSphereRef.current) {
      outerGlassSphereRef.current.rotation.y = -t * 0.25;
      outerGlassSphereRef.current.rotation.x = t * 0.18;
    }
    if (innerNucleusRef.current) {
      innerNucleusRef.current.rotation.y = t * 0.45;
      const s = 0.42 + Math.sin(t * 2.5) * 0.04;
      innerNucleusRef.current.scale.set(s, s, s);
    }

    // Dynamic Swirling Glitter Motion with Shimmer Twinkle
    if (glitterCloudRef.current) {
      const pos = glitterCloudRef.current.geometry.attributes.position;
      const arr = pos.array as Float32Array;
      for (let i = 0; i < glitterCount; i++) {
        const baseTheta = glitterPhases[i * 3];
        const basePhi = glitterPhases[i * 3 + 1];
        const baseR = glitterPhases[i * 3 + 2];

        // Smooth orbital rotation around circle
        const theta = baseTheta + t * 0.45 + Math.sin(basePhi * 4 + t * 0.8) * 0.18;
        // Subtle micro-twinkle sparkle breathing
        const sparkle = Math.sin(i * 12.0 + t * 4.0) * 0.04;
        const r = baseR + sparkle;

        arr[i * 3] = r * Math.sin(basePhi) * Math.cos(theta);
        arr[i * 3 + 1] = r * Math.sin(basePhi) * Math.sin(theta) + Math.cos(theta * 3 + t) * 0.05;
        arr[i * 3 + 2] = r * Math.cos(basePhi);
      }
      pos.needsUpdate = true;
    }

    // Rotating Glitter Belts
    if (glitterRing1Ref.current) {
      glitterRing1Ref.current.rotation.y = t * 0.55;
      glitterRing1Ref.current.rotation.x = Math.PI / 8 + Math.sin(t * 0.3) * 0.1;
    }
    if (glitterRing2Ref.current) {
      glitterRing2Ref.current.rotation.y = -t * 0.45;
      glitterRing2Ref.current.rotation.z = Math.PI / 6 + Math.cos(t * 0.25) * 0.1;
    }
  });

  return (
    <group ref={groupRef} scale={opacity * 1.02} visible={opacity > 0.01}>
      {/* Ambient Cyan-Aqua Atmospheric Backlight */}
      <mesh position={[0, 0, -0.3]}>
        <sphereGeometry args={[1.7, 32, 32]} />
        <meshBasicMaterial color="#2dd4bf" transparent opacity={0.18 * opacity} />
      </mesh>

      {/* ─── 1. Pure Crystal Liquid Glass Outer Shell ─── */}
      <mesh ref={outerGlassSphereRef}>
        <sphereGeometry args={[0.78, 64, 64]} />
        <meshPhysicalMaterial
          color="#f0fdfa"
          emissive="#2dd4bf"
          emissiveIntensity={0.35 * opacity}
          roughness={0.01}
          metalness={0.02}
          transmission={0.98}
          thickness={2.8}
          ior={1.56}
          clearcoat={1.0}
          clearcoatRoughness={0.0}
          iridescence={0.95}
          iridescenceIOR={1.4}
          transparent
          opacity={0.96 * opacity}
        />
      </mesh>

      {/* ─── 2. Internal Luminous Quantum Crystal Core ─── */}
      <mesh ref={innerNucleusRef}>
        <dodecahedronGeometry args={[0.4, 0]} />
        <meshPhysicalMaterial
          color="#ffffff"
          emissive="#38bdf8"
          emissiveIntensity={2.8 * opacity}
          roughness={0.02}
          metalness={0.1}
          transmission={0.92}
          thickness={1.4}
          ior={1.52}
          clearcoat={1.0}
          transparent
          opacity={0.94 * opacity}
        />
      </mesh>

      {/* ─── 3. High-Visibility Sparkling White Glitter Cloud ─── */}
      <points ref={glitterCloudRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={glitterCount} array={glitterPositions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={glitterCount} array={glitterColors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial 
          size={0.048} 
          vertexColors 
          transparent 
          opacity={0.98 * opacity} 
          sizeAttenuation 
        />
      </points>

      {/* ─── 4. Orbiting White Glitter Ring Belt 1 ─── */}
      <points ref={glitterRing1Ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={ring1Count} array={ring1Positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial 
          size={0.052} 
          color="#ffffff" 
          transparent 
          opacity={0.95 * opacity} 
          sizeAttenuation 
        />
      </points>

      {/* ─── 5. Orbiting White Glitter Ring Belt 2 (Tilted) ─── */}
      <points ref={glitterRing2Ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={ring2Count} array={ring2Positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial 
          size={0.048} 
          color="#ffffff" 
          transparent 
          opacity={0.9 * opacity} 
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

    if (progress <= 1) {
      op1.current = easeInOutCubic(1 - progress);
      op2.current = easeInOutCubic(progress);
      op3.current = 0;
      op4.current = 0;
    } else if (progress <= 2) {
      op1.current = 0;
      op2.current = easeInOutCubic(2 - progress);
      op3.current = easeInOutCubic(progress - 1);
      op4.current = 0;
    } else if (progress <= 3) {
      op1.current = 0;
      op2.current = 0;
      op3.current = easeInOutCubic(3 - progress);
      op4.current = easeInOutCubic(progress - 2);
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
