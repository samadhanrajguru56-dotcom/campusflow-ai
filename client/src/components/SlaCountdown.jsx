import React, { useState, useEffect } from 'react';
import { Timer, AlertCircle, ShieldCheck } from 'lucide-react';

export default function SlaCountdown({ createdAt, dueAt, status }) {
  const [timeState, setTimeState] = useState({
    remainingMs: 0,
    isOverdue: false,
    label: '',
    indicator: 'ON_TRACK', // ON_TRACK | AT_RISK | OVERDUE
    percentage: 0
  });

  useEffect(() => {
    function calculate() {
      if (!dueAt || status === 'RESOLVED' || status === 'CLOSED') {
        setTimeState({
          remainingMs: 0,
          isOverdue: false,
          label: status === 'RESOLVED' ? 'Completed' : 'Closed',
          indicator: 'ON_TRACK',
          percentage: 100
        });
        return;
      }

      const now = Date.now();
      const due = new Date(dueAt).getTime();
      const created = createdAt ? new Date(createdAt).getTime() : now - 3600000;
      const diff = due - now;
      const total = due - created;
      const elapsed = now - created;

      const percentage = total > 0 ? Math.min(100, Math.max(0, (elapsed / total) * 100)) : 100;

      if (diff <= 0) {
        const overdueMins = Math.abs(Math.round(diff / 60000));
        const hours = Math.floor(overdueMins / 60);
        const mins = overdueMins % 60;
        setTimeState({
          remainingMs: diff,
          isOverdue: true,
          label: `${hours > 0 ? `${hours}h ` : ''}${mins}m overdue`,
          indicator: 'OVERDUE',
          percentage: 100
        });
      } else {
        const remainingMins = Math.round(diff / 60000);
        const hours = Math.floor(remainingMins / 60);
        const mins = remainingMins % 60;
        const isAtRisk = percentage >= 80;

        setTimeState({
          remainingMs: diff,
          isOverdue: false,
          label: `${hours > 0 ? `${hours}h ` : ''}${mins}m left`,
          indicator: isAtRisk ? 'AT_RISK' : 'ON_TRACK',
          percentage
        });
      }
    }

    calculate();
    const timer = setInterval(calculate, 30000);
    return () => clearInterval(timer);
  }, [createdAt, dueAt, status]);

  if (status === 'RESOLVED' || status === 'CLOSED') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>SLA Met</span>
      </span>
    );
  }

  const indicatorStyles = {
    ON_TRACK: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    AT_RISK: 'bg-amber-500/15 text-amber-300 border-amber-500/30 animate-pulse',
    OVERDUE: 'bg-red-500/20 text-red-300 border-red-500/40 animate-bounce-subtle'
  };

  const badgeClass = indicatorStyles[timeState.indicator];

  return (
    <div className="flex flex-col items-start gap-1">
      <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${badgeClass}`}>
        <Timer className="w-3.5 h-3.5" />
        <span>{timeState.label}</span>
      </div>
      {/* Mini Progress Bar */}
      <div className="w-20 bg-slate-800 rounded-full h-1 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            timeState.indicator === 'OVERDUE'
              ? 'bg-red-500'
              : timeState.indicator === 'AT_RISK'
              ? 'bg-amber-400'
              : 'bg-emerald-400'
          }`}
          style={{ width: `${Math.min(100, timeState.percentage)}%` }}
        />
      </div>
    </div>
  );
}
