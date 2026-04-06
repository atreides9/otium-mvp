// Kakao category_name → 유저 장르 매핑
export function mapToGenre(categoryName) {
  if (!categoryName) return '기타';
  const c = categoryName;
  if (c.includes('에세이'))                          return '에세이';
  if (c.includes('희곡'))                            return '희곡';
  if (c.includes('소설'))                            return '소설';
  if (/[^가-힣]시[^가-힣]|^시$|[>]\s*시$/.test(c)) return '시';
  if (c.includes('사회과학') || c.startsWith('사회')) return '사회과학';
  if (c.includes('인문'))                            return '인문학';
  if (c.includes('경영') || c.includes('경제'))      return '경영/경제';
  if (c.includes('자기계발'))                        return '자기계발';
  if (c.includes('과학'))                            return '과학';
  if (c.includes('예술'))                            return '예술';
  if (c.includes('역사'))                            return '역사';
  if (c.includes('종교') || c.includes('역학'))      return '종교/역학';
  if (c.includes('컴퓨터') || c.includes('모바일') || c.includes('IT')) return '컴퓨터';
  if (c.includes('외국어'))                          return '외국어';
  if (c.includes('만화') || c.includes('라이트노벨')) return '만화/라이트노벨';
  if (c.includes('건강') || c.includes('취미') || c.includes('스포츠')) return '건강/취미';
  if (c.includes('여행'))                            return '여행';
  if (c.includes('전집') || c.includes('세트'))      return '전집';
  if (c.includes('요리') || c.includes('살림'))      return '요리/살림';
  if (c.includes('좋은부모') || c.includes('육아'))  return '좋은부모';
  if (c.includes('청소년'))                          return '청소년';
  if (c.includes('어린이') || c.includes('아동'))    return '어린이';
  return '기타';
}
