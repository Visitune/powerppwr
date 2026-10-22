import { useEffect, useState } from 'react';

/** useState backed by localStorage. Falls back silently when storage is unavailable or the value is invalid. */
export function usePersistentState<T>(key: string, initial: T, isValid: (v: unknown) => v is T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) {
        const parsed: unknown = JSON.parse(raw);
        if (isValid(parsed)) return parsed;
      }
    } catch { /* storage unavailable or corrupted */ }
    return initial;
  });

  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable */ }
  }, [key, value]);

  return [value, setValue];
}
