/**
 * URL Validator & SSRF Prevention Utility.
 * Strictly verifies and parses GitHub URLs before external fetch calls.
 */

export interface ParsedGitHubUrl {
  owner: string;
  repo: string;
  branch?: string;
  path?: string;
}

const BLOCKED_HOSTS = new Set([
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
  '169.254.169.254', // AWS/GCP metadata service
  'metadata.google.internal',
]);

const PRIVATE_IP_RANGES = [
  /^10\./, // 10.0.0.0/8
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // 172.16.0.0/12
  /^192\.168\./, // 192.168.0.0/16
  /^127\./, // 127.0.0.0/8
  /^fc00:/i, // IPv6 Unique Local Address
  /^fe80:/i, // IPv6 Link-Local
];

/**
 * Validates a GitHub URL against SSRF vulnerabilities and returns parsed components.
 */
export function validateAndParseGitHubUrl(rawUrl: string): {
  valid: boolean;
  error?: string;
  parsed?: ParsedGitHubUrl;
} {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { valid: false, error: 'URL must be a non-empty string.' };
  }

  // Reject URLs that are too long
  if (rawUrl.length > 500) {
    return { valid: false, error: 'URL exceeds maximum allowed length of 500 characters.' };
  }

  let urlObj: URL;
  try {
    urlObj = new URL(rawUrl.trim());
  } catch {
    return { valid: false, error: 'Invalid URL format.' };
  }

  // Enforce HTTPS
  if (urlObj.protocol !== 'https:') {
    return { valid: false, error: 'Only HTTPS protocol is permitted.' };
  }

  const hostname = urlObj.hostname.toLowerCase();

  // SSRF Check 1: Disallow userinfo (e.g. user:pass@host)
  if (urlObj.username || urlObj.password) {
    return { valid: false, error: 'URLs with embedded credentials are not allowed.' };
  }

  // SSRF Check 2: Block prohibited hosts & metadata endpoints
  if (BLOCKED_HOSTS.has(hostname)) {
    return { valid: false, error: 'Target host is prohibited for security reasons.' };
  }

  // SSRF Check 3: Block private/local IP address ranges
  for (const regex of PRIVATE_IP_RANGES) {
    if (regex.test(hostname)) {
      return { valid: false, error: 'Requests to private IP addresses are prohibited.' };
    }
  }

  // Hostname must be strictly github.com or api.github.com
  if (hostname !== 'github.com' && hostname !== 'raw.githubusercontent.com') {
    return { valid: false, error: 'Only public repositories on github.com are supported.' };
  }

  // Parse path: /owner/repo/...
  const segments = urlObj.pathname.split('/').filter(Boolean);
  if (segments.length < 2) {
    return { valid: false, error: 'URL must point to a valid repository path (e.g., https://github.com/owner/repo).' };
  }

  const owner = segments[0];
  const repo = segments[1].replace(/\.git$/i, '');

  // Sanitize owner and repo identifiers (standard GitHub naming conventions)
  const identifierRegex = /^[a-zA-Z0-9_.-]+$/;
  if (!identifierRegex.test(owner) || !identifierRegex.test(repo)) {
    return { valid: false, error: 'Invalid repository owner or name characters.' };
  }

  let branch: string | undefined;
  let path: string | undefined;

  // Optional: /owner/repo/blob/branch/path/to/file
  if (segments.length >= 4 && (segments[2] === 'blob' || segments[2] === 'tree')) {
    branch = segments[3];
    path = segments.slice(4).join('/');
  }

  return {
    valid: true,
    parsed: {
      owner,
      repo,
      branch,
      path,
    },
  };
}
