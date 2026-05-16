import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/useAuthStore';
import { Leaf } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { session, isAdmin } = useAuthStore();

  // If already logged in as admin, send them to the dashboard
  useEffect(() => {
    if (session && isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [session, isAdmin, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setIsLoading(false);
        return;
      }

      // Check if the user is actually an admin in the profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileError || profile?.role !== 'admin') {
        // If they are not an admin, sign them out immediately and show an error
        await supabase.auth.signOut();
        setError('Unauthorized access. This portal is for administrators only.');
        setIsLoading(false);
        return;
      }

      // If successful and is admin, the useAuthStore will detect the session change and update state
      // We can safely navigate
      navigate('/admin/dashboard', { replace: true });

    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-container flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface-container-lowest p-8 rounded-2xl shadow-xl border border-outline-variant">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="bg-primary-container p-3 rounded-full mb-4">
            <Leaf className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary text-center">Verdant Admin</h1>
          <p className="text-on-surface-variant font-label-md mt-2 uppercase tracking-widest text-xs">Secure Portal</p>
        </div>

        {error && (
          <div className="bg-error-container text-on-error-container p-4 rounded-lg mb-6 text-sm font-body-md border border-error/20">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1">
            <label className="font-label-md text-[12px] text-on-surface-variant uppercase tracking-widest block">Admin Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-container-low border-0 border-b border-outline focus:border-primary focus:ring-0 text-body-md px-4 py-3 rounded-t-lg"
              placeholder="admin@verdantoasis.com"
            />
          </div>
          
          <div className="space-y-1">
            <label className="font-label-md text-[12px] text-on-surface-variant uppercase tracking-widest block">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-container-low border-0 border-b border-outline focus:border-primary focus:ring-0 text-body-md px-4 py-3 rounded-t-lg"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-primary text-on-primary py-4 rounded-full font-label-md hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors flex items-center justify-center disabled:opacity-70"
          >
            {isLoading ? 'Authenticating...' : 'Enter Workspace'}
          </button>
        </form>
      </div>
    </div>
  );
}
