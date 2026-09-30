import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ticketApi } from '../services/api.js';
import PriorityBadge from '../components/PriorityBadge.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import SlaCountdown from '../components/SlaCountdown.jsx';
import StatCard from '../components/StatCard.jsx';
import {
  GraduationCap,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Monitor,
  Flame,
  ArrowRight
} from 'lucide-react';

export default function FacultyDashboard() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [labTickets, setLabTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFacultyData() {
      try {
        const [myRes, labRes] = await Promise.all([
          ticketApi.getAll({ requesterId: user?.id }),
          ticketApi.getAll({ location: 'Lab 3' })
        ]);
        setTickets(myRes.data.tickets || []);
        setLabTickets(labRes.data.tickets || []);
      } catch (err) {
        console.error('Failed to load faculty portal data:', err);
      } finally {
        setLoading(false);
      }
    }
    if (user?.id) loadFacultyData();
  }, [user]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Faculty Welcome Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Faculty Academic Operations Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Academic Lead: {user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Prioritize classroom projectors, exam laboratory networks, and lecture theater acoustics to ensure uninterrupted academic sessions.
          </p>
        </div>

        <Link
          to="/report"
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report Classroom / Lab Issue</span>
        </Link>
      </div>

      {/* Critical Lab 3 Hotspot Warning Banner for Faculty */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3.5">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
            Faculty Alert: Lab 3 Network Instability Detected
          </h4>
          <p className="text-xs text-slate-300">
            Automated intelligence has logged repeated network disconnects in Lab 3 prior to practical exams.
            Master Incident <strong>INC-1042</strong> is active with high-priority technician dispatch.
          </p>
        </div>
      </div>

      {/* Faculty Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Classroom / Lab Requests"
          value={tickets.length}
          subtitle="Reports initiated by faculty"
          icon={GraduationCap}
          color="blue"
        />
        <StatCard
          title="Lab 3 Incident Clusters"
          value={labTickets.length}
          subtitle="Concurrent reports in Lab 3"
          icon={Flame}
          color="amber"
        />
        <StatCard
          title="Resolved Expedited Tasks"
          value={tickets.filter(t => t.status === 'RESOLVED').length}
          subtitle="High priority classroom fixes"
          icon={CheckCircle2}
          color="brand"
        />
      </div>

      {/* Faculty Tickets Table */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Classroom & Facility Requests
            </h3>
            <p className="text-xs text-slate-400">Track technician actions and confirm resolutions</p>
          </div>
          <Link
            to="/my-requests"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>All My Requests</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading requests...</div>
        ) : tickets.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-500">
            No active faculty tickets. All academic facilities operational.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                  <th className="pb-3 px-3">Ticket</th>
                  <th className="pb-3 px-3">Facility / Room</th>
                  <th className="pb-3 px-3">Priority</th>
                  <th className="pb-3 px-3">SLA Countdown</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {tickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-300">{t.ticketNumber}</td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-white truncate max-w-xs">{t.title}</p>
                      <span className="text-[10px] text-slate-400">{t.location}</span>
                    </td>
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
                        Inspect →
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
