'use client';

import React from 'react';
import { usePracticeRecords } from '@/hooks/usePracticeRecords';
import { LogEntryForm } from '@/components/logger/LogEntryForm';
import { PlusCircle, HelpCircle, CheckCircle2, Clock, Lightbulb } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export default function LoggerPage() {
  const { addRecord } = usePracticeRecords();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs tracking-wider uppercase">
          <PlusCircle className="w-4 h-4" />
          <span>Question Logger</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-1">
          Record Practice & Mistake Analysis
        </h1>
        <p className="mt-1 text-sm text-gray-600 leading-relaxed">
          Log every question you solve from any coaching test, sectional, mock, or book. Categorizing your errors accurately is key to generating high-impact next steps.
        </p>
      </div>

      {/* Main Form */}
      <LogEntryForm onAddRecord={addRecord} />

      {/* Logging Tips Card */}
      <Card className="bg-slate-50 border-slate-200">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-2">
          <Lightbulb className="w-4 h-4 text-amber-500" /> Best Practices for Mistake Tagging
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-600 mt-2">
          <div className="p-2.5 bg-white rounded-lg border border-gray-200">
            <span className="font-semibold text-gray-800 block mb-1">Concept Gap vs Silly Mistake</span>
            <p>If you didn't know the property or rule, it's a <em>Concept Gap</em>. If you misread numbers or multiplied wrong, tag <em>Calculation / Silly</em>.</p>
          </div>
          <div className="p-2.5 bg-white rounded-lg border border-gray-200">
            <span className="font-semibold text-gray-800 block mb-1">Time Benchmark</span>
            <p>Compare your actual time with typical CAT targets: ~1.5–2 mins for QA, ~2 mins for VA, ~6–8 mins per DILR set.</p>
          </div>
          <div className="p-2.5 bg-white rounded-lg border border-gray-200">
            <span className="font-semibold text-gray-800 block mb-1">Reflect in the Notes</span>
            <p>One sentence identifying why you fell for the trap will make your future reattempt 10x more effective.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
