import { describe, it, expect } from 'vitest';
import { snippetSchema } from './snippet';

describe('Snippet Schema Validation', () => {
  const getValidSnippet = () => ({
    id: '123',
    trigger: '/email',
    content: 'test@example.com',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  it('should validate a correct snippet', () => {
    const result = snippetSchema.safeParse(getValidSnippet());
    expect(result.success).toBe(true);
  });

  describe('Trigger Validation', () => {
    const testTrigger = (trigger: string, expectedValid: boolean) => {
      const data = { ...getValidSnippet(), trigger };
      const result = snippetSchema.safeParse(data);
      expect(result.success).toBe(expectedValid);
    };

    it('should allow valid triggers', () => {
      testTrigger('/email', true);
      testTrigger('/github', true);
      testTrigger('/linkedin', true);
      testTrigger('/my_resume', true);
      testTrigger('/my-resume', true);
      testTrigger('/123', true);
      testTrigger('/a', true);
    });

    it('should reject invalid triggers', () => {
      testTrigger('email', false); // missing slash
      testTrigger('/', false); // empty after slash
      testTrigger('hello world', false); // no slash and spaces
      testTrigger('/my trigger', false); // spaces
      testTrigger(' /email', false); // leading space
      testTrigger('/email ', false); // trailing space
      testTrigger('/email@', false); // invalid character
      testTrigger('', false); // empty string
    });
  });

  describe('Other Fields Validation', () => {
    it('should reject empty ID', () => {
      const data = { ...getValidSnippet(), id: '' };
      const result = snippetSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should allow empty content', () => {
      const data = { ...getValidSnippet(), content: '' };
      const result = snippetSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });
});
