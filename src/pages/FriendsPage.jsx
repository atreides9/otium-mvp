import { useNavigate } from 'react-router-dom';
import { Bell, Plus, UserCircle2, ChevronRight } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { useToast } from '../components/Toast';
import styles from './FriendsPage.module.css';

const DNA_SEGMENTS = [
  { label: '소설', pct: 50, color: '#A78BFA' },
  { label: '에세이', pct: 25, color: '#FCD34D' },
  { label: '자기계발', pct: 15, color: '#64748B' },
  { label: '인문', pct: 10, color: '#2DD4BF' },
];

const MOCK_FRIENDS = [
  { name: '책벌레', online: true },
  { name: '공항서점', online: true },
  { name: '책친자', online: false },
  { name: 'stayy', online: false },
  { name: '부릅뜨...', online: true },
];

const MOCK_CHALLENGES = [
  {
    title: '완독 기록 누적 100m 가보자고 🔥',
    dday: 'D-12',
    members: '25/40명',
    participants: [
      { name: '책벌레', badge: 'D+23 · 이번주 캐리', goal: '베르나르 베르베르 - 개미 시리즈 완독' },
      { name: 'stayy', badge: 'D+50 · 이번달 캐리', goal: '🖤노벨문학상🔥 한강 작가 책 전부 완독' },
    ],
  },
  {
    title: '클럽 총합 50권 도전 📚',
    dday: 'D-42',
    members: '18/30명',
    participants: [
      { name: '독서는나의힘', badge: 'D+15 · 오늘 캐리', goal: '조지 오웰 - 1984 완독' },
      { name: '매일읽는사람', badge: 'D+40 · 2달 연속 캐리', goal: '해리포터 시리즈 전권 재독' },
    ],
  },
];

export default function FriendsPage() {
  const navigate = useNavigate();
  const showToast = useToast();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>친구</h1>
        <div className={styles.headerIcons}>
          <button
            className={styles.iconBtn}
            aria-label="알림"
            onClick={() => showToast('새로운 알림이 없어요')}
          >
            <Bell size={20} />
          </button>
          <button
            className={styles.iconBtn}
            aria-label="친구 추가"
            onClick={() => navigate('/friends/add')}
          >
            <Plus size={20} />
          </button>
        </div>
      </header>

      <div className={styles.scroll}>
        {/* Section 1: 나의 독서 DNA */}
        <div className={styles.dnaCard}>
          <div className={styles.dnaTop}>
            <div className={styles.avatarCircle} />
            <span className={styles.dnaLabel}>나의 독서 DNA</span>
          </div>
          <div className={styles.dnaBar}>
            {DNA_SEGMENTS.map((seg) => (
              <div
                key={seg.label}
                className={styles.dnaSegment}
                style={{ width: `${seg.pct}%`, background: seg.color }}
              />
            ))}
          </div>
          <div className={styles.dnaLegend}>
            {DNA_SEGMENTS.map((seg) => (
              <span key={seg.label} className={styles.dnaLegendItem}>
                <span className={styles.dot} style={{ background: seg.color }} />
                {seg.label}
              </span>
            ))}
          </div>
        </div>

        {/* Section 2: 친구들의 최근 기록 */}
        <p className={styles.sectionTitle}>친구들의 최근 기록</p>
        <div className={styles.friendsRow}>
          {MOCK_FRIENDS.map((f) => (
            <button
              key={f.name}
              className={styles.friendItem}
              onClick={() => navigate(`/friends/profile/${f.name}`)}
            >
              <div className={styles.friendAvatarWrap}>
                <UserCircle2 size={48} color="var(--color-icon-muted)" strokeWidth={1.5} />
                {f.online && <span className={styles.onlineDot} />}
              </div>
              <span className={styles.friendName}>{f.name}</span>
            </button>
          ))}
        </div>

        {/* Section 3: 참여중인 챌린지 */}
        <div className={styles.challengeHeader}>
          <p className={styles.sectionTitle} style={{ marginBottom: 0 }}>참여중인 챌린지</p>
          <button
            className={styles.findLink}
            onClick={() => navigate('/friends/challenges')}
          >
            챌린지 찾기→
          </button>
        </div>

        {MOCK_CHALLENGES.map((ch) => (
          <div key={ch.title} className={styles.challengeBlock}>
            <div className={styles.challengeTitleRow}>
              <span className={styles.challengeTitle}>{ch.title}</span>
              <span className={styles.dday}>{ch.dday}</span>
              <span className={styles.membersPill}>{ch.members}</span>
            </div>
            <div className={styles.participantCard}>
              {ch.participants.map((p, i) => (
                <div key={p.name}>
                  <button
                    className={styles.participantRow}
                    onClick={() => navigate(`/friends/profile/${p.name}`)}
                  >
                    <div className={styles.rankCircle}>{i + 1}</div>
                    <div className={styles.pAvatar}>
                      <UserCircle2 size={32} color="var(--color-icon-muted)" strokeWidth={1.5} />
                    </div>
                    <div className={styles.pInfo}>
                      <div className={styles.pNameRow}>
                        <span className={styles.pName}>{p.name}</span>
                        <span className={styles.badgePill}>{p.badge}</span>
                      </div>
                      <span className={styles.pGoal}>{p.goal}</span>
                    </div>
                    <ChevronRight size={16} color="var(--color-icon-muted)" />
                  </button>
                  {i < ch.participants.length - 1 && <div className={styles.divider} />}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
