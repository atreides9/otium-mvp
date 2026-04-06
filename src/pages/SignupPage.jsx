import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signUp, insertUser } from '../api/userApi';
import { useToast } from '../components/Toast';
import styles from './SignupPage.module.css';

export default function SignupPage() {
  const navigate = useNavigate();
  const showToast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');

  const isKorean = (str) => /[\uAC00-\uD7A3\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uD7B0-\uD7FF]/.test(str);
  const getNicknameMaxLen = (str) => isKorean(str) ? 10 : 12;
  const handleNicknameChange = (e) => {
    const val = e.target.value;
    if (val.length <= getNicknameMaxLen(val)) setNickname(val);
  };
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await signUp({ email, password, nickname });

      if (data.user) {
        await insertUser({ id: data.user.id, email, nickname });
      }

      localStorage.setItem('hasAccount', 'true');
      navigate('/');
    } catch (err) {
      showToast(err.message ?? '회원가입에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>회원가입</h1>
        <p className={styles.sub}>오티움과 함께 독서를 기록하세요</p>

        <form className={styles.form} onSubmit={handleSignup} noValidate>
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
            placeholder="비밀번호 (6자 이상)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
          <input
            className={styles.input}
            type="text"
            placeholder="닉네임"
            value={nickname}
            onChange={handleNicknameChange}
            maxLength={getNicknameMaxLen(nickname)}
            required
            autoComplete="nickname"
          />

          <button className={styles.primaryBtn} type="submit" disabled={loading}>
            {loading ? '처리 중...' : '회원가입'}
          </button>
        </form>

        <div className={styles.footer}>
          <Link to="/login" className={styles.footerLink}>로그인으로 돌아가기</Link>
        </div>
      </div>
    </div>
  );
}
