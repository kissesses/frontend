import {
    Alert,
    Button,
    Group,
    Modal,
    Paper,
    PinInput,
    ScrollArea,
    Select,
    Stack,
    Table,
    Text,
    Textarea,
    Title
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { ExecutePostgresQueryCommand } from '@kissesses/backend-contract'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbPlayerPlay, TbSend } from 'react-icons/tb'

import {
    useAnalyzePostgresQuery,
    useExecutePostgresQuery,
    useRequestPostgresQueryConfirmation,
    useVerifyPostgresQueryConfirmation
} from '@shared/api/hooks/postgres-management/postgres-management.mutation.hooks'

interface IProps {
    tables: string[]
    telegramConfigured: boolean
}

type QueryResult = ExecutePostgresQueryCommand.Response['response']

export const PostgresManagementConsoleFeature = (props: IProps) => {
    const { tables, telegramConfigured } = props
    const { t } = useTranslation()
    const [sql, setSql] = useState('SELECT 1')
    const [selectedTable, setSelectedTable] = useState<string | null>(null)
    const [result, setResult] = useState<QueryResult | null>(null)
    const [confirmationId, setConfirmationId] = useState<string | null>(null)
    const [confirmationToken, setConfirmationToken] = useState<string | null>(null)
    const [pendingOperation, setPendingOperation] = useState<string | null>(null)
    const [confirmationCode, setConfirmationCode] = useState('')
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)

    const { mutateAsync: analyzeQuery, isPending: isAnalyzing } = useAnalyzePostgresQuery()
    const { mutateAsync: executeQuery, isPending: isExecuting } = useExecutePostgresQuery()
    const { mutateAsync: requestConfirmation, isPending: isRequestingConfirmation } =
        useRequestPostgresQueryConfirmation()
    const { mutateAsync: verifyConfirmation, isPending: isVerifyingConfirmation } =
        useVerifyPostgresQueryConfirmation()

    const handleInsertTable = (tableName: string | null) => {
        if (!tableName) return
        setSelectedTable(tableName)
        setSql(`SELECT * FROM "${tableName}" LIMIT 100`)
    }

    const runQuery = async (token?: string) => {
        const response = await executeQuery({
            variables: {
                sql,
                confirmationToken: token
            }
        })

        setResult(response)
        setConfirmationToken(null)
        setConfirmationId(null)
        setPendingOperation(null)
        setIsConfirmationOpen(false)
        setConfirmationCode('')
    }

    const handleRun = async () => {
        setResult(null)

        try {
            const analysis = await analyzeQuery({
                variables: { sql }
            })

            if (analysis.requiresTelegramConfirmation && !confirmationToken) {
                if (!telegramConfigured) {
                    notifications.show({
                        title: t('postgres-management.console.error-title'),
                        message: t('postgres-management.console.telegram-required'),
                        color: 'red'
                    })
                    return
                }

                setPendingOperation(analysis.operation)
                setConfirmationId(null)
                setConfirmationCode('')
                setIsConfirmationOpen(true)
                return
            }

            await runQuery(confirmationToken ?? undefined)
        } catch (error: unknown) {
            notifications.show({
                title: t('postgres-management.console.error-title'),
                message: error instanceof Error ? error.message : t('postgres-management.console.query-failed'),
                color: 'red'
            })
        }
    }

    const handleRequestConfirmation = async () => {
        try {
            const response = await requestConfirmation({
                variables: { sql }
            })

            setConfirmationId(response.confirmationId)
            setPendingOperation(response.operation)
            setConfirmationCode('')
        } catch (error: unknown) {
            notifications.show({
                title: t('postgres-management.console.error-title'),
                message:
                    error instanceof Error
                        ? error.message
                        : t('postgres-management.console.confirmation-request-failed'),
                color: 'red'
            })
        }
    }

    const handleVerifyConfirmation = async () => {
        if (!confirmationId || confirmationCode.length < 6) return

        try {
            const response = await verifyConfirmation({
                variables: {
                    confirmationId,
                    code: confirmationCode
                }
            })

            setConfirmationToken(response.confirmationToken)
            setIsConfirmationOpen(false)
            await runQuery(response.confirmationToken)
        } catch (error: unknown) {
            notifications.show({
                title: t('postgres-management.console.error-title'),
                message:
                    error instanceof Error
                        ? error.message
                        : t('postgres-management.console.invalid-confirmation-code'),
                color: 'red'
            })
        }
    }

    return (
        <Stack gap="md">
            <Alert color="yellow" variant="light">
                {t('postgres-management.console.warning')}
            </Alert>

            <Paper p="md" radius="md" withBorder>
                <Stack gap="md">
                    <Group align="flex-end" grow>
                        <Select
                            clearable
                            data={tables}
                            label={t('postgres-management.console.tables')}
                            onChange={handleInsertTable}
                            searchable
                            value={selectedTable}
                        />
                    </Group>

                    <Textarea
                        autosize
                        label={t('postgres-management.console.sql')}
                        maxRows={12}
                        minRows={6}
                        onChange={(event) => setSql(event.currentTarget.value)}
                        value={sql}
                    />

                    <Group>
                        <Button
                            leftSection={<TbPlayerPlay size={18} />}
                            loading={isAnalyzing || isExecuting}
                            onClick={handleRun}
                        >
                            {t('postgres-management.console.run')}
                        </Button>
                    </Group>
                </Stack>
            </Paper>

            {result?.kind === 'rows' && (
                <Paper p="md" radius="md" withBorder>
                    <Stack gap="sm">
                        {result.truncated && (
                            <Alert color="yellow" variant="light">
                                {t('postgres-management.console.rows-truncated')}
                            </Alert>
                        )}
                        <Title order={5}>
                            {t('postgres-management.console.rows', { count: result.rowCount })}
                        </Title>
                        <ScrollArea>
                            <Table striped withTableBorder withColumnBorders>
                                <Table.Thead>
                                    <Table.Tr>
                                        {result.columns.map((column) => (
                                            <Table.Th key={column}>{column}</Table.Th>
                                        ))}
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {result.rows.map((row, rowIndex) => (
                                        <Table.Tr key={rowIndex}>
                                            {result.columns.map((column) => (
                                                <Table.Td key={column}>
                                                    {formatCell(row[column])}
                                                </Table.Td>
                                            ))}
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        </ScrollArea>
                    </Stack>
                </Paper>
            )}

            {result?.kind === 'command' && (
                <Paper p="md" radius="md" withBorder>
                    <Text>
                        {t('postgres-management.console.affected', { count: result.rowCount })}
                    </Text>
                </Paper>
            )}

            <Modal
                centered
                onClose={() => {
                    setIsConfirmationOpen(false)
                    setConfirmationId(null)
                    setConfirmationCode('')
                    setPendingOperation(null)
                }}
                opened={isConfirmationOpen}
                title={t('postgres-management.console.confirmation-title')}
            >
                <Stack gap="md">
                    <Text size="sm">
                        {pendingOperation
                            ? t('postgres-management.console.confirmation-description', {
                                  operation: pendingOperation
                              })
                            : t('postgres-management.console.confirmation-description-generic')}
                    </Text>

                    {!confirmationId ? (
                        <Button
                            leftSection={<TbSend size={18} />}
                            loading={isRequestingConfirmation}
                            onClick={handleRequestConfirmation}
                        >
                            {t('postgres-management.console.send-confirmation')}
                        </Button>
                    ) : (
                        <Stack gap="sm">
                            <PinInput
                                length={6}
                                onChange={setConfirmationCode}
                                onComplete={handleVerifyConfirmation}
                                oneTimeCode
                                type="number"
                                value={confirmationCode}
                            />
                            <Button
                                disabled={confirmationCode.length < 6}
                                loading={isVerifyingConfirmation || isExecuting}
                                onClick={handleVerifyConfirmation}
                            >
                                {t('postgres-management.console.verify-and-run')}
                            </Button>
                        </Stack>
                    )}
                </Stack>
            </Modal>
        </Stack>
    )
}

function formatCell(value: unknown): string {
    if (value === null || value === undefined) {
        return 'NULL'
    }

    if (typeof value === 'object') {
        return JSON.stringify(value)
    }

    return String(value)
}
