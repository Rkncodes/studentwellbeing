import 'dotenv/config';
import express from 'express';
import { CAMPUS_SERVICES } from './campusServices.js';
import { mockProvider } from './providers/mockProvider.js';
import { createGroqProvider } from './providers/groqProvider.js';
import type { AIProvider } from './providers/aiProvider.js';

const PORT = Number(process.env.PORT ?? 8787);
const TRIAGE_PROVIDER = process.env.TRIAGE_PROVIDER ?? (process.env.GROQ_API_KEY ? 'groq' : 'mock');
const TRIAGE_MODEL = process.env.TRIAGE_MODEL || undefined;

function resolveConfiguredProvider(): { provider: AIProvider; label: string } {
  if (TRIAGE_PROVIDER === 'groq') {
    if (!process.env.GROQ_API_KEY) {
      console.warn(
        '[triage] TRIAGE_PROVIDER=groq but GROQ_API_KEY is not set — falling back to mock provider. See .env.example.',
      );
      return { provider: mockProvider, label: 'mock (no GROQ_API_KEY)' };
    }
    return { provider: createGroqProvider(process.env.GROQ_API_KEY, TRIAGE_MODEL), label: `groq (${TRIAGE_MODEL ?? 'default model'})` };
  }
  return { provider: mockProvider, label: 'mock' };
}

const { provider: configuredProvider, label: providerLabel } = resolveConfiguredProvider();
console.log(`[triage] configured provider: ${providerLabel}`);

const app = express();
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, provider: providerLabel });
});

app.post('/api/triage', async (req, res) => {
  const description = typeof req.body?.description === 'string' ? req.body.description.trim() : '';

  if (description.length < 10) {
    res.status(400).json({ error: 'description must be at least 10 characters' });
    return;
  }

  try {
    const result = await configuredProvider.getTriage(description, CAMPUS_SERVICES);
    res.json(result);
    return;
  } catch (err) {
    if (configuredProvider === mockProvider) {
      console.error('[triage] mock provider threw unexpectedly:', err);
      res.status(500).json({ error: 'triage failed' });
      return;
    }

    console.error('[triage] configured provider failed, falling back to mock:', err instanceof Error ? err.message : err);
    try {
      const fallbackResult = await mockProvider.getTriage(description, CAMPUS_SERVICES);
      res.json(fallbackResult);
    } catch (fallbackErr) {
      console.error('[triage] mock fallback also failed:', fallbackErr);
      res.status(500).json({ error: 'triage failed' });
    }
  }
});

app.listen(PORT, () => {
  console.log(`[triage] server listening on http://localhost:${PORT}`);
});
