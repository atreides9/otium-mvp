import { create } from 'zustand';
import { supabase } from '../api/supabase';

function nicknameFrom(session) {
  return session?.user?.user_metadata?.nickname ?? null;
}

export const useAuthStore = create((set) => ({
  user: null,
  session: null,
  nickname: null,
  isLoading: true,

  init: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    set({ session, user: session?.user ?? null, nickname: nicknameFrom(session), isLoading: false });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null, nickname: nicknameFrom(session) });
    });

    return subscription;
  },
}));
