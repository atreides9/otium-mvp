import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import styles from './SubPage.module.css';

const STATUS_LABEL = { granted: '허용됨', denied: '거부됨', default: '미설정' };
const STATUS_COLOR = { granted: '#10B981', denied: '#EF4444', default: '#6B7280' };

export default function PermissionsPage() {
  const navigate = useNavigate();
  const [notifStatus, setNotifStatus] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  const requestNotification = async () => {
    if (typeof Notification === 'undefined') return;
    const result = await Notification.requestPermission();
    setNotifStatus(result);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </button>
        <h1 className={styles.title}>권한 설정</h1>
      </header>
      <div className={styles.scroll}>
        <div className={styles.card}>
          <p className={styles.groupLabel}>앱 권한</p>
          <div className={styles.row}>
            <span className={styles.rowLabel}>알림</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14, color: STATUS_COLOR[notifStatus] }}>
                {STATUS_LABEL[notifStatus]}
              </span>
              {notifStatus === 'default' && (
                <button
                  onClick={requestNotification}
                  style={{
                    fontSize: 13,
                    padding: '4px 10px',
                    background: 'var(--secondary-500, #7C3AED)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    cursor: 'pointer',
                  }}
                >
                  허용
                </button>
              )}
            </div>
          </div>
        </div>
        {notifStatus === 'denied' && (
          <p style={{ fontSize: 13, color: '#6B7280', textAlign: 'center', marginTop: 4 }}>
            알림 권한이 거부되었습니다. 브라우저 설정에서 변경해주세요.
          </p>
        )}
      </div>
    </div>
  );
}
