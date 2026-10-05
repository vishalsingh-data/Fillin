import { describe, it, expect } from 'vitest';
import { replaceTrigger } from './replacer';
import { DetectionResult } from './detector';

describe('Trigger Replacer', () => {
  it('replaces trigger at the beginning of text', () => {
    const text = '/email';
    const detection: DetectionResult = { trigger: '/email', start: 0, end: 6 };
    const content = 'test@example.com';
    
    const result = replaceTrigger(text, detection, content);
    
    expect(result.text).toBe('test@example.com');
    expect(result.cursorPosition).toBe(16);
  });

  it('replaces trigger in the middle of text', () => {
    const text = 'Send to /email immediately.';
    const detection: DetectionResult = { trigger: '/email', start: 8, end: 14 };
    const content = 'test@example.com';
    
    const result = replaceTrigger(text, detection, content);
    
    expect(result.text).toBe('Send to test@example.com immediately.');
    expect(result.cursorPosition).toBe(24);
  });

  it('replaces trigger at the end of text', () => {
    const text = 'Hello /email';
    const detection: DetectionResult = { trigger: '/email', start: 6, end: 12 };
    const content = 'test@example.com';
    
    const result = replaceTrigger(text, detection, content);
    
    expect(result.text).toBe('Hello test@example.com');
    expect(result.cursorPosition).toBe(22);
  });

  it('handles multiline content replacement correctly', () => {
    const text = 'Here is /sig';
    const detection: DetectionResult = { trigger: '/sig', start: 8, end: 12 };
    const content = 'Thanks,\nJohn Doe\nCEO';
    
    const result = replaceTrigger(text, detection, content);
    
    expect(result.text).toBe('Here is Thanks,\nJohn Doe\nCEO');
    expect(result.cursorPosition).toBe(28);
  });

  it('preserves surrounding text accurately', () => {
    const text = 'A /b C';
    const detection: DetectionResult = { trigger: '/b', start: 2, end: 4 };
    const content = 'B';
    
    const result = replaceTrigger(text, detection, content);
    
    expect(result.text).toBe('A B C');
    expect(result.cursorPosition).toBe(3);
  });

  it('handles empty replacement content safely', () => {
    const text = 'Delete /this please';
    const detection: DetectionResult = { trigger: '/this', start: 7, end: 12 };
    const content = '';
    
    const result = replaceTrigger(text, detection, content);
    
    expect(result.text).toBe('Delete  please');
    expect(result.cursorPosition).toBe(7);
  });
});
