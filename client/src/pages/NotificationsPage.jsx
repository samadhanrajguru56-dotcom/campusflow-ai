import React from 'react';
import { useNotifications } from '../context/NotificationContext.jsx';
import { Bell, CheckCheck, Clock, ShieldAlert, AlertTriangle, Info } from 'lucide-react';

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Real-Time Alert Feed
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            Notifications ({notifications.length})
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            System dispatch alerts, 80% SLA countdown warnings, and ticket resolution confirmations.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 transition-colors"
          >
            <CheckCheck className="w-4 h-4 text-emerald-400" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      <div className="glass-panel rounded-3xl p-5 border border-slate-800 divide-y divide-slate-800/80">
        {notifications.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500">
            <Bell className="w-10 h-10 text-slate-700 mx-auto mb-2" />
            <p>You have no notifications at this time.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={`py-4 px-3 rounded-2xl cursor-pointer transition-colors flex items-start justify-between gap-4 ${
                n.read ? 'hover:bg-slate-900/40 opacity-70' : 'bg-slate-900/80 hover:bg-slate-900 font-medium'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                    n.type?.includes('BREACH') || n.type?.includes('ESCALAT')
                      ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                      : n.type?.includes('WARNING')
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-white leading-relaxed">{n.message}</p>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(n.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {!n.read && (
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 mt-2 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
