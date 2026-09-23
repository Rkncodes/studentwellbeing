import Groq from 'groq-sdk';
import type { CampusService } from '../campusServices.js';
import type { AIProvider, TriageResult } from './aiProvider.js';
import { ProviderTriageSchema, buildTriageJsonSchema } from '../triageSchema.js';
import { buildResolution } from '../resolution.js';

const DEFAULT_MODEL = 'openai/gpt-oss-20b';
const REQUEST_TIMEOUT_MS = 9000;

function buildPrompt(description: string, services: CampusService[]): string {
  const catalog = services
    .map((s) => `- id: "${s.id}" | name: "${s.name}" | category: "${s.category}" | description: "${s.description}"`)
    .join('\n');

  return [
    'You are a triage assistant for a university student support system.',
    'A student has submitted a free-text support request. Classify it against the campus service catalog below.',
    '',
    'Rules:',
    '- You MUST choose exactly one serviceId from the catalog. Never invent a service id or name.',
    '- Judge urgency conservatively but flag genuine crisis language (self-harm, safety threats) as "critical".',
    '- confidence is your own subjective estimate (0-1) of how well the request matches the chosen service, not a measured probability.',
    '- rationale should be a short, student-readable explanation.',
    '- actionType: choose SELF_SERVICE only if the student can reasonably act on this themselves right now (e.g. a routine account/password issue). Choose STAFF_ASSISTANCE if a staff member needs to act. Choose ESCALATION for high/critical urgency situations needing urgent attention.',
    '- actionRationale must only restate/interpret what the student wrote. Do NOT state specific institutional procedures, phone numbers, emails, URLs, office hours, or policies — you do not have verified access to those and must not invent them.',
    '- caseTitle: a short, neutral, under-10-word summary suitable as a support case title.',
    '- clarifyingQuestions: only include questions if your own confidence is below 0.6; otherwise return an empty array.',
    '',
    'Campus service catalog:',
    catalog,
    '',
    `Student request: "${description}"`,
  ].join('\n');
}

export function createGroqProvider(apiKey: string, model = DEFAULT_MODEL): AIProvider {
  const client = new Groq({ apiKey });

  return {
    async getTriage(description: string, services: CampusService[]): Promise<TriageResult> {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      try {
        const completion = await client.chat.completions.create(
          {
            model,
            messages: [{ role: 'user', content: buildPrompt(description, services) }],
            response_format: {
              type: 'json_schema',
              json_schema: {
                name: 'triage_result',
                strict: true,
                schema: buildTriageJsonSchema(),
              },
            },
          },
          { signal: controller.signal },
        );

        const raw = completion.choices[0]?.message?.content;
        if (!raw) {
          throw new Error('Groq response had no message content');
        }

        const parsed = ProviderTriageSchema.parse(JSON.parse(raw));

        const service = services.find((s) => s.id === parsed.serviceId);
        if (!service) {
          // Should be unreachable given the schema enum, but never trust it blindly.
          throw new Error(`Groq returned unknown serviceId: ${parsed.serviceId}`);
        }

        return {
          category: service.category,
          urgency: parsed.urgency,
          suggestedService: service,
          confidence: parsed.confidence,
          rationale: parsed.rationale,
          resolution: buildResolution(service, parsed.urgency, {
            actionType: parsed.actionType,
            actionRationale: parsed.actionRationale,
            caseTitle: parsed.caseTitle,
            clarifyingQuestions: parsed.clarifyingQuestions,
          }),
        };
      } finally {
        clearTimeout(timeout);
      }
    },
  };
}
