import { useState } from 'react';
import { Users, X, Trophy } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { useToast } from '../components/Toast';
import styles from './FriendsPage.module.css';
import subStyles from './SubPage.module.css';

const ALL_CHALLENGES = [
  {
    id: 1,
    title: '완독 기록 누적 100m 가보자고 🔥',
    desc: '함께 쌓는 독서 기록, 100m 달성!',
    dday: 'D-12',
    current: 25, max: 30,
    goal: '클럽 멤버들이 함께 완독한 책의 총 페이지 수를 100m(약 30,000페이지)까지 쌓아올리는 챌린지입니다.',
    period: '2026.03.25 ~ 2026.04.18',
  },
  {
    id: 2,
    title: '클럽 총합 50권 도전 📚',
    desc: '한 달 안에 클럽 전체 50권 완독',
    dday: 'D-42',
    current: 20, max: 20,
    goal: '클럽 멤버 모두가 힘을 합쳐 한 달 안에 총 50권을 완독하는 챌린지입니다.',
    period: '2026.03.01 ~ 2026.05.17',
  },
  {
    id: 3,
    title: '이번 주 한 권 완독 챌린지 ✨',
    desc: '이번 주에 책 한 권을 끝내 보아요',
    dday: 'D-5',
    current: 24, max: 30,
    goal: '한 주 동안 책 한 권을 완독하는 개인 챌린지입니다. 짧고 굵게 집중해서 읽어봐요!',
    period: '2026.04.01 ~ 2026.04.07',
  },
  {
    id: 4,
    title: '2026 독서 목표 100권 🎯',
    desc: '올 한 해 100권 완독에 도전!',
    dday: 'D-271',
    current: 10, max: 10,
    goal: '2026년 한 해 동안 100권의 책을 읽는 장기 챌린지입니다. 꾸준함이 핵심!',
    period: '2026.01.01 ~ 2026.12.31',
  },
  {
    id: 5,
    title: '노벨문학상 수상작 시리즈 읽기 📖',
    desc: '노벨문학상 수상 작가들의 작품 탐험',
    dday: 'D-60',
    current: 5, max: 10,
    goal: '역대 노벨문학상 수상 작가들의 대표작을 함께 읽고 감상을 나누는 챌린지입니다.',
    period: '2026.02.05 ~ 2026.06.04',
  },
];

function ChallengeBottomSheet({ challenge, isJoined, onToggle, onClose }) {
  const isFull = challenge.current >= challenge.max;
  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
          zIndex: 100,
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#fff',
          borderRadius: '20px 20px 0 0',
          padding: '20px 20px 40px',
          zIndex: 101,
          maxHeight: '80dvh',
          overflowY: 'auto',
        }}
      >
        {/* 핸들 */}
        <div style={{ width: 40, height: 4, borderRadius: 2, background: '#E5E7EB', margin: '0 auto 20px' }} />

        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-text-tertiary)',
            padding: 4,
            display: 'flex',
          }}
        >
          <X size={20} />
        </button>

        {/* 아이콘 + D-day */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: 'var(--secondary-50, #F5F3FF)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Trophy size={20} color="var(--secondary-500)" />
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--secondary-500)' }}>{challenge.dday}</span>
        </div>

        {/* 제목 */}
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 6px', lineHeight: 1.4 }}>
          {challenge.title}
        </h2>

        {/* 기간 */}
        <p style={{ fontSize: 13, color: 'var(--color-text-tertiary)', margin: '0 0 16px' }}>
          {challenge.period}
        </p>

        <div style={{ height: 1, background: '#F3F4F6', marginBottom: 16 }} />

        {/* 목표 */}
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary, #374151)', lineHeight: 1.6, margin: '0 0 20px' }}>
          {challenge.goal}
        </p>

        {/* 참여 인원 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 13,
            color: 'var(--color-text-tertiary)',
            marginBottom: 24,
          }}
        >
          <Users size={14} />
          {challenge.current}/{challenge.max}명 참여중
        </div>

        {/* 참여 버튼 */}
        <button
          onClick={isFull && !isJoined ? undefined : onToggle}
          disabled={isFull && !isJoined}
          style={{
            width: '100%',
            height: 48,
            borderRadius: 12,
            border: (isJoined || (isFull && !isJoined)) ? '1px solid #D1D5DB' : 'none',
            background: isFull && !isJoined ? '#F3F4F6' : isJoined ? 'transparent' : 'var(--secondary-500)',
            color: isFull && !isJoined ? '#9CA3AF' : isJoined ? 'var(--color-text-tertiary)' : '#fff',
            fontSize: 16,
            fontWeight: 600,
            cursor: isFull && !isJoined ? 'default' : 'pointer',
          }}
        >
          {isFull && !isJoined ? '모집이 마감된 챌린지예요' : isJoined ? '참여 취소' : '챌린지 참여하기'}
        </button>
      </div>
    </>
  );
}

const FILTERS = [
  { key: 'all', label: '전체' },
  { key: 'open', label: '모집중' },
  { key: 'full', label: '모집완료' },
];

export default function ChallengesPage() {
  const showToast = useToast();
  const [joinedIds, setJoinedIds] = useState(new Set([1, 2]));
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [filter, setFilter] = useState('all');

  const toggleJoin = (id) => {
    setJoinedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        showToast('챌린지에서 나갔어요');
      } else {
        next.add(id);
        showToast('챌린지에 참여했어요 🎉');
      }
      return next;
    });
  };

  const filtered = ALL_CHALLENGES.filter((ch) => {
    const isFull = ch.current >= ch.max;
    if (filter === 'open') return !isFull;
    if (filter === 'full') return isFull;
    return true;
  });

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>챌린지</h1>
      </header>

      {/* 필터 탭 */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          padding: '0 16px 12px',
        }}
      >
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              border: filter === f.key ? 'none' : '1px solid #E5E7EB',
              background: filter === f.key ? 'var(--secondary-500)' : 'transparent',
              color: filter === f.key ? '#fff' : 'var(--color-text-tertiary)',
              fontSize: 13,
              fontWeight: filter === f.key ? 600 : 400,
              cursor: 'pointer',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '0 16px', paddingBottom: 16 }}>
        {filtered.map((ch) => {
          const isJoined = joinedIds.has(ch.id);
          const isFull = ch.current >= ch.max;
          return (
            <div
              key={ch.id}
              className={subStyles.card}
              style={{ marginBottom: 12, cursor: 'pointer', opacity: isFull && !isJoined ? 0.85 : 1 }}
              onClick={() => setSelectedChallenge(ch)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, flexWrap: 'wrap' }}>
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: 'var(--secondary-500)',
                      lineHeight: 1.4,
                    }}
                  >
                    {ch.title}
                  </span>
                  {isFull && (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: '#6B7280',
                        background: '#F3F4F6',
                        borderRadius: 6,
                        padding: '2px 7px',
                        flexShrink: 0,
                      }}
                    >
                      모집완료
                    </span>
                  )}
                </div>
                <span
                  style={{
                    fontSize: 13,
                    color: 'var(--secondary-500)',
                    fontWeight: 600,
                    marginLeft: 8,
                    flexShrink: 0,
                  }}
                >
                  {ch.dday}
                </span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--color-text-tertiary)', margin: '0 0 12px' }}>
                {ch.desc}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 13,
                    color: isFull ? '#EF4444' : 'var(--color-text-tertiary)',
                    fontWeight: isFull ? 600 : 400,
                  }}
                >
                  <Users size={14} />
                  {ch.current}/{ch.max}명
                </span>
                {isFull && !isJoined ? (
                  <span
                    style={{
                      padding: '6px 16px',
                      borderRadius: 20,
                      border: '1px solid #E5E7EB',
                      background: 'transparent',
                      color: '#9CA3AF',
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    마감
                  </span>
                ) : (
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleJoin(ch.id); }}
                    style={{
                      padding: '6px 16px',
                      borderRadius: 20,
                      border: isJoined ? '1px solid #D1D5DB' : 'none',
                      background: isJoined ? 'transparent' : 'var(--secondary-500)',
                      color: isJoined ? 'var(--color-text-tertiary)' : '#fff',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {isJoined ? '참여중' : '참여하기'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedChallenge && (
        <ChallengeBottomSheet
          challenge={selectedChallenge}
          isJoined={joinedIds.has(selectedChallenge.id)}
          onToggle={() => toggleJoin(selectedChallenge.id)}
          onClose={() => setSelectedChallenge(null)}
        />
      )}

      <BottomNav />
    </div>
  );
}
