
// frontend/web/src/hooks/usePrevious.ts
import { useEffect, useRef } from 'react';

/**
 * 获取前一个值Hook
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
