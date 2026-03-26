import { useState, useEffect, useRef } from 'react';
import { searchBooks } from '../api/bookApi';

export function useBookSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const books = await searchBooks(query);
        setResults(books);
      } catch {
        setError('검색 결과를 불러올 수 없어요');
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(timerRef.current);
  }, [query]);

  return { query, setQuery, results, loading, error };
}
