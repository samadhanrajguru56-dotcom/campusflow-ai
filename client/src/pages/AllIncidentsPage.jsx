import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ticketApi, incidentApi } from '../services/api.js';
import PriorityBadge from '../components/PriorityBadge.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import SlaCountdown from '../components/SlaCountdown.jsx';
import {
  Layers,
  Search,
  Filter,
  PlusCircle,
  CopyCheck,
  Building,
  Flame,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function AllIncidentsPage() {
  const [activeTab, setActiveTab] = useState('tickets'); // 'tickets' | 'incidents'
  const [tickets, setTickets] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [tRes, iRes] = await Promise.all([
        ticketApi.getAll({
          search,
          category: categoryFilter,
          priority: priorityFilter,
          status: statusFilter
        }),
        incidentApi.getAll()
      ]);
      setTickets(tRes.data.tickets || []);
      setIncidents(iRes.data.incidents || []);
    } catch (err) {
      console.error('Failed to load tickets/incidents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [categoryFilter, priorityFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Operations Repository
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            Campus Incidents & Tickets
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse all reported campus issues, master grouped incidents, and technician assignments.
          </p>
        </div>

        <Link
          to="/report"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Request</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('tickets')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'tickets'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <span>All Operational Tickets</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
            {tickets.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('incidents')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'incidents'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <CopyCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>Master Grouped Incidents</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
            {incidents.length}
          </span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ticket #, keyword, location, or equipment..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 focus:outline-none focus:border-brand-500"
          >
            <option value="">All Categories</option>
            <option value="NETWORK">Network</option>
            <option value="IT">IT</option>
            <option value="ELECTRICAL">Electrical</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="WATER">Water</option>
            <option value="CLEANING">Cleaning</option>
            <option value="LAB">Lab</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 focus:outline-none focus:border-brand-500"
          >
            <option value="">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 focus:outline-none focus:border-brand-500"
          >
            <option value="">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="ESCALATED">Escalated</option>
          </select>
        </div>
      </div>

      {/* Main Content: Tickets or Master Incidents */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400">Loading incidents...</div>
      ) : activeTab === 'tickets' ? (
        <div className="glass-panel rounded-3xl p-5 border border-slate-800 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                <th className="pb-3 px-3">Ticket</th>
                <th className="pb-3 px-3">Title & Problem</th>
                <th className="pb-3 px-3">Category</th>
                <th className="pb-3 px-3">Priority</th>
                <th className="pb-3 px-3">Location</th>
                <th className="pb-3 px-3">Assignee</th>
                <th className="pb-3 px-3">SLA Remaining</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {tickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-slate-300">{t.ticketNumber}</td>
                  <td className="py-3 px-3 max-w-xs">
                    <p className="font-semibold text-white truncate">{t.title}</p>
                    {t.incidentId && (
                      <span className="inline-block text-[10px] text-amber-400 font-bold mt-0.5">
                        ⚡ Master Grouped
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-slate-300">{t.category}</td>
                  <td className="py-3 px-3"><PriorityBadge priority={t.priority} size="xs" /></td>
                  <td className="py-3 px-3 text-slate-400 truncate max-w-[140px]">{t.location}</td>
                  <td className="py-3 px-3 text-slate-300">{t.assignee?.name || 'Unassigned'}</td>
                  <td className="py-3 px-3">
                    <SlaCountdown createdAt={t.createdAt} dueAt={t.dueAt} status={t.status} />
                  </td>
                  <td className="py-3 px-3"><StatusBadge status={t.status} size="xs" /></td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      to={`/tickets/${t.id}`}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-800 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 transition-colors"
                    >
                      Details →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Master Grouped Incidents List */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {incidents.map((inc) => (
            <div key={inc.id} className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-amber-400">{inc.incidentNumber}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      MASTER INCIDENT
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight">{inc.title}</h3>
                </div>
                <PriorityBadge priority={inc.priority} size="xs" />
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{inc.description}</p>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800/80">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Affected Location</span>
                  <span className="font-medium text-white truncate block">{inc.location}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Affected Users</span>
                  <span className="font-bold text-emerald-400 block">{inc.affectedUsers || 1}+ impacted</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <StatusBadge status={inc.status} size="xs" />
                <span className="text-xs font-semibold text-amber-400">
                  {inc.tickets?.length || 3} Merged Reports Consolidated
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
