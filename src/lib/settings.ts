export type Theme = 'light' | 'dark' | 'contrast';

export interface Settings {
  size: number; // FONT_SIZES 의 번호
  theme: Theme;
  wide: boolean; // 줄 간격 넓게
  bold: boolean; // 굵은 글씨
  speed: number; // SPEEDS 의 번호
}

/** 본문 글자 크기 (rem). 브라우저/휴대폰 글자 크기 설정을 따라 같이 커지도록 rem을 씁니다. */
export const FONT_SIZES = [1.75, 2.125, 2.5, 3, 3.5];

export const THEMES: { id: Theme; name: string }[] = [
  { id: 'light', name: '밝게' },
  { id: 'dark', name: '어둡게' },
  { id: 'contrast', name: '고대비' }
];

export const SPEEDS: { name: string; rate: number }[] = [
  { name: '느리게', rate: 0.7 },
  { name: '보통', rate: 0.9 },
  { name: '빠르게', rate: 1.15 }
];

export const DEFAULT_SETTINGS: Settings = { size: 1, theme: 'light', wide: true, bold: true, speed: 0 };

export function isSettings(v: unknown): v is Settings {
  if (!v || typeof v !== 'object') return false;
  const s = v as Settings;
  return (
    Number.isInteger(s.size) && s.size >= 0 && s.size < FONT_SIZES.length &&
    THEMES.some((t) => t.id === s.theme) &&
    typeof s.wide === 'boolean' &&
    typeof s.bold === 'boolean' &&
    Number.isInteger(s.speed) && s.speed >= 0 && s.speed < SPEEDS.length
  );
}

/** 화면에 보여줄 크기 (기본 글자 16px 기준 포인트) */
export function sizeInPoints(size: number): number {
  return Math.round(FONT_SIZES[size] * 16);
}
