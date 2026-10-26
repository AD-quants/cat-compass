'use client';

import React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, X, RotateCcw } from 'lucide-react';
import { Section, Outcome, ERROR_CATEGORIES } from '@/lib/types';
import { Button } from '@/components/ui/Button';

export interface FilterState {
  search: string;
  section: string;
  outcome: string;
  reattemptStatus: string;
  errorCategory: string;
}

export function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get('q') || '';
  const section = searchParams.get('section') || 'ALL';
  const outcome = searchParams.get('outcome') || 'ALL';
  const reattemptStatus = searchParams.get('reattempt') || 'ALL';
  const errorCategory = searchParams.get('errorCategory') || 'ALL';

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === 'ALL') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    router.replace(pathname);
  };

  const hasActiveFilters =
    search !== '' ||
    section !== 'ALL' ||
    outcome !== 'ALL' ||
    reattemptStatus !== 'ALL' ||
    errorCategory !== 'ALL';

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Search Input */}
        <div className="relative lg:col-span-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search topic, notes, source..."
            value={search}
            onChange={(e) => updateParam('q', e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          {search && (
            <button
              onClick={() => updateParam('q', '')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Section Filter */}
        <div>
          <select
            value={section}
            onChange={(e) => updateParam('section', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          >
            <option value="ALL">All Sections</option>
            <option value="VARC">VARC</option>
            <option value="DILR">DILR</option>
            <option value="Quant">Quant</option>
          </select>
        </div>

        {/* Outcome Filter */}
        <div>
          <select
            value={outcome}
            onChange={(e) => updateParam('outcome', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          >
            <option value="ALL">All Outcomes</option>
            <option value="Correct">Correct</option>
            <option value="Incorrect">Incorrect</option>
            <option value="Skipped">Skipped</option>
            <option value="Partial">Partial</option>
          </select>
        </div>

        {/* Reattempt Filter */}
        <div>
          <select
            value={reattemptStatus}
            onChange={(e) => updateParam('reattempt', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          >
            <option value="ALL">All Reattempt Status</option>
            <option value="pending">Pending Reattempt</option>
            <option value="done">Reattempted</option>
          </select>
        </div>

        {/* Error Category Filter */}
        <div>
          <select
            value={errorCategory}
            onChange={(e) => updateParam('errorCategory', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          >
            <option value="ALL">All Error Causes</option>
            {ERROR_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clear filters row if active */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100 text-xs">
          <span className="text-gray-500 font-medium">Filtering active results</span>
          <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs h-7 py-0">
            <RotateCcw className="w-3 h-3 mr-1" /> Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
}
