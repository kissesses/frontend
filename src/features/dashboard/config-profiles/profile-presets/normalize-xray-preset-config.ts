const baseRouting = {
    rules: [
        {
            ip: ['geoip:private'],
            outboundTag: 'BLOCK'
        },
        {
            domain: ['geosite:private'],
            outboundTag: 'BLOCK'
        },
        {
            protocol: ['bittorrent'],
            outboundTag: 'BLOCK'
        }
    ]
}

const baseOutbounds = [
    { protocol: 'freedom', tag: 'DIRECT' },
    { protocol: 'blackhole', tag: 'BLOCK' }
]

const normalizeOutboundTag = (
    tag: string | undefined,
    protocol: string | undefined
): string | undefined => {
    if (tag === 'direct') return 'DIRECT'
    if (tag === 'block' || tag === 'blocked') return 'BLOCK'
    if (!tag && protocol === 'freedom') return 'DIRECT'
    if (!tag && protocol === 'blackhole') return 'BLOCK'
    return tag
}

const normalizeStreamSettings = (
    streamSettings: Record<string, unknown> | undefined
): Record<string, unknown> | undefined => {
    if (!streamSettings) return streamSettings

    let normalized: Record<string, unknown> = { ...streamSettings }

    if (normalized.network === 'splithttp') {
        const { splithttpSettings, ...rest } = normalized
        normalized = {
            ...rest,
            network: 'xhttp',
            ...(splithttpSettings ? { xhttpSettings: splithttpSettings } : {})
        }
    }

    const realitySettings = normalized.realitySettings
    if (realitySettings && typeof realitySettings === 'object') {
        const reality = realitySettings as Record<string, unknown>
        if ('target' in reality && !('dest' in reality)) {
            normalized = {
                ...normalized,
                realitySettings: {
                    ...reality,
                    dest: reality.target
                }
            }
        }
    }

    return normalized
}

const isBlankTag = (tag: unknown): boolean => typeof tag !== 'string' || tag.trim() === ''

const generateInboundTag = (inbound: Record<string, unknown>, index: number): string => {
    const protocol = String(inbound.protocol ?? 'inbound')
    const streamSettings = inbound.streamSettings as Record<string, unknown> | undefined
    const network = streamSettings?.network ? String(streamSettings.network) : ''
    const port = inbound.port != null ? String(inbound.port) : ''
    const random = Math.floor(Math.random() * 999999) + 1

    const parts = [protocol, network, port].filter(Boolean)
    const prefix = parts.join('_').replace(/-/g, '_')

    return prefix ? `${prefix}_${random}` : `inbound_${index + 1}_${random}`
}

const ensureUniqueInboundTags = (
    inbounds: Record<string, unknown>[]
): Record<string, unknown>[] => {
    const usedTags = new Set<string>()

    return inbounds.map((inbound, index) => {
        let tag = isBlankTag(inbound.tag) ? generateInboundTag(inbound, index) : String(inbound.tag)

        while (usedTags.has(tag)) {
            tag = `${tag}_${usedTags.size + 1}`
        }

        usedTags.add(tag)

        return { ...inbound, tag }
    })
}

const normalizeInbound = (inbound: Record<string, unknown>): Record<string, unknown> => {
    let normalized = { ...inbound }

    if (normalized.settings && typeof normalized.settings === 'object') {
        const settings = normalized.settings as Record<string, unknown>
        if ('clients' in settings && Array.isArray(settings.clients)) {
            normalized = {
                ...normalized,
                settings: {
                    ...settings,
                    clients: []
                }
            }
        }
    }

    const streamSettings = normalized.streamSettings
    if (streamSettings && typeof streamSettings === 'object') {
        normalized = {
            ...normalized,
            streamSettings: normalizeStreamSettings(streamSettings as Record<string, unknown>)
        }
    }

    return normalized
}

export const normalizeXrayPresetConfig = (
    config: Record<string, unknown>
): Record<string, unknown> => {
    const result = structuredClone(config)

    if (!result.log) {
        result.log = { loglevel: 'none' }
    }

    if (Array.isArray(result.outbounds)) {
        result.outbounds = result.outbounds.map((outbound) => {
            if (!outbound || typeof outbound !== 'object') return outbound

            const item = outbound as Record<string, unknown>
            const tag = normalizeOutboundTag(
                item.tag as string | undefined,
                item.protocol as string | undefined
            )

            return tag ? { ...item, tag } : item
        })
    } else {
        result.outbounds = structuredClone(baseOutbounds)
    }

    if (result.routing && typeof result.routing === 'object') {
        const routing = result.routing as Record<string, unknown>
        if (Array.isArray(routing.rules)) {
            routing.rules = routing.rules.map((rule) => {
                if (!rule || typeof rule !== 'object') return rule

                const item = rule as Record<string, unknown>
                const outboundTag = normalizeOutboundTag(
                    item.outboundTag as string | undefined,
                    undefined
                )

                return outboundTag ? { ...item, outboundTag } : item
            })
        }
    } else {
        result.routing = structuredClone(baseRouting)
    }

    if (Array.isArray(result.inbounds)) {
        const normalizedInbounds = result.inbounds
            .filter((inbound): inbound is Record<string, unknown> => Boolean(inbound) && typeof inbound === 'object')
            .map((inbound) => normalizeInbound(inbound))

        result.inbounds = ensureUniqueInboundTags(normalizedInbounds)
    }

    return result
}
