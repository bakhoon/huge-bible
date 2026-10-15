// public/bible/krv/ 의 책별 파일이 books.json과 맞는지 확인합니다.
//   node scripts/check-bible.mjs

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const books = JSON.parse(readFileSync(join(root, 'src/data/books.json'), 'utf8'));

let verses = 0;
const problems = [];
for (const b of books) {
  const file = join(root, 'public/bible/krv', `${String(b.id).padStart(2, '0')}.json`);
  const chapters = JSON.parse(readFileSync(file, 'utf8'));
  if (chapters.length !== b.chapters) problems.push(`${b.name}: ${chapters.length}장 (기대 ${b.chapters}장)`);
  chapters.forEach((ch, i) => {
    if (!ch.length) problems.push(`${b.name} ${i + 1}장: 절이 없음`);
    ch.forEach((v, j) => {
      if (!v) problems.push(`${b.name} ${i + 1}:${j + 1} 빈 절`);
    });
    verses += ch.length;
  });
}

const john = JSON.parse(readFileSync(join(root, 'public/bible/krv/43.json'), 'utf8'));
console.log('요한복음 3:16 →', john[2][15]);
console.log(`${books.length}권, ${verses}절`);
if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
