'use client';

import React, { useState } from 'react';
import { Section, Outcome, Confidence, ErrorCategory, SECTION_TOPICS, ERROR_CATEGORIES, PracticeRecord } from '@/lib/types';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { PlusCircle, RotateCcw, Sparkles } from 'lucide-react';

interface LogEntryFormProps {
  onAddRecord: (record: Omit<PracticeRecord, 'id' | 'createdAt' | 'hasReattempted'>) => void;
}

const COMMON_SOURCES = [
  'IMS SimCAT',
  'TIME AIMCAT',
  'CL Prime CAT',
  'Cracku Daily Target',
  'Cracku Mock',
  'Rodha Practice',
  '2IIM Question Bank',
  'Arun Sharma Book',
  'Previous Year Paper',
];

export function LogEntryForm({ onAddRecord }: LogEntryFormProps) {
  const { success, error: toastError } = useToast();

  const [source, setSource] = useState('');
  const [mockName, setMockName] = useState('');
  const [section, setSection] = useState<Section>('Quant');
  const [topic, setTopic] = useState(SECTION_TOPICS['Quant'][0]);
  const [subtopic, setSubtopic] = useState('');
  const [outcome, setOutcome] = useState<Outcome>('Incorrect');
  const [errorCategory, setErrorCategory] = useState<ErrorCategory>('Calculation Error');
  const [timeTaken, setTimeTaken] = useState<string>('120');
  const [expectedTime, setExpectedTime] = useState<string>('120');
  const [confidence, setConfidence] = useState<Confidence>('Medium');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSectionChange = (newSection: Section) => {
    setSection(newSection);
    const newTopics = SECTION_TOPICS[newSection];
    if (newTopics && newTopics.length > 0) {
      setTopic(newTopics[0]);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!source.trim()) {
      errs.source = 'Practice source is required';
    }
    if (!section) {
      errs.section = 'Section is required';
    }
    if (!topic.trim()) {
      errs.topic = 'Topic is required';
    }
    if (!outcome) {
      errs.outcome = 'Outcome is required';
    }

    const tTaken = parseInt(timeTaken, 10);
    if (isNaN(tTaken) || tTaken <= 0) {
      errs.timeTaken = 'Time taken must be greater than 0 seconds';
    }

    const expTime = parseInt(expectedTime, 10);
    if (isNaN(expTime) || expTime <= 0) {
      errs.expectedTime = 'Expected time must be greater than 0 seconds';
    }

    if (!confidence) {
      errs.confidence = 'Confidence rating is required';
    }

    if (outcome !== 'Correct' && !errorCategory) {
      errs.errorCategory = 'Error category is required for incorrect/skipped questions';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const resetForm = () => {
    setSource('');
    setMockName('');
    setSection('Quant');
    setTopic(SECTION_TOPICS['Quant'][0]);
    setSubtopic('');
    setOutcome('Incorrect');
    setErrorCategory('Calculation Error');
    setTimeTaken('120');
    setExpectedTime('120');
    setConfidence('Medium');
    setNotes('');
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toastError('Please correct the highlighted form errors.');
      return;
    }

    onAddRecord({
      source: source.trim(),
      mockName: mockName.trim(),
      section,
      topic,
      subtopic: subtopic.trim() || undefined,
      outcome,
      errorCategory: outcome === 'Correct' ? undefined : errorCategory,
      timeTaken: parseInt(timeTaken, 10),
      expectedTime: parseInt(expectedTime, 10),
      confidence,
      notes: notes.trim(),
      isDemo: false,
    });

    success('Question logged successfully! Practice data updated.');
    resetForm();
  };

  return (
    <Card className="p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Source & Test Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Input
              label="Source / Provider"
              placeholder="e.g. IMS SimCAT, TIME AIMCAT, Cracku"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              error={errors.source}
              required
            />
            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[11px] text-gray-400 font-medium self-center">Quick picks:</span>
              {['IMS', 'TIME', 'Cracku', 'CL'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setSource(preset)}
                  className="text-[11px] px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Mock Name / Test Series (Optional)"
            placeholder="e.g. SimCAT 4, AIMCAT 2502, Daily Target 41"
            value={mockName}
            onChange={(e) => setMockName(e.target.value)}
            helperText="Helps identify which mock or sectional this was from"
          />
        </div>

        {/* Section & Topic */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['VARC', 'DILR', 'Quant'] as Section[]).map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => handleSectionChange(sec)}
                  className={`py-2 px-3 text-xs font-bold rounded-lg border text-center transition-all ${
                    section === sec
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-100'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {sec}
                </button>
              ))}
            </div>
            {errors.section && <p className="mt-1 text-xs text-rose-600">{errors.section}</p>}
          </div>

          <div className="sm:col-span-2">
            <Select
              label="Topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              error={errors.topic}
              required
            >
              {SECTION_TOPICS[section].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Subtopic */}
        <div>
          <Input
            label="Subtopic / Concept Note (Optional)"
            placeholder="e.g. Successive percentages, Circular arrangement, TITA inference"
            value={subtopic}
            onChange={(e) => setSubtopic(e.target.value)}
          />
        </div>

        {/* Outcome & Error Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Outcome <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Correct', 'Incorrect', 'Skipped', 'Partial'] as Outcome[]).map((out) => {
                const isSelected = outcome === out;
                const colors = {
                  Correct: isSelected ? 'bg-emerald-600 text-white border-emerald-600' : 'hover:bg-emerald-50',
                  Incorrect: isSelected ? 'bg-rose-600 text-white border-rose-600' : 'hover:bg-rose-50',
                  Skipped: isSelected ? 'bg-slate-700 text-white border-slate-700' : 'hover:bg-slate-50',
                  Partial: isSelected ? 'bg-amber-600 text-white border-amber-600' : 'hover:bg-amber-50',
                }[out];

                return (
                  <button
                    key={out}
                    type="button"
                    onClick={() => setOutcome(out)}
                    className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                      isSelected ? colors : 'bg-white text-gray-700 border-gray-300'
                    }`}
                  >
                    {out}
                  </button>
                );
              })}
            </div>
            {errors.outcome && <p className="mt-1 text-xs text-rose-600">{errors.outcome}</p>}
          </div>

          {outcome !== 'Correct' ? (
            <Select
              label="Root Cause / Error Category"
              value={errorCategory}
              onChange={(e) => setErrorCategory(e.target.value as ErrorCategory)}
              error={errors.errorCategory}
              required
            >
              {ERROR_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>
          ) : (
            <div className="flex items-center p-3 rounded-lg bg-emerald-50/70 border border-emerald-100 text-emerald-800 text-xs">
              <Sparkles className="w-4 h-4 mr-2 text-emerald-600 shrink-0" />
              <span>Great job! Correct answers don't require an error category.</span>
            </div>
          )}
        </div>

        {/* Time Taken, Expected Time, Confidence */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Time Taken (seconds)"
            type="number"
            min="1"
            placeholder="120"
            value={timeTaken}
            onChange={(e) => setTimeTaken(e.target.value)}
            error={errors.timeTaken}
            required
            helperText={`${Math.floor(parseInt(timeTaken || '0', 10) / 60)}m ${
              parseInt(timeTaken || '0', 10) % 60
            }s`}
          />

          <Input
            label="Expected Time (seconds)"
            type="number"
            min="1"
            placeholder="120"
            value={expectedTime}
            onChange={(e) => setExpectedTime(e.target.value)}
            error={errors.expectedTime}
            required
            helperText="Benchmark target for this question"
          />

          <Select
            label="Confidence Level"
            value={confidence}
            onChange={(e) => setConfidence(e.target.value as Confidence)}
            error={errors.confidence}
            required
          >
            <option value="High">High (Felt sure)</option>
            <option value="Medium">Medium (Somewhat unsure)</option>
            <option value="Low">Low (Felt like a guess)</option>
          </Select>
        </div>

        {/* Notes */}
        <Textarea
          label="Reflection / Mistake Analysis (Optional)"
          placeholder="What exactly went wrong? Misread a condition? Overlooked a formula? Trapped in calculation?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
          <Button type="button" variant="ghost" onClick={resetForm}>
            <RotateCcw className="w-4 h-4 mr-1.5" /> Reset
          </Button>
          <Button type="submit" variant="primary">
            <PlusCircle className="w-4 h-4 mr-1.5" /> Save Practice Log
          </Button>
        </div>
      </form>
    </Card>
  );
}
