

// frontend/web/src/hooks/useInterval.ts
import { useEffect, useRef } from 'react';

/**
 * 定时器Hook
 */
export function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const tick = () => savedCallback.current?.();
    const id = setInterval(tick, delay);

    return () => clearInterval(id);
  }, [delay]);
}

