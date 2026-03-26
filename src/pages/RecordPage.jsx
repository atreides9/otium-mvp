import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronDown } from 'lucide-react';
import { useBookStore } from '../store/bookStore';
import { useToast } from '../components/Toast';
import StatusPill from '../components/StatusPill';
import StarRating from '../components/StarRating';
import styles from './RecordPage.module.css';

const STATUS_OPTIONS = ['읽는중', '완독', '읽고싶은', '중단', '하차'];

export default function RecordPage() {
  const navigate = useNavigate();
  const { isbn } = useParams();
  const { state } = useLocation();
  const book = state?.book ?? { isbn, title: '', thumbnail: '' };
  const showToast = useToast();

  const { addRecord } = useBookStore();
  const [status, setStatus] = useState(state?.existing ? book.status ?? '' : '');
  const [progress, setProgress] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!status) return;
    setSaving(true);
    try {
      await addRecord({
        kakao_isbn: book.isbn,
        title: book.title,
        author: book.authors?.join(', ') ?? book.author ?? '',
        thumbnail: book.thumbnail ?? '',
        status,
        progress: status === '읽는중' ? progress : null,
        start_date: startDate || null,
        end_date: status === '완독' ? endDate || null : null,
        rating: ['완독', '읽고싶은'].includes(status) ? rating : null,
        review: ['완독', '읽고싶은'].includes(status) ? review : null,
      });
      navigate('/');
    } catch {
      showToast('저장에 실패했어요. 다시 시도해주세요');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)} aria-label="뒤로가기">
          <ChevronLeft size={24} />
        </button>
        <button className={styles.headerStatus} onClick={() => showToast('준비중입니다')} aria-label="상태 변경">
          <span>{status || '독서 기록'}</span>
          {status && <ChevronDown size={16} />}
        </button>
        <button
          className={styles.saveBtn}
          onClick={handleSave}
          disabled={!status || saving}
          aria-label="저장"
        >
          저장
        </button>
      </header>

      <div className={styles.bookInfo}>
        <img
          className={styles.thumb}
          src={book.thumbnail || '/book-placeholder.png'}
          alt={book.title}
          onError={(e) => { e.target.src = '/book-placeholder.png'; }}
        />
        <span className={styles.bookTitle}>{book.title}</span>
      </div>

      <div className={styles.statusRow}>
        <StatusPill options={STATUS_OPTIONS} selected={status} onChange={setStatus} />
      </div>

      {status === '읽는중' && (
        <div className={styles.section}>
          <label className={styles.sectionLabel}>독서 시작일</label>
          <input
            type="date"
            className={styles.dateInput}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            aria-label="독서 시작일"
          />

          <label className={styles.sectionLabel}>진도</label>
          <div className={styles.progressDisplay}>
            <span className={styles.progressEdge}>0%</span>
            <span className={styles.progressCurrent}>{progress}%</span>
            <span className={styles.progressEdge}>100%</span>
          </div>
          <div className={styles.progressBarTrack}>
            <div className={styles.progressBarFill} style={{ width: `${progress}%` }} />
          </div>
          <input
            type="range"
            className={styles.progressSlider}
            min={0}
            max={100}
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            aria-label="읽기 진도"
          />
        </div>
      )}

      {status === '완독' && (
        <div className={styles.section}>
          <label className={styles.sectionLabel}>독서 기간</label>
          <div className={styles.dateRow}>
            <input
              type="date"
              className={styles.dateInput}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              aria-label="시작일"
            />
            <input
              type="date"
              className={styles.dateInput}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              aria-label="종료일"
            />
          </div>

          <label className={styles.sectionLabel}>평점</label>
          <div className={styles.ratingRow}>
            <StarRating value={rating} onChange={setRating} />
            {rating > 0 && <span className={styles.ratingNumber}>{rating}</span>}
          </div>

          <label className={styles.sectionLabel}>감상평 (선택)</label>
          <textarea
            className={styles.textarea}
            placeholder="이 책을 읽고 느낀 점을 자유롭게 작성해보세요"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            aria-label="감상평"
          />
        </div>
      )}

      {status === '읽고싶은' && (
        <div className={styles.section}>
          <label className={styles.sectionLabel}>기대치</label>
          <div className={styles.ratingRow}>
            <StarRating value={rating} onChange={setRating} />
            {rating > 0 && <span className={styles.ratingNumber}>{rating}</span>}
          </div>

          <label className={styles.sectionLabel}>기대평 (선택)</label>
          <textarea
            className={styles.textarea}
            placeholder="이 책을 읽고 싶은 이유나 기대하는 점을 작성해보세요"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            aria-label="기대평"
          />
        </div>
      )}

      {(status === '중단' || status === '하차') && (
        <div className={styles.section}>
          <label className={styles.sectionLabel}>날짜</label>
          <input
            type="date"
            className={styles.dateInput}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            aria-label="날짜"
          />
        </div>
      )}
    </div>
  );
}
