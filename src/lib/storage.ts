import { useEffect, useState } from 'react';

// 개인 보기 설정과 읽던 위치만 이 기기에 저장합니다.
// 비공개 창 등에서 저장이 막혀도 앱은 그대로 동작해야 하므로 모두 try/catch 합니다.

function read<T>(key: string, fallback: T, validate: (v: unknown) => v is T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    const v = JSON.parse(raw);
    return validate(v) ? v : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* 저장 못 해도 괜찮아요 */
  }
}

export function useStored<T>(key: string, fallback: T, validate: (v: unknown) => v is T) {
  const [value, setValue] = useState<T>(() => read(key, fallback, validate));
  useEffect(() => write(key, value), [key, value]);
  return [value, setValue] as const;
}
