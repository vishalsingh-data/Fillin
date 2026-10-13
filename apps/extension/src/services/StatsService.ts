export interface FillinStats {
  keystrokesSaved: number;
  expansionCount: number;
}

export const STATS_STORAGE_KEY = 'fillin_stats';

export class StatsService {
  async getStats(): Promise<FillinStats> {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      return new Promise((resolve) => {
        chrome.storage.local.get(STATS_STORAGE_KEY, (result) => {
          const stats = result[STATS_STORAGE_KEY];
          resolve(stats && typeof stats.keystrokesSaved === 'number' 
            ? stats 
            : { keystrokesSaved: 0, expansionCount: 0 });
        });
      });
    }

    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(STATS_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed.keystrokesSaved === 'number') {
            return parsed;
          }
        }
      }
    } catch {
      // fallback
    }

    return { keystrokesSaved: 0, expansionCount: 0 };
  }

  async recordExpansion(triggerLength: number, expansionLength: number): Promise<FillinStats> {
    const saved = Math.max(0, expansionLength - triggerLength);
    const current = await this.getStats();
    const updated: FillinStats = {
      keystrokesSaved: current.keystrokesSaved + saved,
      expansionCount: current.expansionCount + 1,
    };

    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      await new Promise<void>((resolve) => {
        chrome.storage.local.set({ [STATS_STORAGE_KEY]: updated }, () => resolve());
      });
    } else if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
    }

    return updated;
  }

  formatTimeSaved(keystrokesSaved: number): string {
    // Average typing speed: 40 WPM ~ 200 characters per minute
    const minutes = Math.floor(keystrokesSaved / 200);
    if (minutes < 1) return '< 1 min';
    if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'}`;
    const hours = (minutes / 60).toFixed(1);
    const cleanHours = hours.endsWith('.0') ? hours.slice(0, -2) : hours;
    return `${cleanHours} hr${cleanHours === '1' ? '' : 's'}`;
  }
}

export const statsService = new StatsService();
