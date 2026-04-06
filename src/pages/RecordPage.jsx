import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronDown } from 'lucide-react';
import { useBookStore } from '../store/bookStore';
import { useToast } from '../components/Toast';
import StatusPill from '../components/StatusPill';
import StarRating from '../components/StarRating';
import styles from './RecordPage.module.css';

const STATUS_OPTIONS = ['읽는중', '완독', '읽고싶은', '중단', '하차'];

const GENRE_OPTIONS = [
  '소설', '에세이', '자기계발', '경영/경제', '사회과학', '인문학',
  '과학', '역사', '예술', '시', '희곡', '종교/역학',
  '컴퓨터', '외국어', '만화/라이트노벨', '건강/취미', '여행',
  '전집', '요리/살림', '좋은부모', '청소년', '어린이', '기타',
];

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
  const [genre, setGenre] = useState('');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [saving, setSaving] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const handleStartDateChange = (value) => {
    if (value > today) { showToast('오늘 이후 날짜는 선택할 수 없어요'); return; }
    if (endDate && value > endDate) { showToast('시작일은 완독일보다 이전이어야 해요'); return; }
    setStartDate(value);
  };

  const handleEndDateChange = (value) => {
    if (value > today) { showToast('오늘 이후 날짜는 선택할 수 없어요'); return; }
    if (startDate && value < startDate) { showToast('완독일은 시작일보다 이후여야 해요'); return; }
    setEndDate(value);
  };

  const handleSave = async () => {
    if (!status) return;
    setSaving(true);
    try {
      const saved = await addRecord({
        kakao_isbn: book.isbn,
        title: book.title,
        author: book.authors?.join(', ') ?? book.author ?? '',
        thumbnail: book.thumbnail ?? '',
        category: genre || book.category || '',
        status,
        progress: status === '읽는중' ? progress : null,
        start_date: startDate || null,
        end_date: status === '완독' ? endDate || null : null,
        rating: ['완독', '읽고싶은'].includes(status) ? rating : null,
        review: ['완독', '읽고싶은'].includes(status) ? review : null,
      });
      navigate(`/book/${book.isbn}`, { state: { record: saved }, replace: true });
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

      <div className={styles.genreSection}>
        <span className={styles.sectionLabel}>장르 <span className={styles.optional}>(선택)</span></span>
        <div className={styles.genreScroll}>
          {GENRE_OPTIONS.map((g) => (
            <button
              key={g}
              className={`${styles.genrePill} ${genre === g ? styles.genrePillActive : ''}`}
              onClick={() => setGenre(genre === g ? '' : g)}
              type="button"
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {status === '읽는중' && (
        <div className={styles.section}>
          <label className={styles.sectionLabel}>독서 시작일</label>
          <input
            type="date"
            className={styles.dateInput}
            value={startDate}
            max={today}
            onChange={(e) => handleStartDateChange(e.target.value)}
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
              max={today}
              onChange={(e) => handleStartDateChange(e.target.value)}
              aria-label="시작일"
            />
            <input
              type="date"
              className={styles.dateInput}
              value={endDate}
              max={today}
              onChange={(e) => handleEndDateChange(e.target.value)}
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
            max={today}
            onChange={(e) => handleStartDateChange(e.target.value)}
            aria-label="날짜"
          />
        </div>
      )}
    </div>
  );
}
