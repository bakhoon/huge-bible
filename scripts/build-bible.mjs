// 원본 성경 JSON을 책별 파일로 나눠 public/bible/krv/ 에 저장합니다.
//
// 사용법:
//   node scripts/build-bible.mjs <원본 ko_krv.json 경로>
//
// 원본: https://github.com/thiagobodruk/bible 의 json/ko_krv.json (개역한글, Korean Revised Version)
// 원본 형식: [{ abbrev, name, chapters: [[절, 절, ...], ...] }, ...] (66권, 성경 순서)
// 결과 형식: public/bible/krv/01.json ... 66.json, 각 파일은 [[절, 절, ...], ...] (장 배열)

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = process.argv[2];
if (!src) {
  console.error('원본 파일 경로를 넣어주세요: node scripts/build-bible.mjs <ko_krv.json>');
  process.exit(1);
}

const books = JSON.parse(readFileSync(join(root, 'src/data/books.json'), 'utf8'));
const raw = readFileSync(src, 'utf8').replace(/^﻿/, '');
const data = JSON.parse(raw);

if (data.length !== books.length) {
  throw new Error(`책 수가 다릅니다: 원본 ${data.length}권, books.json ${books.length}권`);
}

const outDir = join(root, 'public/bible/krv');
mkdirSync(outDir, { recursive: true });

let verses = 0;
data.forEach((book, i) => {
  const meta = books[i];
  if (book.chapters.length !== meta.chapters) {
    throw new Error(`${meta.name}: 장 수가 다릅니다 (원본 ${book.chapters.length}, books.json ${meta.chapters})`);
  }
  const chapters = book.chapters.map((ch) => ch.map((v) => String(v).replace(/\s+/g, ' ').trim()));
  verses += chapters.reduce((n, ch) => n + ch.length, 0);
  const file = join(outDir, `${String(meta.id).padStart(2, '0')}.json`);
  writeFileSync(file, JSON.stringify(chapters));
});

console.log(`완료: ${data.length}권, ${verses}절 → public/bible/krv/`);
