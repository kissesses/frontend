import { GetStatusCommand } from '@kissesses/backend-contract';

import { StealthDecoyRenderer } from './decoy-renderer';

interface StealthLoginGateProps {
    config: GetStatusCommand.Response['response']['stealthLogin'];
}

export function StealthLoginGate({ config }: StealthLoginGateProps) {
    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 10000, background: '#fff' }}>
            <StealthDecoyRenderer decoyId={config.decoy} />
        </div>
    );
}
