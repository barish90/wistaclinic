'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useGsap } from '@/app/hooks/useGsap';

interface KineticPrismHeroProps {
  locale: string;
  dict: any;
}

/* ── Three.js Scene (SSR disabled) ── */
const ThreeScene = dynamic(() => Promise.resolve(ThreeSceneInner), {
  ssr: false,
});

/* ── Face data for canvas textures (defaults) ── */
const DEFAULT_FACES = [
  {
    bg: '#2A2520',
    kicker: '',
    title: 'WISTA CLINIC',
    subtitle: 'Rotate to Discover',
    description: 'Istanbul\'s Premier Surgical Destination',
  },
  {
    bg: '#3D2E1F',
    kicker: 'THE SURFACE',
    title: 'Hair\nRestoration',
    subtitle: '',
    description: 'Precision at the follicle level',
  },
  {
    bg: '#2E3025',
    kicker: 'THE FORM',
    title: 'Breast\nAugmentation',
    subtitle: '',
    description: 'Natural proportions, sculpted with artistry',
  },
  {
    bg: '#352025',
    kicker: 'THE SPIRIT',
    title: 'BBL & Body\nContouring',
    subtitle: '',
    description: 'Harmonious curves, architectural balance',
  },
];

/* ── Canvas texture generator ── */
function createFaceTexture(
  face: (typeof DEFAULT_FACES)[number],
  width: number,
  height: number,
  isFront: boolean
) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas; // Fallback: return blank canvas

  // Background
  ctx.fillStyle = face.bg;
  ctx.fillRect(0, 0, width, height);

  // Subtle grain noise
  const imageData = ctx.getImageData(0, 0, width, height);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 12;
    imageData.data[i] += noise;
    imageData.data[i + 1] += noise;
    imageData.data[i + 2] += noise;
  }
  ctx.putImageData(imageData, 0, 0);

  // Subtle inner border
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.15)';
  ctx.lineWidth = 2;
  const inset = 40;
  ctx.strokeRect(inset, inset, width - inset * 2, height - inset * 2);

  // Corner accents
  const cornerLen = 30;
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
  ctx.lineWidth = 1.5;
  // Top-left
  ctx.beginPath();
  ctx.moveTo(inset, inset + cornerLen);
  ctx.lineTo(inset, inset);
  ctx.lineTo(inset + cornerLen, inset);
  ctx.stroke();
  // Top-right
  ctx.beginPath();
  ctx.moveTo(width - inset - cornerLen, inset);
  ctx.lineTo(width - inset, inset);
  ctx.lineTo(width - inset, inset + cornerLen);
  ctx.stroke();
  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(inset, height - inset - cornerLen);
  ctx.lineTo(inset, height - inset);
  ctx.lineTo(inset + cornerLen, height - inset);
  ctx.stroke();
  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(width - inset - cornerLen, height - inset);
  ctx.lineTo(width - inset, height - inset);
  ctx.lineTo(width - inset, height - inset - cornerLen);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (isFront) {
    // Front face: brand title
    // Small label above
    ctx.fillStyle = 'rgba(212, 175, 55, 0.7)';
    ctx.font = `${width * 0.022}px Georgia, "Times New Roman", serif`;
    ctx.letterSpacing = '8px';
    ctx.fillText(face.description.toUpperCase(), width / 2, height * 0.34);

    // Main title
    ctx.fillStyle = '#FFF8E7';
    ctx.font = `200 ${width * 0.09}px Georgia, "Times New Roman", serif`;
    ctx.letterSpacing = '12px';
    ctx.fillText(face.title, width / 2, height * 0.48);

    // Decorative line
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width * 0.38, height * 0.58);
    ctx.lineTo(width * 0.62, height * 0.58);
    ctx.stroke();

    // Subtitle
    ctx.fillStyle = 'rgba(255, 248, 231, 0.4)';
    ctx.font = `${width * 0.025}px Georgia, "Times New Roman", serif`;
    ctx.letterSpacing = '6px';
    ctx.fillText(face.subtitle.toUpperCase(), width / 2, height * 0.65);
  } else {
    // Service faces
    // Kicker
    ctx.fillStyle = '#D4AF37';
    ctx.font = `${width * 0.022}px Georgia, "Times New Roman", serif`;
    ctx.letterSpacing = '8px';
    ctx.fillText(face.kicker, width / 2, height * 0.30);

    // Decorative line above title
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width * 0.43, height * 0.35);
    ctx.lineTo(width * 0.57, height * 0.35);
    ctx.stroke();

    // Title (handle multiline)
    ctx.fillStyle = '#FFF8E7';
    const titleLines = face.title.split('\n');
    const titleSize = width * 0.065;
    ctx.font = `300 ${titleSize}px Georgia, "Times New Roman", serif`;
    const lineHeight = titleSize * 1.25;
    const titleStartY = height * 0.48 - ((titleLines.length - 1) * lineHeight) / 2;
    titleLines.forEach((line, i) => {
      ctx.fillText(line, width / 2, titleStartY + i * lineHeight);
    });

    // Description
    ctx.fillStyle = 'rgba(255, 248, 231, 0.5)';
    ctx.font = `${width * 0.024}px Georgia, "Times New Roman", serif`;
    ctx.letterSpacing = '2px';
    ctx.fillText(face.description, width / 2, height * 0.68);
  }

  return canvas;
}

function ThreeSceneInner({
  progress,
  mousePos,
  canvasRef,
}: {
  progress: number;
  mousePos: { x: number; y: number };
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}) {
  const rendererRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const prismRef = useRef<any>(null);
  const sceneRef = useRef<any>(null);
  const frameRef = useRef<number>(0);
  const currentTiltRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef(0);

  useEffect(() => {
    const THREE = require('three');
    const canvas = canvasRef.current;
    if (!canvas) return;

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    /* ── Scene ── */
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#FFF8E7');
    sceneRef.current = scene;

    /* ── Camera ── */
    const camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.3, 7);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    /* ── Lighting ── */
    // Warm directional from upper-right
    const dirLight = new THREE.DirectionalLight(0xfff0d4, 1.8);
    dirLight.position.set(4, 5, 3);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 20;
    dirLight.shadow.camera.left = -5;
    dirLight.shadow.camera.right = 5;
    dirLight.shadow.camera.top = 5;
    dirLight.shadow.camera.bottom = -5;
    dirLight.shadow.bias = -0.001;
    dirLight.shadow.radius = 4;
    scene.add(dirLight);

    // Fill light from left
    const fillLight = new THREE.DirectionalLight(0xf5e1a4, 0.4);
    fillLight.position.set(-3, 2, 2);
    scene.add(fillLight);

    // Soft ambient
    const ambientLight = new THREE.AmbientLight(0xfff8e7, 0.5);
    scene.add(ambientLight);

    // Subtle rim light from behind
    const rimLight = new THREE.PointLight(0xd4af37, 0.6, 15);
    rimLight.position.set(0, 1, -4);
    scene.add(rimLight);

    /* ── Create face textures ── */
    const texResolution = 1024;
    const texHeight = 640;
    const textures = DEFAULT_FACES.map((face, i) => {
      const texCanvas = createFaceTexture(face, texResolution, texHeight, i === 0);
      const tex = new THREE.CanvasTexture(texCanvas);
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      return tex;
    });

    /* ── Prism geometry & materials ── */
    // Box: wide front, moderate depth
    const boxW = 4.0;
    const boxH = 2.5;
    const boxD = 2.5;
    const geometry = new THREE.BoxGeometry(boxW, boxH, boxD);

    // Material order for BoxGeometry faces: +X, -X, +Y, -Y, +Z, -Z
    // We want: Front(+Z)=FACES[0], Right(+X)=FACES[1], Back(-Z)=FACES[2], Left(-X)=FACES[3]
    // Top/Bottom get a neutral dark material
    const neutralMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1E1A16'),
      metalness: 0.2,
      roughness: 0.5,
    });

    const makeFaceMat = (tex: any) =>
      new THREE.MeshStandardMaterial({
        map: tex,
        metalness: 0.15,
        roughness: 0.55,
      });

    // BoxGeometry face order: [+X, -X, +Y, -Y, +Z, -Z]
    const materials = [
      makeFaceMat(textures[1]), // +X = Right = Hair
      makeFaceMat(textures[3]), // -X = Left = BBL
      neutralMat,               // +Y = Top
      neutralMat,               // -Y = Bottom
      makeFaceMat(textures[0]), // +Z = Front = Branding
      makeFaceMat(textures[2]), // -Z = Back = Breast
    ];

    const prism = new THREE.Mesh(geometry, materials);
    prism.castShadow = true;
    prism.receiveShadow = false;
    prism.position.y = 0.15;
    scene.add(prism);
    prismRef.current = prism;

    /* ── Shadow floor ── */
    const floorGeo = new THREE.PlaneGeometry(20, 20);
    const floorMat = new THREE.ShadowMaterial({
      opacity: 0.12,
      color: 0x2a2520,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -boxH / 2 - 0.3;
    floor.receiveShadow = true;
    scene.add(floor);

    /* ── Resize ── */
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    /* ── Animation loop ── */
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      // Smooth magnetic tilt via lerp
      const lerpFactor = 0.04;
      currentTiltRef.current.x +=
        (mousePos.x * 0.05 - currentTiltRef.current.x) * lerpFactor;
      currentTiltRef.current.y +=
        (mousePos.y * 0.08 - currentTiltRef.current.y) * lerpFactor;

      if (prismRef.current) {
        // Scroll rotation + mouse tilt
        prismRef.current.rotation.y =
          targetRotationRef.current + currentTiltRef.current.x;
        prismRef.current.rotation.x = currentTiltRef.current.y;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      geometry.dispose();
      materials.forEach((m: any) => m.dispose?.());
      textures.forEach((t: any) => t.dispose?.());
    };
  }, [canvasRef]);

  /* ── Update rotation from scroll progress ── */
  useEffect(() => {
    // Map progress 0→1 to rotation 0 → -3π/2 (three 90° turns)
    // Phase 0 (0-0.10): rotation = 0
    // Phase 1 (0.10-0.35): rotation interpolates to -π/2
    // Phase 2 (0.35-0.60): rotation interpolates to -π
    // Phase 3 (0.60-0.85): rotation interpolates to -3π/2
    // Phase 4 (0.85-1.0): rotation stays at -3π/2

    let rotation = 0;
    const PI = Math.PI;

    if (progress <= 0.10) {
      rotation = 0;
    } else if (progress <= 0.35) {
      const t = (progress - 0.10) / 0.25;
      // Smooth ease in-out
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      rotation = -eased * (PI / 2);
    } else if (progress <= 0.60) {
      const t = (progress - 0.35) / 0.25;
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      rotation = -(PI / 2) - eased * (PI / 2);
    } else if (progress <= 0.85) {
      const t = (progress - 0.60) / 0.25;
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      rotation = -PI - eased * (PI / 2);
    } else {
      rotation = -(3 * PI) / 2;
    }

    targetRotationRef.current = rotation;
  }, [progress]);

  /* ── Update mouse tilt target (stored in ref, used in animate loop) ── */
  // mousePos is already reactive from parent

  return null;
}

/* ── Phase labels (defaults) ── */
const DEFAULT_PHASE_LABELS = ['Discover', 'Hair', 'Breast', 'Body', 'Begin'];

/* ── Main Component ── */
export default function KineticPrismHero({
  locale,
  dict,
}: KineticPrismHeroProps) {
  const { gsapReady } = useGsap();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const hasAnimated = useRef(false);

  // Build localized faces and labels from dict with fallbacks
  const kpDict = dict?.home?.kineticPrism ?? {} as Record<string, any>;
  const heroDict = dict?.home?.hero ?? {} as Record<string, string>;
  const FACES = (kpDict.faces as typeof DEFAULT_FACES | undefined) ?? DEFAULT_FACES;
  const PHASE_LABELS = (kpDict.phaseLabels as string[] | undefined) ?? DEFAULT_PHASE_LABELS;
  const trustSignals = (kpDict.trustSignals as string[] | undefined) ?? ['Board Certified', '15+ Years', '10,000+ Patients'];

  const handleProgress = useCallback((p: number) => {
    setScrollProgress(p);
  }, []);

  /* ── Mouse tracking ── */
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  /* ── GSAP ScrollTrigger ── */
  useEffect(() => {
    if (!gsapReady || hasAnimated.current || !containerRef.current) return;

    const gsap = (window as any).gsap;
    const ScrollTrigger = (window as any).ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);
    hasAnimated.current = true;

    const proxy = { progress: 0 };

    const tween = gsap.to(proxy, {
      progress: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=400%',
        pin: true,
        scrub: 1.5,
        onUpdate: (self: any) => {
          proxy.progress = self.progress;
          handleProgress(self.progress);
        },
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [gsapReady, handleProgress]);

  /* ── Phase detection ── */
  const getActivePhase = () => {
    if (scrollProgress < 0.10) return 0;
    if (scrollProgress < 0.35) return 1;
    if (scrollProgress < 0.60) return 2;
    if (scrollProgress < 0.85) return 3;
    return 4;
  };

  const activePhase = getActivePhase();

  /* ── CTA visibility ── */
  const ctaOpacity =
    scrollProgress > 0.88
      ? Math.min(1, (scrollProgress - 0.88) / 0.08)
      : 0;

  return (
    <section
      ref={containerRef}
      className="relative w-full"
      style={{ height: '100vh', background: '#FFF8E7' }}
    >
      {/* 3D Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
      />
      <ThreeScene
        progress={scrollProgress}
        mousePos={mousePos}
        canvasRef={canvasRef}
      />

      {/* Warm vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background:
            'radial-gradient(ellipse at center, transparent 50%, rgba(42,37,32,0.06) 100%)',
        }}
      />

      {/* ── Phase indicator (left side) ── */}
      <div
        className="absolute left-10 top-1/2 -translate-y-1/2 flex flex-col gap-6 pointer-events-none"
        style={{ zIndex: 10 }}
      >
        {PHASE_LABELS.map((label, i) => (
          <div key={i} className="flex items-center gap-3">
            <div
              className="transition-all duration-500"
              style={{
                width: activePhase === i ? '24px' : '8px',
                height: '2px',
                background:
                  activePhase === i
                    ? '#B8860B'
                    : 'rgba(42,37,32,0.15)',
              }}
            />
            <span
              className="transition-all duration-500"
              style={{
                fontSize: '11px',
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: activePhase === i ? 600 : 300,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color:
                  activePhase === i
                    ? '#B8860B'
                    : 'rgba(42,37,32,0.25)',
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* ── Scroll hint (Phase 0 only) ── */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none transition-opacity duration-500"
        style={{
          zIndex: 10,
          opacity: scrollProgress < 0.05 ? 1 : 0,
        }}
      >
        <p
          style={{
            fontSize: '10px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(42,37,32,0.3)',
            fontFamily: "'Cormorant Garamond', serif",
          }}
        >
          {heroDict.scrollLabel ?? 'Scroll to rotate'}
        </p>
        <div
          style={{
            width: '1px',
            height: '28px',
            background:
              'linear-gradient(to bottom, rgba(184,134,11,0.4), transparent)',
          }}
        />
      </div>

      {/* ── Phase service label (right side, shows during service phases) ── */}
      {activePhase >= 1 && activePhase <= 3 && (
        <div
          className="absolute right-10 top-1/2 -translate-y-1/2 text-right pointer-events-none"
          style={{
            zIndex: 10,
            opacity:
              activePhase >= 1 && activePhase <= 3
                ? (() => {
                    // Fade in/out at phase boundaries
                    const phases = [
                      [0.12, 0.33],
                      [0.37, 0.58],
                      [0.62, 0.83],
                    ];
                    const [start, end] = phases[activePhase - 1];
                    const fadeIn = start + 0.03;
                    const fadeOut = end - 0.03;
                    if (scrollProgress < fadeIn)
                      return (scrollProgress - start) / 0.03;
                    if (scrollProgress > fadeOut)
                      return (end - scrollProgress) / 0.03;
                    return 1;
                  })()
                : 0,
          }}
        >
          <p
            style={{
              fontSize: '11px',
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 400,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: '#B8860B',
              marginBottom: '8px',
            }}
          >
            {FACES[activePhase]?.kicker}
          </p>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(24px, 3vw, 40px)',
              fontWeight: 300,
              color: '#2A2520',
              lineHeight: 1.2,
              letterSpacing: '0.02em',
            }}
          >
            {FACES[activePhase]?.title.replace('\n', ' ')}
          </h2>
          <p
            className="mt-2"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '14px',
              fontWeight: 300,
              color: 'rgba(42,37,32,0.5)',
              letterSpacing: '0.04em',
            }}
          >
            {FACES[activePhase]?.description}
          </p>
        </div>
      )}

      {/* ── CTA overlay (Phase 4) ── */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-end pb-24 pointer-events-none"
        style={{
          zIndex: 10,
          opacity: ctaOpacity,
          transition: 'opacity 0.3s ease',
        }}
      >
        <p
          className="mb-3"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '12px',
            fontWeight: 400,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#B8860B',
          }}
        >
          {heroDict.ctaKicker ?? 'Your Transformation Awaits'}
        </p>
        <h2
          className="mb-6"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(28px, 3.5vw, 48px)',
            fontWeight: 200,
            color: '#2A2520',
            textAlign: 'center',
            letterSpacing: '0.04em',
          }}
        >
          {heroDict.ctaHeadline ?? 'Begin Your Journey'}
        </h2>
        <a
          href={`/${locale}/booking`}
          className="group relative overflow-hidden px-10 py-4 pointer-events-auto"
          style={{
            background: '#B8860B',
            color: '#FFF8E7',
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '13px',
            fontWeight: 400,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <span className="relative z-10">{heroDict.ctaPrimary ?? 'Book Consultation'}</span>
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: 'linear-gradient(135deg, #D4AF37, #B8860B)',
            }}
          />
        </a>

        <div className="flex items-center gap-8 mt-8">
          {trustSignals.map(
            (signal, i) => (
              <span
                key={i}
                style={{
                  fontSize: '10px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'rgba(42,37,32,0.25)',
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                {signal}
              </span>
            )
          )}
        </div>
      </div>

    </section>
  );
}
