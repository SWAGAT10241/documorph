/**
 * Content Sanitizer & XSS Prevention Utility.
 * Cleans extracted repository metadata, endpoint definitions, and summaries.
 */

/**
 * Escapes potentially dangerous characters to prevent HTML/XSS injection.
 */
export function sanitizeString(input: unknown): string {
  if (typeof input !== 'string') {
    return '';
  }

  let previous: string;
  let sanitized = input;

  do {
    previous = sanitized;
    sanitized = sanitized
      .replace(/javascript:/gi, '') // remove javascript pseudo-protocol
      .replace(/\bon/gi, '&#111;n') // neutralize event-handler attribute prefixes (on*)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .trim();
  } while (sanitized !== previous);

  return sanitized;
}

/**
 * Sanitizes an object deeply, ensuring all string values are cleansed.
 */
export function sanitizeObject<T>(obj: T): T {
  if (!obj || typeof obj !== 'object') {
    if (typeof obj === 'string') {
      return sanitizeString(obj) as unknown as T;
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item)) as unknown as T;
  }

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = sanitizeObject(value);
  }
  return result as T;
}
