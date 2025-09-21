import { useEffect, useRef, useState } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
}

export const useScrollAnimation = <T extends HTMLElement = HTMLElement>(options: UseScrollAnimationOptions = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<T>(null);

  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true,
    delay = 0,
  } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => setIsVisible(true), delay);
          } else {
            setIsVisible(true);
          }
          
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, delay]);

  return { ref, isVisible };
};

export const useStaggeredScrollAnimation = <T extends HTMLElement = HTMLElement>(
  itemCount: number,
  options: UseScrollAnimationOptions = {}
) => {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(
    new Array(itemCount).fill(false)
  );
  const containerRef = useRef<T>(null);

  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true,
  } = options;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Reveal items with staggered delay
          for (let i = 0; i < itemCount; i++) {
            setTimeout(() => {
              setVisibleItems(prev => {
                const newState = [...prev];
                newState[i] = true;
                return newState;
              });
            }, i * 100); // 100ms delay between each item
          }
          
          if (triggerOnce) {
            observer.unobserve(container);
          }
        } else if (!triggerOnce) {
          setVisibleItems(new Array(itemCount).fill(false));
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [itemCount, threshold, rootMargin, triggerOnce]);

  return { containerRef, visibleItems };
};