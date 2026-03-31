import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../api/supabase';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    } else {
      navigate('/');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.appName}>오티움</h1>
        <p className={styles.appSub}>나만의 독서 기록</p>

        <form className={styles.form} onSubmit={handleLogin} noValidate>
          <input
            className={styles.input}
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            inputMode="email"
          />
          <input
            className={styles.input}
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          {error && <p className={styles.error}>{error}</p>}
          <button className={styles.primaryBtn} type="submit" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className={styles.footer}>
          <span className={styles.footerText}>아직 계정이 없으신가요?</span>
          <Link to="/signup" className={styles.footerLink}>회원가입</Link>
        </div>
      </div>
    </div>
  );
}
