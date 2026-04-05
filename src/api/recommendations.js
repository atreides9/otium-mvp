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
  const token = session?.access_token;

  const { data, error } = await supabase.functions.invoke('recommend-books', {
    body: { user_id: userId },
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (error) throw error;
  return data;
}
