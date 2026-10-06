export interface InputAdapter {
  getText(): string;
  getCursorPosition(): number | null;
  replaceText(start: number, end: number, newContent: string, isHtml?: boolean): void;
}
