# 큰 글씨 성경 (huge-bible)

눈이 잘 안 보이는 분들을 위한 큰 글씨 성경 웹앱이에요. 휴대폰 화면에 맞춰 만들었고, 홈 화면에 설치하면 인터넷 없이도 읽을 수 있어요(PWA).

## 화면

- **읽기**: 본문을 큰 글씨로 보여줘요. 아래에 항상 `이전 장 · 작게 · 크게 · 다음 장` 버튼이 있어요. 위에는 `듣기`(소리로 읽어주기, 읽는 절 표시)와 `보기 설정` 버튼.
- **책·장 고르기**: 한 번에 하나씩 골라요. `이어 읽기` → `구약 / 신약` → 책 → 장.
- **보기 설정**: 글자 크기 5단계(28~56pt), 화면 색 3가지(밝게 / 어둡게 / 고대비), 줄 간격, 굵은 글씨, 읽어주기 속도.

설정과 읽던 위치는 그 기기에 저장돼요.

## 저시력 사용자를 위해 신경 쓴 것

- 모든 크기를 `rem`으로 해서 휴대폰·브라우저의 글자 크기 설정을 따라 같이 커져요.
- 핀치 줌을 막지 않아요.
- 글자 대비는 모든 테마에서 7:1 이상이에요. 고대비는 검정 바탕에 노란 글씨.
- 버튼은 높이 72~88px, 아이콘에는 항상 글자를 같이 붙였어요.
- 한국어 단어가 줄 끝에서 잘리지 않게 `word-break: keep-all`.
- 버튼마다 화면 읽기 프로그램(VoiceOver/TalkBack)용 이름이 있고, 화면이 바뀌면 제목으로 초점이 옮겨가요.

## 실행

```bash
npm install
npm run dev        # 개발 서버
npm run build      # 배포용 빌드 (dist/)
npm run preview    # 빌드 결과 미리보기
```

GitHub Pages처럼 하위 경로에 올릴 때는 `BASE=/huge-bible/ npm run build`.

## 성경 본문

- 번역: **개역한글** (Korean Revised Version, 1961). 저작권이 끝난 번역이에요.
  개역개정은 대한성서공회 저작권이 있어서 쓰려면 허락이 필요해요.
- 원본 데이터: [thiagobodruk/bible](https://github.com/thiagobodruk/bible) 의 `json/ko_krv.json`
- `public/bible/krv/01.json` ~ `66.json`: 책 한 권씩 나눈 파일. 각 파일은 `[[1절, 2절, ...], [1절, ...], ...]` (장 배열).
- 책 이름과 장 수: `src/data/books.json`

원본에서 다시 만들기, 확인하기:

```bash
node scripts/build-bible.mjs <ko_krv.json 경로>
npm run bible:check
```

## 구조

```
src/
  App.tsx              화면 전환, 설정·위치 저장, 테마 적용
  screens/Reader.tsx   읽기 화면
  screens/Picker.tsx   구약/신약 → 책 → 장 고르기
  screens/Settings.tsx 보기 설정
  lib/bible.ts         책 정보, 본문 불러오기, 이전/다음 장 계산
  lib/speech.ts        소리로 읽어주기 (Web Speech API)
  lib/settings.ts      글자 크기, 테마, 속도 값
  lib/storage.ts       기기에 저장 (localStorage)
  lib/route.ts         주소(#) 기반 화면 이동
  styles.css           테마 색과 전체 스타일
```
