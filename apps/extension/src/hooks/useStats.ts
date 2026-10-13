import { useState, useEffect } from 'react';
import { statsService, FillinStats, STATS_STORAGE_KEY } from '../services/StatsService';

export function useStats() {
  const [stats, setStats] = useState<FillinStats>({ keystrokesSaved: 0, expansionCount: 0 });

  useEffect(() => {
    let mounted = true;
    statsService.getStats().then((s) => {
      if (mounted) setStats(s);
    });

    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.onChanged) {
      const listener = (changes: { [key: string]: chrome.storage.StorageChange }, area: string) => {
        if (area === 'local' && changes[STATS_STORAGE_KEY]) {
          setStats(changes[STATS_STORAGE_KEY].newValue || { keystrokesSaved: 0, expansionCount: 0 });
        }
      };
      chrome.storage.onChanged.addListener(listener);
      return () => {
        mounted = false;
        chrome.storage.onChanged.removeListener(listener);
      };
    }

    return () => {
      mounted = false;
    };
  }, []);

  return {
    stats,
    formattedTimeSaved: statsService.formatTimeSaved(stats.keystrokesSaved),
  };
}
