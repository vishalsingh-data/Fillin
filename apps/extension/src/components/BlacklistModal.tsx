import React, { useState } from 'react';
import { Shield, ShieldAlert, X, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen?: boolean;
  onClose: () => void;
  blacklistedDomains: string[];
  currentDomain: string | null;
  isCurrentDomainBlacklisted: boolean;
  onToggleCurrentDomain: () => void;
  onAddDomain: (d: string) => void;
  onRemoveDomain: (d: string) => void;
}

export function BlacklistModal({
  isOpen = true,
  onClose,
  blacklistedDomains,
  currentDomain,
  isCurrentDomainBlacklisted,
  onToggleCurrentDomain,
  onAddDomain,
  onRemoveDomain,
}: Props) {
  const [newDomain, setNewDomain] = useState('');

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDomain.trim()) {
      onAddDomain(newDomain.trim());
      setNewDomain('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-gray-700" />
            <h3 className="text-sm font-bold text-gray-900">Site Blacklist</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto">
          {/* Active Site Card */}
          {currentDomain && (
            <div
              className={`p-3 rounded-xl border transition-all ${
                isCurrentDomainBlacklisted
                  ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                  : 'bg-gray-50 border-gray-200 text-gray-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-1.5">
                    {isCurrentDomainBlacklisted ? (
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                    <span className="text-xs font-semibold">{currentDomain}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {isCurrentDomainBlacklisted ? 'Fillin is paused on this site' : 'Fillin is active on this site'}
                  </p>
                </div>

                <button
                  onClick={onToggleCurrentDomain}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shadow-xs ${
                    isCurrentDomainBlacklisted
                      ? 'bg-amber-600 hover:bg-amber-700 text-white'
                      : 'bg-gray-900 hover:bg-black text-white'
                  }`}
                >
                  {isCurrentDomainBlacklisted ? 'Resume' : 'Pause'}
                </button>
              </div>
            </div>
          )}

          {/* Add Domain Input */}
          <form onSubmit={handleAdd} className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Add Blocked Domain
            </label>
            <div className="flex space-x-1.5">
              <input
                type="text"
                placeholder="e.g. chase.com, bank.org"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400
                           focus:bg-white focus:border-gray-400 focus:ring-2 focus:ring-gray-100 outline-none"
              />
              <button
                type="submit"
                disabled={!newDomain.trim()}
                className="px-3 py-1.5 text-xs font-semibold bg-gray-900 text-white rounded-xl hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center space-x-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add</span>
              </button>
            </div>
          </form>

          {/* Blocked Domains List */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                Blocked Websites ({blacklistedDomains.length})
              </span>
            </div>

            {blacklistedDomains.length === 0 ? (
              <p className="text-xs text-gray-400 italic py-2 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                No websites blacklisted. Fillin runs everywhere.
              </p>
            ) : (
              <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                {blacklistedDomains.map((domain) => (
                  <div
                    key={domain}
                    className="flex items-center justify-between px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                  >
                    <span className="font-mono text-gray-800">{domain}</span>
                    <button
                      onClick={() => onRemoveDomain(domain)}
                      className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                      title={`Unblock ${domain}`}
                      aria-label={`Unblock ${domain}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 text-[11px] text-gray-400 text-center">
          Fillin will stay silent and inactive on all blacklisted domains.
        </div>
      </div>
    </div>
  );
}
