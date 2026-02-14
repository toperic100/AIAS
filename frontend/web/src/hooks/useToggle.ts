
// frontend/web/src/hooks/useToggle.ts
import { useState, useCallback } from 'react';

/**
 * 切换Hook
 */
export function useToggle(initialValue: boolean = false): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue(v => !v);
  }, []);

  return [value, toggle, setValue];
}
