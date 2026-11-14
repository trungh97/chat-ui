export const DEFAULT_DEBOUNCE_TIME = 500

/**
 * How often the app tells the server the user is still here. It must stay below the
 * backend's offline threshold (PRESENCE_OFFLINE_THRESHOLD_SECONDS, 90s), or active users
 * are shown offline. The backend mirrors this value as PRESENCE_HEARTBEAT_INTERVAL_SECONDS.
 */
export const PRESENCE_HEARTBEAT_INTERVAL_MS = 30_000

/** Wait before the first heartbeat. Connecting the WebSocket already marks the user online. */
export const PRESENCE_FIRST_HEARTBEAT_DELAY_MS = 10_000
