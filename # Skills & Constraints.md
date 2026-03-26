# Skills & Constraints

## UI Patterns (디자인 레퍼런스 기반)
- 검색 결과: 책 썸네일 + 제목(bold) + 저자 + 출판사, 카드형 리스트
- 상태 탭: pill 버튼, 선택 시 #3D6B4F 배경 + 흰 텍스트
- 진도바: 녹색 filled, percentage 중앙 표시
- 별점: 5점 만점, 터치 인터랙션
- Empty state: 마스코트 이미지 + 안내 문구 + CTA 버튼

## API Error Handling
- 카카오 API 실패: "검색 결과를 불러올 수 없어요" 토스트
- Supabase 실패: "저장에 실패했어요. 다시 시도해주세요" 토스트

## Animation
- 페이지 전환: fade (150ms)
- 카드 등장: stagger (50ms 간격)
- 버튼 탭: scale(0.96) 100ms

## Accessibility
- 모든 버튼 aria-label
- 이미지 alt 필수
- 포커스 링 visible
```
