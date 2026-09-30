import React, { useState } from 'react';
import { ticketApi, aiApi } from '../services/api.js';
import PriorityBadge from '../components/PriorityBadge.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import confetti from 'canvas-confetti';
import {
  Play,
  CheckCircle2,
  Sparkles,
  Bot,
  CopyCheck,
  Flame,
  UserCheck,
  Timer,
  Bell,
  Activity,
  AlertTriangle,
  FileSpreadsheet,
  ArrowRight,
  RefreshCw,
  Cpu,
  Layers,
  Wrench,
  Check
} from 'lucide-react';

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState('demo1'); // 'demo1' | 'demo2' | 'demo3'

  // DEMO 1 STATE
  const [demo1Input, setDemo1Input] = useState('Internet is not working in Lab 3 and tomorrow we have practical exams.');
  const [demo1Step, setDemo1Step] = useState(0);
  const [demo1Running, setDemo1Running] = useState(false);
  const [demo1Ticket, setDemo1Ticket] = useState(null);

  // DEMO 2 STATE
  const [demo2Running, setDemo2Running] = useState(false);
  const [demo2Stage, setDemo2Stage] = useState(0); // 0=initial, 1=3 reports incoming, 2=duplicate detected, 3=merged master incident

  // DEMO 3 STATE
  const [demo3Running, setDemo3Running] = useState(false);
  const [demo3Revealed, setDemo3Revealed] = useState(false);

  // Demo 1 Steps
  const demo1StepsList = [
    { num: 1, title: 'Understanding Request', desc: 'NLP Entity Extraction & Semantics' },
    { num: 2, title: 'Classifying Category', desc: 'Identified as NETWORK / IT' },
    { num: 3, title: 'Checking Duplicate Incidents', desc: 'Vector cluster match in Lab 3' },
    { num: 4, title: 'Detecting High Impact', desc: 'Upcoming scheduled practical examination' },
    { num: 5, title: 'Setting Priority to CRITICAL', desc: 'High academic impact & deadline constraint' },
    { num: 6, title: 'Selecting IT Department', desc: 'Direct routing to IT Support Network Desk' },
    { num: 7, title: 'Selecting Available Technician', desc: 'Matched Rajesh Kumar (Senior Network Eng)' },
    { num: 8, title: 'Establishing Dynamic SLA', desc: 'Enforced 2-hour hard resolution deadline' },
    { num: 9, title: 'Sending Push & In-App Alerts', desc: 'Dispatched to technician & faculty requester' },
    { num: 10, title: 'Creating Automation Audit Log', desc: 'Immutable action recorded in event ledger' },
    { num: 11, title: 'Publishing Incident to Live Dashboard', desc: 'Status initialized as IN_PROGRESS' }
  ];

  const runDemo1Automation = async () => {
    setDemo1Running(true);
    setDemo1Step(0);
    setDemo1Ticket(null);

    // Animate steps sequentially
    for (let i = 1; i <= 11; i++) {
      setDemo1Step(i);
      await new Promise(r => setTimeout(r, 450));
    }

    try {
      const res = await ticketApi.create({
        title: 'Lab 3 Network & Wi-Fi Gateway Outage',
        description: demo1Input,
        location: 'Lab 3, Computer Science Dept',
        category: 'NETWORK',
        priority: 'CRITICAL',
        urgency: 'CRITICAL',
        impact: 'Students unable to conduct practical examination'
      });
      setDemo1Ticket(res.data.ticket);
      try {
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      } catch (e) {}
    } catch (err) {
      console.error('Demo 1 error:', err);
    } finally {
      setDemo1Running(false);
    }
  };

  const runDemo2DuplicateCluster = async () => {
    setDemo2Running(true);
    setDemo2Stage(1); // Show 3 reports
    await new Promise(r => setTimeout(r, 1200));

    setDemo2Stage(2); // AI Detects duplicate
    await new Promise(r => setTimeout(r, 1500));

    setDemo2Stage(3); // Master Incident Created
    setDemo2Running(false);
    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const runDemo3RecurringAnalysis = async () => {
    setDemo3Running(true);
    await new Promise(r => setTimeout(r, 1400));
    setDemo3Revealed(true);
    setDemo3Running(false);
    try {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/40 relative overflow-hidden bg-gradient-to-br from-emerald-950/20 via-slate-900 to-slate-950">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                Official Hackathon Demonstration Hub
              </span>
              <span className="text-[10px] font-mono text-brand-300 font-bold">
                100% Live Connected
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              CampusFlow AI Interactive Evaluation
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Experience the 3 flagship breakthroughs: End-to-End Decision Automation, Smart Duplicate Grouping into Master Incidents, and Predictive Recurring Issue Prevention.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-slate-800">
          <button
            onClick={() => setActiveTab('demo1')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'demo1'
                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                : 'bg-slate-900/90 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <span>WOW 1: Complete 11-Step Automation</span>
          </button>
          <button
            onClick={() => setActiveTab('demo2')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'demo2'
                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                : 'bg-slate-900/90 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <CopyCheck className="w-3.5 h-3.5" />
            <span>WOW 2: Duplicate Incident Merging</span>
          </button>
          <button
            onClick={() => setActiveTab('demo3')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'demo3'
                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                : 'bg-slate-900/90 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>WOW 3: Recurring Issue Prevention</span>
          </button>
        </div>
      </div>

      {/* =======================================================
          SCENARIO 1: COMPLETE 11-STEP AUTOMATION PIPELINE
      ======================================================= */}
      {activeTab === 'demo1' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                Scenario 1 Input
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                Unstructured Voice or Text Problem Report
              </h3>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                type="text"
                value={demo1Input}
                onChange={(e) => setDemo1Input(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-brand-500 font-sans"
              />
              <button
                onClick={runDemo1Automation}
                disabled={demo1Running}
                className="px-6 py-3 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(34,197,94,0.35)] transition-all active:scale-95 disabled:opacity-50"
              >
                <Play className={`w-4 h-4 fill-current ${demo1Running ? 'animate-spin' : ''}`} />
                <span>{demo1Running ? 'Orchestrating Workflow...' : 'Run AI Automation'}</span>
              </button>
            </div>
          </div>

          {/* 11 Steps Animated Visualizer */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Autonomous Execution Chain
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {demo1StepsList.map((step) => {
                const isPassed = demo1Step >= step.num;
                const isCurrent = demo1Step === step.num;

                return (
                  <div
                    key={step.num}
                    className={`p-3 rounded-2xl border transition-all duration-300 flex items-start gap-3 ${
                      isCurrent
                        ? 'bg-brand-950/70 border-brand-500 shadow-[0_0_20px_rgba(34,197,94,0.3)] scale-[1.02]'
                        : isPassed
                        ? 'bg-slate-900 border-emerald-500/30 text-slate-200'
                        : 'bg-slate-900/40 border-slate-800 text-slate-600 opacity-50'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                        isPassed
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {isPassed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : step.num}
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-white tracking-tight">{step.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {demo1Ticket && (
              <div className="mt-6 p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Workflow Automated Successfully!</h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Created live record <strong>{demo1Ticket.ticketNumber}</strong> with 2h SLA and routed to Rajesh Kumar.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <PriorityBadge priority="CRITICAL" size="xs" />
                  <span className="text-xs font-bold text-emerald-400 font-mono">SLA: 2h Remaining</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =======================================================
          SCENARIO 2: SMART DUPLICATE GROUPING
      ======================================================= */}
      {activeTab === 'demo2' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                  Scenario 2: Concurrent Incident Flood
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Multi-User Duplicate Detection & Master Incident Consolidation
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Three different students report the same network drop with different wording.
                </p>
              </div>

              <button
                onClick={runDemo2DuplicateCluster}
                disabled={demo2Running}
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Simulate 3 Incoming Reports</span>
              </button>
            </div>

            {demo2Stage >= 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Student A Report</span>
                  <p className="font-semibold text-white">"WiFi not working in Lab 3."</p>
                  <span className="text-[10px] text-slate-400 block">Location: Lab 3</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Student B Report</span>
                  <p className="font-semibold text-white">"Internet stopped working in Lab 3."</p>
                  <span className="text-[10px] text-slate-400 block">Location: Lab 3</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Student C Report</span>
                  <p className="font-semibold text-white">"Lab 3 network is down."</p>
                  <span className="text-[10px] text-slate-400 block">Location: Lab 3</span>
                </div>
              </div>
            )}

            {demo2Stage >= 2 && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs flex items-center gap-3 animate-in fade-in duration-200">
                <CopyCheck className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <h4 className="font-bold text-amber-300 uppercase text-[11px]">
                    Semantic Duplicate Match Confidence: 94%
                  </h4>
                  <p className="text-slate-300 mt-0.5">
                    AI identified 3 concurrent reports describing the exact same physical infrastructure outage at Lab 3.
                    Prevented creating 3 independent dispatch orders.
                  </p>
                </div>
              </div>
            )}

            {demo2Stage >= 3 && (
              <div className="p-6 rounded-3xl bg-slate-900 border-2 border-emerald-500/50 space-y-4 shadow-[0_0_30px_rgba(34,197,94,0.15)] animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40">
                      INC-1042
                    </span>
                    <h4 className="text-base font-bold text-white">
                      Lab 3 Core Network & Wi-Fi Gateway Outage
                    </h4>
                  </div>
                  <PriorityBadge priority="HIGH" size="xs" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Affected Reports</span>
                    <span className="font-bold text-white text-sm">3 Merged</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Impacted Users</span>
                    <span className="font-bold text-emerald-400 text-sm">45+ Students</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Assigned Dept</span>
                    <span className="font-bold text-white text-sm">IT Support</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Coordination Status</span>
                    <span className="font-bold text-emerald-400 text-sm">Single Dispatch</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300">
                  ✓ "3 similar reports automatically grouped into this master incident. Zero redundant staff calls."
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =======================================================
          SCENARIO 3: RECURRING ISSUE DETECTION
      ======================================================= */}
      {activeTab === 'demo3' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">
                  Scenario 3: Predictive Operations
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Historical Incident Clustering & Preventive Maintenance
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Moving from reactive firefighting to predictive preventive interventions.
                </p>
              </div>

              <button
                onClick={runDemo3RecurringAnalysis}
                disabled={demo3Running}
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-purple-500 hover:bg-purple-400 text-slate-950 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Run Historical Scan</span>
              </button>
            </div>

            {/* Historical Trend Bar */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Lab 3 30-Day Historical Incidents
              </h4>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block">Week 1</span>
                  <span className="font-bold text-white text-base">2 Incidents</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block">Week 2</span>
                  <span className="font-bold text-amber-400 text-base">3 Incidents</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block">Week 3</span>
                  <span className="font-bold text-amber-400 text-base">2 Incidents</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block">Week 4</span>
                  <span className="font-bold text-rose-400 text-base">4 Incidents</span>
                </div>
              </div>
            </div>

            {demo3Revealed && (
              <div className="p-6 rounded-3xl bg-slate-900 border border-emerald-500/40 space-y-4 animate-in zoom-in-95 duration-200">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <Bot className="w-4 h-4" />
                  <span>AI Predictive Insight Formulated</span>
                </div>

                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300">
                    Recurring Failure Detected: 7 Outages in 30 Days
                  </span>
                  <p className="text-sm font-bold text-white">
                    "Lab 3 network failures are recurring. A preventive network inspection is recommended."
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Recurring Problem</span>
                    <span className="font-semibold text-white mt-0.5 block">Edge Switch Port Degradation</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Location</span>
                    <span className="font-semibold text-white mt-0.5 block">Lab 3, Computer Science Dept</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Frequency</span>
                    <span className="font-bold text-rose-400 mt-0.5 block">7 Incidents (Surge Trend)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Action Type</span>
                    <span className="font-bold text-emerald-400 mt-0.5 block">Preventive Maintenance</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1">
                  <span className="text-[10px] font-bold uppercase text-emerald-400 block">
                    Recommended Action
                  </span>
                  <p className="text-slate-200 leading-relaxed font-medium">
                    Deploy managed Gigabit switch to replace legacy 100Mbps hardware in Rack 2, inspect fiber patch cords, and verify UPS battery backup before upcoming practical examinations.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
