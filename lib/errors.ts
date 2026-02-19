/**
 * Centralized error reporting utility.
 *
 * In development, errors are logged to the console.
 * In production, this is the integration point for external error
 * tracking services (e.g., Sentry, Datadog, LogRocket).
 *
 * To integrate Sentry, install `@sentry/nextjs` and replace the
 * production branch with `Sentry.captureException(error, { extra: { context } })`.
 */
export function reportError(error: unknown, context?: string): void {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`[${context ?? 'App'}]`, error);
    return;
  }

  // Production: replace with your error tracking service.
  // e.g. Sentry.captureException(error, { extra: { context } });
  console.error(`[${context ?? 'App'}]`, error instanceof Error ? error : String(error));
}
