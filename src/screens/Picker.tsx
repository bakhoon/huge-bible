import { useState } from 'react';
import { Icon } from '../components/Icon';
import { BOOKS, getBook, label, type Book, type Position, type Testament } from '../lib/bible';
import { backToReader } from '../lib/route';

interface Props {
  position: Position;
  onPick: (p: Position) => void;
}

// 한 번에 하나만 고르게 합니다: 구약/신약 → 책 → 장.
// 66권을 한 화면에 다 보여주면 글씨와 버튼이 작아지기 때문이에요.

export default function Picker({ position, onPick }: Props) {
  const current = getBook(position.book);
  const [testament, setTestament] = useState<Testament>(current.testament);
  const [book, setBook] = useState<Book | null>(null);

  if (book) {
    return (
      <div className="screen">
        <header className="pagehead">
          <p className="eyebrow">{book.testament === 'new' ? '신약' : '구약'}</p>
          <h1 tabIndex={-1} data-screen-title>
            {book.name}
          </h1>
          <p className="lead">몇 장을 읽을까요?</p>
        </header>
        <main className="content">
          <div className="chapter-grid">
            {Array.from({ length: book.chapters }, (_, i) => i + 1).map((n) => {
              const here = book.id === position.book && n === position.chapter;
              return (
                <button
                  key={n}
                  type="button"
                  className={`chapter-button${here ? ' is-current' : ''}`}
                  aria-label={`${book.name} ${n}장${here ? ', 지금 읽는 곳' : ''}`}
                  aria-current={here ? 'true' : undefined}
                  onClick={() => onPick({ book: book.id, chapter: n })}
                >
                  {n}
                </button>
              );
            })}
          </div>
        </main>
        <footer className="bottombar">
          <button type="button" className="big-button wide" onClick={() => setBook(null)}>
            <Icon name="left" size={28} />
            다른 책 고르기
          </button>
        </footer>
      </div>
    );
  }

  const list = BOOKS.filter((b) => b.testament === testament);

  return (
    <div className="screen">
      <header className="pagehead">
        <h1 tabIndex={-1} data-screen-title>
          어느 책을 읽을까요?
        </h1>
        <button type="button" className="resume-button" onClick={backToReader}>
          <span>이어 읽기 · {label(position)}</span>
          <Icon name="right" size={28} />
        </button>
        <div className="segmented" role="group" aria-label="구약 신약 고르기">
          <button type="button" aria-pressed={testament === 'old'} onClick={() => setTestament('old')}>
            구약 <small>39권</small>
          </button>
          <button type="button" aria-pressed={testament === 'new'} onClick={() => setTestament('new')}>
            신약 <small>27권</small>
          </button>
        </div>
      </header>
      <main className="content">
        <ul className="book-list">
          {list.map((b) => (
            <li key={b.id}>
              <button
                type="button"
                className={`book-button${b.id === position.book ? ' is-current' : ''}`}
                aria-current={b.id === position.book ? 'true' : undefined}
                onClick={() => setBook(b)}
              >
                <span>{b.name}</span>
                <small>{b.chapters}장</small>
              </button>
            </li>
          ))}
        </ul>
      </main>
      <footer className="bottombar">
        <button type="button" className="big-button wide" onClick={backToReader}>
          <Icon name="left" size={28} />
          읽던 곳으로
        </button>
      </footer>
    </div>
  );
}
