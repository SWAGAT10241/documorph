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

  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // remove script tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // remove iframe tags
    .replace(/javascript:/gi, '') // remove javascript pseudo-protocol
    .replace(/on\w+\s*=/gi, '') // remove event handlers like onload=, onclick=
    .replace(/[<>]/g, (char) => (char === '<' ? '&lt;' : '&gt;')) // escape remaining brackets
    .trim();
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
