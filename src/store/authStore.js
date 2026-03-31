import { create } from 'zustand';
import { supabase } from '../api/supabase';

export const useAuthStore = create((set) => ({
  user: null,
  session: null,
  isLoading: true,

  init: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    set({ session, user: session?.user ?? null, isLoading: false });

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null });
    });
  },
}));
