import { useEffect } from 'react';
import { isValidPosition, type Position } from './lib/bible';
import { DEFAULT_SETTINGS, FONT_SIZES, isSettings, type Settings } from './lib/settings';
import { useStored } from './lib/storage';
import { backToReader, useRoute } from './lib/route';
import Reader from './screens/Reader';
import Picker from './screens/Picker';
import SettingsScreen from './screens/Settings';

const START: Position = { book: 43, chapter: 3 }; // 처음 열면 요한복음 3장

export default function App() {
  const route = useRoute();
  const [settings, setSettings] = useStored<Settings>('hb.settings', DEFAULT_SETTINGS, isSettings);
  const [position, setPosition] = useStored<Position>('hb.position', START, isValidPosition);

  // 화면 색과 글자 설정은 맨 바깥(html)에 걸어서 모든 화면에 적용합니다.
  useEffect(() => {
    const el = document.documentElement;
    el.dataset.theme = settings.theme;
    el.style.setProperty('--verse-size', `${FONT_SIZES[settings.size]}rem`);
    el.style.setProperty('--verse-leading', settings.wide ? '1.8' : '1.5');
    el.style.setProperty('--verse-weight', settings.bold ? '600' : '400');
    const color = getComputedStyle(el).getPropertyValue('--bar').trim();
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color || '#1F4E9E');
  }, [settings]);

  // 화면이 바뀌면 맨 위 제목으로 초점을 옮겨서, 화면 읽기 프로그램이 새 화면을 알려주게 합니다.
  useEffect(() => {
    document.querySelector<HTMLElement>('[data-screen-title]')?.focus();
  }, [route]);

  if (route === 'books') {
    return (
      <Picker
        position={position}
        onPick={(p) => {
          setPosition(p);
          backToReader();
        }}
      />
    );
  }
  if (route === 'settings') {
    return <SettingsScreen settings={settings} onChange={setSettings} />;
  }
  return <Reader position={position} onMove={setPosition} settings={settings} onChange={setSettings} />;
}
