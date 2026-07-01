import {
    GetAllNodesCommand,
    GetBandwidthStatsCommand,
    GetRemnawaveHealthCommand,
    GetStatsCommand
} from '@kissesses/backend-contract'

export interface IProps {
    bandwidthStats: GetBandwidthStatsCommand.Response['response']
    isNodesLoading: boolean
    nodes: GetAllNodesCommand.Response['response'] | undefined
    remnawaveHealth: GetRemnawaveHealthCommand.Response['response']
    systemInfo: GetStatsCommand.Response['response']
}
