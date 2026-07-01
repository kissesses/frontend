import { GetStatusCommand } from '@kissesses/backend-contract';
import { parseStealthHotkey } from '@kissesses/backend-contract';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { STEALTH_UNLOCK_SESSION_KEY } from '../constants/decoy-registry';

type StealthConfig = GetStatusCommand.Response['response']['stealthLogin'];

function readSessionUnlock() {
    return sessionStorage.getItem(STEALTH_UNLOCK_SESSION_KEY) === '1';
}

function writeSessionUnlock() {
    sessionStorage.setItem(STEALTH_UNLOCK_SESSION_KEY, '1');
}

function hotkeyMatches(event: KeyboardEvent, configHotkey: string) {
    const hotkey = parseStealthHotkey(configHotkey);
    const parts = configHotkey.toLowerCase().split('+');
    const needCtrl = parts.includes('ctrl');
    const needShift = parts.includes('shift');
    const needAlt = parts.includes('alt');

    return (
        event.key.toLowerCase() === hotkey.key &&
        event.ctrlKey === needCtrl &&
        event.shiftKey === needShift &&
        event.altKey === needAlt
    );
}

export function useStealthUnlock(config: StealthConfig | undefined) {
    const [clientUnlocked, setClientUnlocked] = useState(() => readSessionUnlock());
    const clickCountRef = useRef(0);
    const clickTimerRef = useRef<number | undefined>(undefined);

    const unlocked = useMemo(() => {
        if (!config?.enabled) return true;
        if (config.revealed) return true;
        return clientUnlocked;
    }, [clientUnlocked, config]);

    const unlock = useCallback(() => {
        writeSessionUnlock();
        setClientUnlocked(true);
    }, []);

    useEffect(() => {
        if (!config?.enabled || unlocked) return;
        window.history.replaceState(null, '', config.historyPath || '/');
    }, [config, unlocked]);

    useEffect(() => {
        if (!config?.enabled || unlocked) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (!config.hotkeyEnabled) return;
            if (!hotkeyMatches(event, config.hotkey)) return;
            event.preventDefault();
            event.stopPropagation();
            unlock();
        };

        const onClick = () => {
            if (!config.clicksEnabled) return;
            clickCountRef.current += 1;
            window.clearTimeout(clickTimerRef.current);
            if (clickCountRef.current >= config.clicksCount) {
                unlock();
                return;
            }
            clickTimerRef.current = window.setTimeout(() => {
                clickCountRef.current = 0;
            }, config.clicksWindowMs);
        };

        document.addEventListener('keydown', onKeyDown, true);
        document.addEventListener('click', onClick, true);
        return () => {
            document.removeEventListener('keydown', onKeyDown, true);
            document.removeEventListener('click', onClick, true);
            window.clearTimeout(clickTimerRef.current);
        };
    }, [config, unlock, unlocked]);

    return { unlocked, unlock };
}
