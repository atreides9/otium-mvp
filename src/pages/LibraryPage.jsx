import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Plus, Users, ChevronRight } from 'lucide-react';
import { useBookStore } from '../store/bookStore';
import { useAuthStore } from '../store/authStore';
import BottomNav from '../components/BottomNav';
import styles from './LibraryPage.module.css';

const JOINED_CHALLENGES = [
  {
    id: 1,
    title: '완독 기록 누적 100m 가보자고 🔥',
    desc: '함께 쌓는 독서 기록, 100m 달성!',
    dday: 'D-12',
    members: '25/40명',
  },
  {
    id: 2,
    title: '클럽 총합 50권 도전 📚',
    desc: '한 달 안에 클럽 전체 50권 완독',
    dday: 'D-42',
    members: '18/30명',
  },
];

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
  const nickname = useAuthStore((s) => s.nickname);
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
              onClick={() => setActiveTab(t)}
              aria-pressed={activeTab === t}
            >
              {t}
            </button>
          ))}
        </div>
        <div className={styles.headerIcons}>
          <button className={styles.iconBtn} aria-label="검색" onClick={() => navigate('/search')}><Search size={20} /></button>
          <button className={styles.iconBtn} aria-label="알림" onClick={() => navigate('/mypage/notices')}><Bell size={20} /></button>
        </div>
      </header>

      {activeTab === '서재' ? (
        <>
          <div className={styles.hero}>
            <p className={styles.subtitle}>책 읽고 싶어지는 저녁이에요,</p>
            <h1 className={styles.heroTitle}>{nickname ?? '...'}님의 서재</h1>
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
                  onClick={() => navigate(`/book/${r.kakao_isbn}`, { state: { record: r } })}
                  aria-label={r.title}
                >
                  <img src={r.thumbnail || '/book-placeholder.png'} alt={r.title} style={r.status !== '완독' ? { opacity: 0.55, filter: 'blur(3px) brightness(0.8) saturate(0.5)', transform: 'scale(1.04)' } : {}} onError={(e) => { e.target.src = '/book-placeholder.png'; }} />
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
        <div style={{ padding: '0 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0 16px' }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-primary)' }}>참여중인 챌린지</h2>
            <button
              onClick={() => navigate('/challenges')}
              style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 13, color: 'var(--color-text-tertiary)', cursor: 'pointer' }}
            >
              챌린지 찾기 <ChevronRight size={16} />
            </button>
          </div>
          {JOINED_CHALLENGES.length === 0 ? (
            <div className={styles.empty}>
              <p>참여중인 챌린지가 없어요</p>
              <button
                onClick={() => navigate('/challenges')}
                style={{ padding: '10px 20px', borderRadius: 20, background: 'var(--secondary-500)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
              >
                챌린지 찾아보기
              </button>
            </div>
          ) : (
            JOINED_CHALLENGES.map((ch) => (
              <div
                key={ch.id}
                style={{
                  background: 'var(--color-surface-raised)',
                  borderRadius: 12,
                  padding: '16px',
                  marginBottom: 12,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--secondary-500)', flex: 1, lineHeight: 1.4 }}>
                    {ch.title}
                  </span>
                  <span style={{ fontSize: 13, color: 'var(--secondary-500)', fontWeight: 600, marginLeft: 8, flexShrink: 0 }}>
                    {ch.dday}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--color-text-tertiary)', margin: '0 0 12px' }}>{ch.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--color-text-tertiary)' }}>
                  <Users size={14} />
                  {ch.members}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <button className={styles.fab} onClick={() => navigate('/search')} aria-label="책 추가하기">
        <Plus size={28} />
      </button>

      <BottomNav />
    </div>
  );
}
