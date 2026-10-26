'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePracticeRecords } from '@/hooks/usePracticeRecords';
import { calculateWeaknesses } from '@/lib/recommendations';
import { RecommendationCard } from '@/components/next-steps/RecommendationCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import {
  Target,
  ChevronDown,
  ChevronUp,
  Info,
  Sparkles,
  PlusCircle,
  HelpCircle,
  TrendingDown,
  Layers,
} from 'lucide-react';

export default function NextStepsPage() {
  const { records, isLoaded, loadDemoData } = usePracticeRecords();
  const { success } = useToast();
  const [showFormula, setShowFormula] = useState(false);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const weaknesses = calculateWeaknesses(records);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs tracking-wider uppercase">
            <Target className="w-4 h-4" />
            <span>Personalised Recommendations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-1">
            Prioritised Next Steps
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Algorithmic weakness ranking that highlights your highest-yield preparation areas right now.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowFormula(!showFormula)}
            className="text-xs"
          >
            <Info className="w-4 h-4 mr-1.5 text-indigo-600" />
            {showFormula ? 'Hide Ranking Logic' : 'How Are These Ranked?'}
            {showFormula ? <ChevronUp className="w-3.5 h-3.5 ml-1" /> : <ChevronDown className="w-3.5 h-3.5 ml-1" />}
          </Button>
        </div>
      </div>

      {/* Collapsible Algorithm Explanation */}
      {showFormula && (
        <Card className="bg-gradient-to-r from-indigo-50/70 via-sky-50/50 to-white border-indigo-100 p-5 sm:p-6 transition-all duration-300">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-indigo-600 text-white mt-0.5 shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-gray-900 text-base">The CAT Compass Priority Algorithm</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Rather than treating all mistakes equally, CAT Compass groups your errors by <strong>(Section, Topic, Error Category)</strong> and scores each pattern using a weighted impact formula:
              </p>

              <div className="p-3 bg-white/90 rounded-xl border border-indigo-100 font-mono text-xs sm:text-sm text-indigo-950 shadow-inner">
                Priority Score = (Unresolved Count × 3) + (Occurrences × 1) + (Avg Time Lost / 60 × 2) + Recency Bonus
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs text-gray-600">
                <div className="p-2.5 bg-white/80 rounded-lg border border-gray-100">
                  <strong className="text-gray-900 block mb-0.5">Unresolved (×3)</strong>
                  Heaviest weight on mistakes you haven't successfully reattempted yet.
                </div>
                <div className="p-2.5 bg-white/80 rounded-lg border border-gray-100">
                  <strong className="text-gray-900 block mb-0.5">Occurrences (×1)</strong>
                  Reflects recurring chronic vulnerability in the topic.
                </div>
                <div className="p-2.5 bg-white/80 rounded-lg border border-gray-100">
                  <strong className="text-gray-900 block mb-0.5">Time Lost (×2/min)</strong>
                  Penalises traps that rob you of precious test minutes.
                </div>
                <div className="p-2.5 bg-white/80 rounded-lg border border-gray-100">
                  <strong className="text-gray-900 block mb-0.5">Recency Bonus</strong>
                  +2 points if seen within 7 days, +1 if within 14 days.
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Recommendations Cards or Empty State */}
      {weaknesses.length === 0 ? (
        <Card className="text-center py-12 px-4 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No Weaknesses Detected Yet</h3>
          <p className="mt-1 text-sm text-gray-500 leading-relaxed">
            As you log questions that were Incorrect, Skipped, or Partial, the ranking engine will cluster them and present your top focus areas here.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                loadDemoData();
                success('Loaded demo preparation data!');
              }}
            >
              Load Demo Data
            </Button>
            <Link href="/logger">
              <Button variant="secondary" size="sm">
                Log a Mistake
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {weaknesses.map((weakness, index) => (
            <RecommendationCard
              key={`${weakness.section}-${weakness.topic}-${weakness.errorCategory || 'none'}-${index}`}
              weakness={weakness}
              rank={index + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
