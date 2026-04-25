import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { Slider } from "@/components/ui/slider";
import { Settings2 } from "lucide-react";
import bikkey1 from "@/assets/bikkey-1.png";
import bikkey2 from "@/assets/bikkey-2.png";
import bikkey3 from "@/assets/bikkey-3.png";

const photoUrls: string[] = [bikkey1, bikkey2, bikkey3];

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
 * A single front-facing photo plane that shows the full portrait. No spinning —
 * just a subtle pointer-driven parallax tilt and an auto-cycling carousel
 * through the available portraits.
 */
function PhotoPanel({
  pointer,
  adjust,
  photoIndex,
}: {
  pointer: { x: number; y: number };
  adjust: PhotoAdjust;
  photoIndex: number;
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

  // One material per texture, kept stable across renders.
  const materials = useMemo(
    () => textures.map((t) => makePhotoMaterial(t)),
    [textures],
  );

  // Push slider values into uniforms + apply gentle parallax tilt.
  useFrame(() => {
    materials.forEach((m) => {
      m.uniforms.uBrightness.value = adjust.brightness;
      m.uniforms.uContrast.value = adjust.contrast;
      m.uniforms.uSaturation.value = adjust.saturation;
    });
    const g = groupRef.current;
    if (!g) return;
    const targetY = pointer.x * 0.18;
    const targetX = pointer.y * 0.18;
    g.rotation.y += (targetY - g.rotation.y) * 0.08;
    g.rotation.x += (targetX - g.rotation.x) * 0.08;
  });

  // Plane sized to show the full portrait (taller than wide).
  const width = 2.4;
  const height = 3.0;

  return (
    <group ref={groupRef}>
      {/* Decorative glowing frame behind the photo */}
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[width + 0.18, height + 0.18]} />
        <meshBasicMaterial color="#7c5cff" toneMapped={false} />
      </mesh>

      {/* Cross-fade all photos by toggling material opacity */}
      {textures.map((_, i) => (
        <mesh key={i} position={[0, 0, i * 0.001]} material={materials[i]}>
          <planeGeometry args={[width, height]} />
        </mesh>
      ))}

      {/* Visibility toggle for the carousel — the active one renders on top */}
      <FadePhotos materials={materials} activeIndex={photoIndex} />

      {/* Glowing accent ring under the panel */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -height / 2 - 0.15, 0]}>
        <torusGeometry args={[width * 0.55, 0.025, 16, 64]} />
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

/**
 * Drives a smooth opacity cross-fade between the photo materials so only the
 * active portrait is visible at full strength.
 */
function FadePhotos({
  materials,
  activeIndex,
}: {
  materials: THREE.ShaderMaterial[];
  activeIndex: number;
}) {
  // Initial setup: enable transparency on all photo materials.
  useEffect(() => {
    materials.forEach((m, i) => {
      m.transparent = true;
      m.uniforms.uOpacity = { value: i === activeIndex ? 1 : 0 };
      // Patch the fragment shader once to honor uOpacity.
      if (!m.userData.opacityPatched) {
        m.fragmentShader = m.fragmentShader.replace(
          "uniform float uSaturation;",
          "uniform float uSaturation;\nuniform float uOpacity;",
        );
        m.fragmentShader = m.fragmentShader.replace(
          "gl_FragColor = vec4(clamp(c, 0.0, 1.0), tex.a);",
          "gl_FragColor = vec4(clamp(c, 0.0, 1.0), tex.a * uOpacity);",
        );
        m.needsUpdate = true;
        m.userData.opacityPatched = true;
      }
    });
  }, [materials, activeIndex]);

  useFrame((_, delta) => {
    materials.forEach((m, i) => {
      const target = i === activeIndex ? 1 : 0;
      const u = m.uniforms.uOpacity;
      if (u) u.value += (target - u.value) * Math.min(1, delta * 3);
    });
  });
  return null;
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
  const [photoIndex, setPhotoIndex] = useState(0);

  // Auto-cycle through portraits without rotating the mesh.
  useEffect(() => {
    const id = setInterval(
      () => setPhotoIndex((i) => (i + 1) % photoUrls.length),
      4500,
    );
    return () => clearInterval(id);
  }, []);

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
            <PhotoPanel
              pointer={pointer}
              adjust={adjust}
              photoIndex={photoIndex}
            />
            <OrbitingDots />
            <ContactShadows
              position={[0, -2.0, 0]}
              opacity={0.4}
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
