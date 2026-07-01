export const USER_ACTIVITY_EVENT_TYPES = [
    'user.created',
    'user.modified',
    'user.deleted',
    'user.revoked',
    'user.disabled',
    'user.enabled',
    'user.limited',
    'user.expired',
    'user.traffic_reset',
    'user.first_connected',
    'user.bandwidth_usage_threshold_reached',
    'user.not_connected',
    'user.expiration',
    'user.subscription_request',
    'user_hwid_devices.added',
    'user_hwid_devices.deleted'
] as const

export type TUserActivityEventType = (typeof USER_ACTIVITY_EVENT_TYPES)[number]
