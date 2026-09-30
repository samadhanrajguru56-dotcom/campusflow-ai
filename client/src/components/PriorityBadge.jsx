import React from 'react';
import { AlertCircle, AlertTriangle, Info, ShieldAlert } from 'lucide-react';

export default function PriorityBadge({ priority = 'MEDIUM', size = 'sm' }) {
  const p = (priority || 'MEDIUM').toUpperCase();
  
  const config = {
    CRITICAL: {
      bg: 'bg-red-500/15 text-red-400 border-red-500/30',
      icon: ShieldAlert,
      glow: 'shadow-[0_0_12px_rgba(239,68,68,0.3)]'
    },
    HIGH: {
      bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      icon: AlertTriangle,
      glow: 'shadow-[0_0_10px_rgba(245,158,11,0.2)]'
    },
    MEDIUM: {
      bg: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
      icon: Info,
      glow: ''
    },
    LOW: {
      bg: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
      icon: Info,
      glow: ''
    }
  };

  const current = config[p] || config.MEDIUM;
  const Icon = current.icon;
  const sizeClasses = size === 'xs' ? 'text-xs px-2 py-0.5' : size === 'lg' ? 'text-sm px-3.5 py-1.5' : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${current.bg} ${current.glow} ${sizeClasses}`}>
      <Icon className={size === 'xs' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{p}</span>
    </span>
  );
}
