# CLAUDE.md — otium-mvp

## Project Context
독서 기록 앱 "오티움" MVP. 예비창업패키지 사업계획서 제출용 데모.
로그인 없음. 핵심 2가지 기능만: 책 검색 + 책 기록(상태/진도/별점/감상).

## Tech Stack
- React 18 + Vite
- Supabase (DB + 실시간)
- Kakao Book Search API (책 검색)
- React Router v6
- Zustand (전역 상태)
- CSS Modules (스타일링)

## Design System
- Base unit: 8px grid
- Primary color: #3D6B4F (딥 그린)
- Background: #F2EDE6 (웜 베이지)
- Surface: #FFFFFF
- Text primary: #1A1A1A
- Text secondary: #6B6B6B
- Border radius: 12px (card), 8px (input), 24px (pill button)
- Font: Pretendard (한글), system-ui fallback
- Touch targets: min 44px height

## File Structure
```
src/
  components/     # 재사용 컴포넌트
  pages/          # GNB 5개 페이지
  hooks/          # custom hooks
  store/          # zustand store
  api/            # kakao API, supabase client
  styles/         # global CSS, tokens
```

## Critical Rules
1. 컴포넌트 파일당 100줄 이하 목표
2. CSS variables는 tokens.css에만 선언
3. Supabase 호출은 반드시 api/ 폴더에서만
4. 에러 상태, 로딩 상태 항상 처리
5. 모바일 퍼스트 (max-width: 390px 기준)

## MVP Scope (이것만)
- [ ] 책 검색 (카카오 API)
- [ ] 책 상태 저장 (읽는중/완독/읽고싶은/중단/하차)
- [ ] 독서 진도 입력 (읽는중 → %)
- [ ] 별점 + 감상평 (완독)
- [ ] 내 서재 목록 표시

## Out of Scope
- 로그인/회원가입
- AI 큐레이션
- 친구/소셜
- 챌린지
- 통계 상세