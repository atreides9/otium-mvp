import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import BottomNav from '../components/BottomNav';
import { useToast } from '../components/Toast';
import { useBookStore } from '../store/bookStore';
import { mapToGenre } from '../utils/genreUtils';
import styles from './RecordStatsPage.module.css';

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

const PILL_COLORS = [
  '#93C5FD', '#6EE7B7', '#FDE68A', '#C4B5FD', '#FCA5A5',
  '#D1FAE5', '#A7F3D0', '#FCD34D', '#FBCFE8', '#374151',
];

const RANK_COLORS = ['#B8860B', 'var(--color-icon-muted)', '#CD7F32', 'var(--color-text-tertiary)', 'var(--color-text-tertiary)'];

// 유저 정의 장르 → 고정 색상
const GENRE_COLOR_MAP = {
  '소설':         '#A78BFA',
  '에세이':       '#FCD34D',
  '사회과학':     '#2DD4BF',
  '과학':         '#4ADE80',
  '자기계발':     '#60A5FA',
  '경영/경제':    '#FB923C',
  '시':           '#E879F9',
  '희곡':         '#F472B6',
  '예술':         '#F87171',
  '역사':         '#FBBF24',
  '인문학':       '#34D399',
  '종교/역학':    '#A3E635',
  '컴퓨터':       '#38BDF8',
  '외국어':       '#818CF8',
  '만화/라이트노벨': '#F9A8D4',
  '건강/취미':    '#86EFAC',
  '여행':         '#FDE68A',
  '전집':         '#C4B5FD',
  '요리/살림':    '#FCA5A5',
  '좋은부모':     '#6EE7B7',
  '청소년':       '#93C5FD',
  '어린이':       '#D1FAE5',
  '기타':         '#D1D5DB',
};


const HEIGHT_MILESTONES = [
  { minBooks: 50,  label: '어른 키만큼 읽었어요' },
  { minBooks: 30,  label: '초등학생만큼 읽었어요' },
  { minBooks: 15,  label: '2살 아이만큼 읽었어요' },
  { minBooks: 8,   label: '고양이만큼 읽었어요' },
  { minBooks: 1,   label: '첫 발을 내딛었어요' },
];

function buildCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

export default function RecordStatsPage() {
  const toast = useToast();
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const { records, loading, fetchRecords } = useBookStore();

  useEffect(() => {
    fetchRecords();
  }, []);


  const cells = buildCalendarDays(currentYear, currentMonth);

  function prevMonth() {
    if (currentMonth === 0) { setCurrentYear(y => y - 1); setCurrentMonth(11); }
    else setCurrentMonth(m => m - 1);
  }
  function nextMonth() {
    if (currentMonth === 11) { setCurrentYear(y => y + 1); setCurrentMonth(0); }
    else setCurrentMonth(m => m + 1);
  }

  const isToday = (day) =>
    day === today.getDate() &&
    currentMonth === today.getMonth() &&
    currentYear === today.getFullYear();

  // Section 1: 완독 책 스택
  const completedBooks = useMemo(
    () => records.filter(r => r.status === '완독'),
    [records]
  );

  const heightM = (completedBooks.length * 0.02).toFixed(2);

  const milestone = HEIGHT_MILESTONES.find(m => completedBooks.length >= m.minBooks);

  // Section 2: 달력 날짜 → 썸네일 (완독=end_date, 읽는중=start_date)
  const calendarMap = useMemo(() => {
    const map = {};
    for (const r of records) {
      let dateStr = null;
      if (r.status === '완독' && r.end_date) dateStr = r.end_date;
      else if (r.status === '읽는중' && r.start_date) dateStr = r.start_date;
      if (!dateStr) continue;
      const d = new Date(dateStr);
      if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
        const day = d.getDate();
        if (!map[day]) map[day] = r.thumbnail;
      }
    }
    return map;
  }, [records, currentYear, currentMonth]);

  // Section 3: 자주 읽은 작가 (top 5)
  const authorStats = useMemo(() => {
    const counts = {};
    for (const r of records) {
      if (!r.author) continue;
      const primary = r.author.split(',')[0].trim();
      if (!primary) continue;
      counts[primary] = (counts[primary] ?? 0) + 1;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count], i) => ({
        rank: i + 1,
        initial: [...name][0],
        name,
        count,
        rankColor: RANK_COLORS[i],
      }));
  }, [records]);

  // Section 4: 장르별 기록 (완독만)
  const genreData = useMemo(() => {
    const counts = {};
    for (const r of completedBooks) {
      const genre = mapToGenre(r.category?.trim() || '');
      counts[genre] = (counts[genre] ?? 0) + 1;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value, color: GENRE_COLOR_MAP[name] ?? '#D1D5DB' }));
  }, [completedBooks]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>기록</h1>
      </header>

      {/* ── Section 1: 누적 완독 페이지 ── */}
      <section className={styles.section}>
        <div className={styles.sectionRow}>
          <span className={styles.sectionTitle}>누적 완독 페이지</span>
          <span className={styles.sectionLinkGreen} onClick={() => toast('챌린지 준비중입니다')}>
            챌린지→
          </span>
        </div>

        <div className={styles.stackCard}>
          {loading ? (
            <p className={styles.stackHeading} style={{ color: 'var(--color-icon-muted)' }}>불러오는 중...</p>
          ) : completedBooks.length === 0 ? (
            <p className={styles.stackHeading}>아직 완독한 책이 없어요</p>
          ) : (
            <>
              <p className={styles.stackHeading}>{milestone?.label ?? '대단해요!'}</p>
              <p className={styles.stackSubheading}>
                총 {completedBooks.length}권 · 약 {heightM}m
              </p>
              <div className={styles.bookPills}>
                {[...completedBooks].reverse().map((book, i) => (
                  <div
                    key={book.id}
                    className={styles.bookPill}
                    style={{ background: PILL_COLORS[i % PILL_COLORS.length] }}
                  >
                    <span className={styles.bookPillText}>{book.title}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── Section 2: 독서 달력 ── */}
      <section className={styles.section}>
        <div className={styles.sectionRow}>
          <span className={styles.sectionTitle}>독서 달력</span>
        </div>

        <div className={styles.card}>
          <div className={styles.monthNav}>
            <button className={styles.navBtn} onClick={prevMonth} aria-label="이전 달">
              <ChevronLeft size={18} />
            </button>
            <div className={styles.monthLabelWrap}>
              <span className={styles.monthYear}>{currentYear}</span>
              <span className={styles.monthMonth}>{String(currentMonth + 1).padStart(2, '0')}월</span>
            </div>
            <button className={styles.navBtn} onClick={nextMonth} aria-label="다음 달">
              <ChevronRight size={18} />
            </button>
          </div>

          <div className={styles.dayHeaders}>
            {DAY_LABELS.map(d => (
              <span key={d} className={styles.dayLabel}>{d}</span>
            ))}
          </div>

          <div className={styles.dateGrid}>
            {cells.map((day, i) => {
              if (day === null) return <div key={i} className={styles.dateCell} />;
              const bookImg = calendarMap[day];
              if (bookImg) {
                return (
                  <div key={i} className={styles.dateCell}>
                    <img
                      src={bookImg}
                      alt=""
                      className={styles.bookThumb}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                );
              }
              return (
                <div key={i} className={styles.dateCell}>
                  <span className={isToday(day) ? styles.todayCircle : styles.dateNumber}>
                    {day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Section 3: 자주 읽은 작가 ── */}
      <section className={styles.section}>
        <div className={styles.sectionRow}>
          <span className={styles.sectionTitle}>자주 읽은 작가</span>
          {authorStats.length > 0 && (
            <span className={styles.countPill}>총 {authorStats.length}명</span>
          )}
        </div>

        <div className={styles.card}>
          {authorStats.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--color-icon-muted)', padding: '16px 0', fontSize: 14, margin: 0 }}>
              아직 기록된 작가가 없어요
            </p>
          ) : (
            <>
              {authorStats.map((author, idx) => (
                <div key={author.name}>
                  <div className={styles.authorRow}>
                    <span className={styles.authorRank} style={{ color: author.rankColor }}>
                      {author.rank}
                    </span>
                    <div className={styles.authorAvatar}>
                      <span className={styles.authorInitial}>{author.initial}</span>
                    </div>
                    <div className={styles.authorInfo}>
                      <span className={styles.authorName}>{author.name}</span>
                    </div>
                    <span className={styles.authorCount}>{author.count}권</span>
                  </div>
                  {idx < authorStats.length - 1 && <div className={styles.divider} />}
                </div>
              ))}
            </>
          )}
        </div>
      </section>

      {/* ── Section 4: 장르별 기록 (완독 1권 이상일 때만) ── */}
      {completedBooks.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionRow}>
            <span className={styles.sectionTitle}>장르별 기록</span>
          </div>

          <div className={styles.card}>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={genreData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  isAnimationActive={false}
                >
                  {genreData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className={styles.legend}>
              {genreData.map(({ name, value, color }) => (
                <div key={name} className={styles.legendRow}>
                  <span className={styles.legendDot} style={{ background: color }} />
                  <span className={styles.legendName}>{name}</span>
                  <span className={styles.legendValue}>{value}권</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <BottomNav />
    </div>
  );
}
