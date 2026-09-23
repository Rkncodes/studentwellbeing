import type { TriageResult } from './triage';

export type RequestStatus =
  | 'submitted'
  | 'triaged'
  | 'routed'
  | 'in_progress'
  | 'resolved'
  | 'closed';

export type TimelineEventType = 'created' | 'triaged' | 'routed' | 'status_change' | 'note';

export interface TimelineEvent {
  id: string;
  timestamp: string;
  type: TimelineEventType;
  label: string;
  actor: 'student' | 'system' | 'staff';
}

export interface SupportRequest {
  id: string;
  studentId: string;
  description: string;
  createdAt: string;
  status: RequestStatus;
  triage?: TriageResult;
  // Populated once the ServiceNow integration exists; null/undefined until then.
  serviceNowCaseId?: string;
  assignmentGroup?: string;
  timeline: TimelineEvent[];
}
