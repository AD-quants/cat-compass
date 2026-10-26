'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge, PriorityLevel } from '@/components/ui/Badge';
import { Weakness } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { AlertCircle, Clock, Lightbulb, ArrowRight, Target, Sparkles } from 'lucide-react';

interface RecommendationCardProps {
  weakness: Weakness;
  rank: number;
}

export function RecommendationCard({ weakness, rank }: RecommendationCardProps) {
  let priorityLevel: PriorityLevel = 'Medium';
  if (weakness.priorityScore >= 12) priorityLevel = 'Critical';
  else if (weakness.priorityScore >= 8) priorityLevel = 'High';
  else if (weakness.priorityScore < 5) priorityLevel = 'Low';

  const timeLostMinutes = Math.round(weakness.avgTimeLost / 60);

  // Strategic customized advice based on section and error category
  const getActionAdvice = (): string => {
    const cat = weakness.errorCategory || '';
    if (cat === 'Calculation Error') {
      return 'Drill 10 minutes of mental arithmetic daily. Avoid calculating to the 4th decimal place unless necessary; leverage options elimination and digit sum approximations.';
    }
    if (cat === 'Concept Gap') {
      return 'Pause mock tests for 48 hours. Go back to basics: read conceptual summaries and solve 15 untimed foundational problems before attempting timed sectionals.';
    }
    if (cat === 'Set Selection') {
      return 'Adopt the 4-minute rule: scan all sets, rate their complexity on a scale of 1–3, and solve the most direct sets first. Never get emotionally invested in a sticky set.';
    }
    if (cat === 'Time Management') {
      return 'Implement strict hard-stops. If you have not cracked the approach within 90 seconds, mark the question for review and move on.';
    }
    if (cat === 'Reading Comprehension' || weakness.section === 'VARC') {
      return 'Focus on identifying the central argument and author tone. Actively eliminate options with extreme qualifiers (e.g., "always", "entirely", "never").';
    }
    if (cat === 'Silly Mistake' || cat === 'Misread Question') {
      return 'Underline constraints in the question stem (e.g., "must NOT be true", "all positive integers", "units in km/h"). Double-check before submitting the final answer.';
    }
    return `Schedule a targeted 30-minute sectional sprint on ${weakness.topic} to solidify your fundamentals.`;
  };

  const advice = getActionAdvice();

  return (
    <Card hoverEffect className="relative overflow-hidden border-t-4 border-t-indigo-600 flex flex-col justify-between">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-sm shadow-indigo-200">
              #{rank}
            </span>
            <Badge variant="section" value={weakness.section}>
              {weakness.section}
            </Badge>
            <Badge variant="priority" value={priorityLevel}>
              {priorityLevel} Priority ({weakness.priorityScore} pts)
            </Badge>
          </div>
          {weakness.errorCategory && (
            <span className="text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-md">
              {weakness.errorCategory}
            </span>
          )}
        </div>

        {/* Topic Title */}
        <h3 className="text-lg font-bold text-gray-900 mt-1">{weakness.topic}</h3>
        <p className="text-sm text-gray-600 mt-2 leading-relaxed">{weakness.reason}</p>

        {/* Quant metrics breakdown */}
        <div className="grid grid-cols-3 gap-2 mt-4 p-3 bg-gray-50/80 rounded-xl border border-gray-100 text-center">
          <div>
            <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider block">Unresolved</span>
            <span className="text-base font-bold text-rose-600 mt-0.5 block">{weakness.unresolvedCount}</span>
          </div>
          <div>
            <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider block">Occurrences</span>
            <span className="text-base font-bold text-gray-900 mt-0.5 block">{weakness.occurrences}</span>
          </div>
          <div>
            <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider block">Time Cost</span>
            <span className="text-base font-bold text-amber-600 mt-0.5 block">~{timeLostMinutes}m</span>
          </div>
        </div>

        {/* Action Strategy box */}
        <div className="mt-4 p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100/80 text-xs text-indigo-950 flex items-start gap-2.5">
          <Lightbulb className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-indigo-900 block mb-0.5">Recommended Action:</span>
            <p className="leading-relaxed text-indigo-900/90">{advice}</p>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
        <Link
          href={`/history?section=${encodeURIComponent(weakness.section)}&topic=${encodeURIComponent(
            weakness.topic
          )}`}
          className="text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors"
        >
          View Logged Mistakes
        </Link>
        <Link href={`/reattempts?section=${encodeURIComponent(weakness.section)}`}>
          <Button size="sm" variant="primary">
            Resolve Questions <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
