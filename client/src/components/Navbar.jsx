import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotifications } from '../context/NotificationContext.jsx';
import {
  Zap,
  Bell,
  PlusCircle,
  Play,
  LogOut,
  User,
  Shield,
  CheckCheck,
  Menu,
  X
} from 'lucide-react';

export default function Navbar({ onToggleSidebar }) {
  const { user, logout, switchDemoRole } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  const handleRoleSwitch = async (role) => {
    await switchDemoRole(role);
    setShowProfileMenu(false);
    navigate(
      role === 'ADMIN'
        ? '/admin'
        : role === 'STAFF'
        ? '/staff'
        : role === 'FACULTY'
        ? '/faculty'
        : '/student'
    );
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Brand */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.4)] group-hover:scale-105 transition-transform duration-200">
              <Zap className="w-5 h-5 text-slate-950 font-black fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white">CAMPUSFLOW</span>
                <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-400 border border-brand-500/40">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">Smart Campus Operations</p>
            </div>
          </Link>
        </div>

        {/* Center: Live Demo & Quick Navigation */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            to="/demo"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/40 hover:border-emerald-500 hover:shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all duration-200"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Interactive Live Demo</span>
          </Link>

          <Link
            to="/automation"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Automation Center</span>
          </Link>
        </div>

        {/* Right: Actions & User */}
        <div className="flex items-center gap-3">
          {/* Quick Report Button */}
          <Link
            to="/report"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all duration-200 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Problem</span>
          </Link>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 relative transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-[0_0_8px_rgba(239,68,68,0.5)]">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-panel rounded-2xl shadow-2xl border border-slate-700/80 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-sm font-bold text-white">Notifications</h4>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Mark all read</span>
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60 my-2">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-500">
                      No notifications yet.
                    </div>
                  ) : (
                    notifications.slice(0, 6).map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markAsRead(n.id)}
                        className={`py-2.5 px-2 rounded-lg cursor-pointer transition-colors ${
                          n.read ? 'hover:bg-slate-800/40 opacity-70' : 'bg-slate-800/50 hover:bg-slate-800/80 font-medium'
                        }`}
                      >
                        <p className="text-xs text-slate-200 leading-snug">{n.message}</p>
                        <span className="text-[10px] text-slate-500 mt-1 block">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-2 border-t border-slate-800 text-center">
                  <Link
                    to="/notifications"
                    onClick={() => setShowNotifications(false)}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                  >
                    View All Notifications →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Demo Switcher */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-800/80 border border-transparent hover:border-slate-700/60 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-emerald-400">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-white leading-tight">{user.name}</p>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                    {user.role}
                  </span>
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 glass-panel rounded-2xl shadow-2xl border border-slate-700/80 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="text-xs font-bold text-white">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-brand-500/20 text-brand-400 border border-brand-500/30">
                      ROLE: {user.role}
                    </span>
                  </div>

                  {/* 1-Click Role Switcher for Hackathon Judges */}
                  <div className="py-2 border-b border-slate-800">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 mb-1.5">
                      ⚡ Switch Demo Role
                    </p>
                    <div className="grid grid-cols-2 gap-1 px-1">
                      <button
                        onClick={() => handleRoleSwitch('ADMIN')}
                        className={`text-xs px-2.5 py-1.5 rounded-lg text-left font-medium transition-colors ${
                          user.role === 'ADMIN' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        👑 Admin
                      </button>
                      <button
                        onClick={() => handleRoleSwitch('FACULTY')}
                        className={`text-xs px-2.5 py-1.5 rounded-lg text-left font-medium transition-colors ${
                          user.role === 'FACULTY' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        🎓 Faculty
                      </button>
                      <button
                        onClick={() => handleRoleSwitch('STAFF')}
                        className={`text-xs px-2.5 py-1.5 rounded-lg text-left font-medium transition-colors ${
                          user.role === 'STAFF' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        🔧 Technician
                      </button>
                      <button
                        onClick={() => handleRoleSwitch('STUDENT')}
                        className={`text-xs px-2.5 py-1.5 rounded-lg text-left font-medium transition-colors ${
                          user.role === 'STUDENT' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        🎒 Student
                      </button>
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/profile"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-800 transition-colors"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>My Profile</span>
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-800 transition-colors"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>Settings & Rules</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setShowProfileMenu(false);
                        navigate('/login');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 transition-colors mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
