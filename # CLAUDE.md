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

### Color Token System

#### Usage Rules
- **NEVER** use raw hex codes in component code.  
  Always reference semantic tokens. Primitive tokens are definition-only.
- Background base (`--color-bg-base: #F5F0E8`) is **immutable**.  
  Do not override for any component or state.
- All new components must pass WCAG AA (4.5:1 contrast) against their semantic background token.

---

#### Primitive Tokens — Gray
```css
--gray-0:   #FFFFFF;
--gray-50:  #FAFAFA;
--gray-100: #F5F5F5;
--gray-200: #EBEBEB;
--gray-300: #D9D9D9;
--gray-400: #BFBFBF;
--gray-500: #A6A6A6;
--gray-600: #858585;
--gray-700: #636363;
--gray-800: #424242;
--gray-900: #1F1F1F;
--gray-950: #0A0A0A;
```

#### Primitive Tokens — Base
```css
--black: #1A1410;
--white: #FFFFFF;
```

#### Primitive Tokens — Primary (Brown)
```css
--primary-50: #F5EEE9;
--primary-100: #EAD9CF;
--primary-200: #D4B8A8;
--primary-300: #BC9480;
--primary-400: #9E7260;
--primary-500: #6B5E57;
--primary-600: #5A4E48;
--primary-700: #483D38;
--primary-800: #362C28;
--primary-900: #241B18;
```

#### Primitive Tokens — Secondary (Green)
```css
--secondary-50: #EDF4EF;
--secondary-100: #D4E9DA;
--secondary-200: #A8D3B5;
--secondary-300: #7BBD90;
--secondary-400: #5A9B6F;
--secondary-500: #4A7C59;
--secondary-600: #3D6649;
--secondary-700: #2F5038;
--secondary-800: #213A28;
--secondary-900: #132418;
```

#### Primitive Tokens — Positive
```css
--positive-50: #EDFAF3;
--positive-100: #C8F0DC;
--positive-300: #55CF93;
--positive-500: #1A9E5E;
--positive-600: #147E4A;
--positive-700: #0E5E36;
```

#### Primitive Tokens — Negative
```css
--negative-50: #FEF1F0;
--negative-100: #FCDCD9;
--negative-300: #F3837A;
--negative-500: #D63B30;
--negative-600: #AC2F25;
--negative-700: #82231B;
```

#### Primitive Tokens — Warning
```css
--warning-50: #FFF8ED;
--warning-100: #FEEECE;
--warning-300: #FCC668;
--warning-500: #E89820;
--warning-700: #885510;
```

#### Primitive Tokens — Info
```css
--info-50: #EEF4FD;
--info-100: #D0E4F9;
--info-300: #6CABED;
--info-500: #2577CC;
--info-600: #1D5FA2;
--info-700: #154779;
```

---

#### Semantic Tokens
```css
/* Background */
--color-bg-base: var(--primary-50);  /* #F5F0E8 *//* IMMUTABLE */
--color-bg-elevated: var(--white);
--color-bg-sunken: var(--gray-200);
--color-bg-overlay: rgba(26, 20, 16, 0.4);

/* Border */
--color-border-default: var(--gray-300);
--color-border-strong: var(--gray-400);
--color-border-subtle: var(--gray-200);
--color-border-focus: var(--primary-500);

/* Text */
--color-text-primary: var(--black);
--color-text-secondary: var(--primary-500);
--color-text-tertiary: var(--gray-500);
--color-text-disabled: var(--gray-400);
--color-text-inverse: var(--white);
--color-text-link: var(--secondary-500);

/* CTA Main */
--color-cta-main-bg: var(--primary-500);
--color-cta-main-bg-hover: var(--primary-600);
--color-cta-main-bg-press: var(--primary-700);
--color-cta-main-fg: var(--white);
--color-cta-main-disabled-bg: var(--gray-300);
--color-cta-main-disabled-fg: var(--gray-500);

/* CTA Sub */
--color-cta-sub-bg: transparent;
--color-cta-sub-border: var(--primary-500);
--color-cta-sub-fg: var(--primary-500);
--color-cta-sub-bg-hover: var(--primary-50);
--color-cta-sub-bg-press: var(--primary-100);

/* Status */
--color-status-success-bg: var(--positive-50);
--color-status-success-fg: var(--positive-600);
--color-status-success-icon: var(--positive-500);
--color-status-error-bg: var(--negative-50);
--color-status-error-fg: var(--negative-600);
--color-status-error-icon: var(--negative-500);
--color-status-warning-bg: var(--warning-50);
--color-status-warning-fg: var(--warning-700);
--color-status-warning-icon: var(--warning-500);
--color-status-info-bg: var(--info-50);
--color-status-info-fg: var(--info-600);
--color-status-info-icon: var(--info-500);

/* Icon */
--color-icon-default: var(--primary-500);
--color-icon-muted: var(--gray-500);
--color-icon-active: var(--secondary-500);
--color-icon-inverse: var(--white);
--color-icon-danger: var(--negative-500);

/* GNB */
--color-gnb-bg: var(--white);
--color-gnb-border: var(--gray-300);
--color-gnb-icon-default: var(--gray-500);
--color-gnb-icon-active: var(--secondary-500);
--color-gnb-label-active: var(--secondary-500);
--color-gnb-badge-bg: var(--secondary-400);

/* Tag */
--color-tag-red-bg: var(--negative-50);
--color-tag-red-fg: var(--negative-600);
--color-tag-yellow-bg: var(--warning-50);
--color-tag-yellow-fg: var(--warning-700);
--color-tag-green-bg: var(--positive-50);
--color-tag-green-fg: var(--positive-700);
--color-tag-blue-bg: var(--info-50);
--color-tag-blue-fg: var(--info-600);
--color-tag-gray-bg: var(--gray-200);
--color-tag-gray-fg: var(--gray-700);
--color-tag-primary-bg: var(--primary-100);
--color-tag-primary-fg: var(--primary-700);
```

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