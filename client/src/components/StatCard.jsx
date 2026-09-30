import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'brand',
  trend,
  onClick
}) {
  const colorMap = {
    brand: {
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      accent: 'border-l-emerald-500'
    },
    blue: {
      iconBg: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      accent: 'border-l-sky-500'
    },
    amber: {
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      accent: 'border-l-amber-500'
    },
    red: {
      iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      accent: 'border-l-rose-500'
    },
    purple: {
      iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      accent: 'border-l-purple-500'
    }
  };

  const scheme = colorMap[color] || colorMap.brand;

  return (
    <div
      onClick={onClick}
      className={`glass-card rounded-xl p-5 border-l-4 ${scheme.accent} relative overflow-hidden group ${
        onClick ? 'cursor-pointer hover:border-slate-700' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-1.5 font-sans tracking-tight">{value}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl border ${scheme.iconBg} transition-transform group-hover:scale-110 duration-200`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center gap-1.5 text-xs">
          {trend.isPositive ? (
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
          )}
          <span className={trend.isPositive ? 'text-emerald-400 font-medium' : 'text-rose-400 font-medium'}>
            {trend.value}
          </span>
          <span className="text-slate-400">{trend.label || 'vs last month'}</span>
        </div>
      )}
    </div>
  );
}
