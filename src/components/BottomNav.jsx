import { useNavigate, useLocation } from 'react-router-dom';
import { BookMarked, Compass, PenLine, Trophy, CircleUserRound } from 'lucide-react';
import styles from './BottomNav.module.css';

const TABS = [
  { path: '/', label: '내서재', Icon: BookMarked },
  { path: '/explore', label: '탐색', Icon: Compass },
  { path: '/record-stats', label: '기록', Icon: PenLine },
  { path: '/challenges', label: '챌린지', Icon: Trophy },
  { path: '/mypage', label: 'My', Icon: CircleUserRound },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className={styles.nav} aria-label="하단 탭 메뉴">
      {TABS.map(({ path, label, Icon }) => (
        <button
          key={path}
          className={`${styles.tab} ${pathname === path ? styles.active : ''}`}
          onClick={() => navigate(path)}
          aria-label={label}
          aria-current={pathname === path ? 'page' : undefined}
        >
          <Icon size={22} aria-hidden="true" />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
