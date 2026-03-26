import styles from './StarRating.module.css';

export default function StarRating({ value = 0, onChange, label }) {
  return (
    <div>
      {label && <div className={styles.label}>{label}</div>}
      <div className={styles.wrapper} role="group" aria-label={label || '별점'}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            className={`${styles.star} ${value >= n ? styles.filled : ''}`}
            onClick={() => onChange?.(n === value ? 0 : n)}
            aria-label={`${n}점`}
            aria-pressed={value >= n}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
}
