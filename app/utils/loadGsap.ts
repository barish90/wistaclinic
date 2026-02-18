/**
 * Dynamically imports GSAP libraries + premium plugins from the npm package.
 * Uses dynamic import() for code splitting — GSAP is only loaded when needed.
 *
 * Premium plugins (now free with GSAP 3.12+):
 *   ScrollSmoother, SplitText, DrawSVGPlugin, CustomEase, Observer
 */

declare global {
  interface Window {
    gsap: any;
    ScrollTrigger: any;
    ScrollToPlugin: any;
    ScrollSmoother: any;
    SplitText: any;
    DrawSVGPlugin: any;
    MorphSVGPlugin: any;
    CustomEase: any;
    Observer: any;
    confetti: any;
  }
}

let gsapPromise: Promise<void> | null = null;

export async function loadGsap(): Promise<void> {
  if (gsapPromise) {
    return gsapPromise;
  }

  if (window.gsap && window.ScrollTrigger && window.SplitText && window.MorphSVGPlugin && window.DrawSVGPlugin) {
    return Promise.resolve();
  }

  gsapPromise = (async () => {
    try {
      const [
        gsapModule,
        scrollTriggerModule,
        scrollToModule,
        scrollSmootherModule,
        splitTextModule,
        drawSvgModule,
        morphSvgModule,
        customEaseModule,
        observerModule,
      ] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
        import('gsap/ScrollToPlugin'),
        import('gsap/ScrollSmoother'),
        import('gsap/SplitText'),
        import('gsap/DrawSVGPlugin'),
        import('gsap/MorphSVGPlugin'),
        import('gsap/CustomEase'),
        import('gsap/Observer'),
      ]);

      const gsap = gsapModule.default || gsapModule.gsap;
      const ScrollTrigger = scrollTriggerModule.default || scrollTriggerModule.ScrollTrigger;
      const ScrollToPlugin = scrollToModule.default || scrollToModule.ScrollToPlugin;
      const ScrollSmoother = scrollSmootherModule.default || scrollSmootherModule.ScrollSmoother;
      const SplitText = splitTextModule.default || splitTextModule.SplitText;
      const DrawSVGPlugin = drawSvgModule.default || drawSvgModule.DrawSVGPlugin;
      const MorphSVGPlugin = morphSvgModule.default || morphSvgModule.MorphSVGPlugin;
      const CustomEase = customEaseModule.default || customEaseModule.CustomEase;
      const Observer = observerModule.default || observerModule.Observer;

      gsap.registerPlugin(
        ScrollTrigger,
        ScrollToPlugin,
        ScrollSmoother,
        SplitText,
        DrawSVGPlugin,
        MorphSVGPlugin,
        CustomEase,
        Observer,
      );

      // Attach to window for components that reference window.*
      window.gsap = gsap;
      window.ScrollTrigger = ScrollTrigger;
      window.ScrollToPlugin = ScrollToPlugin;
      window.ScrollSmoother = ScrollSmoother;
      window.SplitText = SplitText;
      window.DrawSVGPlugin = DrawSVGPlugin;
      window.MorphSVGPlugin = MorphSVGPlugin;
      window.CustomEase = CustomEase;
      window.Observer = Observer;
    } catch (error) {
      console.error('Failed to load GSAP:', error);
      gsapPromise = null;
      throw error;
    }
  })();

  return gsapPromise;
}

let confettiPromise: Promise<void> | null = null;

export async function loadConfetti(): Promise<void> {
  if (window.confetti) {
    return Promise.resolve();
  }

  if (confettiPromise) {
    return confettiPromise;
  }

  confettiPromise = (async () => {
    try {
      const confettiModule = await import('canvas-confetti');
      window.confetti = confettiModule.default || confettiModule;
    } catch (error) {
      console.error('Failed to load confetti:', error);
      confettiPromise = null;
      throw error;
    }
  })();

  return confettiPromise;
}
