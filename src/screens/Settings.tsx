import { FONT_SIZES, SPEEDS, THEMES, sizeInPoints, type Settings } from '../lib/settings';
import { speechSupported } from '../lib/speech';
import { backToReader } from '../lib/route';

interface Props {
  settings: Settings;
  onChange: (s: Settings) => void;
}

export default function SettingsScreen({ settings, onChange }: Props) {
  const set = (patch: Partial<Settings>) => onChange({ ...settings, ...patch });
  const max = FONT_SIZES.length - 1;

  return (
    <div className="screen">
      <header className="pagehead">
        <h1 tabIndex={-1} data-screen-title>
          보기 설정
        </h1>
      </header>

      <main className="content settings">
        <div className="preview verse" aria-label="미리보기">
          하나님이 세상을 이처럼 사랑하사
        </div>

        <section aria-labelledby="s-size">
          <h2 id="s-size">글자 크기</h2>
          <div className="stepper">
            <button
              type="button"
              className="big-button"
              aria-label="글자 작게"
              disabled={settings.size === 0}
              onClick={() => set({ size: settings.size - 1 })}
            >
              가−
            </button>
            <p aria-live="polite">
              {sizeInPoints(settings.size)}
              <small> 포인트</small>
            </p>
            <button
              type="button"
              className="big-button glyph-large"
              aria-label="글자 크게"
              disabled={settings.size === max}
              onClick={() => set({ size: settings.size + 1 })}
            >
              가+
            </button>
          </div>
        </section>

        <section aria-labelledby="s-theme">
          <h2 id="s-theme">화면 색</h2>
          <div className="choice-grid three" role="group" aria-labelledby="s-theme">
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`swatch swatch-${t.id}`}
                aria-pressed={settings.theme === t.id}
                onClick={() => set({ theme: t.id })}
              >
                <span className="swatch-glyph" aria-hidden="true">가</span>
                {t.name}
              </button>
            ))}
          </div>
        </section>

        <section aria-labelledby="s-leading">
          <h2 id="s-leading">줄 간격</h2>
          <div className="choice-grid two" role="group" aria-labelledby="s-leading">
            <button type="button" className="choice" aria-pressed={!settings.wide} onClick={() => set({ wide: false })}>
              보통
            </button>
            <button type="button" className="choice" aria-pressed={settings.wide} onClick={() => set({ wide: true })}>
              넓게
            </button>
          </div>
        </section>

        <section aria-labelledby="s-bold">
          <h2 id="s-bold">굵은 글씨</h2>
          <button
            type="button"
            className="choice wide"
            role="switch"
            aria-checked={settings.bold}
            aria-labelledby="s-bold"
            onClick={() => set({ bold: !settings.bold })}
          >
            {settings.bold ? '켜짐' : '꺼짐'}
          </button>
        </section>

        {speechSupported && (
          <section aria-labelledby="s-speed">
            <h2 id="s-speed">읽어주기 속도</h2>
            <div className="choice-grid three" role="group" aria-labelledby="s-speed">
              {SPEEDS.map((s, i) => (
                <button key={s.name} type="button" className="choice" aria-pressed={settings.speed === i} onClick={() => set({ speed: i })}>
                  {s.name}
                </button>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="bottombar">
        <button type="button" className="big-button wide primary" onClick={backToReader}>
          완료
        </button>
      </footer>
    </div>
  );
}
