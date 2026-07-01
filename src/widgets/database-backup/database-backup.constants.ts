import {
    DATABASE_BACKUP_SCHEDULE_PRESETS,
    DATABASE_BACKUP_SCHEDULE_CRON,
    TDatabaseBackupSchedulePreset
} from '@remnawave/backend-contract'

export const DATABASE_BACKUP_SCHEDULE_LABELS: Record<TDatabaseBackupSchedulePreset, string> = {
    every_6h: 'database-backup.widget.schedule.every-6h',
    every_12h: 'database-backup.widget.schedule.every-12h',
    daily_0300: 'database-backup.widget.schedule.daily-0300',
    daily_0600: 'database-backup.widget.schedule.daily-0600',
    daily_1200: 'database-backup.widget.schedule.daily-1200',
    daily_1800: 'database-backup.widget.schedule.daily-1800',
    weekly_mon_0300: 'database-backup.widget.schedule.weekly-mon-0300',
    weekly_wed_0300: 'database-backup.widget.schedule.weekly-wed-0300',
    weekly_fri_0300: 'database-backup.widget.schedule.weekly-fri-0300',
    weekly_sun_0400: 'database-backup.widget.schedule.weekly-sun-0400',
    monthly_1st_0300: 'database-backup.widget.schedule.monthly-1st-0300',
    custom: 'database-backup.widget.schedule.custom'
}

export { DATABASE_BACKUP_SCHEDULE_PRESETS, DATABASE_BACKUP_SCHEDULE_CRON }
