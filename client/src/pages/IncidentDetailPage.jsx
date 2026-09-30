import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ticketApi } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import PriorityBadge from '../components/PriorityBadge.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import SlaCountdown from '../components/SlaCountdown.jsx';
import {
  ArrowLeft,
  Bot,
  Building,
  User,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  History,
  Send,
  ShieldCheck,
  Flame,
  CopyCheck
} from 'lucide-react';

export default function IncidentDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [history, setHistory] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const loadTicketDetails = async () => {
    try {
      const [tRes, cRes, hRes] = await Promise.all([
        ticketApi.getById(id),
        ticketApi.getComments(id),
        ticketApi.getHistory(id)
      ]);
      setTicket(tRes.data.ticket);
      setComments(cRes.data.comments || []);
      setHistory(hRes.data.history || []);
    } catch (err) {
      console.error('Failed to load ticket details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTicketDetails();
  }, [id]);

  const handleStatusChange = async (status) => {
    setUpdatingStatus(true);
    try {
      await ticketApi.update(id, { status });
      await loadTicketDetails();
    } catch (err) {
      alert('Failed to update status: ' + (err.response?.data?.error || err.message));
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      await ticketApi.addComment(id, { message: newComment });
      setNewComment('');
      await loadTicketDetails();
    } catch (err) {
      alert('Failed to post message: ' + (err.response?.data?.error || err.message));
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading incident details...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="p-8 text-center space-y-4">
        <h3 className="text-lg font-bold text-white">Incident Not Found</h3>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-white"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Back button & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-emerald-400">{ticket.ticketNumber}</span>
              <StatusBadge status={ticket.status} size="xs" />
              <PriorityBadge priority={ticket.priority} size="xs" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-1">
              {ticket.title}
            </h1>
          </div>
        </div>

        {/* Action Controls for Staff / Admin */}
        <div className="flex items-center gap-2">
          {ticket.status !== 'IN_PROGRESS' && ticket.status !== 'RESOLVED' && (
            <button
              onClick={() => handleStatusChange('IN_PROGRESS')}
              disabled={updatingStatus}
              className="px-3.5 py-1.5 rounded-xl font-bold text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-500/30 transition-colors"
            >
              Start Diagnostic
            </button>
          )}

          {ticket.status !== 'RESOLVED' && (
            <button
              onClick={() => handleStatusChange('RESOLVED')}
              disabled={updatingStatus}
              className="px-3.5 py-1.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors"
            >
              Mark Resolved ✓
            </button>
          )}
        </div>
      </div>

      {/* Duplicate Incident Alert Banner */}
      {ticket.incidentId && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
          <CopyCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Consolidated in Master Incident
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              This request was automatically merged with other concurrent reports at {ticket.location} to prevent redundant maintenance dispatch.
            </p>
          </div>
        </div>
      )}

      {/* SLA Countdown Header Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Automated SLA Deadline
            </span>
            <p className="text-sm font-bold text-white mt-0.5">
              Target Resolution: {ticket.dueAt ? new Date(ticket.dueAt).toLocaleString() : '24 Hours'}
            </p>
          </div>
        </div>

        <SlaCountdown createdAt={ticket.createdAt} dueAt={ticket.dueAt} status={ticket.status} />
      </div>

      {/* Main Grid: Details + AI Blueprint */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Problem Narrative & Metadata */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Problem Description
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed font-sans bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
              {ticket.description}
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs pt-2">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Location</span>
                <span className="font-semibold text-white mt-0.5 block">{ticket.location}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Department</span>
                <span className="font-semibold text-white mt-0.5 block">{ticket.department?.name || 'IT Support'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Reported By</span>
                <span className="font-semibold text-slate-300 mt-0.5 block">{ticket.requester?.name || 'Student'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Assigned Technician</span>
                <span className="font-semibold text-emerald-400 mt-0.5 block">{ticket.assignee?.name || 'Unassigned'}</span>
              </div>
            </div>
          </div>

          {/* Activity / Comments Thread */}
          <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white tracking-tight">Work Notes & Discussion ({comments.length})</h3>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {comments.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No comments or work notes logged yet.</p>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{c.user?.name || 'User'}</span>
                      <span className="text-[10px] text-slate-500">{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{c.message}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAddComment} className="pt-2 flex items-center gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add technical work note or student comment..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
              />
              <button
                type="submit"
                disabled={submittingComment || !newComment.trim()}
                className="p-2.5 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: AI Analysis Blueprint & Audit Timeline */}
        <div className="lg:col-span-5 space-y-6">
          {/* AI Blueprint Card */}
          <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-800 space-y-3.5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">AI Operations Blueprint</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                Confidence: 96%
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Assessed Impact</span>
                <p className="text-slate-300 mt-0.5 leading-snug">{ticket.impact || 'Standard campus operational impact'}</p>
              </div>

              {ticket.aiAnalysis && (
                <>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Priority Justification</span>
                    <p className="text-slate-300 mt-0.5 leading-snug">{ticket.aiAnalysis.reason}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                    <span className="text-[10px] uppercase font-bold block mb-0.5">Recommended Action</span>
                    <p className="leading-snug">{ticket.aiAnalysis.suggestedAction}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Audit History Timeline */}
          <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <History className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Automated Audit Trail</h3>
            </div>

            <div className="space-y-3 text-xs max-h-64 overflow-y-auto">
              {history.length === 0 ? (
                <p className="text-slate-500 text-center py-2">No historical events recorded.</p>
              ) : (
                history.map((h, i) => (
                  <div key={h.id || i} className="flex items-start gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-200 block text-[11px]">{h.action}</span>
                      <p className="text-slate-400 text-[10px]">{h.newValue}</p>
                      <span className="text-[9px] text-slate-600 block mt-0.5">
                        {new Date(h.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
