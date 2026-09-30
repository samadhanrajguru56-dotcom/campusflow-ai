import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ticketApi } from '../services/api.js';
import PriorityBadge from '../components/PriorityBadge.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import SlaCountdown from '../components/SlaCountdown.jsx';
import StatCard from '../components/StatCard.jsx';
import { PlusCircle, Clock, CheckCircle2, AlertCircle, ArrowRight, Mic } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStudentTickets() {
      try {
        const res = await ticketApi.getAll({ requesterId: user?.id });
        setTickets(res.data.tickets || []);
      } catch (err) {
        console.error('Failed to load student requests:', err);
      } finally {
        setLoading(false);
      }
    }
    if (user?.id) loadStudentTickets();
  }, [user]);

  const activeCount = tickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length;
  const resolvedCount = tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Student Welcome Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Student Operations Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {user?.name || 'Student'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Need urgent lab internet, hostel water, classroom fan or projector fixed? Submit with voice or text and track real-time resolution SLA.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10">
          <Link
            to="/report"
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all active:scale-95"
          >
            <Mic className="w-4 h-4" />
            <span>Report Problem Now</span>
          </Link>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Active Requests"
          value={activeCount}
          subtitle="Currently assigned & in progress"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Resolved"
          value={resolvedCount}
          subtitle="Fixed by campus technicians"
          icon={CheckCircle2}
          color="brand"
        />
        <StatCard
          title="Total Reports Submitted"
          value={tickets.length}
          subtitle="Logged under your student profile"
          icon={PlusCircle}
          color="blue"
        />
      </div>

      {/* My Reported Issues */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              My Campus Requests ({tickets.length})
            </h3>
            <p className="text-xs text-slate-400">Track task assignments and SLA progress</p>
          </div>
          <Link
            to="/my-requests"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading your requests...</div>
        ) : tickets.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto opacity-70" />
            <h4 className="text-sm font-bold text-white">No Active Problems Reported</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Campus facilities in your vicinity are operating smoothly. If you face any issues, click Report Problem.
            </p>
            <Link
              to="/report"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white"
            >
              Report an Issue
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                  <th className="pb-3 px-3">Ticket</th>
                  <th className="pb-3 px-3">Problem</th>
                  <th className="pb-3 px-3">Location</th>
                  <th className="pb-3 px-3">Priority</th>
                  <th className="pb-3 px-3">SLA Status</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {tickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-300">{t.ticketNumber}</td>
                    <td className="py-3 px-3 font-semibold text-white max-w-xs truncate">{t.title}</td>
                    <td className="py-3 px-3 text-slate-400 truncate max-w-[150px]">{t.location}</td>
                    <td className="py-3 px-3"><PriorityBadge priority={t.priority} size="xs" /></td>
                    <td className="py-3 px-3">
                      <SlaCountdown createdAt={t.createdAt} dueAt={t.dueAt} status={t.status} />
                    </td>
                    <td className="py-3 px-3"><StatusBadge status={t.status} size="xs" /></td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        to={`/tickets/${t.id}`}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-800 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300"
                      >
                        Track →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
