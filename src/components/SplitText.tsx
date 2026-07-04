import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: 'chars' | 'words' | 'lines';
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  onLetterAnimationComplete?: () => void;
}

export default function SplitText({
  text,
  className = '',
  delay = 50,
  duration = 1.25,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'center',
  tag = 'p',
  onLetterAnimationComplete
}: SplitTextProps) {
  const containerRef = useRef<HTMLElement>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    if (document.fonts.status === 'loaded') {
      setFontsLoaded(true);
    } else {
      document.fonts.ready.then(() => {
        setFontsLoaded(true);
      });
    }
  }, []);

  const words = text.split(' ');

  useGSAP(() => {
    if (!containerRef.current || !fontsLoaded) return;

    const el = containerRef.current;
    const targets = el.querySelectorAll('.animate-item');

    if (!targets.length) return;

    const startPct = (1 - threshold) * 100;
    const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
    const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
    const marginUnit = marginMatch ? marginMatch[2] || 'px' : 'px';
    const sign =
      marginValue === 0
        ? ''
        : marginValue < 0
          ? `-=${Math.abs(marginValue)}${marginUnit}`
          : `+=${marginValue}${marginUnit}`;
    const start = `top ${startPct}%${sign}`;

    gsap.fromTo(
      targets,
      from,
      {
        ...to,
        duration,
        ease,
        stagger: delay / 1000,
        scrollTrigger: {
          trigger: el,
          start,
          once: true,
          fastScrollEnd: true,
        },
        onComplete: () => {
          onLetterAnimationComplete?.();
        }
      }
    );
  }, {
    dependencies: [text, delay, duration, ease, splitType, JSON.stringify(from), JSON.stringify(to), threshold, rootMargin, fontsLoaded],
    scope: containerRef
  });

  const style = {
    textAlign,
    wordWrap: 'break-word' as const,
  };

  const Tag = tag as any;

  return (
    <Tag ref={containerRef} style={style} className={`inline-block ${className}`}>
      {splitType === 'words' ? (
        words.map((word, wordIdx) => (
          <span
            key={wordIdx}
            className="animate-item inline-block"
            style={{ willChange: 'transform, opacity' }}
          >
            {word}{wordIdx < words.length - 1 && '\u00A0'}
          </span>
        ))
      ) : (
        words.map((word, wordIdx) => (
          <span key={wordIdx} className="inline-block whitespace-nowrap">
            {word.split('').map((char, charIdx) => (
              <span
                key={charIdx}
                className="animate-item inline-block"
                style={{ willChange: 'transform, opacity' }}
              >
                {char}
              </span>
            ))}
            {wordIdx < words.length - 1 && <span className="inline-block">&nbsp;</span>}
          </span>
        ))
      )}
    </Tag>
  );
}
