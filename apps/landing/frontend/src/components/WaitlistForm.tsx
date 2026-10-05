import React, { useState } from 'react';
import { apiClient } from '../services/api.client';
import { ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export const WaitlistForm = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === 'loading') return;

    // Basic client-side validation
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      await apiClient.joinWaitlist(email);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      if (err instanceof Error) {
        if (err.message === 'DUPLICATE') {
          setErrorMessage('You are already on the waitlist!');
        } else if (err.message === 'INVALID_EMAIL') {
          setErrorMessage('Please enter a valid email address.');
        } else {
          setErrorMessage('Unable to connect to the server. Please try again.');
        }
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    }
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center space-y-3 bg-green-50 text-green-800 p-6 rounded-2xl border border-green-200 animate-in fade-in slide-in-from-bottom-2">
        <CheckCircle2 className="w-8 h-8 text-green-500" />
        <p className="font-medium text-lg">You&apos;re on the list!</p>
        <p className="text-sm text-green-700">We&apos;ll notify you at {email} when we launch.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === 'error') setStatus('idle');
            }}
            placeholder="Enter your email"
            disabled={status === 'loading'}
            className={`w-full px-5 py-4 bg-white border rounded-full text-base focus:outline-none focus:ring-4 transition-all disabled:opacity-50 ${
              status === 'error'
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                : 'border-gray-200 focus:border-gray-900 focus:ring-gray-900/10'
            }`}
            required
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading' || !email}
          className="flex items-center justify-center space-x-2 bg-black text-white px-8 py-4 rounded-full font-semibold text-base hover:bg-gray-800 transition-all active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <span>Join Waitlist</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
      
      <div className="mt-3 h-6 text-sm flex items-center justify-center">
        {status === 'error' && (
          <span className="flex items-center text-red-600 animate-in fade-in">
            <AlertCircle className="w-4 h-4 mr-1.5" />
            {errorMessage}
          </span>
        )}
      </div>
    </form>
  );
};
