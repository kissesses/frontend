import { TStealthDecoyId } from '@kissesses/backend-contract';

export type StealthDecoyGroupId =
    | 'errors'
    | 'hosting'
    | 'protection'
    | 'cloud'
    | 'gaming_pages'
    | 'cms'
    | 'placeholder'
    | 'games';

export type StealthDecoyKind = 'page' | 'game';

export interface StealthDecoyMeta {
    group: StealthDecoyGroupId;
    id: TStealthDecoyId;
    kind: StealthDecoyKind;
    labelKey: string;
    status?: string;
}

const page = (
    group: StealthDecoyGroupId,
    id: TStealthDecoyId,
    labelKey: string,
    status?: string
): StealthDecoyMeta => ({
    group,
    id,
    kind: 'page',
    labelKey,
    status
});

const game = (id: TStealthDecoyId, labelKey: string): StealthDecoyMeta => ({
    group: 'games',
    id,
    kind: 'game',
    labelKey
});

export const STEALTH_DECOY_REGISTRY: StealthDecoyMeta[] = [
    page('errors', '502_nginx', 'stealth-login.decoys.502-nginx', '502'),
    page('errors', '404', 'stealth-login.decoys.404', '404'),
    page('errors', '503', 'stealth-login.decoys.503', '503'),
    page('errors', '401', 'stealth-login.decoys.401', '401'),
    page('errors', '500', 'stealth-login.decoys.500', '500'),
    page('errors', '429', 'stealth-login.decoys.429', '429'),
    page('errors', 'maintenance', 'stealth-login.decoys.maintenance', '503'),
    page('hosting', 'host_cloudflare_522', 'stealth-login.decoys.cf-522', '522'),
    page('hosting', 'host_cloudflare_521', 'stealth-login.decoys.cf-521', '521'),
    page('hosting', 'host_apache_403', 'stealth-login.decoys.apache-403', '403'),
    page('hosting', 'host_nginx_welcome', 'stealth-login.decoys.nginx-welcome', '200'),
    page('hosting', 'host_iis_404', 'stealth-login.decoys.iis-404', '404'),
    page('hosting', 'host_litespeed', 'stealth-login.decoys.litespeed', '200'),
    page('cms', 'cms_wordpress', 'stealth-login.decoys.wordpress', '200'),
    page('cms', 'cms_parked', 'stealth-login.decoys.parked', '200'),
    page('cms', 'cms_joomla', 'stealth-login.decoys.joomla', '200'),
    page('cms', 'cms_directory', 'stealth-login.decoys.directory', '200'),
    page('cms', 'cms_registrar', 'stealth-login.decoys.registrar', '200'),
    page('placeholder', 'stub_coming_soon', 'stealth-login.decoys.coming-soon', '200'),
    page('placeholder', 'stub_construction', 'stealth-login.decoys.construction', '200'),
    page('placeholder', 'stub_blank', 'stealth-login.decoys.blank', '200'),
    page('placeholder', 'stub_ru_soon', 'stealth-login.decoys.ru-soon', '200'),
    page('placeholder', 'stub_ru_maintenance', 'stealth-login.decoys.ru-maintenance', '200'),
    page('placeholder', 'stub_intranet', 'stealth-login.decoys.intranet', '200'),
    page('placeholder', 'stub_loading', 'stealth-login.decoys.loading', '200'),
    page('protection', 'waf_ddosguard_check', 'stealth-login.decoys.ddosguard-check', '200'),
    page('protection', 'waf_ddosguard_ru', 'stealth-login.decoys.ddosguard-ru', '200'),
    page('protection', 'waf_ip_blocked', 'stealth-login.decoys.ip-blocked', '403'),
    page('protection', 'waf_under_attack', 'stealth-login.decoys.under-attack', '200'),
    page('cloud', 'cloud_instance_boot', 'stealth-login.decoys.instance-boot', '200'),
    page('cloud', 'cloud_k8s_pending', 'stealth-login.decoys.k8s-pending', '200'),
    page('cloud', 'cloud_storage_empty', 'stealth-login.decoys.storage-empty', '200'),
    page('cloud', 'cloud_console_signin', 'stealth-login.decoys.console-signin', '200'),
    page('cloud', 'cloud_docker_hub', 'stealth-login.decoys.docker-hub', '200'),
    page('gaming_pages', 'game_server_offline', 'stealth-login.decoys.server-offline', '503'),
    page('gaming_pages', 'game_maintenance', 'stealth-login.decoys.game-maintenance', '503'),
    page('gaming_pages', 'game_matchmaking', 'stealth-login.decoys.matchmaking', '200'),
    page('gaming_pages', 'game_launcher_update', 'stealth-login.decoys.launcher-update', '200'),
    page('gaming_pages', 'game_ru_server', 'stealth-login.decoys.ru-server', '503'),
    page('gaming_pages', 'game_studio', 'stealth-login.decoys.game-studio', '200'),
    game('game_snake', 'stealth-login.decoys.snake'),
    game('game_memory', 'stealth-login.decoys.memory'),
    game('game_pong', 'stealth-login.decoys.pong'),
    game('game_tictactoe', 'stealth-login.decoys.tictactoe'),
    game('game_breakout', 'stealth-login.decoys.breakout'),
    game('game_2048', 'stealth-login.decoys.2048'),
    game('game_minesweeper', 'stealth-login.decoys.minesweeper'),
    game('game_simon', 'stealth-login.decoys.simon'),
    game('game_flappy', 'stealth-login.decoys.flappy'),
    game('game_reaction', 'stealth-login.decoys.reaction'),
    game('game_whack', 'stealth-login.decoys.whack'),
    game('game_dino', 'stealth-login.decoys.dino'),
    game('game_guess', 'stealth-login.decoys.guess'),
    game('game_tetris', 'stealth-login.decoys.tetris')
];

export const STEALTH_DECOY_BY_ID = Object.fromEntries(
    STEALTH_DECOY_REGISTRY.map((item) => [item.id, item])
) as Record<TStealthDecoyId, StealthDecoyMeta>;

export const STEALTH_DECOY_GROUP_ORDER: StealthDecoyGroupId[] = [
    'errors',
    'hosting',
    'protection',
    'cloud',
    'gaming_pages',
    'cms',
    'placeholder',
    'games'
];

export const STEALTH_DECOY_GROUP_LABEL_KEYS: Record<StealthDecoyGroupId, string> = {
    errors: 'stealth-login.groups.errors',
    hosting: 'stealth-login.groups.hosting',
    protection: 'stealth-login.groups.protection',
    cloud: 'stealth-login.groups.cloud',
    gaming_pages: 'stealth-login.groups.gaming-pages',
    cms: 'stealth-login.groups.cms',
    placeholder: 'stealth-login.groups.placeholder',
    games: 'stealth-login.groups.games'
};

export const STEALTH_UNLOCK_SESSION_KEY = 'rw_stealth_login_unlocked';
