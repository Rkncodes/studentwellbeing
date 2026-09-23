import { CURRENT_STUDENT } from '../../config/currentStudent';
import { generateId } from '../../lib/utils';
import type { RequestStatus, SupportRequest, TimelineEvent } from '../../models/request';
import type { TriageResult } from '../../models/triage';
import type { RequestService } from '../api/requestService';

const STORAGE_KEY = 'studentwellbeing.requests';

function loadAll(): SupportRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SupportRequest[]) : [];
  } catch {
    return [];
  }
}

function saveAll(requests: SupportRequest[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  } catch {
    // Ignore storage failures (e.g. private browsing) — demo state just won't persist.
  }
}

function makeEvent(type: TimelineEvent['type'], label: string, actor: TimelineEvent['actor']): TimelineEvent {
  return {
    id: generateId('evt'),
    timestamp: new Date().toISOString(),
    type,
    label,
    actor,
  };
}

async function withLatency<T>(value: T, ms = 400): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, ms));
  return value;
}

export const mockRequestService: RequestService = {
  async createRequest(description: string, triage: TriageResult): Promise<SupportRequest> {
    const now = new Date().toISOString();
    const request: SupportRequest = {
      id: generateId('req'),
      studentId: CURRENT_STUDENT.id,
      description,
      createdAt: now,
      status: 'routed',
      triage,
      serviceNowCaseId: undefined,
      assignmentGroup: triage.suggestedService.assignmentGroup,
      timeline: [
        makeEvent('created', 'Request submitted by student', 'student'),
        makeEvent('triaged', `AI triage: ${triage.category} / ${triage.urgency} urgency`, 'system'),
        makeEvent('routed', `Routed to ${triage.suggestedService.name} (${triage.suggestedService.assignmentGroup})`, 'system'),
      ],
    };

    const all = loadAll();
    all.unshift(request);
    saveAll(all);

    return withLatency(request);
  },

  async getRequest(id: string): Promise<SupportRequest | undefined> {
    const found = loadAll().find((r) => r.id === id);
    return withLatency(found);
  },

  async listRequests(studentId: string): Promise<SupportRequest[]> {
    const mine = loadAll().filter((r) => r.studentId === studentId);
    return withLatency(mine);
  },

  async updateStatus(id: string, status: RequestStatus, label?: string): Promise<SupportRequest> {
    const all = loadAll();
    const index = all.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new Error(`Request ${id} not found`);
    }

    const updated: SupportRequest = {
      ...all[index],
      status,
      timeline: [
        ...all[index].timeline,
        makeEvent('status_change', label ?? `Status changed to ${status}`, 'staff'),
      ],
    };

    all[index] = updated;
    saveAll(all);

    return withLatency(updated);
  },
};
