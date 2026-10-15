import { useCallback, useEffect, useRef, useState } from 'react';

// 브라우저에 들어있는 음성 읽기(Web Speech API)로 한 절씩 차례대로 읽어줍니다.
// 지금 읽는 절 번호를 알려줘서 화면에서 그 절을 표시할 수 있어요.

export const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

function koreanVoice(): SpeechSynthesisVoice | undefined {
  if (!speechSupported) return undefined;
  const voices = window.speechSynthesis.getVoices();
  return voices.find((v) => v.lang === 'ko-KR') ?? voices.find((v) => v.lang.startsWith('ko'));
}

export function useReadAloud(verses: string[] | null, rate: number) {
  const [current, setCurrent] = useState<number | null>(null); // 읽는 중인 절 (0부터), 아니면 null
  const run = useRef(0); // 멈추거나 장이 바뀌면 이전 읽기를 무시하기 위한 번호

  const stop = useCallback(() => {
    run.current++;
    if (speechSupported) window.speechSynthesis.cancel();
    setCurrent(null);
  }, []);

  const start = useCallback(
    (from = 0) => {
      if (!speechSupported || !verses?.length) return;
      window.speechSynthesis.cancel();
      const id = ++run.current;
      const voice = koreanVoice();

      const speak = (i: number) => {
        if (id !== run.current) return;
        if (i >= verses.length) {
          setCurrent(null);
          return;
        }
        setCurrent(i);
        const u = new SpeechSynthesisUtterance(verses[i]);
        u.lang = 'ko-KR';
        if (voice) u.voice = voice;
        u.rate = rate;
        u.onend = () => speak(i + 1);
        u.onerror = () => {
          if (id === run.current) setCurrent(null);
        };
        window.speechSynthesis.speak(u);
      };
      speak(from);
    },
    [verses, rate]
  );

  // 장이 바뀌거나 화면을 떠나면 멈춥니다.
  useEffect(() => stop, [verses, stop]);

  return { current, playing: current !== null, start, stop };
}
