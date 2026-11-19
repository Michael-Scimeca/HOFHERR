/* Pure ISO/IEC 18004 QR Code encoder (Byte mode, ECC Level L, Versions 1–6)
   for crisp, zero-dependency SVG QR codes on printable butcher sheets. */

type VersionSpec = {
    version: number;
    size: number;
    dataCodewords: number;
    ecCodewords: number;
    alignment: number[];
};

const VERSION_SPECS: VersionSpec[] = [
    { version: 1, size: 21, dataCodewords: 19, ecCodewords: 7, alignment: [] },
    { version: 2, size: 25, dataCodewords: 34, ecCodewords: 10, alignment: [6, 18] },
    { version: 3, size: 29, dataCodewords: 55, ecCodewords: 15, alignment: [6, 22] },
    { version: 4, size: 33, dataCodewords: 80, ecCodewords: 20, alignment: [6, 26] },
    { version: 5, size: 37, dataCodewords: 108, ecCodewords: 26, alignment: [6, 30] },
];

const GF_EXP = new Uint8Array(512);
const GF_LOG = new Uint8Array(256);

(() => {
    let x = 1;
    for (let i = 0; i < 255; i++) {
        GF_EXP[i] = x;
        GF_LOG[x] = i;
        x <<= 1;
        if (x & 0x100) x ^= 0x11d;
    }
    for (let i = 255; i < 512; i++) {
        GF_EXP[i] = GF_EXP[i - 255];
    }
})();

function gfMul(a: number, b: number): number {
    if (a === 0 || b === 0) return 0;
    return GF_EXP[GF_LOG[a] + GF_LOG[b]];
}

function rsGeneratorPoly(degree: number): Uint8Array {
    let poly = new Uint8Array([1]);
    for (let i = 0; i < degree; i++) {
        const next = new Uint8Array(poly.length + 1);
        const root = GF_EXP[i];
        for (let j = 0; j < poly.length; j++) {
            next[j] ^= poly[j];
            next[j + 1] ^= gfMul(poly[j], root);
        }
        poly = next;
    }
    return poly;
}

function rsRemainder(data: Uint8Array, ecCount: number): Uint8Array {
    const gen = rsGeneratorPoly(ecCount);
    const rem = new Uint8Array(ecCount);
    for (let i = 0; i < data.length; i++) {
        const factor = data[i] ^ rem[0];
        rem.copyWithin(0, 1);
        rem[ecCount - 1] = 0;
        if (factor !== 0) {
            for (let j = 0; j < ecCount; j++) {
                rem[j] ^= gfMul(gen[j + 1], factor);
            }
        }
    }
    return rem;
}

function computeFormatBits(mask: number): number {
    // ECC Level L = 01
    const data = (0b01 << 3) | (mask & 0b111);
    let rem = data << 10;
    for (let bit = 14; bit >= 10; bit--) {
        if ((rem >>> bit) & 1) {
            rem ^= 0x537 << (bit - 10);
        }
    }
    return ((data << 10) | rem) ^ 0x5412;
}

function maskTest(mask: number, r: number, c: number): boolean {
    switch (mask) {
        case 0:
            return (r + c) % 2 === 0;
        case 1:
            return r % 2 === 0;
        case 2:
            return c % 3 === 0;
        case 3:
            return (r + c) % 3 === 0;
        case 4:
            return (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0;
        case 5:
            return ((r * c) % 2) + ((r * c) % 3) === 0;
        case 6:
            return (((r * c) % 2) + ((r * c) % 3)) % 2 === 0;
        default:
            return (((r + c) % 2) + ((r * c) % 3)) % 2 === 0;
    }
}

function scoreMatrix(modules: boolean[][]): number {
    const n = modules.length;
    let penalty = 0;

    // Rule 1: runs of 5+ identical modules in rows & cols
    for (let r = 0; r < n; r++) {
        let runLen = 1;
        for (let c = 1; c < n; c++) {
            if (modules[r][c] === modules[r][c - 1]) {
                runLen++;
                if (runLen === 5) penalty += 3;
                else if (runLen > 5) penalty += 1;
            } else {
                runLen = 1;
            }
        }
    }
    for (let c = 0; c < n; c++) {
        let runLen = 1;
        for (let r = 1; r < n; r++) {
            if (modules[r][c] === modules[r - 1][c]) {
                runLen++;
                if (runLen === 5) penalty += 3;
                else if (runLen > 5) penalty += 1;
            } else {
                runLen = 1;
            }
        }
    }

    // Rule 2: 2x2 blocks
    for (let r = 0; r < n - 1; r++) {
        for (let c = 0; c < n - 1; c++) {
            const v = modules[r][c];
            if (v === modules[r][c + 1] && v === modules[r + 1][c] && v === modules[r + 1][c + 1]) {
                penalty += 3;
            }
        }
    }

    return penalty;
}

export function encodeQrMatrix(text: string): boolean[][] {
    const bytes = new TextEncoder().encode(text);
    const spec = VERSION_SPECS.find(s => bytes.length + 2 <= s.dataCodewords);
    if (!spec) {
        throw new Error(`QR payload too long (${bytes.length} bytes; max 106 bytes)`);
    }

    // Assemble bit stream: Byte mode (0100) + 8-bit length + bytes + terminator + pad bytes
    const bits: number[] = [];
    const pushBits = (val: number, len: number) => {
        for (let i = len - 1; i >= 0; i--) {
            bits.push((val >>> i) & 1);
        }
    };

    pushBits(0b0100, 4);
    pushBits(bytes.length, 8);
    for (const b of bytes) pushBits(b, 8);

    const capacityBits = spec.dataCodewords * 8;
    const terminator = Math.min(4, capacityBits - bits.length);
    for (let i = 0; i < terminator; i++) bits.push(0);
    while (bits.length % 8 !== 0) bits.push(0);

    const padBytes = [0xec, 0x11];
    let padIdx = 0;
    while (bits.length < capacityBits) {
        pushBits(padBytes[padIdx % 2], 8);
        padIdx++;
    }

    const dataCw = new Uint8Array(spec.dataCodewords);
    for (let i = 0; i < spec.dataCodewords; i++) {
        let byte = 0;
        for (let b = 0; b < 8; b++) byte = (byte << 1) | bits[i * 8 + b];
        dataCw[i] = byte;
    }

    const ecCw = rsRemainder(dataCw, spec.ecCodewords);
    const allBits: number[] = [];
    for (const b of dataCw) {
        for (let i = 7; i >= 0; i--) allBits.push((b >>> i) & 1);
    }
    for (const b of ecCw) {
        for (let i = 7; i >= 0; i--) allBits.push((b >>> i) & 1);
    }

    const n = spec.size;
    const baseModules: boolean[][] = Array.from({ length: n }, () => Array<boolean>(n).fill(false));
    const isFunction: boolean[][] = Array.from({ length: n }, () => Array<boolean>(n).fill(false));

    const setFunc = (r: number, c: number, dark: boolean) => {
        if (r < 0 || r >= n || c < 0 || c >= n) return;
        baseModules[r][c] = dark;
        isFunction[r][c] = true;
    };

    const drawFinder = (topR: number, leftC: number) => {
        for (let dr = -1; dr <= 7; dr++) {
            for (let dc = -1; dc <= 7; dc++) {
                const isSep = dr === -1 || dr === 7 || dc === -1 || dc === 7;
                const isOuter = dr === 0 || dr === 6 || dc === 0 || dc === 6;
                const isInner = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4;
                setFunc(topR + dr, leftC + dc, !isSep && (isOuter || isInner));
            }
        }
    };

    drawFinder(0, 0);
    drawFinder(0, n - 7);
    drawFinder(n - 7, 0);

    // Timing patterns
    for (let i = 8; i < n - 8; i++) {
        const dark = i % 2 === 0;
        setFunc(6, i, dark);
        setFunc(i, 6, dark);
    }

    // Alignment patterns
    const align = spec.alignment;
    for (const ar of align) {
        for (const ac of align) {
            const overlapsFinder =
                (ar <= 8 && ac <= 8) || (ar <= 8 && ac >= n - 8) || (ar >= n - 8 && ac <= 8);
            if (overlapsFinder) continue;
            for (let dr = -2; dr <= 2; dr++) {
                for (let dc = -2; dc <= 2; dc++) {
                    const dist = Math.max(Math.abs(dr), Math.abs(dc));
                    setFunc(ar + dr, ac + dc, dist !== 1);
                }
            }
        }
    }

    // Reserve format areas + fixed dark module
    for (let i = 0; i <= 8; i++) {
        if (i !== 6) {
            setFunc(8, i, false);
            setFunc(i, 8, false);
        }
    }
    for (let i = 0; i < 8; i++) {
        setFunc(8, n - 1 - i, false);
        setFunc(n - 1 - i, 8, false);
    }
    setFunc(n - 8, 8, true);

    // Place data bits in 2-col zigzag
    let bitIdx = 0;
    let upward = true;
    for (let rightCol = n - 1; rightCol >= 1; rightCol -= 2) {
        if (rightCol === 6) rightCol = 5;
        for (let step = 0; step < n; step++) {
            const r = upward ? n - 1 - step : step;
            for (const c of [rightCol, rightCol - 1]) {
                if (!isFunction[r][c]) {
                    baseModules[r][c] = bitIdx < allBits.length ? allBits[bitIdx] === 1 : false;
                    bitIdx++;
                }
            }
        }
        upward = !upward;
    }

    const writeFormatBits = (grid: boolean[][], mask: number) => {
        const fmt = computeFormatBits(mask);
        const bit = (i: number) => ((fmt >>> i) & 1) === 1;

        // Top-left copy (MSB = bit 14 -> LSB = bit 0)
        const tlCoords: [number, number][] = [
            [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5],
            [8, 7], [8, 8], [7, 8],
            [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8],
        ];
        for (let i = 0; i < 15; i++) {
            const [r, c] = tlCoords[i];
            grid[r][c] = bit(14 - i);
        }

        // Bottom-left + top-right copy
        for (let i = 0; i < 7; i++) {
            grid[n - 1 - i][8] = bit(14 - i);
        }
        for (let i = 0; i < 8; i++) {
            grid[8][n - 8 + i] = bit(7 - i);
        }
        grid[n - 8][8] = true;
    };

    let bestGrid = baseModules;
    let bestScore = Number.POSITIVE_INFINITY;

    for (let mask = 0; mask < 8; mask++) {
        const candidate = baseModules.map((row, r) =>
            row.map((val, c) => (isFunction[r][c] ? val : val !== maskTest(mask, r, c)))
        );
        writeFormatBits(candidate, mask);
        const score = scoreMatrix(candidate);
        if (score < bestScore) {
            bestScore = score;
            bestGrid = candidate;
        }
    }

    return bestGrid;
}

/** Build a single SVG path string (`Mx y h1 v1 h-1 z`) with a `quietZone` margin. */
export function buildQrSvgPath(text: string, quietZone = 2): { path: string; viewSize: number } {
    const matrix = encodeQrMatrix(text);
    const n = matrix.length;
    const viewSize = n + quietZone * 2;
    let d = '';
    for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
            if (matrix[r][c]) {
                d += `M${c + quietZone} ${r + quietZone}h1v1h-1z`;
            }
        }
    }
    return { path: d, viewSize };
}

