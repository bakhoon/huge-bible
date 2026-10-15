import { useEffect, useState } from 'react';

// 아주 단순한 주소(#) 기반 화면 이동.
// 휴대폰의 "뒤로" 버튼이 앱 안에서 이전 화면으로 돌아가게 해줍니다.

export type Route = 'read' | 'books' | 'settings';

function parse(hash: string): Route {
  if (hash === '#/books') return 'books';
  if (hash === '#/settings') return 'settings';
  return 'read';
}

export function useRoute() {
  const [route, setRoute] = useState<Route>(() => parse(location.hash));
  useEffect(() => {
    const on = () => setRoute(parse(location.hash));
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}

// 읽기 화면에서 열었으면 "돌아가기"는 기록을 한 칸 되돌립니다.
// (새로고침 등으로 바로 들어왔으면 그냥 읽기 화면으로 이동)
let openedFromReader = false;

export function open(route: Exclude<Route, 'read'>) {
  openedFromReader = parse(location.hash) === 'read';
  location.hash = `#/${route}`;
}

export function backToReader() {
  if (openedFromReader) {
    openedFromReader = false;
    history.back();
  } else {
    location.hash = '#/';
  }
}
