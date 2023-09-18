# Physixels

A small pixel based physics library that's really only one function

## Installing

Install this module with `yarn add physixels` or `npm i physixels`.

## Getting Started

### Import using ES6 Modules

```TS
import { step } from "physixels";
```

### Create Multidimensional Array of Data

```TS
const data = [
    [0, 0, 0, 2, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0],
];
```

### Run Physixels

```TS
const newData = step(data);
```

## Reference

```TS
type Options = {
    // Bias for pixel's drop direction
    // Default: 'random'
    bias: 'left' | 'right' | 'random';
    
    // Seed for if bias is 'random'
    // Default: null
    seed: string | null;
    
    // Skip to state after running X + 1 times
    // Default: 0
    skip: number;
    
    // If pixels can pass through blocks diagonally 
    // Default: true
    diagonalPassthrough: boolean;

    // A list of cell behaviors based on number
    // Default: 
    /* [
        { id: 0, behavior: 'empty' },
        { id: 1, behavior: 'static' },
        { id: 2, behavior: 'dynamic' }
    ] */
    cellTypes: {
        id: number;
        behavior: 'empty' | 'static' | 'dynamic';
    }[]
}

function step(data: number[][], options?: Partial<Options>): number[][]
```
