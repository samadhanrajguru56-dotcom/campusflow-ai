import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsApi, ticketApi, automationApi } from '../services/api.js';
import StatCard from '../components/StatCard.jsx';
import PriorityBadge from '../components/PriorityBadge.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import SlaCountdown from '../components/SlaCountdown.jsx';
import {
  Inbox,
  CheckCircle2,
  Clock,
  AlertTriangle,
  CopyCheck,
  Zap,
  TrendingUp,
  BarChart3,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Play
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [trends, setTrends] = useState([]);
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [ovRes, catRes, prioRes, deptRes, trendRes, tktRes] = await Promise.all([
          analyticsApi.getOverview(),
          analyticsApi.getCategories(),
          analyticsApi.getPriorities(),
          analyticsApi.getDepartments(),
          analyticsApi.getTrends(),
          ticketApi.getAll({ limit: 6 })
        ]);

        setOverview(ovRes.data.overview);
        setCategories(catRes.data.categories);
        setPriorities(prioRes.data.priorities);
        setDepartments(deptRes.data.departments);
        setTrends(trendRes.data.trends);
        setRecentTickets(tktRes.data.tickets.slice(0, 6));
      } catch (err) {
        console.error('Failed to load admin dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const COLORS = ['#22c55e', '#38bdf8', '#f59e0b', '#ec4899', '#a855f7', '#64748b'];

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading campus operations intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Executive Command Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            Campus Operations Overview
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry, automated triage queues and predictive failure tracking.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/demo"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-500/40 hover:bg-brand-500/30 transition-all shadow-[0_0_15px_rgba(34,197,94,0.2)]"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Interactive Demo</span>
          </Link>
          <Link
            to="/insights"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Insights</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <StatCard
          title="Total Requests"
          value={overview?.totalRequests || 0}
          icon={Inbox}
          color="blue"
          trend={{ value: '+18%', isPositive: true }}
        />
        <StatCard
          title="In Progress"
          value={overview?.inProgressCount || 0}
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="SLA Compliance"
          value={overview?.slaCompliance || '92%'}
          icon={CheckCircle2}
          color="brand"
          trend={{ value: '+4.2%', isPositive: true }}
        />
        <StatCard
          title="Critical Issues"
          value={overview?.criticalCount || 0}
          icon={ShieldAlert}
          color="red"
        />
        <StatCard
          title="Overdue Breaches"
          value={overview?.overdueCount || 0}
          icon={AlertTriangle}
          color="red"
        />
        <StatCard
          title="Duplicates Merged"
          value={overview?.mergedCount || 0}
          icon={CopyCheck}
          color="purple"
          subtitle="Saved ~14 hours"
        />
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 4-Week Operations Trend */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-5 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                4-Week Request & Resolution Velocity
              </h3>
              <p className="text-[11px] text-slate-400">Total volume vs automated resolutions</p>
            </div>
            <span className="text-xs font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              High Resolution Rate
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="week" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="total" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" name="Total Requests" />
                <Area type="monotone" dataKey="resolved" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorResolved)" name="Resolved" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Request by Category Distribution */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-5 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight mb-1">
              Requests by Category
            </h3>
            <p className="text-[11px] text-slate-400 mb-4">Volume breakdown across operational domains</p>
            <div className="h-52 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categories}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    innerRadius={45}
                    paddingAngle={3}
                  >
                    {categories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-3 border-t border-slate-800">
            {categories.slice(0, 4).map((c, i) => (
              <div key={c.name} className="flex items-center gap-1.5 truncate">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-slate-300 truncate">{c.name}</span>
                <span className="text-slate-500 font-mono ml-auto">({c.count})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Incident Feed Table */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Active Triage Queue
            </h3>
            <p className="text-xs text-slate-400">Real-time requests and automated SLA countdowns</p>
          </div>
          <Link
            to="/incidents"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>View All Tickets ({overview?.totalRequests})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <th className="pb-3 px-3">Ticket #</th>
                <th className="pb-3 px-3">Problem Title</th>
                <th className="pb-3 px-3">Category</th>
                <th className="pb-3 px-3">Priority</th>
                <th className="pb-3 px-3">Location</th>
                <th className="pb-3 px-3">SLA Status</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recentTickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-900/60 transition-colors group">
                  <td className="py-3 px-3 font-mono font-bold text-slate-300">{t.ticketNumber}</td>
                  <td className="py-3 px-3 max-w-xs">
                    <p className="font-semibold text-white truncate">{t.title}</p>
                    {t.incidentId && (
                      <span className="inline-block text-[10px] text-amber-400 font-bold mt-0.5">
                        ⚡ Merged in Master INC
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-slate-300">{t.category}</td>
                  <td className="py-3 px-3"><PriorityBadge priority={t.priority} size="xs" /></td>
                  <td className="py-3 px-3 text-slate-400 truncate max-w-[140px]">{t.location}</td>
                  <td className="py-3 px-3">
                    <SlaCountdown createdAt={t.createdAt} dueAt={t.dueAt} status={t.status} />
                  </td>
                  <td className="py-3 px-3"><StatusBadge status={t.status} size="xs" /></td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      to={`/tickets/${t.id}`}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-800 group-hover:bg-emerald-500/20 text-slate-300 group-hover:text-emerald-300 transition-colors"
                    >
                      Details →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
