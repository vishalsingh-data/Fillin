import { describe, it, expect, beforeEach } from 'vitest';
import { StatsService, STATS_STORAGE_KEY } from './StatsService';

describe('StatsService', () => {
  let service: StatsService;

  beforeEach(() => {
    localStorage.clear();
    service = new StatsService();
  });

  it('initializes with zero stats', async () => {
    const stats = await service.getStats();
    expect(stats.keystrokesSaved).toBe(0);
    expect(stats.expansionCount).toBe(0);
  });

  it('records expansions and accumulates keystrokes saved', async () => {
    // /email (6 chars) expanded to test@example.com (16 chars) -> 10 saved
    await service.recordExpansion(6, 16);
    let stats = await service.getStats();
    expect(stats.keystrokesSaved).toBe(10);
    expect(stats.expansionCount).toBe(1);

    // /sig (4 chars) expanded to 104 chars -> 100 saved
    await service.recordExpansion(4, 104);
    stats = await service.getStats();
    expect(stats.keystrokesSaved).toBe(110);
    expect(stats.expansionCount).toBe(2);
  });

  it('handles expansion shorter than trigger gracefully', async () => {
    // e.g., trigger length 5, content length 3 -> 0 saved
    await service.recordExpansion(5, 3);
    const stats = await service.getStats();
    expect(stats.keystrokesSaved).toBe(0);
    expect(stats.expansionCount).toBe(1);
  });

  it('formats time saved properly', () => {
    expect(service.formatTimeSaved(0)).toBe('< 1 min');
    expect(service.formatTimeSaved(150)).toBe('< 1 min');
    expect(service.formatTimeSaved(200)).toBe('1 min');
    expect(service.formatTimeSaved(1000)).toBe('5 mins');
    expect(service.formatTimeSaved(12000)).toBe('1 hr');
    expect(service.formatTimeSaved(18000)).toBe('1.5 hrs');
  });
});
