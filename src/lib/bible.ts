import booksJson from '../data/books.json';

export type Testament = 'old' | 'new';

export interface Book {
  id: number;
  name: string;
  testament: Testament;
  chapters: number;
}

export interface Position {
  book: number; // 1~66
  chapter: number; // 1부터
}

export const BOOKS = booksJson as Book[];

export function getBook(id: number): Book {
  const b = BOOKS[id - 1];
  if (!b) throw new Error(`없는 책 번호: ${id}`);
  return b;
}

export function isValidPosition(p: unknown): p is Position {
  if (!p || typeof p !== 'object') return false;
  const { book, chapter } = p as Position;
  const b = BOOKS[book - 1];
  return Number.isInteger(chapter) && !!b && chapter >= 1 && chapter <= b.chapters;
}

/** 이전 장. 책의 처음이면 앞 책의 마지막 장으로. 창세기 1장이면 null */
export function prevPosition({ book, chapter }: Position): Position | null {
  if (chapter > 1) return { book, chapter: chapter - 1 };
  if (book > 1) return { book: book - 1, chapter: getBook(book - 1).chapters };
  return null;
}

/** 다음 장. 책의 끝이면 다음 책 1장으로. 요한계시록 마지막 장이면 null */
export function nextPosition({ book, chapter }: Position): Position | null {
  if (chapter < getBook(book).chapters) return { book, chapter: chapter + 1 };
  if (book < BOOKS.length) return { book: book + 1, chapter: 1 };
  return null;
}

export function label({ book, chapter }: Position): string {
  return `${getBook(book).name} ${chapter}장`;
}

// 책 한 권 = 장 배열, 장 = 절 문자열 배열
const cache = new Map<number, Promise<string[][]>>();

export function loadBook(id: number): Promise<string[][]> {
  let p = cache.get(id);
  if (!p) {
    const url = `${import.meta.env.BASE_URL}bible/krv/${String(id).padStart(2, '0')}.json`;
    p = fetch(url).then((res) => {
      if (!res.ok) throw new Error(`본문을 불러오지 못했어요 (${res.status})`);
      return res.json() as Promise<string[][]>;
    });
    p.catch(() => cache.delete(id));
    cache.set(id, p);
  }
  return p;
}

export async function loadChapter(pos: Position): Promise<string[]> {
  const chapters = await loadBook(pos.book);
  const verses = chapters[pos.chapter - 1];
  if (!verses) throw new Error('없는 장이에요');
  return verses;
}
