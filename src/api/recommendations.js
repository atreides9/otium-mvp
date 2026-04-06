import { supabase } from './supabase';

export async function fetchRecommendations(userId) {
  const { data, error } = await supabase
    .from('recommendations')
    .select('*, books(*)')
    .eq('user_id', userId)
    .order('shown_at', { ascending: false })
    .limit(4);

  if (error || !data) return [];

  return data.map((row) => ({
    ...row.books,
    reason_copy: row.reason_copy,
  }));
}

export async function getNextAvailableAt(userId) {
  const { data, error } = await supabase
    .from('recommendations')
    .select('next_available_at')
    .eq('user_id', userId)
    .order('next_available_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return null;
  return data.next_available_at ?? null;
}

export async function requestNewRecommendation(userId) {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) throw new Error('로그인이 필요합니다');

  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/recommend-books`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ user_id: userId }),
    }
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error ?? 'recommendation failed');
  }

  return await response.json();
}
