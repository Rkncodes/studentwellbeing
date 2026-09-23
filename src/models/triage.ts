import type { CampusService } from './service';
import type { Resolution } from './resolution';

export type Urgency = 'low' | 'medium' | 'high' | 'critical';

export interface TriageResult {
  category: string;
  urgency: Urgency;
  suggestedService: CampusService;
  confidence: number; // 0-1
  rationale: string;
  resolution: Resolution;
}
