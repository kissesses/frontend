const XTLS_XRAY_EXAMPLES_RAW = 'https://raw.githubusercontent.com/XTLS/Xray-examples/main'

const xtlsExampleUrl = (...segments: string[]): string =>
    `${XTLS_XRAY_EXAMPLES_RAW}/${segments.map((segment) => encodeURIComponent(segment)).join('/')}`

const REMNAWAVE_TEMPLATES_RAW =
    'https://raw.githubusercontent.com/remnawave/templates/refs/heads/main'

const INTERNETKAFE_XHTTP_RAW =
    'https://raw.githubusercontent.com/internetkafe/InternetkafeXHTTP/main'

export interface IConfigProfilePreset {
    descriptionKey: string
    id: string
    nameKey: string
    protocol: string
    suggestedName: string
    url: string
}

export const CONFIG_PROFILE_PRESETS: IConfigProfilePreset[] = [
    {
        id: 'vless-tcp-reality',
        nameKey: 'config-profile-presets.presets.vless-tcp-reality.name',
        descriptionKey: 'config-profile-presets.presets.vless-tcp-reality.description',
        protocol: 'VLESS + REALITY',
        suggestedName: 'VLESS TCP REALITY',
        url: xtlsExampleUrl('VLESS-TCP-XTLS-Vision-REALITY', 'config_server.jsonc')
    },
    {
        id: 'vless-xhttp-reality',
        nameKey: 'config-profile-presets.presets.vless-xhttp-reality.name',
        descriptionKey: 'config-profile-presets.presets.vless-xhttp-reality.description',
        protocol: 'VLESS + XHTTP + REALITY',
        suggestedName: 'VLESS XHTTP REALITY',
        url: xtlsExampleUrl('VLESS-XHTTP-Reality', 'minimal-steal_others', 'server.jsonc')
    },
    {
        id: 'vless-xhttp-reality-browser',
        nameKey: 'config-profile-presets.presets.vless-xhttp-reality-browser.name',
        descriptionKey: 'config-profile-presets.presets.vless-xhttp-reality-browser.description',
        protocol: 'VLESS + XHTTP + REALITY',
        suggestedName: 'VLESS XHTTP REALITY Browser',
        url: `${INTERNETKAFE_XHTTP_RAW}/internetkafexhttp.json`
    },
    {
        id: 'vless-xhttp-tls-h3',
        nameKey: 'config-profile-presets.presets.vless-xhttp-tls-h3.name',
        descriptionKey: 'config-profile-presets.presets.vless-xhttp-tls-h3.description',
        protocol: 'VLESS + XHTTP + TLS',
        suggestedName: 'VLESS XHTTP TLS H3',
        url: xtlsExampleUrl('VLESS-TLS-SplitHTTP-H3', 'server.jsonc')
    },
    {
        id: 'vless-xhttp-behind-nginx',
        nameKey: 'config-profile-presets.presets.vless-xhttp-behind-nginx.name',
        descriptionKey: 'config-profile-presets.presets.vless-xhttp-behind-nginx.description',
        protocol: 'VLESS + XHTTP',
        suggestedName: 'VLESS XHTTP Nginx',
        url: xtlsExampleUrl('VLESS-TLS-SplitHTTP-CaddyNginx', 'server.jsonc')
    },
    {
        id: 'vless-grpc-reality',
        nameKey: 'config-profile-presets.presets.vless-grpc-reality.name',
        descriptionKey: 'config-profile-presets.presets.vless-grpc-reality.description',
        protocol: 'VLESS + gRPC + REALITY',
        suggestedName: 'VLESS gRPC REALITY',
        url: xtlsExampleUrl('VLESS-gRPC-REALITY', 'config_server.jsonc')
    },
    {
        id: 'vless-tcp-reality-selfhost',
        nameKey: 'config-profile-presets.presets.vless-tcp-reality-selfhost.name',
        descriptionKey: 'config-profile-presets.presets.vless-tcp-reality-selfhost.description',
        protocol: 'VLESS + REALITY',
        suggestedName: 'VLESS REALITY Selfhost',
        url: xtlsExampleUrl('VLESS-TCP-REALITY (without being stolen)', 'config_server.jsonc')
    },
    {
        id: 'hysteria2',
        nameKey: 'config-profile-presets.presets.hysteria2.name',
        descriptionKey: 'config-profile-presets.presets.hysteria2.description',
        protocol: 'Hysteria2',
        suggestedName: 'Hysteria2',
        url: xtlsExampleUrl('Hysteria2', 'server.jsonc')
    },
    {
        id: 'trojan-tcp-tls',
        nameKey: 'config-profile-presets.presets.trojan-tcp-tls.name',
        descriptionKey: 'config-profile-presets.presets.trojan-tcp-tls.description',
        protocol: 'Trojan + TLS',
        suggestedName: 'Trojan TCP TLS',
        url: xtlsExampleUrl('Trojan-TCP-TLS (minimal)', 'config_server.jsonc')
    },
    {
        id: 'shadowsocks-2022',
        nameKey: 'config-profile-presets.presets.shadowsocks-2022.name',
        descriptionKey: 'config-profile-presets.presets.shadowsocks-2022.description',
        protocol: 'SS-2022',
        suggestedName: 'Shadowsocks 2022',
        url: `${REMNAWAVE_TEMPLATES_RAW}/by-ikitkatt/xray-core/example-shadowsocks-2022.json`
    }
]
