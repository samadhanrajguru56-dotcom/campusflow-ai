import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  ArrowRight,
  Sparkles,
  Bot,
  CopyCheck,
  Timer,
  AlertTriangle,
  FileSpreadsheet,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  Activity,
  Play,
  Layers,
  ChevronRight,
  Cpu,
  RefreshCw,
  BellRing
} from 'lucide-react';
import AutomationPipelineVisualizer from '../components/AutomationPipelineVisualizer.jsx';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState('after');

  const workflowSteps = [
    { name: 'REPORT', desc: 'Voice or text incident input' },
    { name: 'UNDERSTAND', desc: 'NLP semantic extraction' },
    { name: 'PRIORITIZE', desc: 'Impact & urgency scoring' },
    { name: 'ASSIGN', desc: 'Skill & workload dispatch' },
    { name: 'AUTOMATE', desc: 'Rule execution engine' },
    { name: 'TRACK', desc: 'SLA countdown monitoring' },
    { name: 'ESCALATE', desc: 'Auto alert at 80% & breach' },
    { name: 'RESOLVE', desc: 'On-site verified sign-off' },
    { name: 'PREDICT', desc: 'Preventive recurring insights' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold mb-6 shadow-[0_0_20px_rgba(34,197,94,0.15)] animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>Hackathon Smart Automation Theme • Powered by Google Gemini</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
          From Campus Problems to{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Automated Solutions.
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
          CampusFlow AI understands operational problems, automates task coordination, tracks deadlines,
          and identifies recurring issues before they become bigger disruptions.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/demo"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_25px_rgba(34,197,94,0.4)] transition-all duration-200 active:scale-95 group"
          >
            <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
            <span>Launch Live Hackathon Demo</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/report"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700/80 hover:border-emerald-500/50 shadow-lg transition-all duration-200"
          >
            <span>🎙 Report Problem (Voice / Text)</span>
          </Link>
        </div>

        {/* Dynamic Workflow Bar */}
        <div className="mt-16 pt-8 border-t border-slate-800/80">
          <p className="text-xs uppercase font-extrabold tracking-widest text-slate-400 mb-6">
            End-to-End Autonomous Workflow Engine
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs">
            {workflowSteps.map((step, idx) => (
              <React.Fragment key={step.name}>
                <div className="px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 flex flex-col items-center hover:border-emerald-500/50 transition-colors">
                  <span className="font-extrabold text-emerald-400 tracking-wider text-[11px]">
                    {step.name}
                  </span>
                  <span className="text-[10px] text-slate-400">{step.desc}</span>
                </div>
                {idx < workflowSteps.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 hidden md:block shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Pipeline Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Architecture Blueprint
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
                Automated Operations Orchestration Pipeline
              </h2>
            </div>
            <Link
              to="/automation"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5"
            >
              <span>Explore Automation Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <AutomationPipelineVisualizer currentStep={7} />
        </div>
      </section>

      {/* Before vs After Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Measurable Operational Impact
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
            The Automation Shift: Before vs After
          </h2>
          <p className="text-slate-400 text-sm mt-3">
            See how CampusFlow AI eliminates human coordination delays, duplicate dispatches, and missed deadlines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* BEFORE CARD */}
          <div className="glass-card rounded-2xl p-6 border-l-4 border-l-rose-500 bg-rose-950/10">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2.5 py-1 rounded-md text-xs font-black uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40">
                Legacy Manual Process
              </span>
            </div>
            <ul className="space-y-3 text-sm text-slate-300">
              {[
                'Reported via fragmented WhatsApp messages, sticky notes & phone calls',
                'Manual data entry with frequent human typos and incorrect department routing',
                'Duplicate complaints independently handled, sending 3 technicians to 1 room',
                'No SLA accountability; complaints slip through email cracks for weeks',
                'Manual phone follow-ups required by students and faculty',
                'Zero recurring pattern awareness — fixing the same router 7 times without diagnosis'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold shrink-0 mt-0.5">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* AFTER CARD */}
          <div className="glass-card rounded-2xl p-6 border-l-4 border-l-emerald-500 bg-emerald-950/15">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2.5 py-1 rounded-md text-xs font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                CampusFlow Smart Automation
              </span>
            </div>
            <ul className="space-y-3 text-sm text-slate-200">
              {[
                'Instant Voice & NLP Understanding converts informal text into structured JSON',
                'Automated classification and smart department assignment in under 2 seconds',
                'Intelligent Duplicate Detection merges concurrent student reports into Master Incidents',
                'Dynamic SLA matrix enforces hard deadlines with proactive 80% reminder triggers',
                'Autonomous escalation loop alerts Campus Operations Admin on breaches',
                'AI detects recurring equipment failure clusters and prescribes preventive maintenance'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Core AI Capabilities Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Powered by Google Gemini
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
            10 Intelligent Automation Pillars
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Request Understanding',
              desc: 'Extracts title, urgency, root cause, location and academic impact from raw text or speech.',
              icon: Bot
            },
            {
              title: 'Intelligent Classification',
              desc: 'Categorizes into 13 campus domains (IT, Electrical, Water, HVAC, Hostel, Lab, etc.).',
              icon: Layers
            },
            {
              title: 'Duplicate Incident Detection',
              desc: 'Clusters concurrent reports into a single Master Incident, preventing wasted technician dispatches.',
              icon: CopyCheck
            },
            {
              title: 'Dynamic SLA Engine',
              desc: 'Sets automated resolution countdowns: Critical (2h), High (6h), Medium (24h), Low (72h).',
              icon: Timer
            },
            {
              title: 'Autonomous Escalation',
              desc: 'Dispatches 80% threshold warnings to technicians and escalates breaches to management.',
              icon: AlertTriangle
            },
            {
              title: 'Smart Assignment',
              desc: 'Matches task requirements against staff specialization, current ticket queue and availability.',
              icon: Cpu
            },
            {
              title: 'Recurring Issue Detection',
              desc: 'Identifies failure hotspots (e.g. Lab 3 switch down 7 times) and prescribes root-cause fixes.',
              icon: RefreshCw
            },
            {
              title: 'Executive AI Report',
              desc: 'Synthesizes entire database telemetry into actionable management efficiency briefings in 1-click.',
              icon: FileSpreadsheet
            },
            {
              title: 'Voice-First Input',
              desc: 'Speak naturally from any mobile browser: speech-to-text with instantaneous AI orchestration.',
              icon: BellRing
            }
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={i} className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-emerald-500/40">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="mt-auto border-t border-slate-800/80 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        <h3 className="text-2xl font-bold text-white mb-3">Ready to experience Smart Campus Automation?</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
          Built for the Hackathon Smart Automation Challenge. Fully functional with real database and Gemini AI.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/demo"
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors"
          >
            Run Live Demo Scenario
          </Link>
          <Link
            to="/login"
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            Sign In with Demo Role
          </Link>
        </div>
        <p className="text-[11px] text-slate-600 mt-8">
          CampusFlow AI © 2025 • Designed for Hackathon Smart Automation
        </p>
      </footer>
    </div>
  );
}
