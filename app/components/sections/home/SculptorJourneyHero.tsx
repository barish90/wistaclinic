'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { useGsap } from '@/app/hooks/useGsap';

interface SculptorJourneyHeroProps {
  locale: string;
}

/* ══════════════════════════════════════════════════════════════
   SHAPE GENERATORS
   ══════════════════════════════════════════════════════════════ */

const PC = 5500; // particle count

/**
 * Tight origin point — all particles start here, then explode outward.
 */
function generateOrigin(): Float32Array {
  const p = new Float32Array(PC * 3);
  for (let i = 0; i < PC; i++) {
    const r = Math.random() * 0.04;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    p[i * 3] = r * Math.sin(ph) * Math.cos(th);
    p[i * 3 + 1] = 0.7 + r * Math.cos(ph);
    p[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
  }
  return p;
}

/**
 * Chaotic spiral — transitional state between origin and body forms.
 */
function generateChaos(): Float32Array {
  const p = new Float32Array(PC * 3);
  for (let i = 0; i < PC; i++) {
    const angle = Math.random() * Math.PI * 6;
    const r = Math.pow(Math.random(), 0.55) * 4.5;
    const spiral = angle * 0.15;
    p[i * 3] = Math.cos(angle + spiral) * r + (Math.random() - 0.5) * 1.2;
    p[i * 3 + 1] = (Math.random() - 0.5) * 5.5;
    p[i * 3 + 2] = Math.sin(angle + spiral) * r + (Math.random() - 0.5) * 1.2;
  }
  return p;
}

/**
 * Torso — athletic male-like upper body silhouette.
 * Uses continuous radial profile for smooth, recognizable contours.
 * 85% of particles on the shell surface for crisp silhouette definition.
 */
function generateTorso(): Float32Array {
  const p = new Float32Array(PC * 3);
  let idx = 0;
  const put = (x: number, y: number, z: number) => {
    if (idx >= PC * 3) return;
    p[idx++] = x; p[idx++] = y; p[idx++] = z;
  };

  // Continuous radial cross-section: h ∈ [0, 1] → { rx, rz }
  const profile = (h: number): { rx: number; rz: number } => {
    // Head (sphere): 0.84–1.0
    if (h > 0.84) {
      const t = (h - 0.84) / 0.16;
      const r = 0.22 * Math.sqrt(Math.max(0, 1 - Math.pow(t * 2 - 1, 2)));
      return { rx: r + 0.015, rz: r * 0.85 };
    }
    // Neck: 0.78–0.84
    if (h > 0.78) {
      const t = (h - 0.78) / 0.06;
      const neckR = 0.09 + t * 0.035;
      return { rx: neckR, rz: neckR * 0.85 };
    }
    // Shoulder slope: 0.69–0.78
    if (h > 0.69) {
      const t = (h - 0.69) / 0.09;
      const ease = t * t * (3 - 2 * t); // smoothstep
      return { rx: 0.125 + ease * 0.44, rz: 0.095 + ease * 0.14 };
    }
    // Upper chest: 0.60–0.69
    if (h > 0.60) {
      const t = (h - 0.60) / 0.09;
      return { rx: 0.565 - t * 0.04, rz: 0.235 - t * 0.01 };
    }
    // Mid torso: 0.48–0.60
    if (h > 0.48) {
      const t = (h - 0.48) / 0.12;
      return { rx: 0.525 - t * 0.13, rz: 0.225 - t * 0.035 };
    }
    // Waist: 0.40–0.48
    if (h > 0.40) {
      const t = (h - 0.40) / 0.08;
      return { rx: 0.395 + t * 0.02, rz: 0.19 + t * 0.005 };
    }
    // Hips/pelvis: 0.28–0.40
    if (h > 0.28) {
      const t = (h - 0.28) / 0.12;
      const hipCurve = Math.sin(t * Math.PI);
      return { rx: 0.415 + hipCurve * 0.06, rz: 0.195 + hipCurve * 0.035 };
    }
    // Upper legs: 0.0–0.28
    const t = h / 0.28;
    return { rx: 0.115 + t * 0.08, rz: 0.11 + t * 0.04 };
  };

  // Main body shell — bias toward surface for crisp silhouette
  const mainCount = Math.floor(PC * 0.72);
  for (let i = 0; i < mainCount; i++) {
    const h = Math.random();
    const y = -0.7 + h * 2.85;
    const { rx, rz } = profile(h);
    const a = Math.random() * Math.PI * 2;
    // 85% shell, 15% interior
    const shell = Math.random() < 0.85;
    const rFact = shell ? (0.88 + Math.random() * 0.12) : (Math.random() * 0.85);
    const scatter = shell ? 0.012 : 0.02;

    if (h < 0.28) {
      // Two separate leg cylinders
      const side = Math.random() > 0.5 ? 1 : -1;
      const sep = 0.17 * (0.6 + (h / 0.28) * 0.4);
      put(
        side * sep + rx * rFact * Math.cos(a) + (Math.random() - 0.5) * scatter,
        y + (Math.random() - 0.5) * scatter,
        rz * rFact * Math.sin(a) + (Math.random() - 0.5) * scatter
      );
    } else {
      put(
        rx * rFact * Math.cos(a) + (Math.random() - 0.5) * scatter,
        y + (Math.random() - 0.5) * scatter,
        rz * rFact * Math.sin(a) + (Math.random() - 0.5) * scatter
      );
    }
  }

  // Arms (slightly away from body, natural hang)
  const armCount = Math.floor(PC * 0.11);
  for (let i = 0; i < armCount; i++) {
    const side = Math.random() > 0.5 ? 1 : -1;
    const t = Math.random(); // 0=shoulder, 1=hand
    const y = 1.65 - t * 1.15;
    const armR = 0.075 - t * 0.022;
    const a = Math.random() * Math.PI * 2;
    const shell = Math.random() < 0.8;
    const r = shell ? armR * (0.85 + Math.random() * 0.15) : armR * Math.random() * 0.8;
    // Arms angle slightly outward then back in
    const xOff = 0.58 + Math.sin(t * Math.PI * 0.6) * 0.08;
    put(
      side * xOff + r * Math.cos(a),
      y + (Math.random() - 0.5) * 0.01,
      r * Math.sin(a) + 0.015
    );
  }

  // Spine/back ridge detail
  const spineCount = Math.floor(PC * 0.025);
  for (let i = 0; i < spineCount; i++) {
    const h = 0.30 + Math.random() * 0.52;
    const y = -0.7 + h * 2.85;
    const { rz } = profile(h);
    put(
      (Math.random() - 0.5) * 0.035,
      y,
      -(rz * 0.96) + (Math.random() - 0.5) * 0.015
    );
  }

  // Fill remaining with subtle ambient glow near body
  while (idx < PC * 3) {
    const h = 0.20 + Math.random() * 0.65;
    const y = -0.7 + h * 2.85;
    const { rx, rz } = profile(h);
    const a = Math.random() * Math.PI * 2;
    const r = rx + 0.08 + Math.random() * 0.12;
    put(r * Math.cos(a), y + (Math.random() - 0.5) * 0.04, r * Math.sin(a) * (rz / rx));
  }
  return p;
}

/**
 * Venus — refined feminine silhouette, hourglass proportions.
 * Dramatically cinched waist, pronounced hips, graceful shoulders.
 */
function generateVenus(): Float32Array {
  const p = new Float32Array(PC * 3);
  let idx = 0;
  const put = (x: number, y: number, z: number) => {
    if (idx >= PC * 3) return;
    p[idx++] = x; p[idx++] = y; p[idx++] = z;
  };

  const profile = (h: number): { rx: number; rz: number } => {
    // Head: 0.85–1.0
    if (h > 0.85) {
      const t = (h - 0.85) / 0.15;
      const r = 0.21 * Math.sqrt(Math.max(0, 1 - Math.pow(t * 2 - 1, 2)));
      return { rx: r + 0.01, rz: r * 0.85 };
    }
    // Neck: 0.79–0.85
    if (h > 0.79) {
      const t = (h - 0.79) / 0.06;
      return { rx: 0.075 + t * 0.025, rz: 0.065 + t * 0.02 };
    }
    // Shoulders: 0.70–0.79
    if (h > 0.70) {
      const t = (h - 0.70) / 0.09;
      const ease = t * t * (3 - 2 * t);
      return { rx: 0.10 + ease * 0.35, rz: 0.085 + ease * 0.10 };
    }
    // Bust: 0.58–0.70
    if (h > 0.58) {
      const t = (h - 0.58) / 0.12;
      const bustCurve = Math.sin(t * Math.PI);
      return { rx: 0.44 + bustCurve * 0.09, rz: 0.19 + bustCurve * 0.07 };
    }
    // Ribcage → waist taper: 0.49–0.58
    if (h > 0.49) {
      const t = (h - 0.49) / 0.09;
      const taper = t * t; // accelerating taper
      return { rx: 0.44 - taper * 0.16, rz: 0.19 - taper * 0.04 };
    }
    // Narrow waist: 0.43–0.49
    if (h > 0.43) {
      const t = (h - 0.43) / 0.06;
      const cinch = 1 - Math.cos(t * Math.PI) * 0.5 - 0.5;
      return { rx: 0.28 - cinch * 0.02, rz: 0.15 - cinch * 0.01 };
    }
    // Hips flare: 0.30–0.43
    if (h > 0.30) {
      const t = (h - 0.30) / 0.13;
      // Bell curve that peaks at ~40% through the hip section
      const hipBell = Math.exp(-Math.pow((t - 0.4) * 2.8, 2));
      return { rx: 0.30 + hipBell * 0.30, rz: 0.16 + hipBell * 0.11 };
    }
    // Upper thigh: 0.22–0.30
    if (h > 0.22) {
      const t = (h - 0.22) / 0.08;
      return { rx: 0.30 - t * 0.12, rz: 0.16 - t * 0.04 };
    }
    // Lower legs: 0.0–0.22
    const t = h / 0.22;
    return { rx: 0.10 + t * 0.08, rz: 0.09 + t * 0.03 };
  };

  // Main body shell
  const mainCount = Math.floor(PC * 0.70);
  for (let i = 0; i < mainCount; i++) {
    const h = Math.random();
    const y = -0.75 + h * 2.95;
    const { rx, rz } = profile(h);
    const a = Math.random() * Math.PI * 2;
    const shell = Math.random() < 0.87;
    const rFact = shell ? (0.88 + Math.random() * 0.12) : (Math.random() * 0.82);
    const scatter = shell ? 0.01 : 0.018;

    if (h < 0.22) {
      const side = Math.random() > 0.5 ? 1 : -1;
      const sep = 0.15 * (0.5 + (h / 0.22) * 0.5);
      put(
        side * sep + rx * rFact * Math.cos(a) + (Math.random() - 0.5) * scatter,
        y + (Math.random() - 0.5) * scatter,
        rz * rFact * Math.sin(a) + (Math.random() - 0.5) * scatter
      );
    } else {
      put(
        rx * rFact * Math.cos(a) + (Math.random() - 0.5) * scatter,
        y + (Math.random() - 0.5) * scatter,
        rz * rFact * Math.sin(a) + (Math.random() - 0.5) * scatter
      );
    }
  }

  // Glute definition (extra back volume at hip level)
  const gluteCount = Math.floor(PC * 0.05);
  for (let i = 0; i < gluteCount; i++) {
    const h = 0.30 + Math.random() * 0.10;
    const y = -0.75 + h * 2.95;
    const gc = Math.sin((h - 0.30) / 0.10 * Math.PI);
    const a = -Math.PI * 0.5 + (Math.random() - 0.5) * Math.PI * 0.55;
    const r = (0.18 + gc * 0.12) * (0.82 + Math.random() * 0.18);
    put(r * Math.cos(a) * 0.6, y, -(0.15 + gc * 0.10));
  }

  // Arms (slender, feminine)
  const armCount = Math.floor(PC * 0.08);
  for (let i = 0; i < armCount; i++) {
    const side = Math.random() > 0.5 ? 1 : -1;
    const t = Math.random();
    const y = 1.70 - t * 1.0;
    const armR = 0.055 - t * 0.018;
    const a = Math.random() * Math.PI * 2;
    const r = (0.7 + Math.random() * 0.3) * armR;
    put(side * (0.48 + Math.sin(t * Math.PI * 0.5) * 0.06) + r * Math.cos(a), y, r * Math.sin(a));
  }

  // Spine
  const spineCount = Math.floor(PC * 0.025);
  for (let i = 0; i < spineCount; i++) {
    const h = 0.25 + Math.random() * 0.55;
    const y = -0.75 + h * 2.95;
    const { rz } = profile(h);
    put((Math.random() - 0.5) * 0.03, y, -(rz * 0.94));
  }

  // Ambient glow fill
  while (idx < PC * 3) {
    const h = 0.22 + Math.random() * 0.6;
    const y = -0.75 + h * 2.95;
    const { rx, rz } = profile(h);
    const a = Math.random() * Math.PI * 2;
    const r = rx + 0.07 + Math.random() * 0.10;
    put(r * Math.cos(a), y, r * Math.sin(a) * (rz / rx));
  }
  return p;
}

/* ── Interpolation ── */
function lerpPositions(a: Float32Array, b: Float32Array, t: number, out: Float32Array) {
  for (let i = 0; i < a.length; i++) out[i] = a[i] + (b[i] - a[i]) * t;
}
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/* ══════════════════════════════════════════════════════════════
   THREE.JS SCENE HOOK
   ══════════════════════════════════════════════════════════════ */

function useThreeScene(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  progressRef: React.MutableRefObject<number>,
  mousePosRef: React.MutableRefObject<{ x: number; y: number }>,
  entranceRef: React.MutableRefObject<number>,
) {
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current || typeof window === 'undefined') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    initRef.current = true;

    let THREE: any;
    try { THREE = require('three'); } catch { return; }

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    /* ── Scene ── */
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0a0a0f');
    scene.fog = new THREE.FogExp2(0x0a0a0f, 0.035);

    /* ── Camera ── */
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0.7, 0.5);

    /* ── Shapes ── */
    const origin = generateOrigin();
    const chaos = generateChaos();
    const torso = generateTorso();
    const venus = generateVenus();

    /* ── Particles ── */
    const positions = new Float32Array(PC * 3);
    positions.set(origin);
    const sizes = new Float32Array(PC);
    const colors = new Float32Array(PC * 3);
    const baseCol = new THREE.Color('#b08d57');
    for (let i = 0; i < PC; i++) {
      sizes[i] = 0.014 + Math.random() * 0.024;
      const v = 0.55 + Math.random() * 0.55;
      colors[i * 3] = baseCol.r * v;
      colors[i * 3 + 1] = baseCol.g * v;
      colors[i * 3 + 2] = baseCol.b * v;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.ShaderMaterial({
      vertexShader: `
        attribute float aSize;
        varying vec3 vColor;
        varying float vAlpha;
        uniform float uTime;
        uniform float uOpacity;
        uniform float uSizeMul;
        void main() {
          vColor = color;
          vec3 pos = position;
          pos.x += sin(uTime * 0.7 + pos.y * 2.5) * 0.003;
          pos.y += cos(uTime * 0.5 + pos.x * 1.8) * 0.002;
          pos.z += sin(uTime * 0.4 + float(gl_VertexID) * 0.0007) * 0.002;
          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          float dist = -mv.z;
          gl_PointSize = max(1.0, (350.0 / max(dist, 0.3)) * aSize * uSizeMul);
          gl_Position = projectionMatrix * mv;
          vAlpha = clamp(1.0 - dist * 0.035, 0.15, 1.0) * uOpacity;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          float core = 1.0 - smoothstep(0.0, 0.10, d);
          float glow = 1.0 - smoothstep(0.0, 0.5, d);
          glow = pow(glow, 1.5);
          vec3 col = vColor * (1.0 + core * 1.0);
          gl_FragColor = vec4(col, glow * vAlpha * 0.85);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0 },
        uSizeMul: { value: 0.2 },
      },
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    /* ── Orbital dust ring ── */
    const ringCount = 500;
    const ringPos = new Float32Array(ringCount * 3);
    for (let i = 0; i < ringCount; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 2.5 + Math.random() * 3.5;
      ringPos[i * 3] = Math.cos(a) * r;
      ringPos[i * 3 + 1] = (Math.random() - 0.5) * 2.5;
      ringPos[i * 3 + 2] = Math.sin(a) * r;
    }
    const ringGeo = new THREE.BufferGeometry();
    ringGeo.setAttribute('position', new THREE.BufferAttribute(ringPos, 3));
    const ringMat = new THREE.PointsMaterial({
      color: 0xb08d57, size: 0.006, transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
    });
    const ring = new THREE.Points(ringGeo, ringMat);
    scene.add(ring);

    /* ── State ── */
    const currentTilt = { x: 0, y: 0 };
    const temp = new Float32Array(PC * 3);
    let time = 0;
    let raf = 0;

    /* ── Resize ── */
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    /* ── Render loop ── */
    const animate = () => {
      raf = requestAnimationFrame(animate);
      time += 0.004;
      mat.uniforms.uTime.value = time;
      ring.rotation.y = time * 0.08;

      const mx = mousePosRef.current.x;
      const my = mousePosRef.current.y;
      currentTilt.x += (mx * 0.03 - currentTilt.x) * 0.015;
      currentTilt.y += (my * 0.02 - currentTilt.y) * 0.015;

      const ep = entranceRef.current;
      const progress = progressRef.current;
      const posAttr = geo.getAttribute('position');

      /* ── ENTRANCE PHASE ── */
      if (ep < 1) {
        const morphT = easeInOutCubic(Math.min(1, ep * 1.4));
        lerpPositions(origin, chaos, morphT, temp);
        for (let i = 0; i < temp.length; i++) (posAttr.array as Float32Array)[i] = temp[i];
        posAttr.needsUpdate = true;

        mat.uniforms.uOpacity.value = Math.min(1, ep * 2.5);
        mat.uniforms.uSizeMul.value = 0.2 + easeInOutCubic(Math.min(1, ep * 1.8)) * 0.8;

        const camT = easeInOutCubic(ep);
        camera.position.x = Math.sin(camT * 0.4 + currentTilt.x) * (0.5 + camT * 6.5);
        camera.position.z = Math.cos(camT * 0.4 + currentTilt.x) * (0.5 + camT * 6.5);
        camera.position.y = 0.7 + camT * 0.15 + currentTilt.y;
        camera.lookAt(0, 0.65, 0);

        ringMat.opacity = Math.max(0, (ep - 0.5) * 0.35);
      } else {
        /* ── SCROLL PHASE ── */
        mat.uniforms.uOpacity.value = 1;
        mat.uniforms.uSizeMul.value = 1;
        ringMat.opacity = 0.18;

        // Shape morphing
        if (progress < 0.18) {
          temp.set(chaos);
        } else if (progress < 0.42) {
          lerpPositions(chaos, torso, easeInOutCubic((progress - 0.18) / 0.24), temp);
        } else if (progress < 0.55) {
          temp.set(torso);
        } else if (progress < 0.78) {
          lerpPositions(torso, venus, easeInOutCubic((progress - 0.55) / 0.23), temp);
        } else {
          temp.set(venus);
        }

        for (let i = 0; i < temp.length; i++) (posAttr.array as Float32Array)[i] = temp[i];
        posAttr.needsUpdate = true;

        // Color shift: bronze → warm gold during venus morph
        const colAttr = geo.getAttribute('color');
        const cm = progress > 0.55 ? Math.min(1, (progress - 0.55) / 0.23) : 0;
        for (let i = 0; i < PC; i++) {
          const v = 0.65 + (i % 19) * 0.02;
          (colAttr.array as Float32Array)[i * 3] = (0.69 + 0.22 * cm) * v;
          (colAttr.array as Float32Array)[i * 3 + 1] = (0.55 + 0.22 * cm) * v;
          (colAttr.array as Float32Array)[i * 3 + 2] = (0.34 + 0.13 * cm) * v;
        }
        colAttr.needsUpdate = true;

        // Camera orbit
        let angle = 0, dist = 7, camY = 0.85;
        if (progress < 0.18) {
          const t = progress / 0.18;
          angle = t * 0.15; dist = 7 - t * 0.5; camY = 0.85 + t * 0.15;
        } else if (progress < 0.42) {
          const t = easeInOutCubic((progress - 0.18) / 0.24);
          angle = 0.15 + t * 0.85; dist = 6.5 - t * 2.7; camY = 1.0 + t * 0.12;
        } else if (progress < 0.55) {
          const t = (progress - 0.42) / 0.13;
          angle = 1.0 + t * 0.5; dist = 3.8; camY = 1.12 - t * 0.12;
        } else if (progress < 0.78) {
          const t = easeInOutCubic((progress - 0.55) / 0.23);
          angle = 1.5 + t * 1.2; dist = 3.8 + t * 0.5; camY = 1.0 - t * 0.1;
        } else {
          const t = easeInOutCubic((progress - 0.78) / 0.22);
          angle = 2.7 + t * (Math.PI * 2 - 2.7 + 0.3); dist = 4.3 + t * 1.5; camY = 0.9 - t * 0.12;
        }

        camera.position.x = Math.sin(angle + currentTilt.x) * dist;
        camera.position.z = Math.cos(angle + currentTilt.x) * dist;
        camera.position.y = camY + currentTilt.y;
        camera.lookAt(0, 0.65, 0);
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
    };
  }, [canvasRef, progressRef, mousePosRef, entranceRef]);
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════ */

export default function SculptorJourneyHero({ locale }: SculptorJourneyHeroProps) {
  const { gsapReady } = useGsap();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const entranceRef = useRef(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [gsapOwned, setGsapOwned] = useState(false);
  const hasAnimated = useRef(false);

  // Three.js — uses refs directly for zero-latency updates
  useThreeScene(canvasRef, progressRef, mousePosRef, entranceRef);

  // Mouse tracking via ref (no re-renders)
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mousePosRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // GSAP entrance + scroll
  useEffect(() => {
    if (!gsapReady || hasAnimated.current || !containerRef.current) return;
    const gsap = (window as any).gsap;
    const ScrollTrigger = (window as any).ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    hasAnimated.current = true;

    /*
     * CRITICAL: Use gsap.set() to establish initial hidden states.
     * This way GSAP "owns" the opacity — React inline styles won't
     * fight GSAP on re-renders because we removed opacity from JSX.
     */
    gsap.set('.sculptor-flash', { opacity: 0, scale: 0.3 });
    gsap.set('.sculptor-line', { opacity: 0, scaleX: 0 });
    gsap.set('.sculptor-kicker', { opacity: 0, letterSpacing: '0.8em', y: 8 });
    gsap.set('.sculptor-title-char', { opacity: 0, y: 55, rotateX: -50, scale: 0.7 });
    gsap.set('.sculptor-subtitle', { opacity: 0, y: 20, filter: 'blur(6px)' });
    gsap.set('.sculptor-scroll-hint', { opacity: 0, y: 12 });

    // Now make content visible — GSAP owns all animated props
    setGsapOwned(true);

    /* ── Entrance Timeline ── */
    const tl = gsap.timeline();

    // 1. Golden radial flash
    tl.to('.sculptor-flash',
      { opacity: 1, scale: 1.2, duration: 0.7, ease: 'power4.out' }, 0)
      .to('.sculptor-flash',
        { opacity: 0, scale: 2, duration: 1.8, ease: 'power2.in' }, 0.4);

    // 2. Particle materialization (drives entranceRef)
    tl.to({ v: 0 }, {
      v: 1, duration: 4.0, ease: 'power2.out',
      onUpdate: function () {
        entranceRef.current = this.targets()[0].v;
      },
    }, 0.1);

    // 3. Golden horizon line sweep
    tl.to('.sculptor-line',
      { scaleX: 1, opacity: 1, duration: 2.0, ease: 'power3.inOut' }, 1.0)
      .to('.sculptor-line',
        { opacity: 0, duration: 0.8, ease: 'power2.in' }, 3.0);

    // 4. Kicker text
    tl.to('.sculptor-kicker',
      { opacity: 0.5, letterSpacing: '0.4em', y: 0, duration: 1.8, ease: 'power2.out' }, 1.6);

    // 5. Title characters — cinematic stagger from center with 3D perspective
    tl.to('.sculptor-title-char', {
      opacity: 1, y: 0, rotateX: 0, scale: 1,
      duration: 1.1, ease: 'power3.out',
      stagger: { each: 0.055, from: 'center' },
    }, 2.0);

    // 6. Title glow pulse
    tl.fromTo('.sculptor-title-wrap',
      { textShadow: '0 0 0px rgba(176,141,87,0)' },
      { textShadow: '0 0 90px rgba(176,141,87,0.35)', duration: 1.6, ease: 'power2.inOut' }, 2.8)
      .to('.sculptor-title-wrap',
        { textShadow: '0 0 30px rgba(176,141,87,0.08)', duration: 1.2, ease: 'power2.out' }, 4.2);

    // 7. Subtitle blur reveal
    tl.to('.sculptor-subtitle',
      { opacity: 0.35, y: 0, filter: 'blur(0px)', duration: 1.5, ease: 'power2.out' }, 3.2);

    // 8. Scroll hint
    tl.to('.sculptor-scroll-hint',
      { opacity: 1, y: 0, duration: 1.0, ease: 'power2.out' }, 4.2);

    /* ── ScrollTrigger (scrubbed phases) ── */
    gsap.to({ p: 0 }, {
      p: 1, ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=400%',
        pin: true,
        pinSpacing: true,
        scrub: 1.5,
        onUpdate: (self: any) => {
          const p = self.progress;
          progressRef.current = p;
          setScrollProgress(p);

          // Fade out scroll hint when user starts scrolling
          const hintEl = document.querySelector('.sculptor-scroll-hint') as HTMLElement;
          if (hintEl) hintEl.style.opacity = String(Math.max(0, 1 - p * 8));
        },
      },
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((st: any) => st.kill());
    };
  }, [gsapReady]);

  /* ── Text phase visibility ── */
  const textStyle = (start: number, end: number) => {
    const fi = start + (end - start) * 0.15;
    const fo = end - (end - start) * 0.15;
    let o = 0;
    if (scrollProgress >= start && scrollProgress <= end) {
      if (scrollProgress < fi) o = (scrollProgress - start) / (fi - start);
      else if (scrollProgress > fo) o = (end - scrollProgress) / (end - fo);
      else o = 1;
    }
    const c = Math.max(0, Math.min(1, o));
    return { opacity: c, transform: `translateY(${(1 - c) * 20}px)`, transition: 'none' };
  };

  const phase1Opacity = scrollProgress < 0.01 ? 1 : Math.max(0, 1 - scrollProgress * 6);
  const titleChars = 'WISTA CLINIC'.split('');

  /*
   * Before GSAP takes control, hide all animated elements via a container.
   * Once gsap.set() has established initial states, gsapOwned flips to true
   * and the container becomes visible. GSAP then owns all animated props —
   * no React inline styles conflict.
   */

  return (
    <>
      {/* Dark band covering the layout pt-16/pt-20 gap above pinned hero */}
      <div
        aria-hidden
        className="relative z-40 -mt-16 h-16 lg:-mt-20 lg:h-20"
        style={{ background: '#0a0a0f' }}
      />

      <section
        ref={containerRef}
        className="relative w-full overflow-hidden"
        style={{ height: '100vh', background: '#0a0a0f' }}
      >
        {/* Three.js canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ zIndex: 1 }}
        />

        {/* Golden flash burst — no opacity in React, GSAP owns it */}
        <div className="sculptor-flash absolute pointer-events-none" style={{
          zIndex: 4, top: '50%', left: '50%', width: '350px', height: '350px',
          marginLeft: '-175px', marginTop: '-175px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(176,141,87,0.7) 0%, rgba(176,141,87,0.15) 35%, transparent 65%)',
          visibility: gsapOwned ? 'visible' : 'hidden',
          filter: 'blur(25px)',
        }} />

        {/* Golden horizon line — no opacity in React, GSAP owns it */}
        <div className="sculptor-line absolute pointer-events-none" style={{
          zIndex: 5, top: '50%', left: '12%', right: '12%', height: '1px',
          background: 'linear-gradient(to right, transparent 0%, #b08d57 25%, #b08d57 75%, transparent 100%)',
          transformOrigin: 'center center',
          visibility: gsapOwned ? 'visible' : 'hidden',
        }} />

        {/* Subtle glow + vignette */}
        <div className="absolute inset-0 pointer-events-none" style={{
          zIndex: 2,
          background: 'radial-gradient(ellipse 40% 50% at 50% 45%, rgba(176,141,87,0.04) 0%, transparent 100%)',
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          zIndex: 3,
          background: 'radial-gradient(ellipse at center, transparent 20%, rgba(10,10,15,0.85) 100%)',
        }} />

        {/* ═══ PHASE 1: Introduction ═══ */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          style={{
            zIndex: 10,
            opacity: phase1Opacity,
            visibility: gsapOwned ? 'visible' : 'hidden',
          }}
        >
          <p
            className="sculptor-kicker uppercase mb-6"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '11px', fontWeight: 300,
              color: 'rgba(176,141,87,0.5)', letterSpacing: '0.4em',
              /* NO opacity here — GSAP owns it */
            }}
          >
            Every masterpiece begins with raw material
          </p>
          <div className="sculptor-title-wrap" style={{ perspective: '700px' }}>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(44px, 8vw, 110px)', fontWeight: 200,
              color: '#f7e3c4', letterSpacing: '0.14em', lineHeight: 1,
              textAlign: 'center', display: 'flex', justifyContent: 'center', flexWrap: 'wrap',
            }}>
              {titleChars.map((ch, i) => (
                <span
                  key={i}
                  className="sculptor-title-char inline-block"
                  style={{
                    /* NO opacity here — GSAP owns it */
                    display: ch === ' ' ? 'inline' : 'inline-block',
                    width: ch === ' ' ? '0.35em' : 'auto',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {ch === ' ' ? '\u00A0' : ch}
                </span>
              ))}
            </h1>
          </div>
          <p
            className="sculptor-subtitle mt-6"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(12px, 1.4vw, 16px)', fontWeight: 300,
              color: 'rgba(247,227,196,0.3)', letterSpacing: '0.2em',
              textTransform: 'uppercase',
              /* NO opacity here — GSAP owns it */
            }}
          >
            The Art of Surgical Sculpture
          </p>
        </div>

        {/* ═══ PHASE 2: Sculpting ═══ */}
        <div
          className="absolute inset-0 flex items-center pointer-events-none"
          style={{ zIndex: 10, ...textStyle(0.20, 0.44) }}
        >
          <div className="ml-[8vw] max-w-[400px]">
            <p className="uppercase tracking-[0.3em] mb-3" style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '11px', fontWeight: 400, color: '#b08d57',
            }}>Phase I</p>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 200,
              color: '#f7e3c4', lineHeight: 1.15, letterSpacing: '0.03em',
            }}>
              From Chaos,<br /><span style={{ color: '#b08d57' }}>Form Emerges</span>
            </h2>
            <div className="my-5 h-[1px] w-16" style={{ background: 'linear-gradient(to right, #b08d57, transparent)' }} />
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '15px', fontWeight: 300,
              color: 'rgba(247,227,196,0.45)', lineHeight: 1.7,
            }}>
              Five thousand particles converge with surgical precision — each one placed with the same intentionality we bring to every procedure.
            </p>
          </div>
        </div>

        {/* ═══ PHASE 3: Admiring ═══ */}
        <div
          className="absolute inset-0 flex items-end justify-center pb-[15vh] pointer-events-none"
          style={{ zIndex: 10, ...textStyle(0.44, 0.56) }}
        >
          <p className="uppercase tracking-[0.25em]" style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '12px', fontWeight: 400, color: '#b08d57',
          }}>
            The human form, deconstructed &amp; reimagined
          </p>
        </div>

        {/* ═══ PHASE 4: Refinement ═══ */}
        <div
          className="absolute inset-0 flex items-center justify-end pointer-events-none"
          style={{ zIndex: 10, ...textStyle(0.57, 0.78) }}
        >
          <div className="mr-[8vw] max-w-[400px] text-right">
            <p className="uppercase tracking-[0.3em] mb-3" style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '11px', fontWeight: 400, color: '#b08d57',
            }}>Phase II</p>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 200,
              color: '#f7e3c4', lineHeight: 1.15, letterSpacing: '0.03em',
            }}>
              Refinement Is<br /><span style={{ color: '#b08d57' }}>The Art</span>
            </h2>
            <div className="my-5 ml-auto h-[1px] w-16" style={{ background: 'linear-gradient(to left, #b08d57, transparent)' }} />
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '15px', fontWeight: 300,
              color: 'rgba(247,227,196,0.45)', lineHeight: 1.7,
            }}>
              Watch the silhouette evolve — proportions refined, curves harmonized, every contour calibrated to classical ideals of beauty.
            </p>
          </div>
        </div>

        {/* ═══ PHASE 5: Masterpiece / CTA ═══ */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          style={{ zIndex: 10, ...textStyle(0.80, 1.0) }}
        >
          <p className="uppercase tracking-[0.35em] mb-4" style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '11px', fontWeight: 400, color: '#b08d57',
          }}>The Masterpiece Revealed</p>
          <h2 className="mb-8" style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(30px, 4.5vw, 56px)', fontWeight: 200,
            color: '#f7e3c4', textAlign: 'center', letterSpacing: '0.06em', lineHeight: 1.2,
          }}>
            Your Transformation<br />Begins Here
          </h2>
          <a
            href={`/${locale}/booking`}
            className="group relative overflow-hidden px-10 py-4 pointer-events-auto"
            style={{
              background: '#b08d57', color: '#111016',
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '13px', fontWeight: 600,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              textDecoration: 'none', transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            <span className="relative z-10">Book Consultation</span>
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: 'linear-gradient(135deg, #d4b06a, #b08d57)' }}
            />
          </a>
          <div className="flex items-center gap-6 mt-8 flex-wrap justify-center">
            {['Board Certified Surgeons', '15+ Years Experience', '10,000+ Transformations'].map((s, i) => (
              <span key={i} style={{
                fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'rgba(247,227,196,0.2)', fontFamily: "'Cormorant Garamond', serif",
              }}>{s}</span>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div
          className="absolute bottom-0 left-0 h-[1px]"
          style={{
            zIndex: 20,
            width: `${scrollProgress * 100}%`,
            background: 'linear-gradient(to right, transparent, #b08d57)',
            transition: 'width 0.1s linear',
          }}
        />

        {/* Scroll hint — GSAP owns opacity, React only controls visibility */}
        <div
          className="sculptor-scroll-hint absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
          style={{
            zIndex: 10,
            visibility: gsapOwned ? 'visible' : 'hidden',
            /* NO opacity here — GSAP owns it */
          }}
        >
          <p style={{
            fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase',
            color: 'rgba(247,227,196,0.2)', fontFamily: "'Cormorant Garamond', serif",
          }}>Scroll to sculpt</p>
          <div style={{
            width: '1px', height: '24px',
            background: 'linear-gradient(to bottom, rgba(176,141,87,0.3), transparent)',
            animation: 'sculptorBounce 2s ease-in-out infinite',
          }} />
        </div>

        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@200;300;400;500;600&display=swap');
          @keyframes sculptorBounce {
            0%, 100% { transform: translateY(0); opacity: 0.5; }
            50% { transform: translateY(6px); opacity: 1; }
          }
        `}</style>
      </section>
    </>
  );
}
