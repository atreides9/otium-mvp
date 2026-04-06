import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { signIn } from '../api/userApi';
import { useToast } from '../components/Toast';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const showToast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn({ email, password });
      localStorage.setItem('hasAccount', 'true');
      navigate('/');
    } catch {
      showToast('이메일 또는 비밀번호를 확인해주세요');
    } finally {
      setLoading(false);
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
          <div className={styles.passwordWrap}>
            <input
              className={styles.input}
              type={showPassword ? 'text' : 'password'}
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <button type="button" className={styles.eyeBtn} onClick={() => setShowPassword((v) => !v)} tabIndex={-1}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

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
