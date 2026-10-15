import { useEffect, useRef, useState } from 'react';
import { Icon } from '../components/Icon';
import { label, loadChapter, nextPosition, prevPosition, type Position } from '../lib/bible';
import { FONT_SIZES, SPEEDS, type Settings } from '../lib/settings';
import { speechSupported, useReadAloud } from '../lib/speech';
import { open } from '../lib/route';

interface Props {
  position: Position;
  onMove: (p: Position) => void;
  settings: Settings;
  onChange: (s: Settings) => void;
}

type Load = { state: 'loading' } | { state: 'ok'; verses: string[] } | { state: 'error'; message: string };

export default function Reader({ position, onMove, settings, onChange }: Props) {
  const [load, setLoad] = useState<Load>({ state: 'loading' });
  const [retry, setRetry] = useState(0);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let alive = true;
    setLoad({ state: 'loading' });
    loadChapter(position)
      .then((verses) => alive && setLoad({ state: 'ok', verses }))
      .catch((e: Error) => alive && setLoad({ state: 'error', message: e.message }));
    mainRef.current?.scrollTo({ top: 0 });
    return () => {
      alive = false;
    };
  }, [position.book, position.chapter, retry]);

  const verses = load.state === 'ok' ? load.verses : null;
  const speech = useReadAloud(verses, SPEEDS[settings.speed].rate);

  // 읽어주는 절이 바뀌면 그 절이 보이도록 화면을 옮깁니다.
  useEffect(() => {
    if (speech.current == null) return;
    document.getElementById(`v${speech.current + 1}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [speech.current]);

  const prev = prevPosition(position);
  const next = nextPosition(position);
  const maxSize = FONT_SIZES.length - 1;
  const setSize = (size: number) => onChange({ ...settings, size: Math.max(0, Math.min(maxSize, size)) });

  return (
    <div className="screen">
      <header className="topbar">
        <h1 className="sr-only" tabIndex={-1} data-screen-title>
          {label(position)}
        </h1>
        <button type="button" className="title-button" onClick={() => open('books')} aria-label={`${label(position)}, 다른 곳 고르기`}>
          <span>{label(position)}</span>
          <Icon name="down" size={26} />
        </button>
        <div className="topbar-actions">
          {speechSupported && (
            <button
              type="button"
              className="icon-button"
              aria-pressed={speech.playing}
              aria-label={speech.playing ? '읽어주기 멈추기' : '소리로 듣기'}
              onClick={() => (speech.playing ? speech.stop() : speech.start())}
              disabled={!verses}
            >
              <Icon name={speech.playing ? 'stop' : 'speaker'} />
            </button>
          )}
          <button type="button" className="icon-button" aria-label="보기 설정" onClick={() => open('settings')}>
            <Icon name="sliders" />
          </button>
        </div>
      </header>

      <main className="content" ref={mainRef}>
        {load.state === 'loading' && <p className="status">불러오는 중이에요…</p>}
        {load.state === 'error' && (
          <div className="status">
            <p>{load.message}</p>
            <button type="button" className="big-button" onClick={() => setRetry((n) => n + 1)}>
              다시 해보기
            </button>
          </div>
        )}
        {verses?.map((text, i) => (
          <p key={i} id={`v${i + 1}`} className={`verse${speech.current === i ? ' is-reading' : ''}`}>
            <span className="verse-number">{i + 1}</span>
            {text}
          </p>
        ))}
        {verses && next && (
          <button type="button" className="big-button end-next" onClick={() => onMove(next)}>
            다음 장 읽기 · {label(next)}
          </button>
        )}
      </main>

      <footer className="bottombar">
        <p className="size-label" aria-live="polite">
          글자 크기 {settings.size + 1} / {FONT_SIZES.length}
        </p>
        <nav className="bottom-buttons" aria-label="읽기 버튼">
          <button type="button" className="bar-button" disabled={!prev} onClick={() => prev && onMove(prev)}>
            <Icon name="left" />
            이전 장
          </button>
          <button
            type="button"
            className="bar-button"
            disabled={settings.size === 0}
            onClick={() => setSize(settings.size - 1)}
            aria-label="글자 작게"
          >
            <span className="glyph small" aria-hidden="true">가−</span>
            작게
          </button>
          <button
            type="button"
            className="bar-button"
            disabled={settings.size === maxSize}
            onClick={() => setSize(settings.size + 1)}
            aria-label="글자 크게"
          >
            <span className="glyph large" aria-hidden="true">가+</span>
            크게
          </button>
          <button type="button" className="bar-button primary" disabled={!next} onClick={() => next && onMove(next)}>
            <Icon name="right" />
            다음 장
          </button>
        </nav>
      </footer>
    </div>
  );
}
