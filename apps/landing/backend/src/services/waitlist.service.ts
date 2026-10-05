import { WaitlistDto } from '../schemas/waitlist.schema';

export class WaitlistService {
  // In a real app, this would use a database
  private static waitlist: Set<string> = new Set();

  static async join(dto: WaitlistDto): Promise<void> {
    if (this.waitlist.has(dto.email)) {
      throw new Error('Email already in waitlist');
    }
    
    // Simulate async DB operation
    await new Promise(resolve => setTimeout(resolve, 50));
    
    this.waitlist.add(dto.email);
  }

  // Used for testing to clear state
  static reset(): void {
    this.waitlist.clear();
  }
}
