export const noctisMonacoTheme = {
    base: 'vs-dark' as const,
    inherit: true,
    rules: [
        { background: '141416', token: '' },
        { foreground: '71717a', token: 'comment' },
        { foreground: '8c69fb', token: 'constant' },
        { foreground: 'c4b5fd', token: 'entity' },
        { foreground: 'e4e4e7', token: 'keyword' },
        { foreground: 'e4e4e7', token: 'storage' },
        { foreground: 'a7f3d0', token: 'string' },
        { foreground: 'a7f3d0', token: 'meta.verbatim' },
        { foreground: '8c69fb', token: 'support' },
        { foreground: 'fb923c', fontStyle: 'italic', token: 'invalid.deprecated' },
        { foreground: '#fafafa', background: '7c2d12', token: 'invalid.illegal' },
        { foreground: 'c4b5fd', fontStyle: 'italic', token: 'entity.other.inherited-class' },
        { foreground: 'ddd6fe', token: 'string constant.other.placeholder' },
        { foreground: 'a78bfa', token: 'meta.function-call.py' },
        { foreground: '52525b', token: 'meta.tag' },
        { foreground: '52525b', token: 'meta.tag entity' },
        { foreground: 'd4d4d8', token: 'entity.name.section' },
        { foreground: 'd4d4d8', token: 'keyword.type.variant' }
    ],
    colors: {
        'editor.foreground': '#e4e4e7',
        'editor.background': '#141416',
        'editor.selectionBackground': '#694bca44',
        'editor.lineHighlightBackground': '#1c1c1f',
        'editorCursor.foreground': '#8c69fb',
        'editorWhitespace.foreground': '#3f3f46',
        'editorLineNumber.foreground': '#52525b',
        'editorLineNumber.activeForeground': '#d4d4d8',
        'editorGutter.background': '#141416',
        'editorWidget.background': '#1c1c1f',
        'editorSuggestWidget.background': '#1c1c1f',
        'editorHoverWidget.background': '#1c1c1f'
    }
}
