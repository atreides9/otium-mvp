import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import BottomNav from '../components/BottomNav';
import { useToast } from '../components/Toast';
import styles from './RecordStatsPage.module.css';

/* ── Section 1: 누적 완독 페이지 ── */
const BOOK_STACK = [
  { title: '1984', color: '#93C5FD' },
  { title: '자유론', color: '#374151' },
  { title: '죄와 벌 어쩌고저쩌고', color: '#6EE7B7' },
  { title: '어린왕자', color: '#FDE68A' },
  { title: '데미안', color: '#C4B5FD' },
  { title: '노르웨이의 숲', color: '#6EE7B7' },
  { title: '코스모스 어쩌고', color: '#FCA5A5' },
  { title: '파친코', color: '#D1FAE5' },
  { title: '사피엔스', color: '#A7F3D0' },
  { title: '먹', color: '#FCD34D' },
  { title: '브람스를 좋아하세요', color: '#FBCFE8' },
  { title: '자유론', color: '#374151' },
  { title: '1984', color: '#93C5FD' },
];

/* ── Section 2: 독서 달력 ── */
const MOCK_CALENDAR_BOOKS = [
  { date: 4,  img: 'https://covers.openlibrary.org/b/isbn/9780156012195-M.jpg' },
  { date: 5,  img: 'https://covers.openlibrary.org/b/isbn/9780451524935-M.jpg' },
  { date: 6,  img: 'https://covers.openlibrary.org/b/isbn/9780062600271-M.jpg' },
  { date: 9,  img: 'https://covers.openlibrary.org/b/isbn/9780375704024-M.jpg' },
  { date: 11, img: 'https://covers.openlibrary.org/b/isbn/9781455563920-M.jpg' },
  { date: 12, img: 'https://covers.openlibrary.org/b/isbn/9780345539434-M.jpg' },
  { date: 15, img: 'https://covers.openlibrary.org/b/isbn/9780062138927-M.jpg' },
  { date: 17, img: 'https://covers.openlibrary.org/b/isbn/9780140020229-M.jpg' },
  { date: 18, img: 'https://covers.openlibrary.org/b/isbn/9781501160271-M.jpg' },
  { date: 22, img: 'https://covers.openlibrary.org/b/isbn/9780439708180-M.jpg' },
  { date: 24, img: 'https://covers.openlibrary.org/b/isbn/9780062600271-M.jpg' },
  { date: 25, img: 'https://covers.openlibrary.org/b/isbn/9780451526342-M.jpg' },
];
const CALENDAR_BOOK_MAP = Object.fromEntries(MOCK_CALENDAR_BOOKS.map(b => [b.date, b.img]));

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

function buildCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

/* ── Section 3: 자주 읽은 작가 ── */
const MOCK_AUTHORS = [
  { rank: 1, initial: '정', name: '정유정',    genre: '소설 · 스릴러',  count: 3, rankColor: '#B8860B' },
  { rank: 2, initial: '유', name: '유발 하라리', genre: '인문 · 철학',   count: 3, rankColor: '#9CA3AF' },
  { rank: 3, initial: '이', name: '이미예',    genre: '소설 · 판타지',  count: 2, rankColor: '#CD7F32' },
  { rank: 4, initial: '김', name: '김영하',    genre: '소설 · SF',     count: 2, rankColor: '#6B6B6B' },
  { rank: 5, initial: '아', name: '아니 에르노', genre: '소설 · 자전적', count: 2, rankColor: '#6B6B6B' },
];

/* ── Section 4: 이 작가도 좋아할 것 같아요 ── */
const MOCK_SIMILAR_AUTHORS = [
  { initial: '문', name: '문요한' },
  { initial: '헤', name: '헤르만 헤세' },
  { initial: '카', name: '카뮈' },
];

/* ── Section 5: 장르별 기록 ── */
const GENRE_DATA = [
  { name: '문학',    value: 27, color: '#A78BFA' },
  { name: '에세이',  value: 15, color: '#FCD34D' },
  { name: '인문/철학', value: 12, color: '#2DD4BF' },
  { name: '경영/경제', value: 9,  color: '#4ADE80' },
  { name: '자기계발', value: 5,  color: '#64748B' },
  { name: '과학',    value: 3,  color: '#F87171' },
  { name: '예술',    value: 1,  color: '#FCA5A5' },
  { name: '기타',    value: 1,  color: '#D1D5DB' },
];

/* ── Baby silhouette SVG ── */
function BabySilhouette() {
  return (
    <svg
      viewBox="0 0 100 140"
      height="220"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.babySvg}
    >
      {/* Head */}
      <circle cx="50" cy="30" r="22" fill="#8B7355" />
      {/* Body */}
      <ellipse cx="50" cy="80" rx="28" ry="35" fill="#8B7355" />
      {/* Left arm */}
      <circle cx="18" cy="72" r="10" fill="#8B7355" />
      {/* Right arm */}
      <circle cx="82" cy="72" r="10" fill="#8B7355" />
      {/* Left leg */}
      <rect x="30" y="108" width="14" height="26" rx="7" fill="#8B7355" />
      {/* Right leg */}
      <rect x="56" y="108" width="14" height="26" rx="7" fill="#8B7355" />
    </svg>
  );
}

export default function RecordStatsPage() {
  const toast = useToast();
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  const cells = buildCalendarDays(currentYear, currentMonth);

  // Only show book thumbnails for the base month (March 2026 = month index 2)
  const isBookMonth =
    currentYear === today.getFullYear() && currentMonth === today.getMonth();

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

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>기록</h1>
      </header>

      {/* ── Section 1: 누적 완독 페이지 ── */}
      <section className={styles.section}>
        <div className={styles.sectionRow}>
          <span className={styles.sectionTitle}>누적 완독 페이지</span>
          <span
            className={styles.sectionLinkGreen}
            onClick={() => toast('챌린지 준비중입니다')}
          >
            챌린지→
          </span>
        </div>

        <div className={styles.stackCard}>
          <p className={styles.stackHeading}>대단해요!</p>
          <p className={styles.stackSubheading}>2살 아이의 키만큼 읽었어요</p>

          <div className={styles.stackBody}>
            {/* Left column */}
            <div className={styles.stackLeft}>
              <span className={styles.heightLabel}>0.8m</span>
              <span className={styles.arrow}>↕</span>
              <div className={styles.bookPills}>
                {[...BOOK_STACK].reverse().map((book, i) => (
                  <div
                    key={i}
                    className={styles.bookPill}
                    style={{ background: book.color }}
                  >
                    <span className={styles.bookPillText}>{book.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column */}
            <div className={styles.stackRight}>
              <BabySilhouette />
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: 독서 달력 ── */}
      <section className={styles.section}>
        <div className={styles.sectionRow}>
          <span className={styles.sectionTitle}>독서 달력</span>
          <span
            className={styles.sectionLinkGray}
            onClick={() => toast('준비중입니다')}
          >
            자세히 보기
          </span>
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
              const bookImg = isBookMonth ? CALENDAR_BOOK_MAP[day] : null;
              if (bookImg) {
                return (
                  <div key={i} className={styles.dateCell}>
                    <img src={bookImg} alt="" className={styles.bookThumb} />
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
          <span className={styles.countPill}>총 5명</span>
        </div>

        <div className={styles.card}>
          {MOCK_AUTHORS.map((author, idx) => (
            <div key={author.rank}>
              <div className={styles.authorRow}>
                <span className={styles.authorRank} style={{ color: author.rankColor }}>
                  {author.rank}
                </span>
                <div className={styles.authorAvatar}>
                  <span className={styles.authorInitial}>{author.initial}</span>
                </div>
                <div className={styles.authorInfo}>
                  <span className={styles.authorName}>{author.name}</span>
                  <span className={styles.authorGenre}>{author.genre}</span>
                </div>
                <span className={styles.authorCount}>{author.count}권</span>
              </div>
              {idx < MOCK_AUTHORS.length - 1 && <div className={styles.divider} />}
            </div>
          ))}
          <div
            className={styles.viewAll}
            onClick={() => toast('준비중입니다')}
          >
            전체보기
          </div>
        </div>
      </section>

      {/* ── Section 4: 이 작가도 좋아할 것 같아요 ── */}
      <section className={styles.section}>
        <div className={styles.sectionRow}>
          <span className={styles.sectionTitle}>이 작가도 좋아할 것 같아요</span>
        </div>

        <div className={styles.similarScroll}>
          {MOCK_SIMILAR_AUTHORS.map((author) => (
            <div key={author.name} className={styles.similarCard}>
              <div className={styles.authorAvatar}>
                <span className={styles.authorInitial}>{author.initial}</span>
              </div>
              <p className={styles.similarName}>{author.name}</p>
              <button
                className={styles.exploreBtn}
                onClick={() => toast('준비중입니다')}
              >
                탐색
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 5: 장르별 기록 ── */}
      <section className={styles.section}>
        <div className={styles.sectionRow}>
          <span className={styles.sectionTitle}>장르별 기록</span>
        </div>

        <div className={styles.card}>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={GENRE_DATA}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                isAnimationActive={false}
              >
                {GENRE_DATA.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className={styles.legend}>
            {GENRE_DATA.map(({ name, value, color }) => (
              <div key={name} className={styles.legendRow}>
                <span className={styles.legendDot} style={{ background: color }} />
                <span className={styles.legendName}>{name}</span>
                <span className={styles.legendValue}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BottomNav />
    </div>
  );
}
