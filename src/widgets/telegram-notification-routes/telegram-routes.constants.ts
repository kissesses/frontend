import {
    TELEGRAM_FORUM_TOPIC_NAMES,
    TELEGRAM_NOTIFICATION_ROUTE_CATEGORIES,
    TTelegramNotificationRouteCategory
} from '@kissesses/backend-contract'

export const TELEGRAM_ROUTE_CATEGORY_LABELS: Record<TTelegramNotificationRouteCategory, string> = {
    users: 'telegram-routes.widget.category.users',
    nodes: 'telegram-routes.widget.category.nodes',
    crm: 'telegram-routes.widget.category.crm',
    service: 'telegram-routes.widget.category.service',
    tblocker: 'telegram-routes.widget.category.tblocker',
    backup: 'telegram-routes.widget.category.backup',
    backupSecrets: 'telegram-routes.widget.category.backup-secrets'
}

export const TELEGRAM_ROUTE_CATEGORY_DESCRIPTIONS: Record<
    TTelegramNotificationRouteCategory,
    string
> = {
    users: 'telegram-routes.widget.category.users-description',
    nodes: 'telegram-routes.widget.category.nodes-description',
    crm: 'telegram-routes.widget.category.crm-description',
    service: 'telegram-routes.widget.category.service-description',
    tblocker: 'telegram-routes.widget.category.tblocker-description',
    backup: 'telegram-routes.widget.category.backup-description',
    backupSecrets: 'telegram-routes.widget.category.backup-secrets-description'
}

export const TELEGRAM_ROUTE_TOPIC_FIELD: Record<
    TTelegramNotificationRouteCategory,
    `${TTelegramNotificationRouteCategory}TopicId`
> = {
    users: 'usersTopicId',
    nodes: 'nodesTopicId',
    crm: 'crmTopicId',
    service: 'serviceTopicId',
    tblocker: 'tblockerTopicId',
    backup: 'backupTopicId',
    backupSecrets: 'backupSecretsTopicId'
}

export { TELEGRAM_FORUM_TOPIC_NAMES, TELEGRAM_NOTIFICATION_ROUTE_CATEGORIES }
