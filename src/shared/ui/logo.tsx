/* eslint-disable @stylistic/indent */

import { Box, BoxProps, ElementProps } from '@mantine/core'
import { useId } from 'react'

interface LogoProps
    extends ElementProps<'svg', keyof BoxProps>, Omit<BoxProps, 'children' | 'ref'> {
    size?: number | string
}

export function Logo({ size, style, ...props }: LogoProps) {
    const gradientId = useId()
    const glowId = useId()

    return (
        <Box
            component="svg"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            style={{
                width: size,
                height: size,
                display: 'inline-block',
                verticalAlign: 'middle',
                flexShrink: 0,
                ...style
            }}
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <defs>
                <linearGradient
                    id={gradientId}
                    x1="120"
                    y1="90"
                    x2="390"
                    y2="420"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0%" stopColor="#E97CFF" />
                    <stop offset="35%" stopColor="#B84DFF" />
                    <stop offset="70%" stopColor="#7A2EFF" />
                    <stop offset="100%" stopColor="#4B148C" />
                </linearGradient>
                <filter id={glowId} height="160%" width="160%" x="-30%" y="-30%">
                    <feGaussianBlur result="blur" stdDeviation="6" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <g filter={`url(#${glowId})`}>
                <path
                    d="M128 170 L256 82 C256 160 242 205 178 250 L128 218 Z"
                    fill={`url(#${gradientId})`}
                />
                <path
                    d="M384 170 L256 82 C256 160 270 205 334 250 L384 218 Z"
                    fill={`url(#${gradientId})`}
                />
                <path
                    d="M384 342 L256 430 C256 352 270 307 334 262 L384 294 Z"
                    fill={`url(#${gradientId})`}
                />
                <path
                    d="M128 342 L256 430 C256 352 242 307 178 262 L128 294 Z"
                    fill={`url(#${gradientId})`}
                />
            </g>
        </Box>
    )
}
