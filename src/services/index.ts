import { mockRequestService } from './mocks/mockRequestService';
import { mockTriageService } from './mocks/mockTriageService';
import { restTriageService } from './rest/restTriageService';
import type { RequestService } from './api/requestService';
import type { TriageService } from './api/triageService';

// If the backend itself is unreachable (not started, crashed mid-demo), fall
// back to the frontend's local keyword mock rather than surfacing an error.
// The backend has its own independent Groq -> mock fallback for when it IS
// reachable but Groq fails; this is the outer safety net.
const resilientTriageService: TriageService = {
  async triage(description) {
    try {
      return await restTriageService.triage(description);
    } catch (err) {
      console.warn('[triage] backend unreachable, using local mock triage:', err);
      return mockTriageService.triage(description);
    }
  },
};

// Single wiring point. Tomorrow: swap requestService for a real
// backend/ServiceNow client — nothing outside this file needs to change.
export const triageService: TriageService = resilientTriageService;
export const requestService: RequestService = mockRequestService;
