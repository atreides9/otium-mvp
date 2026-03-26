import styles from './BookCard.module.css';

export default function BookCard({ book, onClick }) {
  const { title, authors = [], publisher, thumbnail } = book;
  const authorText = authors.join(', ');

  return (
    <button className={styles.card} onClick={onClick} aria-label={`${title} 선택`}>
      <img
        className={styles.thumbnail}
        src={thumbnail || '/book-placeholder.png'}
        alt={`${title} 표지`}
        onError={(e) => { e.target.src = '/book-placeholder.png'; }}
      />
      <div className={styles.info}>
        <span className={styles.title}>{title}</span>
        {authorText && <span className={styles.author}>{authorText}</span>}
        {publisher && <span className={styles.publisher}>{publisher}</span>}
      </div>
    </button>
  );
}
