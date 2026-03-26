import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search } from 'lucide-react';
import { useBookSearch } from '../hooks/useBookSearch';
import BookCard from '../components/BookCard';
import styles from './SearchPage.module.css';

export default function SearchPage() {
  const navigate = useNavigate();
  const { query, setQuery, results, loading, error } = useBookSearch();
  const [selected, setSelected] = useState(null);

  const handleSelect = (book) => {
    setSelected(book);
    navigate(`/record/${book.isbn}`, { state: { book } });
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)} aria-label="뒤로가기">
          <ChevronLeft size={24} />
        </button>
        <h1 className={styles.headerTitle}>책 기록</h1>
        <button className={styles.nextBtn} disabled={!selected} aria-label="다음 단계">
          다음
        </button>
      </header>

      <div className={styles.searchBox}>
        <div className={styles.inputWrapper}>
          <input
            className={styles.input}
            type="search"
            placeholder="책 제목, 저자를 검색해보세요"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="책 검색"
            autoFocus
          />
          <span className={styles.searchIcon} aria-hidden="true"><Search size={18} /></span>
        </div>
      </div>

      <div className={styles.results}>
        {loading && <p className={styles.status}>검색 중...</p>}
        {error && <p className={`${styles.status} ${styles.error}`}>{error}</p>}
        {!loading && !error && query && results.length === 0 && (
          <p className={styles.status}>검색 결과가 없어요</p>
        )}
        {results.map((book) => (
          <BookCard key={book.isbn} book={book} onClick={() => handleSelect(book)} />
        ))}
      </div>
    </div>
  );
}
