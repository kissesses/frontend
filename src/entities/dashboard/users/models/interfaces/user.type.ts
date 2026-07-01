import { GetAllUsersCommand } from '@kissesses/backend-contract'

export type User = GetAllUsersCommand.Response['response']['users'][number]
