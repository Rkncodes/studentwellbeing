import { z } from 'zod';
import { CAMPUS_SERVICES } from './campusServices.js';

const SERVICE_IDS = CAMPUS_SERVICES.map((s) => s.id) as [string, ...string[]];

// What we accept back from any provider (Groq or mock) before we trust it.
// The provider only ever supplies a serviceId — the full CampusService object
// is re-hydrated server-side from our own catalog, never taken from the model.
export const ProviderTriageSchema = z.object({
  serviceId: z.enum(SERVICE_IDS),
  urgency: z.enum(['low', 'medium', 'high', 'critical']),
  confidence: z.number().min(0).max(1),
  rationale: z.string().min(1).max(500),
});

export type ProviderTriageOutput = z.infer<typeof ProviderTriageSchema>;

// The Groq Structured Outputs JSON Schema — kept in sync with ProviderTriageSchema.
// `strict: true` requires: every property in `required`, no extra keywords beyond
// what Groq's structured-output subset supports, and additionalProperties: false.
export function buildTriageJsonSchema() {
  return {
    type: 'object',
    properties: {
      serviceId: {
        type: 'string',
        enum: SERVICE_IDS,
        description: 'The id of the single best-matching campus service from the allowed list.',
      },
      urgency: {
        type: 'string',
        enum: ['low', 'medium', 'high', 'critical'],
        description: 'How urgently the student needs a response.',
      },
      confidence: {
        type: 'number',
        description:
          "The model's own subjective confidence estimate between 0 and 1 for this classification. This is a self-reported estimate, not a measured probability.",
      },
      rationale: {
        type: 'string',
        description: 'A one or two sentence explanation for the chosen service and urgency.',
      },
    },
    required: ['serviceId', 'urgency', 'confidence', 'rationale'],
    additionalProperties: false,
  } as const;
}
