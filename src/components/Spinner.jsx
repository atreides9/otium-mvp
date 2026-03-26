import styles from './Spinner.module.css';

export default function Spinner({ center = false }) {
  const el = <div className={styles.spinner} role="status" aria-label="로딩 중" />;
  return center ? <div className={styles.center}>{el}</div> : el;
}
