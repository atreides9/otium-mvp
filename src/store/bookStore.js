import { create } from 'zustand';
import { supabase } from '../api/supabase';

export const useBookStore = create((set, get) => ({
  records: [],
  loading: false,
  error: null,

  fetchRecords: async () => {
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from('book_records')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      set({ error: error.message, loading: false });
    } else {
      set({ records: data ?? [], loading: false });
    }
  },

  addRecord: async (record) => {
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from('book_records')
      .insert([record])
      .select()
      .single();
    if (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
    set((s) => ({ records: [data, ...s.records], loading: false }));
    return data;
  },

  updateRecord: async (id, updates) => {
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from('book_records')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
    set((s) => ({
      records: s.records.map((r) => (r.id === id ? data : r)),
      loading: false,
    }));
    return data;
  },

  deleteRecord: async (id) => {
    const { error } = await supabase.from('book_records').delete().eq('id', id);
    if (error) {
      set({ error: error.message });
      throw error;
    }
    set((s) => ({ records: s.records.filter((r) => r.id !== id) }));
  },
}));
