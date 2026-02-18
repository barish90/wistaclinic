'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useGsap } from '@/app/hooks/useGsap';

interface GlassLayersHeroProps {
  locale: string;
  dict: any;
}

/* ── Three.js Scene (loaded dynamically, SSR disabled) ── */
const ThreeScene = dynamic(() => Promise.resolve(ThreeSceneInner), {
  ssr: false,
});

function ThreeSceneInner({
  progress,
  canvasRef,
}: {
  progress: number;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}) {
  const rendererRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const planesRef = useRef<any[]>([]);
  const particlesRef = useRef<any>(null);
  const sceneRef = useRef<any>(null);
  const frameRef = useRef<number>(0);
  const burstParticlesRef = useRef<any[]>([]);

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
    renderer.toneMappingExposure = 1.5;
    rendererRef.current = renderer;

    /* ── Scene ── */
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#1A1714');
    sceneRef.current = scene;

    /* ── Camera ── */
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 6);
    cameraRef.current = camera;

    /* ── Lights ── */
    const ambientLight = new THREE.AmbientLight(0xfff8e7, 0.4);
    scene.add(ambientLight);

    // Warm champagne key light from above-front
    const keyLight = new THREE.PointLight(0xf5e1a4, 3, 30);
    keyLight.position.set(0, 3, 6);
    scene.add(keyLight);

    // Bronze fill lights on sides
    const fillLeft = new THREE.PointLight(0xb8860b, 1.5, 15);
    fillLeft.position.set(-3, 0, 3);
    scene.add(fillLeft);

    const fillRight = new THREE.PointLight(0xd4af37, 1.5, 15);
    fillRight.position.set(3, 0, 1);
    scene.add(fillRight);

    // Backlight for rim glow
    const backLight = new THREE.PointLight(0xd4af37, 2, 12);
    backLight.position.set(0, 0, -2);
    scene.add(backLight);

    /* ── Glass Plane Builder ── */
    const planePositions = [4, 2, 0];
    const planes: any[] = [];

    /* Custom frosted glass shader */
    const glassVertexShader = `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vWorldPosition;
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPos.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `;

    const glassFragmentShader = `
      uniform float uOpacity;
      uniform float uTime;
      uniform vec3 uCameraPos;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vWorldPosition;

      // Noise function for frosted texture
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }

      void main() {
        // View-dependent fresnel for glass edge glow
        vec3 viewDir = normalize(uCameraPos - vWorldPosition);
        float fresnel = 1.0 - abs(dot(viewDir, vNormal));
        fresnel = pow(fresnel, 2.0);

        // Frosted noise pattern
        float frost = noise(vUv * 20.0 + uTime * 0.3) * 0.5
                    + noise(vUv * 40.0 - uTime * 0.15) * 0.3
                    + noise(vUv * 8.0 + uTime * 0.1) * 0.2;

        // Edge glow (stronger at edges of rectangle)
        float edgeX = smoothstep(0.0, 0.08, vUv.x) * smoothstep(1.0, 0.92, vUv.x);
        float edgeY = smoothstep(0.0, 0.08, vUv.y) * smoothstep(1.0, 0.92, vUv.y);
        float edgeMask = 1.0 - edgeX * edgeY;

        // Glass body: champagne tinted, frosted
        vec3 glassColor = vec3(0.96, 0.88, 0.64); // champagne
        vec3 edgeColor = vec3(0.83, 0.69, 0.22);  // gold
        vec3 rimColor = vec3(0.72, 0.53, 0.04);   // bronze

        // Combine: frosted center + bright edges
        vec3 bodyColor = mix(glassColor, vec3(1.0), frost * 0.15);
        vec3 finalColor = mix(bodyColor, edgeColor, edgeMask * 0.8);
        finalColor += rimColor * fresnel * 1.5;

        // Opacity: frosted glass body + bright edge border
        float bodyAlpha = 0.12 + frost * 0.08;
        float edgeAlpha = edgeMask * 0.7;
        float fresnelAlpha = fresnel * 0.5;
        float alpha = (bodyAlpha + edgeAlpha + fresnelAlpha) * uOpacity;

        gl_FragColor = vec4(finalColor, alpha);
      }
    `;

    planePositions.forEach((zPos, idx) => {
      const group = new THREE.Group();

      // Main glass panel with custom shader
      const planeGeo = new THREE.PlaneGeometry(3.6, 2.2, 1, 1);
      const glassMat = new THREE.ShaderMaterial({
        vertexShader: glassVertexShader,
        fragmentShader: glassFragmentShader,
        uniforms: {
          uOpacity: { value: 1.0 },
          uTime: { value: 0 },
          uCameraPos: { value: new THREE.Vector3(0, 0, 6) },
        },
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const glassPlane = new THREE.Mesh(planeGeo, glassMat);
      group.add(glassPlane);

      // Bright border frame using thin box geometries (since linewidth is capped at 1)
      const borderThickness = 0.02;
      const borderDepth = 0.01;
      const w = 3.6;
      const h = 2.2;
      const borderMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color('#D4AF37'),
        transparent: true,
        opacity: 0.85,
      });

      // Top edge
      const topBar = new THREE.Mesh(
        new THREE.BoxGeometry(w + borderThickness, borderThickness, borderDepth),
        borderMat
      );
      topBar.position.y = h / 2;
      group.add(topBar);

      // Bottom edge
      const bottomBar = new THREE.Mesh(
        new THREE.BoxGeometry(w + borderThickness, borderThickness, borderDepth),
        borderMat.clone()
      );
      bottomBar.position.y = -h / 2;
      group.add(bottomBar);

      // Left edge
      const leftBar = new THREE.Mesh(
        new THREE.BoxGeometry(borderThickness, h, borderDepth),
        borderMat.clone()
      );
      leftBar.position.x = -w / 2;
      group.add(leftBar);

      // Right edge
      const rightBar = new THREE.Mesh(
        new THREE.BoxGeometry(borderThickness, h, borderDepth),
        borderMat.clone()
      );
      rightBar.position.x = w / 2;
      group.add(rightBar);

      // Soft glow halo behind the panel
      const glowGeo = new THREE.PlaneGeometry(4.4, 3.0, 1, 1);
      const glowMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color('#D4AF37'),
        transparent: true,
        opacity: 0.06,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const glowPlane = new THREE.Mesh(glowGeo, glowMat);
      glowPlane.position.z = -0.05;
      group.add(glowPlane);

      group.position.z = zPos;
      scene.add(group);

      planes.push({
        group,
        glassMat,
        borderMat,
        glowMat,
        borders: [topBar, bottomBar, leftBar, rightBar],
        zPos,
        idx,
      });
    });
    planesRef.current = planes;

    /* ── Burst particles (one set per plane, initially hidden) ── */
    const bursts: any[] = [];
    planePositions.forEach((zPos) => {
      const count = 120;
      const positions = new Float32Array(count * 3);
      const velocities = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        // Start clustered at plane position
        positions[i * 3] = (Math.random() - 0.5) * 3.6;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 2.2;
        positions[i * 3 + 2] = zPos;
        // Random outward velocity
        velocities[i * 3] = (Math.random() - 0.5) * 0.06;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.04;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.08;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.PointsMaterial({
        color: new THREE.Color('#D4AF37'),
        size: 0.04,
        transparent: true,
        opacity: 0,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const points = new THREE.Points(geo, mat);
      scene.add(points);
      bursts.push({ points, mat, geo, velocities, zPos, active: false, life: 0 });
    });
    burstParticlesRef.current = bursts;

    /* ── Ambient Particles ── */
    const particleCount = 600;
    const pPositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 12;
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pPositions[i * 3 + 2] = Math.random() * 10 - 3;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: new THREE.Color('#D4AF37'),
      size: 0.035,
      transparent: true,
      opacity: 0.45,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    /* ── Resize ── */
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    /* ── Animation Loop ── */
    let time = 0;
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      time += 0.008;

      // Update glass shader time uniform
      planes.forEach((p) => {
        p.glassMat.uniforms.uTime.value = time;
        p.glassMat.uniforms.uCameraPos.value.copy(camera.position);
      });

      // Gentle particle drift
      if (particlesRef.current) {
        const posAttr = particlesRef.current.geometry.getAttribute('position');
        for (let i = 0; i < posAttr.count; i++) {
          posAttr.array[i * 3 + 1] += Math.sin(time * 0.8 + i * 0.1) * 0.0004;
          posAttr.array[i * 3] += Math.cos(time * 0.6 + i * 0.15) * 0.0003;
        }
        posAttr.needsUpdate = true;
      }

      // Subtle plane breathing
      planes.forEach((p, i) => {
        p.group.rotation.y = Math.sin(time * 0.4 + i * 1.2) * 0.02;
        p.group.rotation.x = Math.cos(time * 0.25 + i * 0.8) * 0.01;
      });

      // Animate burst particles
      bursts.forEach((b) => {
        if (b.active && b.life > 0) {
          b.life -= 0.015;
          b.mat.opacity = Math.max(0, b.life * 0.8);
          const posAttr = b.geo.getAttribute('position');
          for (let i = 0; i < posAttr.count; i++) {
            posAttr.array[i * 3] += b.velocities[i * 3];
            posAttr.array[i * 3 + 1] += b.velocities[i * 3 + 1];
            posAttr.array[i * 3 + 2] += b.velocities[i * 3 + 2];
          }
          posAttr.needsUpdate = true;
          if (b.life <= 0) {
            b.active = false;
            b.mat.opacity = 0;
          }
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, [canvasRef]);

  /* ── Update camera & planes on scroll progress ── */
  useEffect(() => {
    if (!cameraRef.current || !planesRef.current.length) return;

    // Camera z: 6 → -2 over full scroll
    const camZ = 6 - progress * 8;
    cameraRef.current.position.z = camZ;

    // Update each glass plane
    planesRef.current.forEach((p) => {
      const dist = camZ - p.zPos;

      // Opacity: full when far, fade as camera approaches and passes through
      let opacity: number;
      if (dist > 2.0) {
        opacity = 1;
      } else if (dist > -0.3) {
        opacity = Math.max(0, (dist + 0.3) / 2.3);
      } else {
        opacity = 0;
      }

      // Update glass shader opacity
      p.glassMat.uniforms.uOpacity.value = opacity;

      // Update border opacity
      p.borders.forEach((bar: any) => {
        bar.material.opacity = 0.85 * opacity;
      });

      // Glow
      p.glowMat.opacity = 0.06 * opacity;

      // Scale up as camera approaches (creates dramatic fly-through feeling)
      let scale = 1;
      if (dist > 0 && dist < 2.5) {
        const t = 1 - dist / 2.5; // 0 at far, 1 at plane
        scale = 1 + t * 0.4; // grows up to 1.4x
      }
      p.group.scale.set(scale, scale, 1);

      // Trigger burst when passing through
      if (burstParticlesRef.current) {
        const burst = burstParticlesRef.current[p.idx];
        if (dist < 0.3 && dist > -0.3 && !burst.active) {
          burst.active = true;
          burst.life = 1.0;
          // Reset positions to plane location
          const posAttr = burst.geo.getAttribute('position');
          for (let i = 0; i < posAttr.count; i++) {
            posAttr.array[i * 3] = (Math.random() - 0.5) * 3.6;
            posAttr.array[i * 3 + 1] = (Math.random() - 0.5) * 2.2;
            posAttr.array[i * 3 + 2] = p.zPos;
          }
          posAttr.needsUpdate = true;
        }
        // Reset burst availability once camera moves past
        if (dist < -1.0 && burst.life <= 0) {
          burst.active = false;
        }
      }
    });
  }, [progress]);

  return null;
}

/* ── Phase content data ── */
const PHASES = [
  {
    kicker: 'THE SURFACE',
    title: 'Hair Restoration',
    description: 'Precision at the follicle level',
  },
  {
    kicker: 'THE FORM',
    title: 'Breast Augmentation',
    description: 'Natural proportions, sculpted with artistry',
  },
  {
    kicker: 'THE SPIRIT',
    title: 'BBL & Body Contouring',
    description: 'Harmonious curves, architectural balance',
  },
];

/* ── Main Component ── */
export default function GlassLayersHero({ locale, dict }: GlassLayersHeroProps) {
  const { gsapReady } = useGsap();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const hasAnimated = useRef(false);

  const handleProgress = useCallback((p: number) => {
    setScrollProgress(p);
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
        scrub: 0.8,
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

  /* ── Phase visibility ── */
  const getPhaseOpacity = (phaseIndex: number) => {
    const ranges = [
      [0, 0.15],
      [0.15, 0.40],
      [0.40, 0.65],
      [0.65, 0.85],
      [0.85, 1.0],
    ];
    const [start, end] = ranges[phaseIndex];
    const dur = end - start;
    const fadeInEnd = start + dur * 0.15;
    const fadeOutStart = end - dur * 0.15;

    if (scrollProgress < start) return phaseIndex === 0 ? 1 : 0;
    if (scrollProgress > end) return phaseIndex === 4 ? 1 : 0;
    if (scrollProgress < fadeInEnd) {
      if (phaseIndex === 0) return 1;
      return (scrollProgress - start) / (fadeInEnd - start);
    }
    if (scrollProgress > fadeOutStart) {
      if (phaseIndex === 4) return 1;
      return (end - scrollProgress) / (end - fadeOutStart);
    }
    return 1;
  };

  const getPhaseTransform = (phaseIndex: number) => {
    const opacity = getPhaseOpacity(phaseIndex);
    const translateY = opacity < 1 ? (1 - opacity) * 30 : 0;
    return { opacity, transform: `translateY(${translateY}px)` };
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full"
      style={{ height: '100vh' }}
    >
      {/* 3D Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
      />
      <ThreeScene progress={scrollProgress} canvasRef={canvasRef} />

      {/* Subtle vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(26,23,20,0.5) 100%)',
        }}
      />

      {/* ── Phase 0: Opening ── */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
        style={{ zIndex: 10, ...getPhaseTransform(0) }}
      >
        <p
          className="uppercase tracking-[0.35em] mb-4"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '13px',
            fontWeight: 300,
            color: '#B8860B',
          }}
        >
          Istanbul&apos;s Premier Destination
        </p>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(42px, 7vw, 96px)',
            fontWeight: 200,
            color: '#FFF8E7',
            letterSpacing: '0.08em',
            lineHeight: 1,
            textAlign: 'center',
            textShadow: '0 2px 30px rgba(212,175,55,0.15)',
          }}
        >
          WISTA CLINIC
        </h1>
        <p
          className="mt-6"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(14px, 2vw, 20px)',
            fontWeight: 300,
            color: 'rgba(255,248,231,0.5)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          Three Layers of Transformation
        </p>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-12 flex flex-col items-center gap-2"
          style={{ opacity: Math.max(0, 1 - scrollProgress * 10) }}
        >
          <p
            style={{
              fontSize: '10px',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'rgba(255,248,231,0.3)',
            }}
          >
            Scroll to explore
          </p>
          <div
            className="w-[1px] h-8"
            style={{
              background:
                'linear-gradient(to bottom, rgba(184,134,11,0.5), transparent)',
            }}
          />
        </div>
      </div>

      {/* ── Phases 1–3: Services ── */}
      {PHASES.map((phase, i) => (
        <div
          key={i}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          style={{ zIndex: 10, ...getPhaseTransform(i + 1) }}
        >
          <p
            className="uppercase tracking-[0.3em] mb-3"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '12px',
              fontWeight: 400,
              color: '#B8860B',
              letterSpacing: '0.3em',
            }}
          >
            {phase.kicker}
          </p>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(36px, 5vw, 64px)',
              fontWeight: 300,
              color: '#FFF8E7',
              letterSpacing: '0.04em',
              lineHeight: 1.1,
              textAlign: 'center',
              textShadow: '0 2px 20px rgba(0,0,0,0.4)',
            }}
          >
            {phase.title}
          </h2>
          <p
            className="mt-4"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '16px',
              fontWeight: 300,
              color: 'rgba(255,248,231,0.6)',
              letterSpacing: '0.05em',
            }}
          >
            {phase.description}
          </p>

          {/* Decorative line */}
          <div
            className="mt-6 h-[1px] w-16"
            style={{
              background:
                'linear-gradient(to right, transparent, #B8860B, transparent)',
            }}
          />
        </div>
      ))}

      {/* ── Phase 4: CTA ── */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ zIndex: 10, ...getPhaseTransform(4) }}
      >
        <p
          className="uppercase tracking-[0.3em] mb-4"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '12px',
            fontWeight: 400,
            color: '#B8860B',
          }}
        >
          Your Journey Begins
        </p>
        <h2
          className="mb-8"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(32px, 4.5vw, 56px)',
            fontWeight: 200,
            color: '#FFF8E7',
            letterSpacing: '0.06em',
            textAlign: 'center',
            lineHeight: 1.2,
          }}
        >
          Begin Your
          <br />
          Transformation
        </h2>

        <a
          href={`/${locale}/booking`}
          className="group relative overflow-hidden px-10 py-4 pointer-events-auto"
          style={{
            background: '#B8860B',
            color: '#FFF8E7',
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '14px',
            fontWeight: 400,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <span className="relative z-10">Book Consultation</span>
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: 'linear-gradient(135deg, #D4AF37, #B8860B)',
            }}
          />
        </a>

        {/* Trust signals */}
        <div className="flex items-center gap-8 mt-10">
          {['Board Certified', '15+ Years', '10,000+ Patients'].map(
            (signal, i) => (
              <span
                key={i}
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,248,231,0.3)',
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                {signal}
              </span>
            )
          )}
        </div>
      </div>

      {/* ── Progress dots ── */}
      <div
        className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 pointer-events-none"
        style={{ zIndex: 20 }}
      >
        {[0, 0.15, 0.4, 0.65, 0.85].map((threshold, i) => {
          const nextThreshold = [0.15, 0.4, 0.65, 0.85, 1.0][i];
          const isActive =
            scrollProgress >= threshold && scrollProgress < nextThreshold;
          return (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full transition-all duration-300"
              style={{
                background: isActive ? '#D4AF37' : 'rgba(255,248,231,0.2)',
                transform: isActive ? 'scale(1.5)' : 'scale(1)',
                boxShadow: isActive
                  ? '0 0 8px rgba(212,175,55,0.5)'
                  : 'none',
              }}
            />
          );
        })}
      </div>

    </section>
  );
}
