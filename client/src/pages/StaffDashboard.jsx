import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ticketApi } from '../services/api.js';
import PriorityBadge from '../components/PriorityBadge.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import SlaCountdown from '../components/SlaCountdown.jsx';
import StatCard from '../components/StatCard.jsx';
import {
  Wrench,
  CheckCircle2,
  Clock,
  AlertTriangle,
  PlayCircle,
  FileText,
  Send,
  X
} from 'lucide-react';

export default function StaffDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Status Update Modal
  const [selectedTask, setSelectedTask] = useState(null);
  const [newStatus, setNewStatus] = useState('IN_PROGRESS');
  const [workNote, setWorkNote] = useState('');
  const [updating, setUpdating] = useState(false);

  const loadTasks = async () => {
    try {
      const res = await ticketApi.getAll({ assigneeId: user?.id });
      setTasks(res.data.tickets || []);
    } catch (err) {
      console.error('Failed to load technician tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) loadTasks();
  }, [user]);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedTask) return;

    setUpdating(true);
    try {
      await ticketApi.update(selectedTask.id, {
        status: newStatus,
        resolutionNote: workNote
      });
      setSelectedTask(null);
      setWorkNote('');
      await loadTasks();
    } catch (err) {
      alert('Failed to update task: ' + (err.response?.data?.error || err.message));
    } finally {
      setUpdating(false);
    }
  };

  const pendingCount = tasks.filter(t => t.status === 'OPEN').length;
  const inProgressCount = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const resolvedCount = tasks.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Staff Welcome Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Technician Dispatch Queue
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Technician: {user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            View assigned maintenance & IT operational tasks, track real-time SLA countdowns, and record diagnostic work notes.
          </p>
        </div>

        <div className="px-4 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
            Status: On-Duty Available
          </span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="In Progress Queue"
          value={inProgressCount}
          subtitle="Currently under technical investigation"
          icon={PlayCircle}
          color="amber"
        />
        <StatCard
          title="New Open Assignments"
          value={pendingCount}
          subtitle="Awaiting technician on-site dispatch"
          icon={Clock}
          color="blue"
        />
        <StatCard
          title="Completed & Resolved"
          value={resolvedCount}
          subtitle="Verified operational resolution"
          icon={CheckCircle2}
          color="brand"
        />
      </div>

      {/* Task Queue Table */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Assigned Field Work Orders ({tasks.length})
            </h3>
            <p className="text-xs text-slate-400">Prioritized by deadline urgency</p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading work orders...</div>
        ) : tasks.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-500">
            No pending tasks assigned to your queue.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                  <th className="pb-3 px-3">Ticket</th>
                  <th className="pb-3 px-3">Title & Location</th>
                  <th className="pb-3 px-3">Priority</th>
                  <th className="pb-3 px-3">SLA Deadline</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Quick Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {tasks.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-300">{t.ticketNumber}</td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-white max-w-xs truncate">{t.title}</p>
                      <span className="text-[10px] text-slate-400">{t.location}</span>
                    </td>
                    <td className="py-3 px-3"><PriorityBadge priority={t.priority} size="xs" /></td>
                    <td className="py-3 px-3">
                      <SlaCountdown createdAt={t.createdAt} dueAt={t.dueAt} status={t.status} />
                    </td>
                    <td className="py-3 px-3"><StatusBadge status={t.status} size="xs" /></td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedTask(t);
                            setNewStatus(t.status === 'OPEN' ? 'IN_PROGRESS' : 'RESOLVED');
                          }}
                          className="px-3 py-1 rounded-lg text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-colors"
                        >
                          Update Status
                        </button>
                        <Link
                          to={`/tickets/${t.id}`}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Technician Status Update Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
                  {selectedTask.ticketNumber}
                </span>
                <h3 className="text-base font-bold text-white tracking-tight mt-0.5">
                  Update Task Status
                </h3>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Change Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="OPEN">Open (Queued)</option>
                  <option value="IN_PROGRESS">In Progress (Diagnosing)</option>
                  <option value="RESOLVED">Resolved (Completed)</option>
                  <option value="CLOSED">Closed (Archived)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Technician Work Note / Resolution Details
                </label>
                <textarea
                  rows={3}
                  value={workNote}
                  onChange={(e) => setWorkNote(e.target.value)}
                  placeholder="e.g. Inspected switch in Rack 2. Replaced faulty RJ45 patch cable. Gateway latency normal at 4ms."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500 leading-relaxed placeholder:text-slate-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedTask(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{updating ? 'Saving...' : 'Confirm Update'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
