import { ActionIcon, Button, Card, CloseButton, Drawer, InputBase, Modal, Paper, PasswordInput, Select, Switch, TextInput } from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'

import defaultOverrides from '../../../overrides'

import cardClasses from './card.module.css'

const noctisOverrides = {
    ActionIcon: ActionIcon.extend({
        defaultProps: {
            radius: 'md',
            variant: 'subtle'
        }
    }),
    Button: Button.extend({
        defaultProps: {
            radius: 'md',
            variant: 'light'
        },
        styles: {
            root: {
                fontWeight: 500,
                transition: 'background-color 150ms ease, border-color 150ms ease, color 150ms ease'
            }
        }
    }),
    Card: Card.extend({
        classNames: cardClasses,
        defaultProps: {
            radius: 'lg',
            withBorder: true,
            padding: 'lg'
        }
    }),
    CloseButton: CloseButton.extend({
        defaultProps: {
            size: 'lg',
            radius: 'md'
        }
    }),
    InputBase: InputBase.extend({
        defaultProps: {
            radius: 'md'
        },
        styles: {
            input: {
                backgroundColor: 'var(--app-surface-raised, var(--mantine-color-dark-8))',
                borderColor: 'var(--app-border, rgba(255, 255, 255, 0.06))'
            }
        }
    }),
    PasswordInput: PasswordInput.extend({
        defaultProps: {
            radius: 'md'
        },
        styles: {
            input: {
                backgroundColor: 'var(--app-surface-raised, var(--mantine-color-dark-8))',
                borderColor: 'var(--app-border, rgba(255, 255, 255, 0.06))'
            }
        }
    }),
    TextInput: TextInput.extend({
        defaultProps: {
            radius: 'md'
        },
        styles: {
            input: {
                backgroundColor: 'var(--app-surface-raised, var(--mantine-color-dark-8))',
                borderColor: 'var(--app-border, rgba(255, 255, 255, 0.06))'
            }
        }
    }),
    Select: Select.extend({
        defaultProps: {
            radius: 'md'
        },
        styles: {
            input: {
                backgroundColor: 'var(--app-surface-raised, var(--mantine-color-dark-8))',
                borderColor: 'var(--app-border, rgba(255, 255, 255, 0.06))'
            }
        }
    }),
    DateTimePicker: DateTimePicker.extend({
        defaultProps: {
            radius: 'md'
        }
    }),
    Paper: Paper.extend({
        defaultProps: {
            radius: 'lg'
        },
        styles: {
            root: {
                backgroundColor: 'var(--app-surface, var(--mantine-color-dark-8))',
                borderColor: 'var(--app-border, rgba(255, 255, 255, 0.06))'
            }
        }
    }),
    Switch: Switch.extend({
        defaultProps: {
            radius: 'xl'
        }
    }),
    Modal: Modal.extend({
        defaultProps: {
            transitionProps: { duration: 180, transition: 'pop' }
        }
    }),
    Drawer: Drawer.extend({
        defaultProps: {
            transitionProps: { duration: 180, transition: 'slide-left' }
        }
    })
}

export default {
    ...defaultOverrides,
    ...noctisOverrides
}
