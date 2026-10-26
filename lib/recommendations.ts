import { ErrorCategory, PracticeRecord, Section, Weakness } from './types';

export function calculateWeaknesses(records: PracticeRecord[]): Weakness[] {
  // Filter for errors: Incorrect, Skipped, Partial
  const errorRecords = records.filter(
    (r) => r.outcome === 'Incorrect' || r.outcome === 'Skipped' || r.outcome === 'Partial'
  );

  if (errorRecords.length === 0) {
    return [];
  }

  const now = new Date().getTime();

  // Group by (section, topic, errorCategory)
  const groupMap = new Map<
    string,
    {
      section: Section;
      topic: string;
      errorCategory?: ErrorCategory;
      records: PracticeRecord[];
    }
  >();

  for (const record of errorRecords) {
    const key = `${record.section}:::${record.topic}:::${record.errorCategory || 'Uncategorized'}`;
    const existing = groupMap.get(key);
    if (existing) {
      existing.records.push(record);
    } else {
      groupMap.set(key, {
        section: record.section,
        topic: record.topic,
        errorCategory: record.errorCategory,
        records: [record],
      });
    }
  }

  const weaknesses: Weakness[] = [];

  for (const group of Array.from(groupMap.values())) {
    const occurrences = group.records.length;
    const unresolvedCount = group.records.filter((r) => !r.hasReattempted).length;

    // Calculate time lost: excess time or time spent on unsuccessful questions
    const totalTimeLost = group.records.reduce((acc, r) => {
      const excess = r.timeTaken - r.expectedTime;
      // If took longer than expected, count full excess + portion of expected; else half the time spent
      const lost = excess > 0 ? excess + Math.round(r.expectedTime * 0.5) : Math.round(r.timeTaken * 0.75);
      return acc + Math.max(30, lost);
    }, 0);
    const avgTimeLost = Math.round(totalTimeLost / occurrences);

    // Find most recent timestamp
    const sortedByDate = [...group.records].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const lastSeen = sortedByDate[0].createdAt;
    const daysSince = Math.max(0, (now - new Date(lastSeen).getTime()) / (1000 * 60 * 60 * 24));

    // Recency bonus: +2 if within 7 days, +1 if within 14 days
    let recencyBonus = 0;
    if (daysSince <= 7) {
      recencyBonus = 2;
    } else if (daysSince <= 14) {
      recencyBonus = 1;
    }

    // priorityScore = (unresolvedCount × 3) + (occurrences × 1) + (avgTimeLost/60 × 2) + recencyBonus
    const priorityScore = Number(
      (
        unresolvedCount * 3 +
        occurrences * 1 +
        (avgTimeLost / 60) * 2 +
        recencyBonus
      ).toFixed(1)
    );

    // Human-readable reason
    const categoryText = group.errorCategory ? `"${group.errorCategory}"` : 'repeated mistakes';
    let urgency = 'Needs attention';
    if (priorityScore >= 12) urgency = 'Critical focus';
    else if (priorityScore >= 8) urgency = 'High priority';

    const reason = `${urgency}: ${occurrences} ${occurrences === 1 ? 'mistake' : 'mistakes'} (${unresolvedCount} pending reattempt) driven by ${categoryText}. Avg time cost ~${Math.round(avgTimeLost / 60)}m.`;

    weaknesses.push({
      section: group.section,
      topic: group.topic,
      errorCategory: group.errorCategory,
      occurrences,
      unresolvedCount,
      avgTimeLost,
      lastSeen,
      priorityScore,
      reason,
    });
  }

  // Sort descending by priorityScore
  weaknesses.sort((a, b) => b.priorityScore - a.priorityScore);

  // Return top 6
  return weaknesses.slice(0, 6);
}
