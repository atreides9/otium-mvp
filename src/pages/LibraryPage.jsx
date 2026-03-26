import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Plus } from 'lucide-react';
import { useBookStore } from '../store/bookStore';
import { useToast } from '../components/Toast';
import BottomNav from '../components/BottomNav';
import styles from './LibraryPage.module.css';

const MOCK_BOOKS = [
  { isbn: '9788936434595', title: '채식주의자', thumbnail: 'https://covers.openlibrary.org/b/isbn/9781101906118-M.jpg' },
  { isbn: '9788954651135', title: '82년생 김지영', thumbnail: 'https://covers.openlibrary.org/b/isbn/9781982102494-M.jpg' },
  { isbn: '9788932917245', title: '아몬드', thumbnail: 'https://covers.openlibrary.org/b/isbn/9781250299451-M.jpg' },
  { isbn: '9788937460449', title: '1984', thumbnail: 'https://covers.openlibrary.org/b/isbn/9780451524935-M.jpg' },
  { isbn: '9788901210978', title: '해리포터', thumbnail: 'https://covers.openlibrary.org/b/isbn/9780439708180-M.jpg' },
  { isbn: '9788998139766', title: '코스모스', thumbnail: 'https://covers.openlibrary.org/b/isbn/9780345539434-M.jpg' },
  { isbn: '9788932473825', title: '노르웨이의 숲', thumbnail: 'https://covers.openlibrary.org/b/isbn/9780375704024-M.jpg' },
  { isbn: '9788936352578', title: '데미안', thumbnail: 'https://covers.openlibrary.org/b/isbn/9780374523404-M.jpg' },
  { isbn: '9791130620190', title: '파친코', thumbnail: 'https://covers.openlibrary.org/b/isbn/9781455563920-M.jpg' },
  { isbn: '9788934972464', title: '어린왕자', thumbnail: 'https://covers.openlibrary.org/b/isbn/9780156012195-M.jpg' },
  { isbn: '9788937460067', title: '동물농장', thumbnail: 'https://covers.openlibrary.org/b/isbn/9780451526342-M.jpg' },
  { isbn: '9788954442428', title: '살인자의 기억법', thumbnail: 'https://covers.openlibrary.org/b/isbn/9780544985780-M.jpg' },
];

export default function LibraryPage() {
  const navigate = useNavigate();
  const { records, loading, fetchRecords } = useBookStore();
  const showToast = useToast();
  const [activeTab, setActiveTab] = useState('서재');

  useEffect(() => { fetchRecords(); }, []);

  const visibleRecords = records.filter(
    (r) => r.status === '완독' || r.status === '읽는중'
  );
  const displayBooks = visibleRecords.length > 0 ? visibleRecords : null;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.tabSwitch}>
          {['서재', '챌린지'].map((t) => (
            <button
              key={t}
              className={`${styles.tabBtn} ${activeTab === t ? styles.activeTab : ''}`}
              onClick={() => t === '챌린지' ? showToast('준비중입니다') : setActiveTab(t)}
              aria-pressed={activeTab === t}
            >
              {t}
            </button>
          ))}
        </div>
        <div className={styles.headerIcons}>
          <button className={styles.iconBtn} aria-label="검색" onClick={() => showToast('준비중입니다')}><Search size={20} /></button>
          <button className={styles.iconBtn} aria-label="알림" onClick={() => showToast('준비중입니다')}><Bell size={20} /></button>
        </div>
      </header>

      {activeTab === '서재' ? (
        <>
          <div className={styles.hero}>
            <p className={styles.subtitle}>책 읽고 싶어지는 저녁이에요,</p>
            <h1 className={styles.heroTitle}>오티움님의 서재</h1>
            <div className={styles.streakRow}>
              <span className={styles.streakLeft}>🔥 1일 연속 독서 중</span>
              <span className={styles.streakRight}>{visibleRecords.length}권 / {records.length}권</span>
            </div>
          </div>

          {loading ? (
            <div className={styles.empty}><span>불러오는 중...</span></div>
          ) : displayBooks ? (
            <div className={styles.grid}>
              {displayBooks.map((r) => (
                <button
                  key={r.id}
                  className={styles.gridItem}
                  onClick={() => navigate(`/record/${r.kakao_isbn}`, { state: { book: r, existing: true } })}
                  aria-label={r.title}
                >
                  <img src={r.thumbnail || '/book-placeholder.png'} alt={r.title} onError={(e) => { e.target.src = '/book-placeholder.png'; }} />
                </button>
              ))}
            </div>
          ) : (
            <div className={styles.grid}>
              {MOCK_BOOKS.map((b) => (
                <div key={b.isbn} className={styles.gridItem} aria-hidden="true">
                  <img src={b.thumbnail} alt={b.title} onError={(e) => { e.target.src = '/book-placeholder.svg'; }} />
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className={styles.empty}>
          <p>참여중인 챌린지가 없어요</p>
        </div>
      )}

      <button className={styles.fab} onClick={() => navigate('/search')} aria-label="책 추가하기">
        <Plus size={28} />
      </button>

      <BottomNav />
    </div>
  );
}
