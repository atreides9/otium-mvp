const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_API_KEY;
const BASE_URL = 'https://dapi.kakao.com/v3/search/book';

export async function searchBooks(query) {
  if (!query.trim()) return [];

  const params = new URLSearchParams({ query, size: 15 });
  const res = await fetch(`${BASE_URL}?${params}`, {
    headers: { Authorization: `KakaoAK ${KAKAO_API_KEY}` },
  });

  if (!res.ok) throw new Error('카카오 API 오류');

  const data = await res.json();
  return data.documents.map((doc) => ({
    isbn: doc.isbn.split(' ').pop(),
    title: doc.title,
    authors: doc.authors,
    publisher: doc.publisher,
    thumbnail: doc.thumbnail,
    contents: doc.contents,
  }));
}
