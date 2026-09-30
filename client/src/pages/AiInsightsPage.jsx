import React, { useState, useEffect } from 'react';
import { aiApi } from '../services/api.js';
import PriorityBadge from '../components/PriorityBadge.jsx';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Bot,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  TrendingUp,
  ShieldAlert,
  Flame,
  Wrench,
  Download,
  X
} from 'lucide-react';

export default function AiInsightsPage() {
  const [insights, setInsights] = useState([]);
  const [recurringIssues, setRecurringIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  // Executive Report Modal
  const [reportModal, setReportModal] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [aiReport, setAiReport] = useState(null);

  const loadInsights = async () => {
    try {
      const res = await aiApi.getInsights();
      setInsights(res.data.insights || []);
      setRecurringIssues(res.data.recurringAnalysis?.recurringIssues || []);
    } catch (err) {
      console.error('Failed to load AI insights:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInsights();
  }, []);

  const handleGenerateReport = async () => {
    setGeneratingReport(true);
    setReportModal(true);
    try {
      const res = await aiApi.generateReport();
      setAiReport(res.data.report);
      try {
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      } catch (e) {}
    } catch (err) {
      alert('Failed to generate AI report: ' + (err.response?.data?.error || err.message));
    } finally {
      setGeneratingReport(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Predictive Operations Intelligence
            </span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
              Google Gemini
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            AI Recurring Patterns & Preventive Insights
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Autonomous detection of repeated campus failures, root cause analysis, and proactive maintenance advisories.
          </p>
        </div>

        <button
          onClick={handleGenerateReport}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-[0_0_25px_rgba(34,197,94,0.35)] transition-all active:scale-95"
        >
          <FileSpreadsheet className="w-4 h-4 fill-current" />
          <span>Generate Executive AI Report</span>
        </button>
      </div>

      {/* Featured WOW Insight: Lab 3 Network Instability */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-amber-500/40 relative overflow-hidden bg-gradient-to-br from-amber-950/20 via-slate-900/60 to-slate-950">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40">
                CRITICAL RECURRING CLUSTER
              </span>
              <span className="text-xs text-amber-400 font-mono font-bold">
                Frequency: 7 Incidents in 30 Days
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Lab 3 Core Network & Wi-Fi Gateway Breakdown
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Historical analysis shows Lab 3 internet failures have recurred 7 times across the past month,
              with 4 outages coinciding with practical exams. This is not isolated user error; telemetry points to edge switch packet buffer exhaustion.
            </p>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5 mt-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <Wrench className="w-4 h-4" />
                <span>AI Preventive Engineering Advisory</span>
              </div>
              <p className="text-xs text-slate-200">
                Schedule preventive replacement of aging 100Mbps edge switch in Rack 2 with a managed Layer-3 Gigabit unit. Re-terminate RJ45 uplink drops to eliminate packet drops before tomorrow's exams.
              </p>
            </div>
          </div>

          <div className="w-full lg:w-72 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs space-y-3 shrink-0">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
              Cluster Frequency Trend
            </h4>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Week 1</span>
                <span className="font-mono text-emerald-400 font-bold">2 Incidents</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Week 2</span>
                <span className="font-mono text-amber-400 font-bold">3 Incidents</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Week 3</span>
                <span className="font-mono text-amber-400 font-bold">2 Incidents</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400 font-bold text-white">Week 4 (Current)</span>
                <span className="font-mono text-rose-400 font-bold">4 Incidents (Surge)</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 text-center">
              Trend Status: <strong className="text-rose-400">INCREASING</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Recurring Problem Clusters */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white tracking-tight">
            Detected Recurring Problem Clusters ({recurringIssues.length})
          </h3>
          <span className="text-xs text-slate-400">Autonomous pattern aggregation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recurringIssues.map((issue, idx) => (
            <div key={idx} className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {issue.frequency} REPEATED INCIDENTS
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{issue.category}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{issue.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{issue.location}</p>
                </div>
                <PriorityBadge priority={issue.severity || 'HIGH'} size="xs" />
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{issue.explanation}</p>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-0.5">
                  Proactive Preventive Fix
                </span>
                <p className="text-emerald-200">{issue.preventiveAction}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Executive AI Report Modal */}
      {reportModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 z-50 animate-in fade-in duration-200">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/40 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono font-bold text-emerald-400 tracking-wider">
                    Official Executive Intelligence
                  </span>
                  <h2 className="text-lg font-extrabold text-white tracking-tight">
                    Smart Campus Operations Efficiency Report
                  </h2>
                </div>
              </div>

              <button
                onClick={() => setReportModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {generatingReport ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-10 h-10 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-semibold text-slate-300">
                  Google Gemini synthesizing database telemetry & SLA performance...
                </p>
              </div>
            ) : aiReport ? (
              <div className="space-y-6 text-xs animate-in fade-in duration-150">
                {/* Executive Summary */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Executive Summary
                  </span>
                  <p className="text-slate-200 leading-relaxed text-sm font-sans">
                    {aiReport.executiveSummary}
                  </p>
                </div>

                {/* Key Highlights */}
                {aiReport.keyHighlights && (
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                      Key Highlights & Accomplishments
                    </h4>
                    <ul className="space-y-2">
                      {aiReport.keyHighlights.map((hl, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Automation Impact */}
                {aiReport.automationImpact && (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block mb-1">
                      Automated Triaging Impact
                    </span>
                    <p className="text-slate-200 leading-relaxed">
                      {aiReport.automationImpact}
                    </p>
                  </div>
                )}

                {/* Preventive Roadmap */}
                {aiReport.preventiveRoadmap && (
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                      Recommended Preventive Operations Roadmap
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {aiReport.preventiveRoadmap.map((step, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                          <span className="text-[10px] font-mono text-emerald-400 font-bold block mb-1">
                            Action {idx + 1}
                          </span>
                          <p className="text-slate-300 text-[11px] leading-tight">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Grounding: Synthesized from live PostgreSQL ticket telemetry.</span>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Print / Export PDF</span>
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
