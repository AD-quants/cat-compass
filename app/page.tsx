'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePracticeRecords } from '@/hooks/usePracticeRecords';
import { calculateWeaknesses } from '@/lib/recommendations';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { SectionPerformance } from '@/components/dashboard/SectionPerformance';
import { WeaknessCard } from '@/components/dashboard/WeaknessCard';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useToast } from '@/components/ui/Toast';
import { PracticeRecord, ReattemptResult } from '@/lib/types';
import {
  Compass,
  CheckCircle2,
  Clock,
  RotateCcw,
  Target,
  PlusCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export default function DashboardPage() {
  const { records, reattempts, isLoaded, loadDemoData, addReattempt } = usePracticeRecords();
  const { success } = useToast();

  const [greeting, setGreeting] = useState('Welcome back');
  const [selectedRecordForReattempt, setSelectedRecordForReattempt] = useState<PracticeRecord | null>(null);
  const [reattemptResult, setReattemptResult] = useState<ReattemptResult>('Solved Independently');
  const [reattemptTime, setReattemptTime] = useState<string>('90');
  const [reattemptNotes, setReattemptNotes] = useState<string>('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500 font-medium">Loading your preparation cockpit...</p>
        </div>
      </div>
    );
  }

  // Empty state if no records
  if (records.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-sm border border-indigo-100">
          <Compass className="w-8 h-8 animate-pulse" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome to CAT Compass</h1>
        <p className="mt-3 text-base text-gray-600 max-w-xl mx-auto leading-relaxed">
          Your free, provider-independent companion for CAT exam preparation. Sit on top of IMS, TIME, Cracku, CL, and self-study practice to diagnose weaknesses and track verified improvements.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            variant="primary"
            onClick={() => {
              loadDemoData();
              success('Loaded 30 realistic practice questions and 10 reattempts!');
            }}
          >
            <Sparkles className="w-5 h-5 mr-2" /> Load Realistic Demo Data
          </Button>
          <Link href="/logger">
            <Button size="lg" variant="secondary">
              <PlusCircle className="w-5 h-5 mr-2" /> Log Your First Question
            </Button>
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <Card className="border-t-4 border-t-indigo-500">
            <h4 className="font-bold text-gray-900 text-sm">Universal Logger</h4>
            <p className="mt-1 text-xs text-gray-500 leading-relaxed">
              Track questions from mocks, sectionals, topic tests, and study books in one unified interface.
            </p>
          </Card>
          <Card className="border-t-4 border-t-rose-500">
            <h4 className="font-bold text-gray-900 text-sm">Algorithmic Prioritisation</h4>
            <p className="mt-1 text-xs text-gray-500 leading-relaxed">
              Ranks your recurring mistake patterns by unresolved count, frequency, and wasted time.
            </p>
          </Card>
          <Card className="border-t-4 border-t-emerald-500">
            <h4 className="font-bold text-gray-900 text-sm">Verified Improvement</h4>
            <p className="mt-1 text-xs text-gray-500 leading-relaxed">
              Follow up on mistakes with tracked reattempts to ensure you truly master tricky concepts.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  // Calculate high-level stats
  const totalLogged = records.length;
  const correctCount = records.filter((r) => r.outcome === 'Correct').length;
  const overallAccuracy = Math.round((correctCount / totalLogged) * 100);

  const totalTimeTaken = records.reduce((acc, r) => acc + r.timeTaken, 0);
  const totalExpectedTime = records.reduce((acc, r) => acc + r.expectedTime, 0);
  const timeRatio = totalExpectedTime > 0 ? (totalTimeTaken / totalExpectedTime).toFixed(2) : '1.00';

  const totalReattempts = reattempts.length;
  const independentSolves = reattempts.filter((re) => re.result === 'Solved Independently').length;
  const reattemptSuccessRate =
    totalReattempts > 0 ? Math.round((independentSolves / totalReattempts) * 100) : 0;

  // Weaknesses
  const allWeaknesses = calculateWeaknesses(records);
  const topWeaknesses = allWeaknesses.slice(0, 3);

  // Modal Handlers
  const handleOpenReattemptModal = (record: PracticeRecord) => {
    setSelectedRecordForReattempt(record);
    setReattemptResult('Solved Independently');
    setReattemptTime(record.expectedTime ? String(record.expectedTime) : '90');
    setReattemptNotes('');
  };

  const handleCloseReattemptModal = () => {
    setSelectedRecordForReattempt(null);
  };

  const handleSubmitReattempt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecordForReattempt) return;

    const time = parseInt(reattemptTime, 10);
    addReattempt({
      practiceRecordId: selectedRecordForReattempt.id,
      result: reattemptResult,
      timeTaken: isNaN(time) || time <= 0 ? 60 : time,
      notes: reattemptNotes.trim(),
      isDemo: false,
    });

    success('Reattempt logged successfully!');
    handleCloseReattemptModal();
  };

  return (
    <div className="space-y-8">
      {/* Top Banner / Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {greeting}, Aspirant!
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Here is your complete CAT preparation diagnostics and action priorities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/logger">
            <Button variant="primary">
              <PlusCircle className="w-4 h-4 mr-2" /> Log Question
            </Button>
          </Link>
          <Link href="/next-steps">
            <Button variant="secondary">
              <Target className="w-4 h-4 mr-2" /> Action Plan
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Total Logged"
          value={totalLogged}
          subtitle="Across all practice sources"
          icon={TrendingUp}
          colorScheme="indigo"
        />
        <StatsCard
          title="Overall Accuracy"
          value={`${overallAccuracy}%`}
          subtitle={`${correctCount} of ${totalLogged} correct`}
          icon={CheckCircle2}
          colorScheme="emerald"
        />
        <StatsCard
          title="Avg Time Ratio"
          value={`${timeRatio}x`}
          subtitle={
            Number(timeRatio) <= 1
              ? 'Pacing within expected limits'
              : 'Taking longer than benchmark'
          }
          icon={Clock}
          colorScheme={Number(timeRatio) <= 1.1 ? 'sky' : 'amber'}
        />
        <StatsCard
          title="Reattempt Mastery"
          value={`${reattemptSuccessRate}%`}
          subtitle={`${independentSolves} of ${totalReattempts} solved cleanly`}
          icon={RotateCcw}
          colorScheme="rose"
        />
      </div>

      {/* Section Performance Row */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Section Breakdown</h2>
            <p className="text-xs text-gray-500">Comparative accuracy and time speed across the 3 sections</p>
          </div>
          <Link
            href="/history"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            Detailed history <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <SectionPerformance records={records} />
      </div>

      {/* Top Weaknesses Prioritisation */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Top Weakness Priorities</h2>
            <p className="text-xs text-gray-500">
              Ranked by recurring error frequency, unresolved status, and lost time
            </p>
          </div>
          <Link
            href="/next-steps"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            View full roadmap <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {topWeaknesses.length === 0 ? (
          <Card className="text-center py-8">
            <p className="text-sm text-gray-500">No weaknesses detected yet! Keep practicing.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {topWeaknesses.map((weakness, idx) => (
              <WeaknessCard key={`${weakness.section}-${weakness.topic}-${idx}`} weakness={weakness} rank={idx + 1} />
            ))}
          </div>
        )}
      </div>

      {/* Recent Practice Log Activity */}
      <div>
        <RecentActivity records={records} onOpenReattemptModal={handleOpenReattemptModal} />
      </div>

      {/* Reattempt Modal */}
      {selectedRecordForReattempt && (
        <Modal
          isOpen={!!selectedRecordForReattempt}
          onClose={handleCloseReattemptModal}
          title="Log Question Reattempt"
          description={`Record your second attempt for ${selectedRecordForReattempt.topic}`}
        >
          <form onSubmit={handleSubmitReattempt} className="space-y-4">
            <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 text-xs text-gray-600 space-y-1">
              <div className="font-semibold text-gray-800">{selectedRecordForReattempt.topic}</div>
              <div>
                Original Outcome: <span className="font-medium text-rose-600">{selectedRecordForReattempt.outcome}</span>
              </div>
              {selectedRecordForReattempt.notes && (
                <div className="italic text-gray-500 mt-1">"{selectedRecordForReattempt.notes}"</div>
              )}
            </div>

            <Select
              label="Reattempt Outcome"
              value={reattemptResult}
              onChange={(e) => setReattemptResult(e.target.value as ReattemptResult)}
              required
            >
              <option value="Solved Independently">Solved Independently (Full Mastery)</option>
              <option value="Needed Hint">Needed Hint (Partial Mastery)</option>
              <option value="Could Not Solve">Could Not Solve (Concept Still Weak)</option>
            </Select>

            <Input
              label="Time Taken (seconds)"
              type="number"
              min="1"
              value={reattemptTime}
              onChange={(e) => setReattemptTime(e.target.value)}
              required
              helperText={`Original time: ${selectedRecordForReattempt.timeTaken}s (Target: ${selectedRecordForReattempt.expectedTime}s)`}
            />

            <Textarea
              label="Reattempt Reflections"
              placeholder="Did you spot the trap faster? What was the breakthrough insight?"
              value={reattemptNotes}
              onChange={(e) => setReattemptNotes(e.target.value)}
              rows={3}
            />

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <Button type="button" variant="ghost" onClick={handleCloseReattemptModal}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Reattempt
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
