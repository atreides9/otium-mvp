import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useToast } from '../components/Toast';
import { supabase } from '../api/supabase';
import styles from './SubPage.module.css';

export default function AccountPage() {
  const navigate = useNavigate();
  const showToast = useToast();
  const user = useAuthStore((state) => state.user);

  const [pwCurrent, setPwCurrent] = useState('');
  const [pwNew, setPwNew] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!pwNew || !pwConfirm) return;
    if (pwNew !== pwConfirm) {
      showToast('새 비밀번호가 일치하지 않습니다');
      return;
    }
    if (pwNew.length < 6) {
      showToast('비밀번호는 6자 이상이어야 합니다');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: pwNew });
      if (error) throw error;
      showToast('비밀번호가 변경되었습니다');
      setPwCurrent('');
      setPwNew('');
      setPwConfirm('');
    } catch (e) {
      showToast(e.message ?? '변경에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </button>
        <h1 className={styles.title}>로그인 정보 관리</h1>
      </header>
      <div className={styles.scroll}>
        {/* 이메일 */}
        <div className={styles.card}>
          <p className={styles.groupLabel}>이메일</p>
          <div className={styles.row}>
            <span className={styles.rowLabel}>{user?.email ?? '-'}</span>
          </div>
        </div>

        {/* 비밀번호 변경 */}
        <div className={styles.card}>
          <p className={styles.groupLabel}>비밀번호 변경</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <label className={styles.fieldLabel}>새 비밀번호</label>
              <input
                className={styles.input}
                type="password"
                value={pwNew}
                onChange={(e) => setPwNew(e.target.value)}
                placeholder="6자 이상 입력"
              />
            </div>
            <div>
              <label className={styles.fieldLabel}>새 비밀번호 확인</label>
              <input
                className={styles.input}
                type="password"
                value={pwConfirm}
                onChange={(e) => setPwConfirm(e.target.value)}
                placeholder="동일하게 입력"
              />
            </div>
          </div>
        </div>

        <button
          className={styles.primaryBtn}
          onClick={handleChangePassword}
          disabled={loading || !pwNew || !pwConfirm}
        >
          {loading ? '변경 중...' : '비밀번호 변경'}
        </button>
      </div>
    </div>
  );
}
