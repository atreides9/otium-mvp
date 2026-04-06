import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, UserCircle2, BookOpen, Users } from 'lucide-react';
import styles from './SubPage.module.css';
import { useToast } from '../components/Toast';

const DNA_SEGMENTS = [
  { label: '소설', pct: 45, color: '#A78BFA' },
  { label: '에세이', pct: 30, color: '#FCD34D' },
  { label: '자기계발', pct: 25, color: '#64748B' },
];

const MOCK_BOOKS = [
  { title: '베르나르 베르베르 - 개미', date: '2026.03.21' },
  { title: '한강 - 채식주의자', date: '2026.02.15' },
  { title: '조지 오웰 - 1984', date: '2026.01.30' },
];

export default function FriendProfilePage() {
  const navigate = useNavigate();
  const showToast = useToast();
  const { username } = useParams();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </button>
        <h1 className={styles.title}>{username}</h1>
      </header>

      <div className={styles.scroll}>
        {/* 프로필 */}
        <div className={styles.card} style={{ marginBottom: 12, textAlign: 'center' }}>
          <UserCircle2
            size={64}
            color="var(--color-icon-muted)"
            strokeWidth={1.5}
            style={{ margin: '0 auto 8px' }}
          />
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 4 }}>
            {username}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 24,
              margin: '12px 0',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-primary)' }}>42</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>완독</div>
            </div>
            <div style={{ width: 1, background: '#F3F4F6' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-primary)' }}>18</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>팔로워</div>
            </div>
            <div style={{ width: 1, background: '#F3F4F6' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-primary)' }}>23</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>팔로잉</div>
            </div>
          </div>

          {/* 독서 DNA */}
          <div
            style={{
              display: 'flex',
              width: '100%',
              height: 8,
              borderRadius: 4,
              overflow: 'hidden',
              marginBottom: 8,
            }}
          >
            {DNA_SEGMENTS.map((seg) => (
              <div
                key={seg.label}
                style={{ width: `${seg.pct}%`, background: seg.color, height: '100%' }}
              />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 16 }}>
            {DNA_SEGMENTS.map((seg) => (
              <span
                key={seg.label}
                style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--color-text-tertiary)' }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: seg.color,
                    flexShrink: 0,
                  }}
                />
                {seg.label}
              </span>
            ))}
          </div>

          <button
            onClick={() => showToast('메시지 기능은 준비 중이에요')}
            className={styles.primaryBtn}
          >
            메시지 보내기
          </button>
        </div>

        {/* 최근 완독 */}
        <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 10 }}>
          최근 완독
        </p>
        <div className={styles.card}>
          {MOCK_BOOKS.map((book, i) => (
            <div key={book.title}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <BookOpen size={18} color="var(--color-icon-muted)" />
                  <span style={{ fontSize: 14, color: 'var(--color-text-primary)' }}>{book.title}</span>
                </div>
                <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)', flexShrink: 0, marginLeft: 8 }}>
                  {book.date}
                </span>
              </div>
              {i < MOCK_BOOKS.length - 1 && <div className={styles.divider} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
