import type { RequestStatus, SupportRequest } from '../../models/request';
import type { TriageResult } from '../../models/triage';

// Seam for case creation/tracking. Tonight: mockRequestService (in-memory +
// localStorage). Tomorrow: a backend-proxied ServiceNow Table API client,
// satisfying the same interface so the UI never changes.
export interface RequestService {
  createRequest(description: string, triage: TriageResult): Promise<SupportRequest>;
  getRequest(id: string): Promise<SupportRequest | undefined>;
  listRequests(studentId: string): Promise<SupportRequest[]>;
  updateStatus(id: string, status: RequestStatus, label?: string): Promise<SupportRequest>;
}
