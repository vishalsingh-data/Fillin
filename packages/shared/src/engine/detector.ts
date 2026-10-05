export interface DetectionResult {
  trigger: string;
  start: number;
  end: number;
}

export function detectTrigger(
  text: string,
  cursorPosition: number,
  registeredTriggers: string[]
): DetectionResult | null {
  if (cursorPosition < 0 || cursorPosition > text.length) {
    return null;
  }

  const textBeforeCursor = text.substring(0, cursorPosition);
  
  // Extract the potential trigger right before the cursor
  // It must start with a slash and contain valid trigger characters
  const match = textBeforeCursor.match(/(\/[a-zA-Z0-9_-]+)$/);
  
  if (!match) {
    return null;
  }

  const candidate = match[1];
  const startPos = cursorPosition - candidate.length;

  // Check if it's a registered trigger
  if (!registeredTriggers.includes(candidate)) {
    return null;
  }

  // Check the character before the trigger to ensure word boundary
  if (startPos > 0) {
    const charBefore = textBeforeCursor[startPos - 1];
    // Allow whitespace or punctuation before the trigger
    // Deny alphanumeric characters (e.g. don't trigger in the middle of https://github.com/email)
    const isBoundary = /[\s.,;:!?()[\]{}"'<>]/.test(charBefore);
    
    if (!isBoundary) {
      return null;
    }
  }

  return {
    trigger: candidate,
    start: startPos,
    end: cursorPosition,
  };
}
