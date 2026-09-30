import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketApi, aiApi } from '../services/api.js';
import PriorityBadge from '../components/PriorityBadge.jsx';
import VoiceInputButton from '../components/VoiceInputButton.jsx';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Bot,
  Send,
  CheckCircle2,
  AlertCircle,
  CopyCheck,
  Building,
  UserCheck,
  Timer,
  Info,
  Layers,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function ReportProblemPage() {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);

  const navigate = useNavigate();

  // Quick preset scenarios for hackathon demo
  const presets = [
    {
      label: 'Exam Wi-Fi Outage (Critical)',
      text: 'The internet is not working in Lab 3 and tomorrow we have practical exams.',
      loc: 'Lab 3, Computer Science Dept'
    },
    {
      label: 'Classroom Projector Burnout (High)',
      text: 'Projector is not working in classroom 204 and class starts in 30 minutes.',
      loc: 'Classroom 204, Academic Block B'
    },
    {
      label: 'Water Leakage (High)',
      text: 'Major water pipe burst in library basement archive flooding book stacks.',
      loc: 'Central Library Basement Archive'
    },
    {
      label: 'Unused Storage Window (Low)',
      text: 'South window in unused basement storage room does not lock properly.',
      loc: 'Old Administrative Archive Storage'
    }
  ];

  const handleVoiceTranscript = (transcript) => {
    setDescription(transcript);
    // Automatically trigger AI analysis if location is present or extract
    handleAnalyze(transcript, location);
  };

  const handleAnalyze = async (descText = description, locText = location) => {
    if (!descText || descText.trim().length < 5) {
      setError('Please enter a clear description of the problem first.');
      return;
    }

    setError('');
    setIsAnalyzing(true);
    try {
      const res = await aiApi.analyze({ text: descText, location: locText });
      const analysis = res.data.analysis;
      setAiAnalysis(analysis);
      if (analysis.location && !locText) {
        setLocation(analysis.location);
      }
      if (analysis.category && !category) {
        setCategory(analysis.category);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'AI analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description) {
      setError('Description is required.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        title: aiAnalysis?.title || description.slice(0, 60),
        description,
        location: location || aiAnalysis?.location || 'Campus Main',
        category: category || aiAnalysis?.category || 'MAINTENANCE',
        priority: aiAnalysis?.priority || 'MEDIUM',
        urgency: aiAnalysis?.urgency || 'MEDIUM',
        impact: aiAnalysis?.impact || 'Standard campus request'
      };

      const res = await ticketApi.create(payload);
      setSuccessData(res.data);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit operational ticket.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successData) {
    const { ticket, duplicateMerged, duplicateCheck } = successData;
    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/40 shadow-[0_0_40px_rgba(34,197,94,0.15)] text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">
            Workflow Automated Successfully
          </span>
          <h2 className="text-2xl font-extrabold text-white mt-1">Ticket {ticket.ticketNumber} Logged</h2>
          <p className="text-sm text-slate-300 mt-2 max-w-lg mx-auto">{ticket.title}</p>

          {duplicateMerged && (
            <div className="mt-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-left flex items-start gap-3">
              <CopyCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  ⚡ Smart Duplicate Grouping Triggered
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  AI detected this report matches concurrent incident at <strong>{ticket.location}</strong>. 
                  Consolidated into Master Incident without creating redundant dispatches!
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6 text-left">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <p className="text-[10px] text-slate-500 uppercase font-bold">Category</p>
              <p className="text-xs font-bold text-white mt-1">{ticket.category}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <p className="text-[10px] text-slate-500 uppercase font-bold">Priority</p>
              <div className="mt-1"><PriorityBadge priority={ticket.priority} size="xs" /></div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <p className="text-[10px] text-slate-500 uppercase font-bold">SLA Deadline</p>
              <p className="text-xs font-bold text-emerald-400 mt-1">
                {ticket.dueAt ? new Date(ticket.dueAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '24 Hours'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <p className="text-[10px] text-slate-500 uppercase font-bold">Department</p>
              <p className="text-xs font-bold text-white mt-1">
                {ticket.department?.name || 'IT Support'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <button
              onClick={() => navigate(`/tickets/${ticket.id}`)}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors"
            >
              View Ticket Details & SLA →
            </button>
            <button
              onClick={() => {
                setSuccessData(null);
                setDescription('');
                setLocation('');
                setCategory('');
                setAiAnalysis(null);
              }}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white transition-colors"
            >
              Report Another Problem
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Intelligent Triage & Auto-Dispatch
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Report Campus Problem
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Speak or type unstructured operational issues. AI classifies, scores impact, and routes to staff.
          </p>
        </div>

        <VoiceInputButton onTranscript={handleVoiceTranscript} isAnalyzing={isAnalyzing} />
      </div>

      {/* Preset Scenarios for Hackathon Presentation */}
      <div className="mb-6 p-4 rounded-2xl glass-card border border-slate-800">
        <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400 mb-2">
          ⚡ Quick Demo Scenarios (Click to Pre-Fill):
        </p>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setDescription(preset.text);
                setLocation(preset.loc);
                handleAnalyze(preset.text, preset.loc);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/30 transition-all text-left"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Form */}
        <div className="lg:col-span-7 space-y-4">
          <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-800 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Problem Description *
                </label>
                <span className="text-[10px] text-slate-500 font-mono">Natural Language</span>
              </div>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. The internet is not working in Lab 3 and tomorrow we have practical exams."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors leading-relaxed placeholder:text-slate-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Location *
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Lab 3, Block B"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Category (Optional)
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors"
                >
                  <option value="">Auto-Detect via AI</option>
                  <option value="IT">IT Support</option>
                  <option value="NETWORK">Network / Wi-Fi</option>
                  <option value="ELECTRICAL">Electrical & HVAC</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="CLEANING">Cleaning & Housekeeping</option>
                  <option value="WATER">Water / Plumbing</option>
                  <option value="LAB">Lab Equipment</option>
                  <option value="SECURITY">Campus Security</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => handleAnalyze()}
                disabled={isAnalyzing || !description}
                className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>{isAnalyzing ? 'AI Analyzing...' : 'Analyze with AI'}</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting || !description}
                className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] active:scale-95 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Automating...' : 'Submit Request'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: AI Analysis Preview Card */}
        <div className="lg:col-span-5">
          <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-800 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white tracking-tight uppercase">AI Triage Blueprint</h3>
                    <p className="text-[10px] text-slate-400">Structured decision payload</p>
                  </div>
                </div>
                {aiAnalysis && (
                  <span className="text-[10px] font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30">
                    Confidence: 96%
                  </span>
                )}
              </div>

              {isAnalyzing ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-10 h-10 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-medium text-slate-300">Google Gemini parsing request...</p>
                  <p className="text-[11px] text-slate-500">Extracting entities, priority, department and SLA</p>
                </div>
              ) : aiAnalysis ? (
                <div className="mt-4 space-y-3.5 text-xs animate-in fade-in duration-150">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Normalized Title</p>
                    <p className="font-semibold text-white mt-0.5 text-sm">{aiAnalysis.title}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Category</span>
                      <span className="font-bold text-emerald-400 mt-0.5 block">{aiAnalysis.category}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Priority</span>
                      <div className="mt-1"><PriorityBadge priority={aiAnalysis.priority} size="xs" /></div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Operational Impact</span>
                    <p className="text-slate-300 leading-snug">{aiAnalysis.impact}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Department</span>
                      <span className="font-bold text-white mt-0.5 block">{aiAnalysis.department}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Enforced SLA</span>
                      <span className="font-bold text-emerald-400 mt-0.5 block">
                        {aiAnalysis.suggestedSLAHours} Hours
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                    <span className="text-[10px] font-bold block uppercase mb-0.5">Suggested Action</span>
                    <p className="leading-snug">{aiAnalysis.suggestedAction}</p>
                  </div>
                </div>
              ) : (
                <div className="py-14 text-center text-slate-500 space-y-2">
                  <Bot className="w-8 h-8 mx-auto text-slate-700" />
                  <p className="text-xs">Click "Analyze with AI" or select a preset to preview automated triage decisions.</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 mt-4 text-[11px] text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Override allowed: Managers can adjust department or priority if required.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
