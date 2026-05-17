import React, { useState } from 'react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { supabase } from '../lib/supabase';
import { X, User, Mail, Lock, LogOut, ShieldCheck, Heart, UserPlus, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AccountModal() {
  const { isAccountOpen, closeAccount } = useCartStore();
  const { session, user, profile, isAdmin, signOut, fetchProfile } = useAuthStore();
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isAccountOpen) return null;

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

      await fetchProfile(data.user);
      setSuccessMsg('Logged in successfully!');
      setTimeout(() => {
        setSuccessMsg('');
        closeAccount();
      }, 1500);

    } catch (err) {
      setError('An unexpected error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 1. Sign up user inside Supabase auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
        setIsLoading(false);
        return;
      }

      if (!data.user) {
        setError('Verification email sent or register limit exceeded.');
        setIsLoading(false);
        return;
      }

      // 2. Insert new user profile inside profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          full_name: fullName,
          role: 'customer'
        });

      if (profileError) {
        console.error('Error inserting customer profile:', profileError);
        // Note: Sign up succeeded, so we fetch profile anyway (it might fall back gracefully)
      }

      await fetchProfile(data.user);
      setSuccessMsg('Account created successfully! Welcome to Plant Beauty 🎉');
      
      // Clear forms
      setEmail('');
      setPassword('');
      setFullName('');

      setTimeout(() => {
        setSuccessMsg('');
        closeAccount();
      }, 2000);

    } catch (err) {
      setError('An unexpected error occurred during account creation.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoutClick = async () => {
    setIsLoading(true);
    await signOut();
    setIsLoading(false);
    closeAccount();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fade-in bg-black/40 backdrop-blur-sm">
      {/* Click backdrop to close */}
      <div className="absolute inset-0 -z-10" onClick={closeAccount} />

      {/* Account panel content */}
      <div className="w-full max-w-md h-full bg-surface-container-lowest/95 shadow-2xl flex flex-col border-l border-outline-variant/30 animate-slide-in relative">
        
        {/* Header */}
        <div className="p-6 border-b border-outline-variant/30 flex items-center justify-between">
          <h2 className="font-headline-md text-headline-md text-primary flex items-center gap-2">
            <User className="w-5 h-5" />
            {session ? 'Your Account' : isSignUp ? 'Create Account' : 'Member Login'}
          </h2>
          <button 
            onClick={closeAccount}
            className="text-on-surface-variant hover:text-primary hover:bg-black/5 p-2 rounded-full transition-colors flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Inner Panel View */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {error && (
            <div className="bg-error-container text-on-error-container p-4 rounded-xl text-xs font-body-md border border-error/20">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="bg-primary-container text-on-primary-container p-4 rounded-xl text-xs font-body-md border border-primary/20 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>{successMsg}</span>
            </div>
          )}

          {session ? (
            /* ============================================== */
            /* 1. PROFILE DETAILS VIEW                        */
            /* ============================================== */
            <div className="space-y-6">
              <div className="glass-card p-6 rounded-2xl border border-outline-variant/10 text-center space-y-4">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                  <User className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md text-primary">
                    {profile?.full_name || 'Valued Botanist'}
                  </h3>
                  <p className="text-xs text-on-surface-variant font-mono mt-1">{user?.email}</p>
                </div>
                
                <span className="inline-block bg-secondary-container text-on-secondary-container text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {profile?.role === 'admin' ? '🛡️ SYSTEM ADMINISTRATOR' : '🌿 CUSTOMER MEMBER'}
                </span>
              </div>

              <div className="space-y-3 pt-4">
                {profile?.role === 'admin' && (
                  <button
                    onClick={() => {
                      closeAccount();
                      navigate('/admin/dashboard');
                    }}
                    className="w-full bg-primary text-on-primary py-3.5 rounded-full font-label-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Go to Admin Dashboard</span>
                  </button>
                )}

                <button
                  onClick={handleLogoutClick}
                  disabled={isLoading}
                  className="w-full bg-surface-container-low border border-outline-variant text-on-surface hover:bg-surface-container hover:text-error/80 py-3.5 rounded-full font-label-md transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out Account</span>
                </button>
              </div>
            </div>
          ) : (
            /* ============================================== */
            /* 2. LOGIN / SIGNUP TABS                         */
            /* ============================================== */
            <div className="space-y-6">
              <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-5">
                {isSignUp && (
                  <div className="space-y-1.5 animate-fade-in">
                    <label className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-widest block">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 w-4 h-4 text-on-surface-variant/70" />
                      <input 
                        type="text" 
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 focus:border-primary focus:ring-0 text-sm font-body-md rounded-xl focus:outline-none transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-widest block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-on-surface-variant/70" />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 focus:border-primary focus:ring-0 text-sm font-body-md rounded-xl focus:outline-none transition-colors"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-widest block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-on-surface-variant/70" />
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 focus:border-primary focus:ring-0 text-sm font-body-md rounded-xl focus:outline-none transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-primary text-on-primary py-3.5 rounded-full font-label-md hover:shadow-lg transition-colors flex items-center justify-center gap-2 active:scale-95 disabled:opacity-75"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></div>
                  ) : isSignUp ? (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Register New Account</span>
                    </>
                  ) : (
                    <>
                      <User className="w-4 h-4" />
                      <span>Access Account</span>
                    </>
                  )}
                </button>
              </form>

              <div className="text-center pt-2">
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                  }}
                  className="text-xs font-semibold text-primary hover:underline transition-all"
                >
                  {isSignUp ? 'Already have an account? Sign In' : "Don't have an account yet? Register Here"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
