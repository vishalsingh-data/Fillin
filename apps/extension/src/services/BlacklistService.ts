export class BlacklistService {
  private storageKey = 'fillin_blacklist';

  public normalizeDomain(input: string): string {
    let clean = input.trim().toLowerCase();
    // Remove protocol
    clean = clean.replace(/^[a-zA-Z]+:\/\//, '');
    // Remove path, query, hash
    clean = clean.split('/')[0].split('?')[0].split('#')[0];
    // Remove port if any
    clean = clean.split(':')[0];
    // Remove leading www.
    clean = clean.replace(/^www\./, '');
    return clean;
  }

  public async getBlacklist(): Promise<string[]> {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      return new Promise((resolve) => {
        chrome.storage.local.get(this.storageKey, (res) => {
          resolve(res[this.storageKey] || []);
        });
      });
    }

    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public async setBlacklist(domains: string[]): Promise<void> {
    const unique = Array.from(new Set(domains.map((d) => this.normalizeDomain(d)).filter(Boolean)));

    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      return new Promise((resolve) => {
        chrome.storage.local.set({ [this.storageKey]: unique }, () => {
          resolve();
        });
      });
    }

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(unique));
    } catch {
      // ignore
    }
  }

  public async addDomain(rawDomain: string): Promise<string[]> {
    const domain = this.normalizeDomain(rawDomain);
    if (!domain) return this.getBlacklist();

    const list = await this.getBlacklist();
    if (!list.includes(domain)) {
      const updated = [...list, domain];
      await this.setBlacklist(updated);
      return updated;
    }
    return list;
  }

  public async removeDomain(rawDomain: string): Promise<string[]> {
    const domain = this.normalizeDomain(rawDomain);
    const list = await this.getBlacklist();
    const updated = list.filter((d) => d !== domain);
    await this.setBlacklist(updated);
    return updated;
  }

  public async isDomainBlacklisted(rawDomain: string): Promise<boolean> {
    const domain = this.normalizeDomain(rawDomain);
    if (!domain) return false;

    const list = await this.getBlacklist();
    return list.some((d) => domain === d || domain.endsWith('.' + d));
  }

  public async toggleDomain(rawDomain: string): Promise<{ blacklisted: boolean; list: string[] }> {
    const domain = this.normalizeDomain(rawDomain);
    const isCurrently = await this.isDomainBlacklisted(domain);
    let updated: string[];

    if (isCurrently) {
      updated = await this.removeDomain(domain);
      return { blacklisted: false, list: updated };
    } else {
      updated = await this.addDomain(domain);
      return { blacklisted: true, list: updated };
    }
  }
}

export const blacklistService = new BlacklistService();
