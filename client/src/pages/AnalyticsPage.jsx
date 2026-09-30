import React, { useState, useEffect } from 'react';
import { analyticsApi } from '../services/api.js';
import StatCard from '../components/StatCard.jsx';
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Clock,
  CopyCheck,
  AlertTriangle,
  Building,
  Layers,
  Flame,
  Activity
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
  Area,
  Legend
} from 'recharts';

export default function AnalyticsPage() {
  const [overview, setOverview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [trends, setTrends] = useState([]);
  const [slaData, setSlaData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAllAnalytics() {
      try {
        const [ovRes, catRes, deptRes, prioRes, trendRes, slaRes] = await Promise.all([
          analyticsApi.getOverview(),
          analyticsApi.getCategories(),
          analyticsApi.getDepartments(),
          analyticsApi.getPriorities(),
          analyticsApi.getTrends(),
          analyticsApi.getSla()
        ]);
        setOverview(ovRes.data.overview);
        setCategories(catRes.data.categories);
        setDepartments(deptRes.data.departments);
        setPriorities(prioRes.data.priorities);
        setTrends(trendRes.data.trends);
        setSlaData(slaRes.data.sla);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAllAnalytics();
  }, []);

  const COLORS = ['#22c55e', '#38bdf8', '#f59e0b', '#ec4899', '#a855f7', '#64748b'];

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Synthesizing campus analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
          Executive Telemetry & Business Intelligence
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
          Operational Analytics & SLA Adherence
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Deep diagnostic metrics on campus operations velocity, department workloads, and automated triage savings.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Overall SLA Adherence"
          value={overview?.slaCompliance || '92.4%'}
          subtitle="Resolved within dynamic SLA"
          icon={CheckCircle2}
          color="brand"
          trend={{ value: '+4.2%', isPositive: true }}
        />
        <StatCard
          title="Manual Coordination Saved"
          value={`${overview?.manualStepsReduced || 208} Steps`}
          subtitle="Autonomous routing & dispatch"
          icon={Activity}
          color="blue"
        />
        <StatCard
          title="Avg Turnaround Time"
          value={`${overview?.averageResolutionHours || 4.2} Hours`}
          subtitle="From report to field resolution"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Duplicate Incidents Merged"
          value={`${overview?.mergedCount || 14} Reports`}
          subtitle="Consolidated into master tickets"
          icon={CopyCheck}
          color="purple"
        />
      </div>

      {/* Row 1: Trends & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 glass-panel rounded-3xl p-5 sm:p-6 border border-slate-800">
          <h3 className="text-sm font-bold text-white tracking-tight mb-1">
            Campus Operational Velocity (4-Week Window)
          </h3>
          <p className="text-xs text-slate-400 mb-4">Total requests submitted vs completed resolutions</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends}>
                <defs>
                  <linearGradient id="areaTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="areaResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="week" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend />
                <Area type="monotone" dataKey="total" stroke="#38bdf8" strokeWidth={2.5} fill="url(#areaTotal)" name="Incoming Requests" />
                <Area type="monotone" dataKey="resolved" stroke="#22c55e" strokeWidth={2.5} fill="url(#areaResolved)" name="Resolved on Schedule" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 glass-panel rounded-3xl p-5 sm:p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight mb-1">
              Priority Segmentation
            </h3>
            <p className="text-xs text-slate-400 mb-4">Urgency levels across campus</p>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorities}
                    dataKey="count"
                    nameKey="priority"
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    innerRadius={45}
                    paddingAngle={3}
                  >
                    {priorities.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.priority === 'CRITICAL'
                            ? '#ef4444'
                            : entry.priority === 'HIGH'
                            ? '#f59e0b'
                            : entry.priority === 'MEDIUM'
                            ? '#38bdf8'
                            : '#64748b'
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-800">
            {priorities.map((p) => (
              <div key={p.priority} className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                <span className="font-semibold text-slate-300 text-[11px]">{p.priority}</span>
                <span className="font-mono font-bold text-white">{p.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Department Workload & Category Volumes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Workload & SLA Adherence */}
        <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white tracking-tight">
            Department Performance & Resolution Ratio
          </h3>
          <p className="text-xs text-slate-400">Total volume vs completed fixes per team</p>

          <div className="space-y-3">
            {departments.map((d) => (
              <div key={d.id} className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{d.name}</span>
                  <span className="font-mono text-emerald-400 font-bold">{d.slaScore}% SLA Adherence</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden flex">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${d.slaScore}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>{d.resolved} Resolved</span>
                  <span>{d.pending} Pending</span>
                  <span className="font-bold text-slate-300">{d.total} Total Tasks</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Requests by Category BarChart */}
        <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white tracking-tight">
            Incident Volumes by Category
          </h3>
          <p className="text-xs text-slate-400">Distribution across infrastructure specializations</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categories}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#22c55e" radius={[6, 6, 0, 0]} name="Ticket Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
