# CLAUDE.md — otium

## Project
독서 기록 + AI 큐레이션 앱. React 18 + Vite + Supabase + Vercel.
Repo: atreides9/otium (private)
Live: https://otium-mvp.vercel.app/

## Stack
- React 18 + Vite, React Router v6, Zustand, CSS Modules
- Supabase (Auth + PostgreSQL + Realtime)
- Kakao Book Search API
- Vercel (deploy)

## Design Tokens
- Background: #F0EBE3 / Surface: #FFFFFF
- Primary: #3D7A5E / Text: #1A1A1A / Secondary: #8C8C8C
- Grid: 8px base / Screen padding: 24px / Border-radius: 12px card, 8px input, 24px pill
- Font: Pretendard, system-ui fallback / Touch target: min 44px

## File Structure
src/
  components/   # 재사용 컴포넌트 (100줄 이하)
  pages/        # 라우트 페이지
  hooks/        # custom hooks
  store/        # zustand (useAuthStore, useBookStore)
  api/          # supabase.js, kakao.js (API 호출은 여기서만)
  styles/       # tokens.css (CSS variables 여기서만 선언)

## Rules
1. Supabase 호출 → api/ 폴더에서만
2. CSS variables → tokens.css에서만 선언
3. 에러/로딩 상태 항상 처리
4. 모바일 퍼스트 (기준 390px)
5. 미구현 기능 탭 → "준비중입니다" toast

## Auth
- Supabase 이메일/비밀번호 (소셜 로그인 없음)
- useAuthStore: { user, session, isLoading }
- 보호 라우트: /library /explore /record /friends /mypage
- 미인증 → /login 리다이렉트

## DB Tables
users / books / reading_records / friendships / challenges / challenge_members / notifications / taste_profiles / recommendations
(상세 스키마는 Supabase 대시보드 참조)

## Current Status
- 완료: 책 검색, 책 기록, 서재, 달력, 통계, 친구탭 UI, 탐색탭 UI
- 진행중: Auth (이메일/비밀번호)
- 미구현: AI 큐레이션, 게이미피케이션, 취향 리포트