// src/components/landing/HeroScene.tsx
// Slide 1 — Interactive 3D collaboration network sphere
import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// ─── Network Node ───
function NetworkNode({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 0.8 + position[0]) * 0.001;
    }
    if (glowRef.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 1.2 + position[1]) * 0.15;
      glowRef.current.scale.setScalar(s);
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.06 * scale, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} transparent opacity={0.9} />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.12 * scale, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

// ─── Connection Lines ───
function ConnectionLines({ nodes }: { nodes: [number, number, number][] }) {
  const linesRef = useRef<THREE.Group>(null);
  
  const connections = useMemo(() => {
    const conns: { start: [number, number, number]; end: [number, number, number] }[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = Math.sqrt(
          (nodes[i][0] - nodes[j][0]) ** 2 +
          (nodes[i][1] - nodes[j][1]) ** 2 +
          (nodes[i][2] - nodes[j][2]) ** 2
        );
        if (dist < 2.5) {
          conns.push({ start: nodes[i], end: nodes[j] });
        }
      }
    }
    return conns;
  }, [nodes]);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Line) {
          const mat = child.material as THREE.LineBasicMaterial;
          mat.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 0.5 + i * 0.3) * 0.1;
        }
      });
    }
  });

  return (
    <group ref={linesRef}>
      {connections.map((conn, i) => {
        const points = [new THREE.Vector3(...conn.start), new THREE.Vector3(...conn.end)];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        return (
          <line key={i} geometry={geometry}>
            <lineBasicMaterial color="#7BA5E6" transparent opacity={0.2} />
          </line>
        );
      })}
    </group>
  );
}

// ─── Floating Particles ───
function Particles({ count = 60 }: { count?: number }) {
  const particlesRef = useRef<THREE.Points>(null);
  
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [
      new THREE.Color('#7BA5E6'),
      new THREE.Color('#BAB8E4'),
      new THREE.Color('#AF7FD2'),
      new THREE.Color('#6344D5'),
    ];
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.8 + Math.random() * 1.2;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, [count]);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.03;
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.1;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} vertexColors transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

// ─── Glass Sphere ───
function GlassSphere() {
  const sphereRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      sphereRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.1;
    }
  });

  return (
    <mesh ref={sphereRef}>
      <icosahedronGeometry args={[1.6, 1]} />
      <meshStandardMaterial
        color="#1a1a3e"
        transparent
        opacity={0.08}
        wireframe
        emissive="#6344D5"
        emissiveIntensity={0.15}
      />
    </mesh>
  );
}

// ─── Mouse-Reactive Group ───
function InteractiveGroup({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += (pointer.x * 0.3 - groupRef.current.rotation.y) * 0.02;
      groupRef.current.rotation.x += (-pointer.y * 0.2 - groupRef.current.rotation.x) * 0.02;
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

// ─── Main Scene ───
function Scene() {
  const nodes: [number, number, number][] = useMemo(() => {
    const pts: [number, number, number][] = [];
    // Create nodes arranged on a sphere surface
    for (let i = 0; i < 18; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.0 + Math.random() * 0.6;
      pts.push([
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
      ]);
    }
    return pts;
  }, []);

  const nodeColors = ['#7BA5E6', '#BAB8E4', '#AF7FD2', '#6344D5', '#19C9C9'];

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.6} color="#7BA5E6" />
      <pointLight position={[-5, -3, 3]} intensity={0.4} color="#AF7FD2" />
      <pointLight position={[0, 5, -5]} intensity={0.3} color="#BAB8E4" />
      
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <InteractiveGroup>
          <GlassSphere />
          {nodes.map((pos, i) => (
            <NetworkNode
              key={i}
              position={pos}
              color={nodeColors[i % nodeColors.length]}
              scale={0.8 + Math.random() * 0.6}
            />
          ))}
          <ConnectionLines nodes={nodes} />
          <Particles count={50} />
        </InteractiveGroup>
      </Float>
    </>
  );
}

// ─── Export ───
export default function HeroScene() {
  return (
    <div className="three-canvas-container" style={{ position: 'absolute', top: 0, right: 0, width: '55%', height: '100%' }}>
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
