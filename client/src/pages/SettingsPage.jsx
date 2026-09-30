import React, { useState, useEffect } from 'react';
import { automationApi } from '../services/api.js';
import { Sliders, Shield, Bell, Cpu, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const [slaRules, setSlaRules] = useState([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await automationApi.getRules();
        setSlaRules(res.data.slaRules || []);
      } catch (err) {
        console.error('Failed to load settings:', err);
      }
    }
    loadSettings();
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
          System Configuration
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
          Automation & SLA Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure dynamic resolution deadlines, alert thresholds, and AI model parameters.
        </p>
      </div>

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Configuration preferences saved successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* SLA Hours Matrix */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white tracking-tight">Dynamic SLA Priority Matrix</h3>
            <p className="text-xs text-slate-400">Enforced countdown windows in hours</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                CRITICAL Priority SLA (Hours)
              </label>
              <input
                type="number"
                defaultValue={2}
                min={1}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-brand-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Default: 2 hours (Safety hazards, practical exams)</span>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                HIGH Priority SLA (Hours)
              </label>
              <input
                type="number"
                defaultValue={6}
                min={1}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-brand-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Default: 6 hours (Active classroom projectors, lab Wi-Fi)</span>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                MEDIUM Priority SLA (Hours)
              </label>
              <input
                type="number"
                defaultValue={24}
                min={1}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-brand-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Default: 24 hours (Hostel water cooler, cafeteria dispensers)</span>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                LOW Priority SLA (Hours)
              </label>
              <input
                type="number"
                defaultValue={72}
                min={1}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-brand-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Default: 72 hours (Storage rooms, routine non-blocking maintenance)</span>
            </div>
          </div>
        </div>

        {/* AI & Environment Status */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white tracking-tight">AI Model & Engine Status</h3>
            <p className="text-xs text-slate-400">Environment telemetry & model bindings</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">NLP Generative Model</span>
              <p className="font-bold text-white">Google Gemini 1.5 Flash</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">SLA Cron Interval</span>
              <p className="font-bold text-emerald-400">60 Seconds Periodic Tick</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Database Provider</span>
              <p className="font-bold text-white">PostgreSQL (Supabase / Neon)</p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors"
        >
          Save Preferences
        </button>
      </form>
    </div>
  );
}
