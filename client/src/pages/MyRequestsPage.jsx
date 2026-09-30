import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ticketApi } from '../services/api.js';
import PriorityBadge from '../components/PriorityBadge.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import SlaCountdown from '../components/SlaCountdown.jsx';
import { ListTodo, PlusCircle, Search, ArrowRight } from 'lucide-react';

export default function MyRequestsPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRequests() {
      try {
        const res = await ticketApi.getAll({ requesterId: user?.id });
        setTickets(res.data.tickets || []);
      } catch (err) {
        console.error('Failed to load my requests:', err);
      } finally {
        setLoading(false);
      }
    }
    if (user?.id) loadRequests();
  }, [user]);

  const filtered = tickets.filter(t =>
    t.title?.toLowerCase().includes(search.toLowerCase()) ||
    t.ticketNumber?.toLowerCase().includes(search.toLowerCase()) ||
    t.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Personal Request Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            My Submitted Requests ({tickets.length})
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track operational status, review work notes, and monitor SLA progress.
          </p>
        </div>

        <Link
          to="/report"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Problem Report</span>
        </Link>
      </div>

      {/* Search Input */}
      <div className="glass-panel rounded-2xl p-3 border border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ticket number, keyword, location..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-3xl p-5 border border-slate-800 overflow-x-auto">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading your requests...</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            No requests found. Click "New Problem Report" to submit an issue.
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                <th className="pb-3 px-3">Ticket #</th>
                <th className="pb-3 px-3">Subject</th>
                <th className="pb-3 px-3">Category</th>
                <th className="pb-3 px-3">Priority</th>
                <th className="pb-3 px-3">Location</th>
                <th className="pb-3 px-3">SLA Status</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-slate-300">{t.ticketNumber}</td>
                  <td className="py-3 px-3 font-semibold text-white max-w-xs truncate">{t.title}</td>
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
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-800 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 transition-colors"
                    >
                      Track →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
