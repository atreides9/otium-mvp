# Skills

## UI Patterns
- 검색 결과: 썸네일(60×80) + 제목 bold + 저자 + 출판사, 카드 리스트
- 상태 칩: pill, 선택 시 #5C4A3A 배경 + 흰 텍스트
- 진도바: #3D7A5E filled, percentage 중앙
- 별점: ★ 5점, 터치 인터랙션
- Empty state: 마스코트 + 안내 문구 + CTA

## Error Handling
- Kakao API 실패: "검색 결과를 불러올 수 없어요"
- Supabase 실패: "저장에 실패했어요. 다시 시도해주세요"
- 미구현 기능: "준비중입니다" (toast)

## Animation
- 페이지 전환: fade 150ms
- 카드 등장: stagger 50ms
- 버튼 탭: scale(0.96) 100ms

## Accessibility
- 버튼 aria-label 필수
- 이미지 alt 필수
- 포커스 링 visible
