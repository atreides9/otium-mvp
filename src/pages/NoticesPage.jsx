import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import styles from './SubPage.module.css';

const NOTICES = [
  {
    id: 1,
    title: '서비스 업데이트 안내 (v1.2.0)',
    date: '2026.03.28',
    content: 'AI 도서 추천 기능이 추가되었습니다. 독서 기록 통계 화면도 새롭게 개선되었습니다.',
  },
  {
    id: 2,
    title: '독서 기록 기능 개선',
    date: '2026.03.10',
    content: '독서 기록 화면이 개편되어 더 빠르게 기록할 수 있습니다. 별점, 한줄 감상 기능이 추가되었습니다.',
  },
  {
    id: 3,
    title: '오티움 베타 서비스 오픈',
    date: '2026.02.01',
    content: '오티움 베타 서비스를 오픈합니다. 독서 기록, 친구 추가, 탐색 기능을 이용하실 수 있습니다. 많은 이용 부탁드립니다.',
  },
];

export default function NoticesPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </button>
        <h1 className={styles.title}>공지사항</h1>
      </header>
      <div className={styles.scroll}>
        {NOTICES.map((notice) => (
          <div key={notice.id} className={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                {notice.title}
              </span>
              <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)', whiteSpace: 'nowrap', marginLeft: 8 }}>
                {notice.date}
              </span>
            </div>
            <p style={{ fontSize: 14, color: '#6B7280', margin: 0, lineHeight: 1.6 }}>
              {notice.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
