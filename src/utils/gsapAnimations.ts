import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

/**
 * Aggressive Hero Entrance Timeline
 * Dramatic drop-in with 3D perspective, scale punch, skew recoil
 */
export const runAggressiveHeroEntrance = (scopeElement: HTMLElement | null) => {
  if (!scopeElement) return;

  const ctx = gsap.context(() => {
    const tl = gsap.timeline({
      defaults: { ease: 'power4.out', duration: 1.1 }
    });

    // 1. Badge pop with back ease
    tl.fromTo(
      '[data-gsap="hero-badge"]',
      { y: -50, opacity: 0, scale: 0.6, rotate: -4 },
      { y: 0, opacity: 1, scale: 1, rotate: 0, ease: 'back.out(2.5)', duration: 0.8 }
    );

    // 2. Punchy headline split-line cascade with scale & skew
    tl.fromTo(
      '[data-gsap="hero-title"]',
      { y: 110, opacity: 0, skewY: 5, scale: 0.92 },
      { y: 0, opacity: 1, skewY: 0, scale: 1, ease: 'expo.out', duration: 1.3 },
      '-=0.55'
    );

    // 3. Subtitle whip
    tl.fromTo(
      '[data-gsap="hero-subtitle"]',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, ease: 'power3.out', duration: 0.95 },
      '-=0.85'
    );

    // 4. Search dock explosive slam
    tl.fromTo(
      '[data-gsap="hero-search"]',
      { y: 80, opacity: 0, scale: 0.9, transformOrigin: 'top center' },
      { y: 0, opacity: 1, scale: 1, ease: 'back.out(1.8)', duration: 1.1 },
      '-=0.75'
    );

    // 5. Hero visual frame dramatic 3D rotate-in
    tl.fromTo(
      '[data-gsap="hero-visual"]',
      { x: 90, opacity: 0, scale: 0.85, rotateY: 18, perspective: 1000 },
      { x: 0, opacity: 1, scale: 1, rotateY: 0, ease: 'power4.out', duration: 1.4 },
      '-=1.0'
    );

    // 6. Floating metric tags pop
    tl.fromTo(
      '[data-gsap="hero-tag"]',
      { scale: 0, opacity: 0, rotate: 12 },
      { scale: 1, opacity: 1, rotate: 0, stagger: 0.14, ease: 'back.out(2.8)', duration: 0.75 },
      '-=0.8'
    );
  }, scopeElement);

  return () => ctx.revert();
};

/**
 * Aggressive Card Cascade Stagger
 * Cards launch upward with staggered explosive ease on ScrollTrigger
 */
export const runCardCascade = (container: HTMLElement | null, cardSelector = '.gsap-card') => {
  if (!container) return;

  const ctx = gsap.context(() => {
    const cards = container.querySelectorAll(cardSelector);
    if (!cards.length) return;

    gsap.fromTo(
      cards,
      { y: 90, opacity: 0, scale: 0.88, rotateX: 10, perspective: 1000 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        rotateX: 0,
        stagger: 0.08,
        duration: 0.95,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      }
    );
  }, container);

  return () => ctx.revert();
};

/**
 * Aggressive Grid Refresh (Re-slam animation on filter changes)
 */
export const runGridSlam = (container: HTMLElement | null, cardSelector = '.gsap-card') => {
  if (!container) return;

  const cards = container.querySelectorAll(cardSelector);
  if (!cards.length) return;

  gsap.killTweensOf(cards);
  gsap.fromTo(
    cards,
    { opacity: 0, y: 40, scale: 0.93, rotateX: 6 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      stagger: 0.05,
      duration: 0.65,
      ease: 'back.out(2.0)'
    }
  );
};

/**
 * Aggressive Section Heading Reveal
 */
export const runAggressiveSectionReveal = (section: HTMLElement | null) => {
  if (!section) return;

  const ctx = gsap.context(() => {
    const pill = section.querySelector('.gsap-reveal-pill');
    const title = section.querySelector('.gsap-reveal-title');
    const sub = section.querySelector('.gsap-reveal-sub');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });

    if (pill) {
      tl.fromTo(
        pill,
        { scale: 0.7, opacity: 0, y: -20 },
        { scale: 1, opacity: 1, y: 0, ease: 'back.out(2.4)', duration: 0.6 }
      );
    }

    if (title) {
      tl.fromTo(
        title,
        { y: 55, opacity: 0, skewY: 3 },
        { y: 0, opacity: 1, skewY: 0, ease: 'expo.out', duration: 1.0 },
        '-=0.4'
      );
    }

    if (sub) {
      tl.fromTo(
        sub,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, ease: 'power3.out', duration: 0.8 },
        '-=0.6'
      );
    }
  }, section);

  return () => ctx.revert();
};

/**
 * Aggressive Perpetual Float Effect for Badges and Pins
 */
export const runPerpetualFloat = (elements: (HTMLElement | null)[]) => {
  const tweens: gsap.core.Tween[] = [];

  elements.forEach((el, index) => {
    if (!el) return;
    const tween = gsap.to(el, {
      y: (index % 2 === 0 ? -10 : 8),
      rotate: (index % 2 === 0 ? 1.5 : -1.5),
      duration: 2.2 + index * 0.4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
    tweens.push(tween);
  });

  return () => {
    tweens.forEach((t) => t.kill());
  };
};

/**
 * Aggressive Number Counter Animation
 */
export const runAggressiveCounter = (element: HTMLElement | null, targetVal: number, suffix = '', prefix = '') => {
  if (!element) return;

  const counter = { val: 0 };
  gsap.to(counter, {
    val: targetVal,
    duration: 2.2,
    ease: 'expo.out',
    scrollTrigger: {
      trigger: element,
      start: 'top 92%'
    },
    onUpdate: () => {
      if (element) {
        element.innerText = `${prefix}${Math.floor(counter.val)}${suffix}`;
      }
    }
  });
};

/**
 * Aggressive Magnetic Pull Effect for Buttons
 */
export const attachMagneticEffect = (button: HTMLElement | null) => {
  if (!button) return () => {};

  const handleMouseMove = (e: MouseEvent) => {
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(button, {
      x: x * 0.4,
      y: y * 0.4,
      scale: 1.06,
      ease: 'power2.out',
      duration: 0.28
    });
  };

  const handleMouseLeave = () => {
    gsap.to(button, {
      x: 0,
      y: 0,
      scale: 1,
      ease: 'elastic.out(1.3, 0.35)',
      duration: 0.8
    });
  };

  button.addEventListener('mousemove', handleMouseMove);
  button.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    button.removeEventListener('mousemove', handleMouseMove);
    button.removeEventListener('mouseleave', handleMouseLeave);
  };
};

/**
 * Aggressive 3D Card Hover Parallax
 */
export const attach3DTilt = (card: HTMLElement | null) => {
  if (!card) return () => {};

  const img = card.querySelector('img');
  const badge = card.querySelector('.gsap-card-badge');

  const handleMouseMove = (e: MouseEvent) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -14;
    const rotY = ((x - centerX) / centerX) * 14;

    gsap.to(card, {
      rotateX: rotX,
      rotateY: rotY,
      scale: 1.03,
      transformPerspective: 1000,
      boxShadow: '0 30px 60px -15px rgba(0, 15, 34, 0.25)',
      ease: 'power1.out',
      duration: 0.25
    });

    if (img) {
      gsap.to(img, {
        scale: 1.08,
        x: (x - centerX) * 0.04,
        y: (y - centerY) * 0.04,
        duration: 0.3,
        ease: 'power1.out'
      });
    }

    if (badge) {
      gsap.to(badge, {
        z: 25,
        scale: 1.08,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  };

  const handleMouseLeave = () => {
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      ease: 'elastic.out(1.15, 0.45)',
      duration: 0.85
    });

    if (img) {
      gsap.to(img, {
        scale: 1,
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'power3.out'
      });
    }

    if (badge) {
      gsap.to(badge, {
        z: 0,
        scale: 1,
        duration: 0.5,
        ease: 'power2.out'
      });
    }
  };

  card.addEventListener('mousemove', handleMouseMove);
  card.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    card.removeEventListener('mousemove', handleMouseMove);
    card.removeEventListener('mouseleave', handleMouseLeave);
  };
};
