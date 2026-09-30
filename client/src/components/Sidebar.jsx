import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  LayoutDashboard,
  PlusCircle,
  ListTodo,
  Layers,
  Zap,
  BarChart3,
  Sparkles,
  Play,
  Bell,
  Sliders,
  ShieldAlert,
  Users
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const role = user?.role || 'STUDENT';

  // Determine role-based primary dashboard link
  const dashboardLink =
    role === 'ADMIN'
      ? '/admin'
      : role === 'STAFF'
      ? '/staff'
      : role === 'FACULTY'
      ? '/faculty'
      : '/student';

  const navItems = [
    {
      to: dashboardLink,
      icon: LayoutDashboard,
      label: `${role.charAt(0) + role.slice(1).toLowerCase()} Hub`
    },
    {
      to: '/report',
      icon: PlusCircle,
      label: 'Report Problem',
      badge: 'AI'
    },
    {
      to: '/my-requests',
      icon: ListTodo,
      label: 'My Requests'
    },
    {
      to: '/incidents',
      icon: Layers,
      label: 'All Incidents',
      sub: 'Merged groups'
    },
    {
      to: '/automation',
      icon: Zap,
      label: 'Automation Center',
      highlight: true
    },
    {
      to: '/analytics',
      icon: BarChart3,
      label: 'Operational Analytics'
    },
    {
      to: '/insights',
      icon: Sparkles,
      label: 'AI Predictive Insights',
      badge: 'Smart'
    },
    {
      to: '/demo',
      icon: Play,
      label: 'Live Hackathon Demo',
      special: true
    },
    {
      to: '/notifications',
      icon: Bell,
      label: 'Notifications'
    },
    {
      to: '/settings',
      icon: Sliders,
      label: 'Settings & Rules'
    }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-16 bottom-0 left-0 w-64 glass-panel border-r border-slate-800/80 z-40 transition-transform duration-300 flex flex-col justify-between py-4 px-3 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Operations Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-[0_0_15px_rgba(34,197,94,0.15)] font-bold'
                      : item.special
                      ? 'text-brand-300 bg-brand-950/40 border border-brand-500/20 hover:border-brand-500/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-brand-500/20 text-brand-400 border border-brand-500/30">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Bottom SLA Engine Status Widget */}
        <div className="pt-4 border-t border-slate-800/80 px-2">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-bold text-white tracking-tight">Auto-Engine Active</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              SLA loop checking breaches every 60s. Auto-routing & duplicate detection active.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
