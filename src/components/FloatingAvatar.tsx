import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Float, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { Slider } from "@/components/ui/slider";
import { Settings2 } from "lucide-react";
import bikkey1 from "@/assets/bikkey-1.png";
import bikkey2 from "@/assets/bikkey-2.png";
import bikkey3 from "@/assets/bikkey-3.png";

const photoUrls = [bikkey1, bikkey2, bikkey3];

type PhotoAdjust = {
  brightness: number; // 0.5 .. 2
  contrast: number; // 0.5 .. 2
  saturation: number; // 0 .. 2
};

/**
 * Custom shader material that lets us tune brightness/contrast/saturation
 * of a texture in real time via uniforms.
 */
function makePhotoMaterial(map: THREE.Texture) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: map },
      uBrightness: { value: 1 },
      uContrast: { value: 1 },
      uSaturation: { value: 1 },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      precision highp float;
      uniform sampler2D uMap;
      uniform float uBrightness;
      uniform float uContrast;
      uniform float uSaturation;
      varying vec2 vUv;

      void main() {
        vec4 tex = texture2D(uMap, vUv);
        vec3 c = tex.rgb;
        // brightness
        c *= uBrightness;
        // contrast around 0.5
        c = (c - 0.5) * uContrast + 0.5;
        // saturation (luma)
        float l = dot(c, vec3(0.299, 0.587, 0.114));
        c = mix(vec3(l), c, uSaturation);
        gl_FragColor = vec4(clamp(c, 0.0, 1.0), tex.a);
      }
    `,
  });
}

/**
 * A rotating triangular prism whose three side-faces each show a different
 * portrait. Auto-rotates idly and reacts subtly to pointer position.
 */
function PhotoPrism({
  pointer,
  adjust,
}: {
  pointer: { x: number; y: number };
  adjust: PhotoAdjust;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const textures = useLoader(THREE.TextureLoader, photoUrls);

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

  // Build one custom material per texture, kept stable across renders.
  const materials = useMemo(
    () => textures.map((t) => makePhotoMaterial(t)),
    [textures],
  );

  // Push slider values into the shader uniforms each frame.
  useFrame((_, delta) => {
    materials.forEach((m) => {
      m.uniforms.uBrightness.value = adjust.brightness;
      m.uniforms.uContrast.value = adjust.contrast;
      m.uniforms.uSaturation.value = adjust.saturation;
    });

    const g = groupRef.current;
    if (!g) return;
    g.rotation.y += delta * 0.45;
    const targetX = pointer.y * 0.35;
    const targetZ = -pointer.x * 0.2;
    g.rotation.x += (targetX - g.rotation.x) * 0.06;
    g.rotation.z += (targetZ - g.rotation.z) * 0.06;
  });

  const radius = 1.1;
  const height = 2.6;

  return (
    <group ref={groupRef}>
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

      {textures.map((_, i) => {
        const angle = (i / 3) * Math.PI * 2;
        const apothem = radius * Math.cos(Math.PI / 3);
        const x = Math.sin(angle) * (apothem + 0.01);
        const z = Math.cos(angle) * (apothem + 0.01);
        const sideLen = radius * Math.sqrt(3);
        return (
          <mesh
            key={i}
            position={[x, 0, z]}
            rotation={[0, angle, 0]}
            material={materials[i]}
          >
            <planeGeometry args={[sideLen * 0.95, height * 0.92]} />
          </mesh>
        );
      })}

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

const DEFAULT_ADJUST: PhotoAdjust = {
  brightness: 1.1,
  contrast: 1.1,
  saturation: 1.05,
};

export function FloatingAvatar() {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [adjust, setAdjust] = useState<PhotoAdjust>(DEFAULT_ADJUST);
  const [showControls, setShowControls] = useState(false);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setPointer({
      x: ((e.clientX - r.left) / r.width) * 2 - 1,
      y: -(((e.clientY - r.top) / r.height) * 2 - 1),
    });
  };
  const handlePointerLeave = () => setPointer({ x: 0, y: 0 });

  return (
    <div className="relative mx-auto h-[360px] w-[360px] sm:h-[440px] sm:w-[440px]">
      <div
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="absolute inset-0"
      >
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
              <PhotoPrism pointer={pointer} adjust={adjust} />
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

      {/* Controls toggle */}
      <button
        type="button"
        onClick={() => setShowControls((v) => !v)}
        aria-label="Toggle photo adjustment controls"
        aria-expanded={showControls}
        className="glass absolute right-2 top-2 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground/80 transition hover:text-foreground"
      >
        <Settings2 className="h-4 w-4" />
      </button>

      {/* Slider panel */}
      {showControls && (
        <div className="glass absolute bottom-2 left-2 right-2 z-10 space-y-3 rounded-2xl p-4 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-medium uppercase tracking-widest text-muted-foreground">
              Photo tuning
            </span>
            <button
              type="button"
              onClick={() => setAdjust(DEFAULT_ADJUST)}
              className="text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
            >
              Reset
            </button>
          </div>

          <AdjustSlider
            label="Brightness"
            value={adjust.brightness}
            min={0.5}
            max={2}
            onChange={(v) => setAdjust((a) => ({ ...a, brightness: v }))}
          />
          <AdjustSlider
            label="Contrast"
            value={adjust.contrast}
            min={0.5}
            max={2}
            onChange={(v) => setAdjust((a) => ({ ...a, contrast: v }))}
          />
          <AdjustSlider
            label="Saturation"
            value={adjust.saturation}
            min={0}
            max={2}
            onChange={(v) => setAdjust((a) => ({ ...a, saturation: v }))}
          />
        </div>
      )}
    </div>
  );
}

function AdjustSlider({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-muted-foreground">
        <span>{label}</span>
        <span className="tabular-nums text-foreground/80">
          {value.toFixed(2)}
        </span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={0.01}
        onValueChange={(v) => onChange(v[0] ?? value)}
      />
    </div>
  );
}
