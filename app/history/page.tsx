'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePracticeRecords } from '@/hooks/usePracticeRecords';
import { FilterBar } from '@/components/history/FilterBar';
import { HistoryTable } from '@/components/history/HistoryTable';
import { History, Download, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

function HistoryContent() {
  const { records, reattempts, isLoaded, deleteRecord, addReattempt } = usePracticeRecords();
  const searchParams = useSearchParams();

  const searchQuery = (searchParams.get('q') || '').toLowerCase().trim();
  const sectionFilter = searchParams.get('section') || 'ALL';
  const outcomeFilter = searchParams.get('outcome') || 'ALL';
  const reattemptFilter = searchParams.get('reattempt') || 'ALL';
  const errorCategoryFilter = searchParams.get('errorCategory') || 'ALL';

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Filter records
  const filteredRecords = records.filter((r) => {
    // Search query
    if (searchQuery) {
      const matchTopic = r.topic.toLowerCase().includes(searchQuery);
      const matchSubtopic = (r.subtopic || '').toLowerCase().includes(searchQuery);
      const matchSource = r.source.toLowerCase().includes(searchQuery);
      const matchMock = (r.mockName || '').toLowerCase().includes(searchQuery);
      const matchNotes = (r.notes || '').toLowerCase().includes(searchQuery);
      if (!matchTopic && !matchSubtopic && !matchSource && !matchMock && !matchNotes) {
        return false;
      }
    }

    // Section
    if (sectionFilter !== 'ALL' && r.section !== sectionFilter) {
      return false;
    }

    // Outcome
    if (outcomeFilter !== 'ALL' && r.outcome !== outcomeFilter) {
      return false;
    }

    // Reattempt status
    if (reattemptFilter === 'pending') {
      if (r.hasReattempted || r.outcome === 'Correct') return false;
    } else if (reattemptFilter === 'done') {
      if (!r.hasReattempted) return false;
    }

    // Error Category
    if (errorCategoryFilter !== 'ALL' && r.errorCategory !== errorCategoryFilter) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs tracking-wider uppercase">
            <History className="w-4 h-4" />
            <span>Preparation History</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-1">
            Unified Practice Records
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Search, filter, and track every logged question across all mock test providers and study sessions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/import-export">
            <Button variant="secondary" size="sm">
              <Download className="w-4 h-4 mr-1.5" /> Export CSV
            </Button>
          </Link>
          <Link href="/logger">
            <Button variant="primary" size="sm">
              <PlusCircle className="w-4 h-4 mr-1.5" /> Log Question
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar />

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-gray-500 px-1">
        <span>
          Showing <strong className="text-gray-900">{filteredRecords.length}</strong> of{' '}
          <strong className="text-gray-900">{records.length}</strong> total records
        </span>
      </div>

      {/* History Table */}
      <HistoryTable
        records={filteredRecords}
        reattempts={reattempts}
        onDeleteRecord={deleteRecord}
        onAddReattempt={addReattempt}
      />
    </div>
  );
}

export default function HistoryPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <HistoryContent />
    </Suspense>
  );
}
