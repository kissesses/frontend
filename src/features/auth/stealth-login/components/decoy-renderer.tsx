import { TStealthDecoyId } from '@kissesses/backend-contract';

import { STEALTH_DECOY_BY_ID } from '../constants/decoy-registry';
import { getStealthPageHtml } from '../constants/decoy-pages-html';

import { StealthDecoyGame } from './decoy-games';

interface StealthDecoyRendererProps {
    decoyId: TStealthDecoyId;
}

export function StealthDecoyRenderer({ decoyId }: StealthDecoyRendererProps) {
    const meta = STEALTH_DECOY_BY_ID[decoyId];

    if (meta?.kind === 'game') {
        return <StealthDecoyGame decoyId={decoyId} />;
    }

    return (
        <iframe
            sandbox=""
            srcDoc={getStealthPageHtml(decoyId)}
            style={{ border: 0, width: '100%', height: '100vh', display: 'block', background: '#fff' }}
            title="decoy"
        />
    );
}
