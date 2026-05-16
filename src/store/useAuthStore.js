import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useAuthStore = create((set) => ({
  session: null,
  user: null,
  profile: null,
  isAdmin: false,
  loading: true,

  initialize: async () => {
    // Get initial session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      await useAuthStore.getState().fetchProfile(session.user);
    } else {
      set({ session: null, user: null, profile: null, isAdmin: false, loading: false });
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        await useAuthStore.getState().fetchProfile(session.user);
      } else {
        set({ session: null, user: null, profile: null, isAdmin: false, loading: false });
      }
    });
  },

  fetchProfile: async (user) => {
    try {
      set({ loading: true });
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) {
        console.error('Error fetching profile:', error);
        set({ session: user, user, profile: null, isAdmin: false, loading: false });
        return;
      }
      
      set({ 
        session: user, 
        user, 
        profile: data, 
        isAdmin: data?.role === 'admin',
        loading: false 
      });
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      set({ session: user, user, profile: null, isAdmin: false, loading: false });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null, profile: null, isAdmin: false });
  }
}));
