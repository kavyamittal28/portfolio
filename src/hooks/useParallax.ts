import { useCallback, useState, type RefObject, type CSSProperties } from 'react';

interface ParallaxResult {
  handleMouseMove: (e: React.MouseEvent<HTMLElement>) => void;
  handleMouseLeave: () => void;
  getTransform: (depth: number) => CSSProperties;
}

export function useParallax(containerRef: RefObject<HTMLElement | null>): ParallaxResult {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      setPosition({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
      });
    },
    [containerRef],
  );

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  const getTransform = useCallback(
    (depth: number): CSSProperties => {
      return {
        transform: `translate(${position.x * depth}px, ${position.y * depth}px)`,
        transition: 'transform 0.1s ease-out',
      };
    },
    [position],
  );

  return { handleMouseMove, handleMouseLeave, getTransform };
}
