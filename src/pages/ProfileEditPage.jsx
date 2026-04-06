import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useToast } from '../components/Toast';
import { supabase } from '../api/supabase';
import styles from './SubPage.module.css';

export default function ProfileEditPage() {
  const navigate = useNavigate();
  const showToast = useToast();
  const nickname = useAuthStore((state) => state.nickname);
  const [value, setValue] = useState(nickname ?? '');

  const isKorean = (str) => /[\uAC00-\uD7A3\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uD7B0-\uD7FF]/.test(str);
  const getNicknameMaxLen = (str) => isKorean(str) ? 10 : 12;
  const handleChange = (e) => {
    const val = e.target.value;
    if (val.length <= getNicknameMaxLen(val)) setValue(val);
  };
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!value.trim()) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ data: { nickname: value.trim() } });
      if (error) throw error;
      showToast('닉네임이 변경되었습니다');
      navigate(-1);
    } catch {
      showToast('변경에 실패했습니다');
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
        <h1 className={styles.title}>프로필 수정</h1>
      </header>
      <div className={styles.scroll}>
        <div className={styles.card}>
          <label className={styles.fieldLabel}>닉네임</label>
          <input
            className={styles.input}
            type="text"
            value={value}
            onChange={handleChange}
            maxLength={getNicknameMaxLen(value)}
            placeholder="닉네임을 입력하세요"
          />
        </div>
        <button
          className={styles.primaryBtn}
          onClick={handleSave}
          disabled={loading || !value.trim()}
        >
          {loading ? '저장 중...' : '저장'}
        </button>
      </div>
    </div>
  );
}
