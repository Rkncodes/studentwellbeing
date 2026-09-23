import type { CampusService } from '../campusServices.js';

export type Urgency = 'low' | 'medium' | 'high' | 'critical';
export type ActionType = 'SELF_SERVICE' | 'STAFF_ASSISTANCE' | 'ESCALATION';

// Mirrors src/models/resolution.ts.
export interface Resolution {
  actionType: ActionType;
  actionRationale: string;
  instructions: string[];
  requiresStaff: boolean;
  caseTitle: string;
  clarifyingQuestions: string[];
}

// Mirrors src/models/triage.ts TriageResult — kept identical so the response
// body needs zero transformation on the frontend.
export interface TriageResult {
  category: string;
  urgency: Urgency;
  suggestedService: CampusService;
  confidence: number;
  rationale: string;
  resolution: Resolution;
}

export interface AIProvider {
  getTriage(description: string, services: CampusService[]): Promise<TriageResult>;
}
