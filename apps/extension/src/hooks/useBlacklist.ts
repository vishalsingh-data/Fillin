import { useState, useEffect, useCallback } from 'react';
import { blacklistService } from '../services/BlacklistService';

export function useBlacklist() {
  const [blacklistedDomains, setBlacklistedDomains] = useState<string[]>([]);
  const [currentDomain, setCurrentDomain] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load blacklisted domains
  const loadBlacklist = useCallback(async () => {
    try {
      const list = await blacklistService.getBlacklist();
      setBlacklistedDomains(list);
    } finally {
      setLoading(false);
    }
  }, []);

  // Detect current active tab domain
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.tabs?.query) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const urlStr = tabs[0]?.url;
        if (urlStr) {
          try {
            const url = new URL(urlStr);
            if (url.protocol.startsWith('http')) {
              const clean = url.hostname.replace(/^www\./, '').toLowerCase();
              setCurrentDomain(clean);
            }
          } catch {
            // ignore invalid URL
          }
        }
      });
    } else if (typeof window !== 'undefined') {
      const clean = window.location.hostname.replace(/^www\./, '').toLowerCase();
      if (clean && clean !== 'localhost') {
        setCurrentDomain(clean);
      }
    }
  }, []);

  // Listen for storage changes
  useEffect(() => {
    loadBlacklist();

    if (typeof chrome !== 'undefined' && chrome.storage?.onChanged) {
      const listener = (changes: { [key: string]: chrome.storage.StorageChange }, area: string) => {
        if (area === 'local' && changes['fillin_blacklist']) {
          setBlacklistedDomains(changes['fillin_blacklist'].newValue || []);
        }
      };
      chrome.storage.onChanged.addListener(listener);
      return () => chrome.storage.onChanged.removeListener(listener);
    }
  }, [loadBlacklist]);

  const isCurrentDomainBlacklisted =
    !!currentDomain &&
    blacklistedDomains.some((d) => currentDomain === d || currentDomain.endsWith('.' + d));

  const toggleCurrentDomain = useCallback(async () => {
    if (!currentDomain) return;
    const res = await blacklistService.toggleDomain(currentDomain);
    setBlacklistedDomains(res.list);
  }, [currentDomain]);

  const addDomain = useCallback(async (domain: string) => {
    const updated = await blacklistService.addDomain(domain);
    setBlacklistedDomains(updated);
  }, []);

  const removeDomain = useCallback(async (domain: string) => {
    const updated = await blacklistService.removeDomain(domain);
    setBlacklistedDomains(updated);
  }, []);

  return {
    blacklistedDomains,
    currentDomain,
    isCurrentDomainBlacklisted,
    toggleCurrentDomain,
    addDomain,
    removeDomain,
    loading,
  };
}
