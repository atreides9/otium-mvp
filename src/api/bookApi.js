const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_API_KEY;
const BASE_URL = 'https://dapi.kakao.com/v3/search/book';

export async function fetchCategoryByIsbn(isbn) {
  if (!isbn) return '';
  try {
    const params = new URLSearchParams({ query: isbn, size: 1 });
    const res = await fetch(`${BASE_URL}?${params}`, {
      headers: { Authorization: `KakaoAK ${KAKAO_API_KEY}` },
    });
    if (!res.ok) return '';
    const data = await res.json();
    return data.documents?.[0]?.category_name ?? '';
  } catch {
    return '';
  }
}

export async function fetchCategoryByTitle(title) {
  if (!title) return '';
  try {
    const params = new URLSearchParams({ query: title, size: 5 });
    const res = await fetch(`${BASE_URL}?${params}`, {
      headers: { Authorization: `KakaoAK ${KAKAO_API_KEY}` },
    });
    if (!res.ok) return '';
    const data = await res.json();
    // category_name 있는 첫 번째 문서 우선, 없으면 첫 번째
    const doc = data.documents?.find((d) => d.category_name) ?? data.documents?.[0];
    return doc?.category_name ?? '';
  } catch {
    return '';
  }
}

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
    category: doc.category_name ?? '',
  }));
}
