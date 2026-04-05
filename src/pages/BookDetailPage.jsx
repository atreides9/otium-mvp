import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useBookStore } from '../store/bookStore';
import BottomNav from '../components/BottomNav';
import StarRating from '../components/StarRating';
import styles from './BookDetailPage.module.css';

const STATUS_COLORS = {
  '완독': 'var(--secondary-500)',
  '읽는중': '#3B82F6',
  '읽고싶은': '#F59E0B',
  '중단': 'var(--color-icon-muted)',
  '하차': '#EF4444',
};

export default function BookDetailPage() {
  const navigate = useNavigate();
  const { isbn } = useParams();
  const { state } = useLocation();
  const records = useBookStore((s) => s.records);

  const record = state?.record ?? records.find((r) => r.kakao_isbn === isbn);

  if (!record) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <button className={styles.backBtn} onClick={() => navigate(-1)} aria-label="뒤로가기">
            <ChevronLeft size={24} />
          </button>
          <span className={styles.headerTitle}>독서 기록</span>
          <span className={styles.editBtn} />
        </header>
        <div className={styles.empty}>책 정보를 찾을 수 없어요</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)} aria-label="뒤로가기">
          <ChevronLeft size={24} />
        </button>
        <span className={styles.headerTitle}>독서 기록</span>
        <button
          className={styles.editBtn}
          onClick={() => navigate(`/record/${isbn}`, { state: { book: record, existing: true } })}
        >
          수정
        </button>
      </header>

      <div className={styles.bookInfo}>
        <img
          className={styles.thumb}
          src={record.thumbnail || '/book-placeholder.png'}
          alt={record.title}
          onError={(e) => { e.target.src = '/book-placeholder.png'; }}
        />
        <div className={styles.bookMeta}>
          <p className={styles.bookTitle}>{record.title}</p>
          {record.author && <p className={styles.bookAuthor}>{record.author}</p>}
        </div>
      </div>

      <div className={styles.statusSection}>
        <span
          className={styles.statusBadge}
          style={{ background: STATUS_COLORS[record.status] ?? 'var(--color-icon-muted)' }}
        >
          {record.status}
        </span>
      </div>

      {record.status === '읽는중' && (
        <div className={styles.section}>
          {record.start_date && (
            <div className={styles.row}>
              <span className={styles.rowLabel}>시작일</span>
              <span className={styles.rowValue}>{record.start_date}</span>
            </div>
          )}
          {record.progress != null && (
            <div className={styles.progressWrap}>
              <div className={styles.progressHeader}>
                <span className={styles.rowLabel}>진도</span>
                <span className={styles.progressText}>{record.progress}%</span>
              </div>
              <div className={styles.progressBarTrack}>
                <div className={styles.progressBarFill} style={{ width: `${record.progress}%` }} />
              </div>
            </div>
          )}
        </div>
      )}

      {record.status === '완독' && (
        <div className={styles.section}>
          {(record.start_date || record.end_date) && (
            <div className={styles.row}>
              <span className={styles.rowLabel}>독서 기간</span>
              <span className={styles.rowValue}>
                {record.start_date ?? '?'} ~ {record.end_date ?? '?'}
              </span>
            </div>
          )}
          {record.rating > 0 && (
            <div className={styles.row}>
              <span className={styles.rowLabel}>평점</span>
              <div className={styles.ratingRow}>
                <StarRating value={record.rating} />
                <span className={styles.ratingNum}>{record.rating}</span>
              </div>
            </div>
          )}
          {record.review && (
            <div className={styles.reviewWrap}>
              <span className={styles.rowLabel}>감상평</span>
              <p className={styles.reviewText}>{record.review}</p>
            </div>
          )}
        </div>
      )}

      {record.status === '읽고싶은' && (
        <div className={styles.section}>
          {record.rating > 0 && (
            <div className={styles.row}>
              <span className={styles.rowLabel}>기대치</span>
              <div className={styles.ratingRow}>
                <StarRating value={record.rating} />
                <span className={styles.ratingNum}>{record.rating}</span>
              </div>
            </div>
          )}
          {record.review && (
            <div className={styles.reviewWrap}>
              <span className={styles.rowLabel}>기대평</span>
              <p className={styles.reviewText}>{record.review}</p>
            </div>
          )}
        </div>
      )}

      {(record.status === '중단' || record.status === '하차') && record.start_date && (
        <div className={styles.section}>
          <div className={styles.row}>
            <span className={styles.rowLabel}>날짜</span>
            <span className={styles.rowValue}>{record.start_date}</span>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
