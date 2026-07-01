import { TStealthDecoyId } from '@kissesses/backend-contract';

const BASE_STYLE =
    'body{margin:0;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#fff;color:#222;line-height:1.5}a{color:inherit}';

const center = (title: string, subtitle?: string, footer = 'nginx/1.24.0 (Ubuntu)') =>
    `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${title}</title><style>${BASE_STYLE}</style></head><body><center style="padding:3rem 1rem"><h1>${title}</h1>${subtitle ? `<p style="color:#666">${subtitle}</p>` : ''}</center><hr><center>${footer}</center></body></html>`;

const darkPage = (title: string, body: string) =>
    `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${title}</title><style>body{margin:0;font-family:system-ui,sans-serif;background:#0f1115;color:#e8eaed;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:2rem;text-align:center}</style></head><body>${body}</body></html>`;

export const STEALTH_PAGE_HTML: Partial<Record<TStealthDecoyId, string>> = {
    '502_nginx': center('502 Bad Gateway'),
    '404': center('404 Not Found'),
    '503': center('503 Service Unavailable'),
    '401': center(
        '401 Unauthorized',
        'This server could not verify that you are authorized to access the document requested.'
    ),
    '500': center('Internal Server Error'),
    '429': center('429 Too Many Requests', 'Rate limit exceeded. Try again later.'),
    maintenance: center(
        'Site Under Maintenance',
        'We are performing scheduled maintenance. Please try again later.',
        'Service Status'
    ),
    host_cloudflare_522: darkPage(
        'Connection timed out',
        '<div><h1>522: Connection timed out</h1><p style="color:#9aa0a6">Cloudflare could not reach the origin server.</p></div>'
    ),
    host_cloudflare_521: darkPage(
        'Web server is down',
        '<div><h1>521: Web server is down</h1><p style="color:#9aa0a6">The origin web server refused the connection.</p></div>'
    ),
    host_apache_403: center('403 Forbidden', 'You do not have permission to access this resource.', 'Apache/2.4.58'),
    host_nginx_welcome: `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Welcome to nginx!</title><style>${BASE_STYLE}body{display:flex;align-items:center;justify-content:center;min-height:100vh;background:#fafafa}main{max-width:640px;padding:2rem;border:1px solid #eee;border-radius:12px;background:#fff}</style></head><body><main><h1>Welcome to nginx!</h1><p>If you see this page, the nginx web server is successfully installed and working.</p></main></body></html>`,
    host_iis_404: center('404 - File or directory not found.', 'The resource you are looking for might have been removed.', 'Microsoft-IIS/10.0'),
    host_litespeed: center('LiteSpeed Web Server', 'Site is being configured.', 'LiteSpeed/6.2'),
    cms_wordpress: darkPage(
        'WordPress',
        '<div><h1>Just another WordPress site</h1><p style="color:#9aa0a6">Nothing to see here yet.</p></div>'
    ),
    cms_parked: center('Domain Parked', 'This domain has been registered but is not in use yet.'),
    cms_joomla: center('Joomla!', 'Installation in progress.'),
    cms_directory: center('Index of /', 'Parent Directory'),
    cms_registrar: center('Domain registered', 'This domain is registered with a registrar parking page.'),
    stub_coming_soon: darkPage(
        'Coming Soon',
        '<div><h1>Coming Soon</h1><p style="color:#9aa0a6">Something great is on the way.</p></div>'
    ),
    stub_construction: darkPage(
        'Under Construction',
        '<div><h1>Under Construction</h1><p style="color:#9aa0a6">We are building something new.</p></div>'
    ),
    stub_blank: `<!DOCTYPE html><html><head><meta charset="utf-8"><title></title><style>html,body{margin:0;min-height:100vh;background:#fff}</style></head><body></body></html>`,
    stub_ru_soon: darkPage(
        'Скоро откроемся',
        '<div><h1>Скоро откроемся</h1><p style="color:#9aa0a6">Сайт находится в разработке.</p></div>'
    ),
    stub_ru_maintenance: darkPage(
        'Технические работы',
        '<div><h1>Технические работы</h1><p style="color:#9aa0a6">Попробуйте зайти позже.</p></div>'
    ),
    stub_intranet: darkPage(
        'Intranet Portal',
        '<div><h1>Corporate Intranet</h1><p style="color:#9aa0a6">Authorized personnel only.</p></div>'
    ),
    stub_loading: darkPage(
        'Loading',
        '<div><h1>Loading…</h1><p style="color:#9aa0a6">Please wait while content is prepared.</p></div>'
    ),
    waf_ddosguard_check: darkPage(
        'Checking your browser',
        '<div><h1>Checking your browser before accessing the site</h1><p style="color:#9aa0a6">DDoS-Guard protection is verifying the request.</p></div>'
    ),
    waf_ddosguard_ru: darkPage(
        'Проверка браузера',
        '<div><h1>Проверка браузера</h1><p style="color:#9aa0a6">DDoS-Guard проверяет ваш запрос.</p></div>'
    ),
    waf_ip_blocked: center('403 Forbidden', 'Your IP address has been blocked by the firewall.'),
    waf_under_attack: darkPage(
        'Under Attack Mode',
        '<div><h1>Under Attack Mode</h1><p style="color:#9aa0a6">Additional verification is required.</p></div>'
    ),
    cloud_instance_boot: darkPage(
        'Instance Booting',
        '<div><h1>Instance is booting</h1><p style="color:#9aa0a6">Cloud VM initialization in progress…</p></div>'
    ),
    cloud_k8s_pending: darkPage(
        'Pod Pending',
        '<div><h1>Pod Pending</h1><p style="color:#9aa0a6">Waiting for scheduler assignment.</p></div>'
    ),
    cloud_storage_empty: darkPage(
        'Bucket Empty',
        '<div><h1>No objects found</h1><p style="color:#9aa0a6">This storage bucket is empty.</p></div>'
    ),
    cloud_console_signin: darkPage(
        'Cloud Console',
        '<div><h1>Sign in to Cloud Console</h1><p style="color:#9aa0a6">Authentication required.</p></div>'
    ),
    cloud_docker_hub: darkPage(
        'Docker Hub',
        '<div><h1>Repository not found</h1><p style="color:#9aa0a6">The requested image repository does not exist.</p></div>'
    ),
    game_server_offline: darkPage(
        'Server Offline',
        '<div><h1>Game server offline</h1><p style="color:#9aa0a6">Unable to connect to multiplayer backend.</p></div>'
    ),
    game_maintenance: darkPage(
        'Maintenance',
        '<div><h1>Servers under maintenance</h1><p style="color:#9aa0a6">Matchmaking is temporarily disabled.</p></div>'
    ),
    game_matchmaking: darkPage(
        'Matchmaking',
        '<div><h1>Searching for players…</h1><p style="color:#9aa0a6">Estimated wait: 02:14</p></div>'
    ),
    game_launcher_update: darkPage(
        'Launcher Update',
        '<div><h1>Updating game files</h1><p style="color:#9aa0a6">Please do not close the launcher.</p></div>'
    ),
    game_ru_server: darkPage(
        'Сервер недоступен',
        '<div><h1>Сервер недоступен</h1><p style="color:#9aa0a6">Попробуйте подключиться позже.</p></div>'
    ),
    game_studio: darkPage(
        'Game Studio',
        '<div><h1>Project archived</h1><p style="color:#9aa0a6">This title is no longer supported.</p></div>'
    )
};

export function getStealthPageHtml(decoyId: TStealthDecoyId): string {
    return STEALTH_PAGE_HTML[decoyId] ?? center('502 Bad Gateway');
}
