import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import styles from './SubPage.module.css';

const SETTINGS = [
  { label: '채팅 알림', key: 'chatNotify', defaultOn: true },
  { label: '읽음 표시', key: 'readReceipt', defaultOn: true },
  { label: '미디어 자동 저장', key: 'autoSave', defaultOn: false },
];

function Toggle({ on, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        padding: 0,
        background: on ? 'var(--secondary-500, #7C3AED)' : '#D1D5DB',
        transition: 'background 0.2s',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 2,
          left: 0,
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: '#fff',
          transform: on ? 'translateX(20px)' : 'translateX(2px)',
          transition: 'transform 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
        }}
      />
    </button>
  );
}

export default function ChatSettingsPage() {
  const navigate = useNavigate();
  const [states, setStates] = useState(() =>
    Object.fromEntries(SETTINGS.map((s) => [s.key, s.defaultOn]))
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </button>
        <h1 className={styles.title}>채팅 설정</h1>
      </header>
      <div className={styles.scroll}>
        <div className={styles.card}>
          {SETTINGS.map((s, i) => (
            <div key={s.key}>
              <div className={styles.row}>
                <span className={styles.rowLabel}>{s.label}</span>
                <Toggle
                  on={states[s.key]}
                  onChange={(v) => setStates((prev) => ({ ...prev, [s.key]: v }))}
                />
              </div>
              {i < SETTINGS.length - 1 && <div className={styles.divider} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
