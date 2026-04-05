import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle2, ChevronRight } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { useToast } from '../components/Toast';
import { signOut } from '../api/userApi';
import { useAuthStore } from '../store/authStore';
import styles from './MyPage.module.css';

const DNA_SEGMENTS = [
  { label: '소설', pct: 50, color: '#A78BFA' },
  { label: '에세이', pct: 25, color: '#FCD34D' },
  { label: '자기계발', pct: 15, color: '#64748B' },
  { label: '인문', pct: 10, color: '#2DD4BF' },
];

const MENU_GROUPS = [
  {
    label: '계정',
    items: [
      { label: '계정 비공개/공개 전환', type: 'arrow' },
      { label: '소셜 로그인 관리', type: 'arrow' },
    ],
  },
  {
    label: '친구 & 채팅',
    items: [
      { label: '친구 관리', type: 'arrow' },
      { label: '채팅 설정', type: 'arrow', sub: '매주 월요일' },
    ],
  },
  {
    label: '알림 & 권한',
    items: [
      { label: '알림 설정', type: 'toggle' },
      { label: '권한 설정', type: 'arrow' },
    ],
  },
  {
    label: '정보',
    items: [
      { label: '공지사항', type: 'arrow' },
      { label: '약관 및 정책', type: 'arrow' },
      { label: '앱 버전', type: 'text', value: '1.2.0' },
    ],
  },
];

function Toggle({ on, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={styles.toggle}
      style={{ background: on ? 'var(--secondary-500)' : '#D1D5DB' }}
    >
      <span
        className={styles.toggleThumb}
        style={{ transform: on ? 'translateX(20px)' : 'translateX(2px)' }}
      />
    </button>
  );
}

function MenuGroup({ group, toggleStates, onToggleChange, onPress }) {
  return (
    <div className={styles.card}>
      <p className={styles.groupLabel}>{group.label}</p>
      {group.items.map((item, i) => (
        <div key={item.label}>
          <div
            className={styles.menuRow}
            onClick={item.type === 'arrow' ? () => onPress() : undefined}
            style={{ cursor: item.type === 'arrow' ? 'pointer' : 'default' }}
          >
            <div className={styles.menuLabelWrap}>
              <span className={styles.menuLabel}>{item.label}</span>
              {item.sub && <span className={styles.menuSub}>{item.sub}</span>}
            </div>
            {item.type === 'arrow' && <ChevronRight size={18} color="var(--color-icon-muted)" />}
            {item.type === 'toggle' && (
              <Toggle
                on={toggleStates[item.label] ?? true}
                onChange={(v) => onToggleChange(item.label, v)}
              />
            )}
            {item.type === 'text' && (
              <span className={styles.menuValue}>{item.value}</span>
            )}
          </div>
          {i < group.items.length - 1 && <div className={styles.divider} />}
        </div>
      ))}
    </div>
  );
}

export default function MyPage() {
  const showToast = useToast();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const nickname = useAuthStore((state) => state.nickname);
  const [toggleStates, setToggleStates] = useState({ '알림 설정': true });

  const handleToggleChange = (label, value) => {
    setToggleStates((prev) => ({ ...prev, [label]: value }));
  };

  const handlePress = () => showToast('준비중입니다');

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>마이페이지</h1>
      </header>

      <div className={styles.scroll}>
        {/* 프로필 카드 */}
        <div className={styles.card} style={{ marginBottom: 16 }}>
          <div className={styles.profileRow}>
            <UserCircle2 size={56} color="var(--color-icon-muted)" strokeWidth={1.5} />
            <div className={styles.profileInfo}>
              <span className={styles.profileName}>
                {nickname ?? '-'}
              </span>
              <span className={styles.profileEmail}>
                {user?.email ?? ''}
              </span>
              <div className={styles.dnaBar}>
                {DNA_SEGMENTS.map((seg) => (
                  <div
                    key={seg.label}
                    style={{
                      width: `${seg.pct}%`,
                      background: seg.color,
                      height: '100%',
                    }}
                  />
                ))}
              </div>
              <button
                className={styles.editBtn}
                onClick={() => showToast('준비중입니다')}
              >
                프로필 수정
              </button>
            </div>
          </div>
        </div>

        {/* 설정 메뉴 그룹 */}
        {MENU_GROUPS.map((group) => (
          <MenuGroup
            key={group.label}
            group={group}
            toggleStates={toggleStates}
            onToggleChange={handleToggleChange}
            onPress={handlePress}
          />
        ))}

        {/* 로그아웃 */}
        <div className={styles.logoutWrap}>
          <button
            className={styles.logoutBtn}
            onClick={async () => {
              await signOut();
              navigate('/login');
            }}
          >
            로그아웃
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
