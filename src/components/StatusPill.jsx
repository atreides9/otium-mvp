import styles from './StatusPill.module.css';

export default function StatusPill({ options, selected, onChange }) {
  return (
    <div className={styles.wrapper} role="group" aria-label="독서 상태 선택">
      {options.map((opt) => (
        <button
          key={opt}
          className={`${styles.pill} ${selected === opt ? styles.selected : ''}`}
          onClick={() => onChange(opt)}
          aria-pressed={selected === opt}
          aria-label={opt}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
