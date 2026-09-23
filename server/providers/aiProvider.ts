import type { CampusService } from '../campusServices.js';

export type Urgency = 'low' | 'medium' | 'high' | 'critical';

// Mirrors src/models/triage.ts TriageResult — kept identical so the response
// body needs zero transformation on the frontend.
export interface TriageResult {
  category: string;
  urgency: Urgency;
  suggestedService: CampusService;
  confidence: number;
  rationale: string;
}

export interface AIProvider {
  getTriage(description: string, services: CampusService[]): Promise<TriageResult>;
}
