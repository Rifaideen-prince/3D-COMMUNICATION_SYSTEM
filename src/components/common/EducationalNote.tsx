import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

interface EducationalNoteProps {
  title: string;
  topic?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const EducationalNote: React.FC<EducationalNoteProps> = ({
  title,
  topic = '3G Engineering Principle',
  children,
  defaultOpen = true
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-cyan-500/25 bg-gradient-to-r from-cyan-950/30 via-slate-900/60 to-slate-900/40 p-4 shadow-sm">
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-cyan-950/80 border border-cyan-800/80 text-cyan-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-400 font-semibold block">
              {topic}
            </span>
            <h4 className="text-sm font-semibold text-slate-200 m-0">
              {title}
            </h4>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-200 p-1">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs text-slate-300 leading-relaxed space-y-2">
          {children}
        </div>
      )}
    </div>
  );
};
