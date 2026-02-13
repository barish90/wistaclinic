/**
 * Dynamically loads GSAP libraries only when needed
 * This reduces initial bundle size by ~55KB
 */

declare global {
  interface Window {
    gsap: any;
    ScrollTrigger: any;
    ScrollToPlugin: any;
    confetti: any;
  }
}

let gsapPromise: Promise<void> | null = null;

export async function loadGsap(): Promise<void> {
  // Return existing promise if already loading
  if (gsapPromise) {
    return gsapPromise;
  }

  // Check if already loaded
  if (window.gsap && window.ScrollTrigger) {
    return Promise.resolve();
  }

  gsapPromise = (async () => {
    try {
      // Load scripts sequentially to ensure proper initialization
      await loadScript('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js');
      await loadScript('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js');
      await loadScript('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollToPlugin.min.js');

      // Register ScrollTrigger plugin
      if (window.gsap && window.ScrollTrigger) {
        window.gsap.registerPlugin(window.ScrollTrigger, window.ScrollToPlugin);
      }
    } catch (error) {
      console.error('Failed to load GSAP:', error);
      gsapPromise = null; // Reset promise on error so it can be retried
      throw error;
    }
  })();

  return gsapPromise;
}

export async function loadConfetti(): Promise<void> {
  if (window.confetti) {
    return Promise.resolve();
  }

  try {
    await loadScript('https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js');
  } catch (error) {
    console.error('Failed to load confetti:', error);
    throw error;
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if script already exists
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));

    document.head.appendChild(script);
  });
}
