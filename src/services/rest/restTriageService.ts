import type { TriageResult } from '../../models/triage';
import type { TriageService } from '../api/triageService';

// Calls the backend triage endpoint (server/index.ts), which internally
// chooses Groq vs mock and handles fallback — this file only knows about
// the HTTP contract, never about providers or API keys.
export const restTriageService: TriageService = {
  async triage(description: string): Promise<TriageResult> {
    const response = await fetch('/api/triage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description }),
    });

    if (!response.ok) {
      throw new Error(`Triage request failed: ${response.status}`);
    }

    return (await response.json()) as TriageResult;
  },
};
