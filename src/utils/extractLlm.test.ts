import { describe, it, expect, beforeEach } from 'vitest';
import { runExtraction } from '../../lib/extractLlm';

describe('runExtraction (shared by Express and Vercel)', () => {
  beforeEach(() => {
    delete process.env.GEMINI_API_KEY;
  });

  it('answers 503 (demo) when no API key is configured', async () => {
    const r = await runExtraction({ text: 'Pb: 10 mg/kg' }, 'test-ip-503');
    expect(r.status).toBe(503);
    expect(r.body.demo).toBe(true);
  });

  it('rate limits a single IP after 30 requests per minute', async () => {
    let last = 0;
    for (let i = 0; i < 31; i++) {
      last = (await runExtraction({ text: 'x' }, 'test-ip-rate')).status;
    }
    expect(last).toBe(429);
  });

  it('does not keep a broken newline regex for file names', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const src = fs.readFileSync(path.resolve(__dirname, '../../lib/extractLlm.ts'), 'utf-8');
    expect(src).toContain('replace(/[\\r\\n"]/g');
  });
});
