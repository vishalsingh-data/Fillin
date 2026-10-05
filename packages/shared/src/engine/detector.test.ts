import { describe, it, expect } from 'vitest';
import { detectTrigger } from './detector';

describe('Trigger Detector', () => {
  const triggers = ['/email', '/github', '/linkedin', '/sig', '/my-resume'];

  describe('valid detections', () => {
    it('detects trigger at the beginning of text', () => {
      const text = '/email';
      const result = detectTrigger(text, text.length, triggers);
      expect(result).toEqual({ trigger: '/email', start: 0, end: 6 });
    });

    it('detects trigger after whitespace', () => {
      const text = 'Hello /github';
      const result = detectTrigger(text, text.length, triggers);
      expect(result).toEqual({ trigger: '/github', start: 6, end: 13 });
    });

    it('detects trigger after newline', () => {
      const text = 'Line 1\n/email';
      const result = detectTrigger(text, text.length, triggers);
      expect(result).toEqual({ trigger: '/email', start: 7, end: 13 });
    });

    it('detects trigger after punctuation', () => {
      const text = 'Contact me (/linkedin)';
      const cursor = text.indexOf(')');
      const result = detectTrigger(text, cursor, triggers);
      expect(result).toEqual({ trigger: '/linkedin', start: 12, end: 21 });
    });

    it('detects trigger in the middle of text when cursor is right after it', () => {
      const text = 'Send to /email immediately.';
      const cursor = text.indexOf(' immediately');
      const result = detectTrigger(text, cursor, triggers);
      expect(result).toEqual({ trigger: '/email', start: 8, end: 14 });
    });

    it('detects multiple occurrences, picking the one before the cursor', () => {
      const text = '/email and another /email';
      const result = detectTrigger(text, text.length, triggers);
      expect(result).toEqual({ trigger: '/email', start: 19, end: 25 });
    });

    it('handles triggers with hyphens', () => {
      const text = 'Here is /my-resume';
      const result = detectTrigger(text, text.length, triggers);
      expect(result).toEqual({ trigger: '/my-resume', start: 8, end: 18 });
    });
  });

  describe('invalid detections (should return null)', () => {
    it('returns null if no trigger is present', () => {
      const text = 'Hello world';
      expect(detectTrigger(text, text.length, triggers)).toBeNull();
    });

    it('returns null if cursor is not immediately after the trigger', () => {
      const text = '/email ';
      expect(detectTrigger(text, text.length, triggers)).toBeNull();
    });

    it('returns null if trigger is part of a URL (no boundary)', () => {
      const text = 'https://example.com/email';
      expect(detectTrigger(text, text.length, triggers)).toBeNull();
    });

    it('returns null if trigger is part of a word (no boundary)', () => {
      const text = 'this/email';
      expect(detectTrigger(text, text.length, triggers)).toBeNull();
    });

    it('returns null if the trigger is not registered', () => {
      const text = '/unknown';
      expect(detectTrigger(text, text.length, triggers)).toBeNull();
    });

    it('returns null if cursor position is invalid', () => {
      const text = '/email';
      expect(detectTrigger(text, -1, triggers)).toBeNull();
      expect(detectTrigger(text, 100, triggers)).toBeNull();
    });
  });
});
