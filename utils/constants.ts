// HTTP methods
export const HTTP_METHOD = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE',
    HEAD: 'HEAD',
    OPTIONS: 'OPTIONS',
} as const;

export type HttpMethod = (typeof HTTP_METHOD)[keyof typeof HTTP_METHOD];

// Test timeouts and delays
export const TIMEOUT = {
    SHORT: 5000,
    MEDIUM: 10000,
    LONG: 30000,
    VERY_LONG: 60000,
} as const;

// Retry configuration
export const RETRY = {
    MAX_ATTEMPTS: 3,
    DELAY_MS: 1000,
} as const;

// Common messages
export const MESSAGES = {
    NOT_FOUND: 'Element not found',
    TIMEOUT: 'Operation timed out',
    INVALID_DATA: 'Invalid data provided',
} as const;
