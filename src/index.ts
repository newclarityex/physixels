import { create } from 'random-seed';

export type Options = {
    bias: 'left' | 'right' | 'random';
    seed: string | null;
    skip: number;
    diagonalPassthrough: boolean;
    cellTypes: {
        id: number;
        behavior: 'empty' | 'static' | 'dynamic';
    }[]
}

const defaultOptions: Options = {
    bias: 'random',
    seed: null,
    skip: 0,
    diagonalPassthrough: true,
    cellTypes: [
        { id: 0, behavior: 'empty' },
        { id: 1, behavior: 'static' },
        { id: 2, behavior: 'dynamic' }
    ],
};

export function step(data: number[][], options?: Partial<Options>) {
    const finalOptions: Options = { ...defaultOptions, ...options };

    // Make sure data is a 2D array
    if (!data[0] || data[0].length === 0) {
        throw new Error('Invalid data');
    }
    // Make sure data is rectangular
    const width = data[0].length;
    if (data.some(row => row.length !== width)) {
        throw new Error('Invalid data');
    }

    const newData = data.map(row => [...row]);

    const rand = finalOptions.seed ? create(finalOptions.seed) : create();

    const behaviors = new Map<number, 'empty' | 'static' | 'dynamic'>();
    for (const type of finalOptions.cellTypes) {
        behaviors.set(type.id, type.behavior);
    }

    // Loop through for each skip
    for (let i = 0; i < finalOptions.skip + 1; i++) {
        // Loop through each row backwards
        for (let y = newData.length - 1; y >= 0; y--) {
            const row = newData[y];
            if (!row) continue;
            for (const [x, cell] of row.entries()) {
                const behavior = behaviors.get(cell);
                if (!behavior || behaviors.get(cell) === 'empty' || behaviors.get(cell) === 'static') {
                    continue;
                }

                // If empty underneath, fall
                const belowRow = newData[y + 1];
                if (!belowRow) continue;

                const belowCell = belowRow && belowRow[x];
                const belowCellBehavior = belowCell === undefined ? undefined : behaviors.get(belowCell);
                if (belowCellBehavior === 'empty') {
                    row[x] = 0;
                    belowRow[x] = cell;
                    continue;
                }

                // If empty to the left or right, move
                const bias =
                    finalOptions.bias === 'left' ?
                        0 :
                        finalOptions.bias === 'right' ?
                            1 :
                            rand(2);

                const offset = bias === 0 ? -1 : 1;

                {
                    const adjacentCell = row[x + offset];
                    const adjacentCellBehavior = adjacentCell === undefined ? undefined : behaviors.get(adjacentCell);
                    const targetCell = belowRow[x + offset];
                    const targetCellBehavior = targetCell === undefined ? undefined : behaviors.get(targetCell);
                    if (targetCellBehavior === 'empty' && (finalOptions.diagonalPassthrough || adjacentCellBehavior === 'empty')) {
                        row[x] = 0;
                        belowRow[x + offset] = cell;
                        continue;
                    }
                }
                {
                    const adjacentCell = row[x - offset];
                    const adjacentCellBehavior = adjacentCell === undefined ? undefined : behaviors.get(adjacentCell);
                    const targetCell = belowRow[x - offset];
                    const targetCellBehavior = targetCell === undefined ? undefined : behaviors.get(targetCell);
                    if (targetCellBehavior === 'empty' && (finalOptions.diagonalPassthrough || adjacentCellBehavior === 'empty')) {
                        row[x] = 0;
                        belowRow[x - offset] = cell;
                        continue;
                    }
                }
            }
        }
    }

    return newData;
}