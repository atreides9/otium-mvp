# Project: otium-mvp

## Quick Reference
- 책 검색: GET https://dapi.kakao.com/v3/search/book?query={keyword}
  - Header: Authorization: KakaoAK {REST_API_KEY}
- Supabase table: `book_records`
  - id, kakao_isbn, title, author, thumbnail, status, progress, rating, review, created_at

## Environment Variables (.env)
VITE_KAKAO_API_KEY=your_kakao_rest_api_key
VITE_SUPABASE_URL=https://vkmskdgkhscybzvrxfkv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrbXNrZGdraHNjeWJ6dnJ4Zmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTQwNjYsImV4cCI6MjA4OTY3MDA2Nn0.1IfOdxjnaQZuv17OqtJvQN9AS1thuJmh-e1QLs0jpBE

## Color Tokens (use these exact values)
--color-primary: #3D6B4F
--color-primary-light: #5A8F6B
--color-bg: #F2EDE6
--color-surface: #FFFFFF
--color-text: #1A1A1A
--color-text-secondary: #6B6B6B
--color-border: #E5E0D8

## Status Values (한글)
읽는중 | 완독 | 읽고싶은 | 중단 | 하차

## Component Naming
- Pages: PascalCase, suffix Page (e.g. LibraryPage)
- Components: PascalCase (e.g. BookCard)
- Hooks: camelCase, prefix use (e.g. useBookSearch)