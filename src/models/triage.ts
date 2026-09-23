import type { CampusService } from './service';

export type Urgency = 'low' | 'medium' | 'high' | 'critical';

export interface TriageResult {
  category: string;
  urgency: Urgency;
  suggestedService: CampusService;
  confidence: number; // 0-1
  rationale: string;
}
