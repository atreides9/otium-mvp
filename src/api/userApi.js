import { supabase } from './supabase';

export async function signUp({ email, password }) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

export async function signIn({ email, password }) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function insertUser({ id, email, nickname }) {
  const { error } = await supabase.from('users').insert({
    id,
    email,
    nickname,
    created_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export async function getUserById(userId) {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, nickname')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}
