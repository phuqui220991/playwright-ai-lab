import { RETRY } from '@utils/constants';

// Retry helper for flaky operations
export async function retryAsync<T>(
    fn: () => Promise<T>,
    maxAttempts: number = RETRY.MAX_ATTEMPTS,
    delayMs: number = RETRY.DELAY_MS,
): Promise<T> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (error) {
            if (attempt === maxAttempts) throw error;
            await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
    }
    throw new Error('Max attempts exceeded');
}
