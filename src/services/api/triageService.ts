import type { TriageResult } from '../../models/triage';

// Seam for the AI triage layer. Tonight: mockTriageService (keyword rules).
// Tomorrow: a real implementation backed by an AI endpoint or ServiceNow's
// own NLU, satisfying the same interface so the UI never changes.
export interface TriageService {
  triage(description: string): Promise<TriageResult>;
}
