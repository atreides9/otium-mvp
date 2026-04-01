import { useNavigate } from 'react-router-dom';
import { Search, Bell } from 'lucide-react';
import { useToast } from '../components/Toast';
import { useAuthStore } from '../store/authStore';
import { useRecommendations } from '../hooks/useRecommendations';
import BottomNav from '../components/BottomNav';
import styles from './ExplorePage.module.css';

export default function ExplorePage() {
  const { user } = useAuthStore();
  const { books, isLoading, daysUntilNext, isRequesting, requestNew } = useRecommendations(user?.id);
  const showToast = useToast();
  const navigate = useNavigate();

  const isOnCooldown = daysUntilNext > 0;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>탐색</h1>
        <div className={styles.headerIcons}>
          <button className={styles.iconBtn} aria-label="검색" onClick={() => showToast('준비중입니다')}><Search size={20} /></button>
          <button className={styles.iconBtn} aria-label="알림" onClick={() => showToast('준비중입니다')}><Bell size={20} /></button>
        </div>
      </header>

      {isLoading ? (
        <>
          <p className={styles.sectionTitle}>오티움님이 좋아하실만한 책</p>
          <div className={styles.grid}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={`${styles.gridItem} ${styles.skeleton}`} />
            ))}
          </div>
        </>
      ) : books.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>아직 추천 책이 없어요</p>
          <p className={styles.emptySubText}>독서 기록을 쌓으면 맞춤 추천을 받을 수 있어요</p>
          <button className={styles.shuffleBtn} onClick={requestNew} disabled={isRequesting}>
            {isRequesting ? '추천 생성 중...' : '추천받기'}
          </button>
        </div>
      ) : (
        <>
          <p className={styles.sectionTitle}>오티움님이 좋아하실만한 책</p>
          <div className={styles.grid}>
            {books.map((book) => (
              <div
                key={book.isbn ?? book.id ?? book.title}
                className={styles.gridItem}
                aria-label={book.title}
                onClick={() => navigate('/explore/rec-detail', { state: { book, reason: book.reason_copy } })}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={book.cover_url ?? book.thumbnail}
                  alt={book.title}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            ))}
          </div>

          <div className={styles.cta}>
            <button
              className={styles.shuffleBtn}
              onClick={requestNew}
              disabled={isOnCooldown || isRequesting}
            >
              {isRequesting ? (
                <span className={styles.btnSpinner} />
              ) : (
                '또 추천받기'
              )}
            </button>
            {isOnCooldown && (
              <span className={styles.countdown}>다음 추천까지 D-{daysUntilNext}</span>
            )}
          </div>
        </>
      )}

      <BottomNav />
    </div>
  );
}
