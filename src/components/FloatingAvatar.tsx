import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Float, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import bikkey1 from "@/assets/bikkey-1.png";
import bikkey2 from "@/assets/bikkey-2.png";
import bikkey3 from "@/assets/bikkey-3.png";

const photoUrls = [bikkey1, bikkey2, bikkey3];

/**
 * A rotating triangular prism whose three side-faces each show a different
 * portrait. Auto-rotates idly and reacts subtly to pointer position.
 */
function PhotoPrism({ pointer }: { pointer: { x: number; y: number } }) {
  const groupRef = useRef<THREE.Group>(null);
  const textures = useLoader(THREE.TextureLoader, photoUrls);

  // Make sure colors look right with the renderer's color management.
  useMemo(() => {
    textures.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 16;
      t.minFilter = THREE.LinearMipmapLinearFilter;
      t.magFilter = THREE.LinearFilter;
      t.generateMipmaps = true;
      t.needsUpdate = true;
    });
  }, [textures]);

  useFrame((_, delta) => {
    const g = groupRef.current;
    if (!g) return;
    // Idle auto-rotation
    g.rotation.y += delta * 0.45;
    // Subtle tilt towards the pointer
    const targetX = pointer.y * 0.35;
    const targetZ = -pointer.x * 0.2;
    g.rotation.x += (targetX - g.rotation.x) * 0.06;
    g.rotation.z += (targetZ - g.rotation.z) * 0.06;
  });

  // Triangular prism: 3 radial segments, tall enough to frame a portrait.
  const radius = 1.1;
  const height = 2.6;

  return (
    <group ref={groupRef}>
      {/* Solid colored prism body (top/bottom + back of side faces) */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, height, 3, 1, false]} />
        <meshStandardMaterial
          color="#1a1a3a"
          metalness={0.6}
          roughness={0.25}
          emissive="#4f46e5"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Three photo planes mounted on each side of the prism */}
      {textures.map((tex, i) => {
        const angle = (i / 3) * Math.PI * 2;
        // Distance from center to the midpoint of a triangle side
        const apothem = radius * Math.cos(Math.PI / 3);
        const x = Math.sin(angle) * (apothem + 0.01);
        const z = Math.cos(angle) * (apothem + 0.01);
        // Plane width = side length of the equilateral triangle
        const sideLen = radius * Math.sqrt(3);
        return (
          <mesh key={i} position={[x, 0, z]} rotation={[0, angle, 0]}>
            <planeGeometry args={[sideLen * 0.95, height * 0.92]} />
            <meshBasicMaterial
              map={tex}
              toneMapped={false}
              transparent={false}
              side={THREE.FrontSide}
            />
          </mesh>
        );
      })}

      {/* Glowing rim ring around the prism */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -height / 2 - 0.05, 0]}>
        <torusGeometry args={[radius * 1.15, 0.03, 16, 64]} />
        <meshStandardMaterial
          color="#7c5cff"
          emissive="#7c5cff"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, height / 2 + 0.05, 0]}>
        <torusGeometry args={[radius * 1.15, 0.03, 16, 64]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/** Small orbiting particles for extra depth. */
function OrbitingDots() {
  const groupRef = useRef<THREE.Group>(null);
  const dots = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        radius: 1.8 + Math.random() * 0.9,
        speed: 0.2 + Math.random() * 0.4,
        offset: Math.random() * Math.PI * 2,
        y: (Math.random() - 0.5) * 2.4,
        size: 0.025 + Math.random() * 0.04,
        color: i % 2 === 0 ? "#7c5cff" : "#22d3ee",
      })),
    [],
  );

  useFrame(({ clock }) => {
    const g = groupRef.current;
    if (!g) return;
    const t = clock.getElapsedTime();
    g.children.forEach((child, i) => {
      const d = dots[i];
      child.position.x = Math.cos(t * d.speed + d.offset) * d.radius;
      child.position.z = Math.sin(t * d.speed + d.offset) * d.radius;
      child.position.y = d.y + Math.sin(t * 0.8 + d.offset) * 0.15;
    });
  });

  return (
    <group ref={groupRef}>
      {dots.map((d, i) => (
        <mesh key={i}>
          <sphereGeometry args={[d.size, 12, 12]} />
          <meshStandardMaterial
            color={d.color}
            emissive={d.color}
            emissiveIntensity={2.5}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Hero avatar built with a real Three.js scene via React Three Fiber. */
export function FloatingAvatar() {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setPointer({
      x: ((e.clientX - r.left) / r.width) * 2 - 1,
      y: -(((e.clientY - r.top) / r.height) * 2 - 1),
    });
  };
  const handlePointerLeave = () => setPointer({ x: 0, y: 0 });

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative mx-auto h-[360px] w-[360px] sm:h-[440px] sm:w-[440px]"
    >
      {/* Background glow halo */}
      <div className="pointer-events-none absolute -inset-8 rounded-full bg-[var(--gradient-radial)] blur-3xl" />

      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0.4, 5], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
        className="!absolute inset-0"
      >
        <color attach="background" args={["#00000000"]} />
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[3, 4, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-4, -2, -3]} intensity={1.4} color="#7c5cff" />
        <pointLight position={[4, -1, 2]} intensity={1} color="#22d3ee" />

        <Suspense fallback={null}>
          <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.8}>
            <PhotoPrism pointer={pointer} />
          </Float>
          <OrbitingDots />
          <ContactShadows
            position={[0, -1.7, 0]}
            opacity={0.45}
            scale={6}
            blur={2.4}
            far={3}
          />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
