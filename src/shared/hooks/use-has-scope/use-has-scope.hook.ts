/**
 * Admin browser sessions (httpOnly cookie) have full panel access.
 * API-token scope checks apply only to programmatic Bearer clients.
 */
export function useHasScope(_scope: string): boolean {
    return true
}
