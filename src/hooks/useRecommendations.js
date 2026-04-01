import { useState, useEffect, useCallback } from 'react';
import { fetchRecommendations, getNextAvailableAt, requestNewRecommendation } from '../api/recommendations';
import { useToast } from '../components/Toast';

export function useRecommendations(userId) {
  const [books, setBooks] = useState([]);
  const [nextAvailableAt, setNextAvailableAt] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState(null);
  const showToast = useToast();

  const load = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const [booksData, nextAt] = await Promise.all([
        fetchRecommendations(userId),
        getNextAvailableAt(userId),
      ]);
      setBooks(booksData);
      setNextAvailableAt(nextAt);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const diff = nextAvailableAt ? new Date(nextAvailableAt) - Date.now() : 0;
  const daysUntilNext = diff <= 0 ? 0 : Math.ceil(diff / (1000 * 60 * 60 * 24));

  const requestNew = useCallback(async () => {
    if (!userId) return;
    setIsRequesting(true);
    try {
      await requestNewRecommendation(userId);
      await load();
    } catch {
      showToast('추천을 불러오지 못했어요. 다시 시도해주세요');
    } finally {
      setIsRequesting(false);
    }
  }, [userId, load, showToast]);

  return { books, nextAvailableAt, isLoading, error, refetch: load, daysUntilNext, isRequesting, requestNew };
}
