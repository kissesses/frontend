import { parse } from 'jsonc-parser'

export const parseJsonc = (text: string): unknown => parse(text)
