import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/security/rateLimiter';
import { validateAndParseGitHubUrl } from '@/lib/security/urlValidator';
import { ingestGitHubRepo } from '@/lib/ingest/githubIngestor';

// Strict Zod Schema for Ingestion Request
const IngestRequestSchema = z.object({
  repoUrl: z
    .string({
      error: 'Repository URL is required.',
    })
    .url('Must be a valid URL format.')
    .max(500, 'URL exceeds maximum length of 500 characters.'),
});

export async function POST(req: NextRequest) {
  const timestamp = new Date().toISOString();

  // 1. Client IP Extraction & Rate Limiting (10 requests per minute per IP)
  const forwardedFor = req.headers.get('x-forwarded-for');
  const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

  const rateLimit = checkRateLimit(clientIp, 10, 60000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: `Too many ingestion requests. Please try again in ${rateLimit.resetInSeconds} seconds.`,
        },
        timestamp,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateLimit.resetInSeconds),
          'X-RateLimit-Limit': String(rateLimit.limit),
          'X-RateLimit-Remaining': String(rateLimit.remaining),
        },
      }
    );
  }

  // 2. Parse and Validate Request Body with Zod
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INVALID_JSON',
          message: 'Request body must be valid JSON.',
        },
        timestamp,
      },
      { status: 400 }
    );
  }

  const parseResult = IngestRequestSchema.safeParse(body);
  if (!parseResult.success) {
    const errorMessages = parseResult.error.issues.map((i) => i.message).join('; ');
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: errorMessages,
        },
        timestamp,
      },
      { status: 400 }
    );
  }

  const { repoUrl } = parseResult.data;

  // 3. SSRF & Target Whitelist Validation
  const urlCheck = validateAndParseGitHubUrl(repoUrl);
  if (!urlCheck.valid || !urlCheck.parsed) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SECURITY_VALIDATION_FAILED',
          message: urlCheck.error || 'The requested URL failed security validation.',
        },
        timestamp,
      },
      { status: 400 }
    );
  }

  const { owner, repo } = urlCheck.parsed;

  // 4. Ingest and Synthesize Living Architecture
  try {
    const template = await ingestGitHubRepo(owner, repo, { timeoutMs: 8000 });

    return NextResponse.json(
      {
        success: true,
        data: template,
        timestamp,
      },
      {
        status: 200,
        headers: {
          'X-RateLimit-Limit': String(rateLimit.limit),
          'X-RateLimit-Remaining': String(rateLimit.remaining),
        },
      }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to ingest repository.';
    const isNotFound = message.includes('not found') || message.includes('private');
    const isRateLimited = message.includes('rate limit');

    return NextResponse.json(
      {
        success: false,
        error: {
          code: isNotFound ? 'REPO_NOT_FOUND' : isRateLimited ? 'GITHUB_RATE_LIMIT' : 'INGEST_FAILED',
          message,
        },
        timestamp,
      },
      { status: isNotFound ? 404 : isRateLimited ? 429 : 500 }
    );
  }
}
