import React, { useState, useEffect } from 'react';
import { automationApi } from '../services/api.js';
import AutomationPipelineVisualizer from '../components/AutomationPipelineVisualizer.jsx';
import confetti from 'canvas-confetti';
import {
  Zap,
  Play,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sliders,
  FileText,
  Activity,
  ShieldCheck,
  RefreshCw,
  Plus
} from 'lucide-react';

export default function AutomationCenterPage() {
  const [rules, setRules] = useState([]);
  const [slaRules, setSlaRules] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [runningCycle, setRunningCycle] = useState(false);
  const [cycleResult, setCycleResult] = useState(null);

  const loadAutomationData = async () => {
    try {
      const [rRes, lRes] = await Promise.all([
        automationApi.getRules(),
        automationApi.getLogs({ limit: 25 })
      ]);
      setRules(rRes.data.rules || []);
      setSlaRules(rRes.data.slaRules || []);
      setLogs(lRes.data.logs || []);
    } catch (err) {
      console.error('Failed to load automation rules:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAutomationData();
  }, []);

  const handleRunCycle = async () => {
    setRunningCycle(true);
    setCycleResult(null);
    try {
      const res = await automationApi.runCycle();
      setCycleResult(res.data);
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      } catch (e) {}
      await loadAutomationData();
    } catch (err) {
      alert('Cycle run failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setRunningCycle(false);
    }
  };

  const handleToggleRule = async (rule) => {
    try {
      await automationApi.updateRule(rule.id, { enabled: !rule.enabled });
      await loadAutomationData();
    } catch (err) {
      alert('Failed to toggle rule: ' + err.message);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Autonomous Operations Brain
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            Smart Automation Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Event-driven rules, automated dispatch matrices, and proactive SLA escalation safeguards.
          </p>
        </div>

        <button
          onClick={handleRunCycle}
          disabled={runningCycle}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${runningCycle ? 'animate-spin' : ''}`} />
          <span>{runningCycle ? 'Running Automation Cycle...' : 'Run Automation Engine Now'}</span>
        </button>
      </div>

      {/* Cycle Result Alert */}
      {cycleResult && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>
              Automation cycle completed: Evaluated {cycleResult.results.checked} active tickets. 
              Sent {cycleResult.results.remindersSent} SLA reminders, escalated {cycleResult.results.escalatedCount} breaches.
            </span>
          </div>
          <span className="font-mono text-[10px] text-slate-400">
            {new Date(cycleResult.timestamp).toLocaleTimeString()}
          </span>
        </div>
      )}

      {/* Visual Pipeline Showcase */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight uppercase">
              Live Autonomous Pipeline Execution
            </h3>
            <p className="text-[11px] text-slate-400">
              Interactive 11-stage automated decision & workflow chain
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold text-[11px]">System Online (60s tick)</span>
          </div>
        </div>
        <AutomationPipelineVisualizer currentStep={8} logs={logs} />
      </div>

      {/* Two Column Layout: Active Workflow Rules & SLA Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Workflow Rules */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-5 sm:p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Active Automation Rules</h3>
              <p className="text-[11px] text-slate-400">Trigger → Condition → Autonomous Action</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10">
              {rules.length} Rules Active
            </span>
          </div>

          <div className="space-y-3">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5 transition-all hover:border-slate-700"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs">{rule.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {rule.trigger}
                    </span>
                  </div>
                  <button
                    onClick={() => handleToggleRule(rule)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-colors ${
                      rule.enabled
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-800 text-slate-500 border-slate-700'
                    }`}
                  >
                    {rule.enabled ? 'ACTIVE' : 'DISABLED'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Condition</span>
                    <code className="text-[11px] text-amber-300 font-mono mt-0.5 block">{rule.condition}</code>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Automated Action</span>
                    <span className="text-[11px] text-slate-300 mt-0.5 block truncate">{rule.action}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: SLA Rules Matrix */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-5 sm:p-6 border border-slate-800 space-y-4">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white tracking-tight">SLA Policy Rules</h3>
            <p className="text-[11px] text-slate-400">Enforced deadline countdowns</p>
          </div>

          <div className="space-y-3">
            {[
              { priority: 'CRITICAL', hours: 2, desc: 'Lab exam blockers, safety risks', color: 'text-red-400 bg-red-500/10 border-red-500/30' },
              { priority: 'HIGH', hours: 6, desc: 'Classroom projectors, active lab Wi-Fi', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
              { priority: 'MEDIUM', hours: 24, desc: 'Hostel fixtures, cafeteria items', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
              { priority: 'LOW', hours: 72, desc: 'Unused storage rooms, aesthetics', color: 'text-slate-400 bg-slate-500/10 border-slate-500/30' }
            ].map((sla) => (
              <div key={sla.priority} className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sla.color}`}>
                      {sla.priority}
                    </span>
                    <span className="text-xs font-bold text-white">{sla.hours} Hours Max</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">{sla.desc}</p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-emerald-400 inline mr-1" />
            Background daemon inspects active timers on 60-second intervals. Automated reminders fire at 80% SLA; breaches escalate automatically.
          </div>
        </div>
      </div>

      {/* Live Automation Logs Table */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight uppercase">
              Automation Execution Audit Logs
            </h3>
            <p className="text-[11px] text-slate-400">Immutable trace of every machine-driven decision</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">Showing recent 25 events</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                <th className="pb-3 px-3">Timestamp</th>
                <th className="pb-3 px-3">Automated Action</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3">Execution Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                    {new Date(log.executedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-emerald-300 text-[11px] whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {log.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 max-w-lg leading-snug">
                    {log.message}
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
