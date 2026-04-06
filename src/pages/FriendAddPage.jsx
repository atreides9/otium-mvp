import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, UserCircle2, UserPlus, Check } from 'lucide-react';
import styles from './SubPage.module.css';
import { useToast } from '../components/Toast';

const MOCK_USERS = [
  { id: 1, name: '책벌레도서관', handle: '@bookworm', books: 128 },
  { id: 2, name: '하루한페이지', handle: '@onepage', books: 54 },
  { id: 3, name: '독서클럽장', handle: '@clubmaster', books: 210 },
  { id: 4, name: '늦잠독서가', handle: '@lazyreader', books: 33 },
];

export default function FriendAddPage() {
  const navigate = useNavigate();
  const showToast = useToast();
  const [query, setQuery] = useState('');
  const [followed, setFollowed] = useState(new Set());

  const results = query.trim()
    ? MOCK_USERS.filter(
        (u) =>
          u.name.toLowerCase().includes(query.toLowerCase()) ||
          u.handle.toLowerCase().includes(query.toLowerCase())
      )
    : MOCK_USERS;

  const toggleFollow = (id, name) => {
    setFollowed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        showToast(`${name} 팔로우를 취소했어요`);
      } else {
        next.add(id);
        showToast(`${name}님을 팔로우했어요`);
      }
      return next;
    });
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </button>
        <h1 className={styles.title}>친구 추가</h1>
      </header>

      <div className={styles.scroll}>
        <div style={{ position: 'relative', marginBottom: 20 }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-tertiary)',
            }}
          />
          <input
            className={styles.input}
            style={{ paddingLeft: 36 }}
            placeholder="닉네임으로 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>

        {results.length === 0 ? (
          <p className={styles.emptyText}>검색 결과가 없어요</p>
        ) : (
          <div className={styles.card}>
            {results.map((user, i) => (
              <div key={user.id}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 0',
                  }}
                >
                  <UserCircle2 size={44} color="var(--color-icon-muted)" strokeWidth={1.5} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {user.name}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--color-text-tertiary)' }}>
                      {user.handle} · 완독 {user.books}권
                    </div>
                  </div>
                  <button
                    onClick={() => toggleFollow(user.id, user.name)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '6px 14px',
                      borderRadius: 20,
                      border: followed.has(user.id) ? '1px solid #D1D5DB' : 'none',
                      background: followed.has(user.id) ? 'transparent' : 'var(--secondary-500)',
                      color: followed.has(user.id) ? 'var(--color-text-tertiary)' : '#fff',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    {followed.has(user.id) ? (
                      <>
                        <Check size={14} />
                        팔로잉
                      </>
                    ) : (
                      <>
                        <UserPlus size={14} />
                        팔로우
                      </>
                    )}
                  </button>
                </div>
                {i < results.length - 1 && <div className={styles.divider} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
