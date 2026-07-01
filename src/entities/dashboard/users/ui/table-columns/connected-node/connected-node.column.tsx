import { Group, Text } from '@mantine/core'
import ReactCountryFlag from 'react-country-flag'

import { IProps } from './interface'

const LEADING_FLAG_EMOJI_RE = /^[\u{1F1E6}-\u{1F1FF}]{2}\s*/u

function formatNodeName(name: string | undefined, stripLeadingFlag: boolean) {
    if (!name) return '–'

    if (!stripLeadingFlag) {
        return name
    }

    return name.replace(LEADING_FLAG_EMOJI_RE, '').trim() || name
}

export function ConnectedNodeColumnEntity(props: IProps) {
    const { node, size = 'md' } = props
    const showFlag = Boolean(node?.countryCode && node.countryCode !== 'XX')
    const displayName = formatNodeName(node?.name, showFlag)

    return (
        <Group
            align="center"
            gap="xs"
            justify="flex-end"
            miw={0}
            style={{
                flex: 1,
                minWidth: 0
            }}
            wrap="nowrap"
        >
            {showFlag && (
                <ReactCountryFlag
                    countryCode={node!.countryCode}
                    style={{
                        fontSize: size === 'sm' ? '1em' : '1.1em',
                        borderRadius: '2px',
                        flexShrink: 0
                    }}
                />
            )}
            <Text ff="monospace" fw={500} size={size} truncate="end">
                {displayName}
            </Text>
        </Group>
    )
}
