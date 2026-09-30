import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Zap, LogIn, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, switchDemoRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      redirectRole(user.role);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role) => {
    setError('');
    setLoading(true);
    try {
      const user = await switchDemoRole(role);
      redirectRole(user.role);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to initialize demo session.');
    } finally {
      setLoading(false);
    }
  };

  const redirectRole = (role) => {
    switch (role) {
      case 'ADMIN': navigate('/admin'); break;
      case 'STAFF': navigate('/staff'); break;
      case 'FACULTY': navigate('/faculty'); break;
      default: navigate('/student'); break;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-slate-950">
      <div className="w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg">
              <Zap className="w-4 h-4 text-slate-950 font-black fill-current" />
            </div>
            <span className="font-extrabold text-lg text-white">CAMPUSFLOW AI</span>
          </Link>
          <h2 className="text-xl font-bold text-white tracking-tight">Sign in to Operations Hub</h2>
          <p className="text-xs text-slate-400 mt-1">Access autonomous campus workflows & requests</p>
        </div>

        {/* 1-Click Quick Demo Sign-In Box */}
        <div className="mb-6 p-3.5 rounded-2xl bg-brand-950/40 border border-brand-500/30">
          <div className="flex items-center gap-1.5 text-xs font-bold text-brand-300 mb-2">
            <ShieldCheck className="w-4 h-4 text-brand-400" />
            <span>Hackathon Judge 1-Click Demo Login</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickDemo('ADMIN')}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900/90 hover:bg-emerald-500/20 text-slate-200 border border-slate-700/60 hover:border-emerald-500/40 transition-colors text-left"
            >
              👑 Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('FACULTY')}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900/90 hover:bg-emerald-500/20 text-slate-200 border border-slate-700/60 hover:border-emerald-500/40 transition-colors text-left"
            >
              🎓 Faculty
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('STAFF')}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900/90 hover:bg-emerald-500/20 text-slate-200 border border-slate-700/60 hover:border-emerald-500/40 transition-colors text-left"
            >
              🔧 Technician
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('STUDENT')}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900/90 hover:bg-emerald-500/20 text-slate-200 border border-slate-700/60 hover:border-emerald-500/40 transition-colors text-left"
            >
              🎒 Student
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Campus Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@campusflow.edu"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400 border-t border-slate-800 pt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-emerald-400 font-semibold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
