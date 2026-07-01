import { Box, Button, Center, SimpleGrid, Stack, Text } from '@mantine/core';
import { TStealthDecoyId } from '@kissesses/backend-contract';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const gameShell = (title: string, subtitle: string, children: React.ReactNode) => (
    <Center h="100vh" style={{ background: '#0f1115', color: '#e8eaed' }}>
        <Stack align="center" gap="md" maw={420} p="md" w="100%">
            <Stack align="center" gap={4}>
                <Text fw={600} size="lg">{title}</Text>
                <Text c="dimmed" size="sm">{subtitle}</Text>
            </Stack>
            {children}
        </Stack>
    </Center>
);

function SnakeGame() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const size = 16;
        const cells = 20;
        let snake = [{ x: 10, y: 10 }];
        let dir = { x: 1, y: 0 };
        let food = { x: 5, y: 5 };
        let alive = true;
        let score = 0;
        const placeFood = () => {
            food = {
                x: Math.floor(Math.random() * cells),
                y: Math.floor(Math.random() * cells)
            };
        };
        const draw = () => {
            ctx.fillStyle = '#1a1d24';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#6ee7a0';
            ctx.fillRect(food.x * size, food.y * size, size - 1, size - 1);
            ctx.fillStyle = '#5b9cf5';
            snake.forEach((part) => ctx.fillRect(part.x * size, part.y * size, size - 1, size - 1));
        };
        const step = () => {
            if (!alive) return;
            const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
            if (head.x < 0 || head.y < 0 || head.x >= cells || head.y >= cells) {
                alive = false;
                return;
            }
            if (snake.some((part) => part.x === head.x && part.y === head.y)) {
                alive = false;
                return;
            }
            snake.unshift(head);
            if (head.x === food.x && head.y === food.y) {
                score += 1;
                placeFood();
            } else {
                snake.pop();
            }
            draw();
        };
        const onKey = (event: KeyboardEvent) => {
            const key = event.key.toLowerCase();
            if (key === 'arrowup' && dir.y !== 1) dir = { x: 0, y: -1 };
            if (key === 'arrowdown' && dir.y !== -1) dir = { x: 0, y: 1 };
            if (key === 'arrowleft' && dir.x !== 1) dir = { x: -1, y: 0 };
            if (key === 'arrowright' && dir.x !== -1) dir = { x: 1, y: 0 };
        };
        document.addEventListener('keydown', onKey);
        placeFood();
        draw();
        const timer = window.setInterval(step, 110);
        return () => {
            window.clearInterval(timer);
            document.removeEventListener('keydown', onKey);
        };
    }, []);
    return gameShell('Snake', 'Use arrow keys', <canvas ref={canvasRef} height={320} style={{ borderRadius: 10, border: '1px solid #2a2f3a', maxWidth: '100%' }} width={320} />);
}

function MemoryGame() {
    const icons = useMemo(() => ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'], []);
    const deck = useMemo(() => [...icons, ...icons].sort(() => Math.random() - 0.5), [icons]);
    const [open, setOpen] = useState<number[]>([]);
    const [matched, setMatched] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const onPick = (index: number) => {
        if (open.includes(index) || matched.includes(index) || open.length === 2) return;
        const next = [...open, index];
        setOpen(next);
        if (next.length === 2) {
            setMoves((value) => value + 1);
            const [a, b] = next;
            if (deck[a] === deck[b]) {
                setMatched((value) => [...value, a, b]);
                setOpen([]);
            } else {
                window.setTimeout(() => setOpen([]), 500);
            }
        }
    };
    return gameShell(
        'Memory',
        `Moves: ${moves}`,
        <SimpleGrid cols={4} spacing={6}>
            {deck.map((value, index) => (
                <Button
                    h={52}
                    key={index}
                    onClick={() => onPick(index)}
                    variant={matched.includes(index) ? 'light' : 'default'}
                >
                    {open.includes(index) || matched.includes(index) ? value : '?'}
                </Button>
            ))}
        </SimpleGrid>
    );
}

function TicTacToeGame() {
    const [board, setBoard] = useState(Array<string | null>(9).fill(null));
    const [turn, setTurn] = useState<'X' | 'O'>('X');
    const winner = useMemo(() => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        for (const [a, b, c] of lines) {
            if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
        }
        return board.every(Boolean) ? 'Draw' : null;
    }, [board]);
    const play = (index: number) => {
        if (board[index] || winner) return;
        const next = [...board];
        next[index] = turn;
        setBoard(next);
        setTurn(turn === 'X' ? 'O' : 'X');
    };
    return gameShell(
        'Tic Tac Toe',
        winner ? `Winner: ${winner}` : `Turn: ${turn}`,
        <>
            <SimpleGrid cols={3} spacing={6}>
                {board.map((cell, index) => (
                    <Button h={64} key={index} onClick={() => play(index)} variant="default">
                        {cell ?? ''}
                    </Button>
                ))}
            </SimpleGrid>
            <Button onClick={() => { setBoard(Array(9).fill(null)); setTurn('X'); }} variant="light">Reset</Button>
        </>
    );
}

function ReactionGame() {
    const [state, setState] = useState<'idle' | 'wait' | 'go'>('idle');
    const [message, setMessage] = useState('Click Start');
    const timeoutRef = useRef<number | undefined>(undefined);
    const start = () => {
        setState('wait');
        setMessage('Wait for green…');
        timeoutRef.current = window.setTimeout(() => {
            setState('go');
            setMessage('CLICK!');
        }, 1000 + Math.random() * 2000);
    };
    const click = () => {
        if (state === 'go') setMessage('Nice reaction!');
        if (state === 'wait') setMessage('Too early!');
        setState('idle');
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
    return gameShell(
        'Reaction',
        message,
        <Button color={state === 'go' ? 'green' : state === 'wait' ? 'yellow' : 'gray'} h={120} onClick={state === 'idle' ? start : click} w={220}>
            {state === 'idle' ? 'Start' : 'Tap'}
        </Button>
    );
}

function GuessGame() {
    const [target] = useState(() => Math.floor(Math.random() * 100) + 1);
    const [value, setValue] = useState('');
    const [hint, setHint] = useState('Guess a number from 1 to 100');
    const submit = () => {
        const num = Number(value);
        if (!num) return;
        if (num === target) setHint('Correct!');
        else setHint(num < target ? 'Higher' : 'Lower');
    };
    return gameShell(
        'Guess Number',
        hint,
        <Stack w="100%">
            <input onChange={(event) => setValue(event.target.value)} style={{ padding: 12, borderRadius: 8, border: '1px solid #2a2f3a', background: '#1a1d24', color: '#fff' }} type="number" value={value} />
            <Button onClick={submit}>Check</Button>
        </Stack>
    );
}

function SimpleCanvasGame({ title, subtitle }: { subtitle: string; title: string }) {
    return gameShell(title, subtitle, <Box bg="#1a1d24" h={240} style={{ border: '1px solid #2a2f3a', borderRadius: 10, width: '100%' }} />);
}

const GAME_COMPONENTS: Partial<Record<TStealthDecoyId, () => React.ReactElement>> = {
    game_snake: SnakeGame,
    game_memory: MemoryGame,
    game_tictactoe: TicTacToeGame,
    game_reaction: ReactionGame,
    game_guess: GuessGame,
    game_pong: () => SimpleCanvasGame({ title: 'Pong', subtitle: 'Move mouse to play' }),
    game_breakout: () => SimpleCanvasGame({ title: 'Breakout', subtitle: 'Arcade placeholder' }),
    game_2048: () => SimpleCanvasGame({ title: '2048', subtitle: 'Use arrow keys' }),
    game_minesweeper: () => SimpleCanvasGame({ title: 'Minesweeper', subtitle: 'Left click to reveal' }),
    game_simon: () => SimpleCanvasGame({ title: 'Simon', subtitle: 'Repeat the pattern' }),
    game_flappy: () => SimpleCanvasGame({ title: 'Flappy', subtitle: 'Press space' }),
    game_whack: () => SimpleCanvasGame({ title: 'Whack', subtitle: 'Click the targets' }),
    game_dino: () => SimpleCanvasGame({ title: 'Dino Run', subtitle: 'Press space to jump' }),
    game_tetris: () => SimpleCanvasGame({ title: 'Tetris', subtitle: 'Arrow keys to move' })
};

export function StealthDecoyGame({ decoyId }: { decoyId: TStealthDecoyId }) {
    const Component = GAME_COMPONENTS[decoyId] ?? (() => SimpleCanvasGame({ title: 'Mini Game', subtitle: 'Offline placeholder' }));
    return <Component />;
}
