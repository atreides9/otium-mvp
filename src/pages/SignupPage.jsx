import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../api/supabase';
import styles from './SignupPage.module.css';

export default function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) throw signUpError;

      if (data.user) {
        const { error: insertError } = await supabase.from('users').insert({
          id: data.user.id,
          email,
          nickname,
          created_at: new Date().toISOString(),
        });
        if (insertError) throw insertError;
      }

      navigate('/');
    } catch (err) {
      setError(err.message ?? '회원가입에 실패했습니다. 다시 시도해 주세요.');
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
            onChange={(e) => setNickname(e.target.value)}
            required
            autoComplete="nickname"
          />
          {error && <p className={styles.error}>{error}</p>}
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
