import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell } from 'lucide-react';
import { useToast } from '../components/Toast';
import BottomNav from '../components/BottomNav';
import { MOCK_RECOMMEND_BOOKS } from './RecommendDetailPage';
import styles from './ExplorePage.module.css';

const BASE_RECOMMENDATIONS = [
  { title: '사랑의 기술', thumbnail: 'https://covers.openlibrary.org/b/isbn/9780062138927-M.jpg' },
  { title: '먹고 기도하고 사랑하라', thumbnail: 'https://covers.openlibrary.org/b/isbn/9780143038412-M.jpg' },
  { title: '물고기는 존재하지 않는다', thumbnail: 'https://covers.openlibrary.org/b/isbn/9781501160271-M.jpg' },
  { title: '브람스를 좋아하세요', thumbnail: 'https://covers.openlibrary.org/b/isbn/9780140020229-M.jpg' },
];

function shuffled(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function ExplorePage() {
  const [books, setBooks] = useState(BASE_RECOMMENDATIONS);
  const showToast = useToast();
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>탐색</h1>
        <div className={styles.headerIcons}>
          <button className={styles.iconBtn} aria-label="검색" onClick={() => showToast('준비중입니다')}><Search size={20} /></button>
          <button className={styles.iconBtn} aria-label="알림" onClick={() => showToast('준비중입니다')}><Bell size={20} /></button>
        </div>
      </header>

      <p className={styles.sectionTitle}>오티움님이 좋아하실만한 책</p>

      <div className={styles.grid}>
        {books.map((book, index) => {
          const detailId = MOCK_RECOMMEND_BOOKS[index]?.id;
          return (
            <div
              key={book.title}
              className={styles.gridItem}
              aria-label={book.title}
              onClick={() => detailId && navigate('/explore/recommend/' + detailId)}
              style={{ cursor: detailId ? 'pointer' : 'default' }}
            >
              <img
                src={book.thumbnail}
                alt={book.title}
                onError={(e) => { e.target.style.background = 'var(--color-border)'; e.target.style.display = 'none'; }}
              />
            </div>
          );
        })}
      </div>

      <div className={styles.cta}>
        <button className={styles.shuffleBtn} onClick={() => setBooks(shuffled(BASE_RECOMMENDATIONS))}>
          또 추천받기
        </button>
        <span className={styles.countdown}>다음 추천까지 D-2</span>
      </div>

      <BottomNav />
    </div>
  );
}
