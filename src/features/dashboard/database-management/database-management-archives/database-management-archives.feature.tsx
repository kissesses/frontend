import { Paper, Stack, Table, Text } from '@mantine/core'
import { GetDatabaseManagementArchivesCommand } from '@kissesses/backend-contract'
import { useTranslation } from 'react-i18next'

import { formatBytes } from '@shared/utils/misc/format'

interface IProps {
    archives: GetDatabaseManagementArchivesCommand.Response['response']
}

export const DatabaseManagementArchivesFeature = (props: IProps) => {
    const { archives } = props
    const { t } = useTranslation()

    if (!archives.storageDir) {
        return (
            <Paper p="md" withBorder>
                <Text c="dimmed" size="sm">
                    {t('database-management.archives.no-storage')}
                </Text>
            </Paper>
        )
    }

    return (
        <Paper p="md" withBorder>
            <Stack gap="sm">
                <Text fw={600}>{t('database-management.archives.title')}</Text>
                <Text c="dimmed" size="sm">
                    {t('database-management.archives.path')}: {archives.storageDir}
                </Text>

                {archives.archives.length === 0 ? (
                    <Text c="dimmed" size="sm">
                        {t('database-management.archives.empty')}
                    </Text>
                ) : (
                    <Table.ScrollContainer minWidth={500}>
                        <Table highlightOnHover striped>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>{t('database-management.archives.file')}</Table.Th>
                                    <Table.Th>{t('database-management.archives.size')}</Table.Th>
                                    <Table.Th>{t('database-management.archives.created')}</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {archives.archives.map((archive) => (
                                    <Table.Tr key={archive.fileName}>
                                        <Table.Td>{archive.fileName}</Table.Td>
                                        <Table.Td>{formatBytes(archive.sizeBytes)}</Table.Td>
                                        <Table.Td>
                                            {new Date(archive.createdAt).toLocaleString()}
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </Table.ScrollContainer>
                )}
            </Stack>
        </Paper>
    )
}
