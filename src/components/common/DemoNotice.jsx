import React from 'react';
import { Info, Sparkles } from 'lucide-react';

export default function DemoNotice({ text = 'Demo Mode: All statistics, Google profile connections, and ranking metrics are simulated with local sample data.', className = '' }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50/80 border border-amber-200/80 text-amber-800 text-xs ${className}`}>
      <span className="flex h-2 w-2 relative shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
      </span>
      <span className="font-semibold text-amber-900 shrink-0">SIMULATED DEMO</span>
      <span className="text-amber-700 truncate">{text}</span>
    </div>
  );
}

