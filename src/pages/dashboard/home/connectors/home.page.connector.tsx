import { HomePage } from '@pages/dashboard/home/components'

import {
    useGetBandwidthStats,
    useGetNodes,
    useGetRemnawaveHealth,
    useGetSystemStats
} from '@shared/api/hooks'
import { LoadingScreen } from '@shared/ui/loading-screen'

export const HomePageConnector = () => {
    const { data: systemInfo } = useGetSystemStats()
    const { data: bandwidthStats } = useGetBandwidthStats()
    const { data: remnawaveHealth } = useGetRemnawaveHealth()
    const { data: nodes, isLoading: isNodesLoading } = useGetNodes()

    if (!systemInfo || !bandwidthStats || !remnawaveHealth) {
        return <LoadingScreen />
    }

    return (
        <HomePage
            bandwidthStats={bandwidthStats}
            isNodesLoading={isNodesLoading}
            nodes={nodes}
            remnawaveHealth={remnawaveHealth}
            systemInfo={systemInfo}
        />
    )
}
