import React from 'react';
import {
  FileText,
  Brain,
  CopyCheck,
  Flame,
  UserCheck,
  Timer,
  Bell,
  Activity,
  AlertTriangle,
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';

export default function AutomationPipelineVisualizer({ currentStep = 10, logs = [] }) {
  const steps = [
    {
      id: 1,
      title: 'New Request',
      icon: FileText,
      desc: 'User voice/text submitted',
      action: 'Ingestion & Tokenization',
      result: 'Payload verified'
    },
    {
      id: 2,
      title: 'AI Analysis',
      icon: Brain,
      desc: 'Request Understanding & NLP',
      action: 'Gemini Generative Classification',
      result: 'Category & entity extracted'
    },
    {
      id: 3,
      title: 'Duplicate Check',
      icon: CopyCheck,
      desc: 'Semantic incident matching',
      action: 'Vector/keyword cluster scan',
      result: 'Duplicate merged / Master created'
    },
    {
      id: 4,
      title: 'Impact & Priority',
      icon: Flame,
      desc: 'Operational disruption scoring',
      action: 'Academic deadline evaluation',
      result: 'CRITICAL / HIGH priority set'
    },
    {
      id: 5,
      title: 'Smart Assignment',
      icon: UserCheck,
      desc: 'Workload & skill matching',
      action: 'Technician availability check',
      result: 'Assigned to qualified staff'
    },
    {
      id: 6,
      title: 'SLA Enforcement',
      icon: Timer,
      desc: 'Dynamic countdown trigger',
      action: 'Policy matrix evaluation',
      result: 'Due date established'
    },
    {
      id: 7,
      title: 'Notification',
      icon: Bell,
      desc: 'Stakeholder alerts',
      action: 'Multi-channel dispatch',
      result: 'Assignee & requester alerted'
    },
    {
      id: 8,
      title: 'Active Monitoring',
      icon: Activity,
      desc: 'Background 60s cron loop',
      action: '80% threshold tracking',
      result: 'Proactive reminder dispatched'
    },
    {
      id: 9,
      title: 'Auto-Escalation',
      icon: AlertTriangle,
      desc: 'SLA breach safeguard',
      action: 'Admin alert on breach',
      result: 'Overdue ticket escalated'
    },
    {
      id: 10,
      title: 'Resolution & Audit',
      icon: CheckCircle,
      desc: 'Verified on-site completion',
      action: 'Resolution timestamped',
      result: 'Status marked RESOLVED'
    },
    {
      id: 11,
      title: 'AI Report & Insights',
      icon: FileSpreadsheet,
      desc: 'Historical pattern synthesis',
      action: 'Recurring issue clustering',
      result: 'Preventive inspection advisory'
    }
  ];

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="min-w-[1000px] flex items-stretch gap-3">
        {steps.map((step, idx) => {
          const isDone = currentStep >= step.id;
          const isCurrent = currentStep === step.id;
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className={`flex-1 relative rounded-xl p-3.5 border transition-all duration-300 flex flex-col justify-between ${
                isCurrent
                  ? 'bg-brand-950/60 border-brand-500 shadow-[0_0_20px_rgba(34,197,94,0.35)] scale-105 z-10'
                  : isDone
                  ? 'bg-slate-900/70 border-emerald-500/40 text-slate-200'
                  : 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                      isDone
                        ? 'bg-emerald-500 text-slate-950 font-mono'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {step.id}
                  </span>
                  <div
                    className={`p-1.5 rounded-lg ${
                      isCurrent
                        ? 'bg-brand-500/20 text-brand-400 animate-pulse'
                        : isDone
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-slate-800 text-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h4 className="text-xs font-bold tracking-tight text-white mb-0.5">{step.title}</h4>
                <p className="text-[11px] text-slate-400 leading-tight mb-2">{step.desc}</p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 mt-2 text-[10px]">
                <p className="text-slate-500 font-medium truncate">Action: {step.action}</p>
                <p className="text-emerald-400 font-semibold truncate mt-0.5">✓ {step.result}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
