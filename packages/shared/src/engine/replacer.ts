import { DetectionResult } from './detector';

export interface ReplacementResult {
  text: string;
  cursorPosition: number;
}

export function replaceTrigger(
  originalText: string,
  detection: DetectionResult,
  replacementContent: string
): ReplacementResult {
  const before = originalText.substring(0, detection.start);
  const after = originalText.substring(detection.end);
  
  const newText = before + replacementContent + after;
  const newCursor = before.length + replacementContent.length;
  
  return {
    text: newText,
    cursorPosition: newCursor
  };
}
