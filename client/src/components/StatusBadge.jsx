import React from 'react';
import { Clock, PlayCircle, CheckCircle2, XCircle, AlertOctagon } from 'lucide-react';

export default function StatusBadge({ status = 'OPEN', size = 'sm' }) {
  const s = (status || 'OPEN').toUpperCase();

  const config = {
    OPEN: {
      bg: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
      icon: Clock,
      label: 'Open'
    },
    IN_PROGRESS: {
      bg: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
      icon: PlayCircle,
      label: 'In Progress'
    },
    RESOLVED: {
      bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      icon: CheckCircle2,
      label: 'Resolved'
    },
    CLOSED: {
      bg: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
      icon: XCircle,
      label: 'Closed'
    },
    ESCALATED: {
      bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse',
      icon: AlertOctagon,
      label: 'Overdue / Escalated'
    }
  };

  const current = config[s] || config.OPEN;
  const Icon = current.icon;
  const sizeClasses = size === 'xs' ? 'text-xs px-2 py-0.5' : size === 'lg' ? 'text-sm px-3.5 py-1.5' : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${current.bg} ${sizeClasses}`}>
      <Icon className={size === 'xs' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{current.label}</span>
    </span>
  );
}
