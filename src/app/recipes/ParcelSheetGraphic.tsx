import Link from 'next/link';
import { buildQrSvgPath } from '@/lib/qr-code';
import {
    PARCEL_OVEN_SAFETY_WARNING,
    type ResolvedCookingSheet,
    type ResolvedSheetZone,
    type ZonePartCallout,
    type ZoneShapeKind,
} from './sheets-data';
import styles from './parcel-sheet.module.css';

const INK = '#111111';
const RED = 'var(--sheet-accent, #111111)';
const INK_MUTED = '#2a2a2a';
const PARCHMENT = 'var(--sheet-paper, #ffffff)';
const HEADING_FONT = 'var(--font-heading), "Yanone Kaffeesatz", Impact, sans-serif';

type HatchIds = {
    diag: string;
    cross: string;
    fine: string;
    redDiag: string;
};

function getHatchIds(slug: string): HatchIds {
    return {
        diag: `wc-diag-${slug}`,
        cross: `wc-cross-${slug}`,
        fine: `wc-fine-${slug}`,
        redDiag: `wc-red-${slug}`,
    };
}

/** Woodcut parallel burin & cross-hatch pattern definitions — pure crisp ink lines, zero solid fills. */
function WoodcutDefs({ hatch }: { hatch: HatchIds }) {
    return (
        <defs>
            <pattern id={hatch.diag} width={6.5} height={6.5} patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
                <line x1={0} y1={0} x2={0} y2={6.5} stroke={INK} strokeWidth={1.05} />
            </pattern>
            <pattern id={hatch.cross} width={7} height={7} patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
                <line x1={0} y1={0} x2={0} y2={7} stroke={INK} strokeWidth={1.15} />
                <line x1={0} y1={0} x2={7} y2={0} stroke={INK} strokeWidth={0.75} />
            </pattern>
            <pattern id={hatch.fine} width={4.8} height={4.8} patternUnits="userSpaceOnUse" patternTransform="rotate(-42)">
                <line x1={0} y1={0} x2={0} y2={4.8} stroke={INK} strokeWidth={0.85} />
            </pattern>
            <pattern id={hatch.redDiag} width={6} height={6} patternUnits="userSpaceOnUse" patternTransform="rotate(42)">
                <line x1={0} y1={0} x2={0} y2={6} stroke={RED} strokeWidth={0.9} />
            </pattern>
        </defs>
    );
}

/** Double-bordered parchment knockout butcher tag with notched woodcut ends. */
function WoodcutCartouche({
    x,
    y,
    w,
    h = 28,
    text,
    accent = false,
}: {
    x: number;
    y: number;
    w: number;
    h?: number;
    text: string;
    accent?: boolean;
}) {
    const hw = w / 2;
    const hh = h / 2;
    const notch = 5;
    const stroke = accent ? RED : INK;
    const d = `M ${x - hw + notch} ${y - hh}
               L ${x + hw - notch} ${y - hh}
               L ${x + hw} ${y}
               L ${x + hw - notch} ${y + hh}
               L ${x - hw + notch} ${y + hh}
               L ${x - hw} ${y} Z`;
    return (
        <g>
            <path d={d} fill={PARCHMENT} stroke={stroke} strokeWidth={1.8} />
            <line x1={x - hw + notch + 4} y1={y - hh + 3} x2={x + hw - notch - 4} y2={y - hh + 3} stroke={stroke} strokeWidth={0.7} />
            <line x1={x - hw + notch + 4} y1={y + hh - 3} x2={x + hw - notch - 4} y2={y + hh - 3} stroke={stroke} strokeWidth={0.7} />
            <text
                x={x}
                y={y + 6}
                textAnchor="middle"
                fontFamily={HEADING_FONT}
                fontSize={16.5}
                fontWeight={800}
                letterSpacing={0.8}
                fill={stroke}
            >
                {text}
            </text>
        </g>
    );
}

/** Direct product + exact quantity micro-stamp placed right inside or on each individual ingredient shape. */
function PartMicroStamp({
    x,
    y,
    w,
    part,
    accent = false,
    compact = false,
}: {
    x: number;
    y: number;
    w: number;
    part?: ZonePartCallout;
    accent?: boolean;
    compact?: boolean;
}) {
    if (!part) return null;
    const hasDetail = Boolean(part.detail) && !compact;
    const subLine = compact && part.detail ? `${part.amount} · ${part.detail}` : part.amount;
    const autoW = Math.max(
        w,
        Math.ceil(subLine.length * (compact ? 5.6 : 6.1) + 16),
        Math.ceil(part.product.length * (compact ? 6.8 : 7.5) + 16)
    );
    const h = hasDetail ? 42 : 30;
    const hw = autoW / 2;
    const hh = h / 2;
    const borderStroke = accent ? RED : INK;

    return (
        <g>
            <rect
                x={x - hw}
                y={y - hh}
                width={autoW}
                height={h}
                rx={3}
                fill={PARCHMENT}
                stroke={borderStroke}
                strokeWidth={1.5}
            />
            <line
                x1={x - hw + 3}
                y1={y - hh + 2.5}
                x2={x + hw - 3}
                y2={y - hh + 2.5}
                stroke={borderStroke}
                strokeWidth={0.6}
            />
            <text
                x={x}
                y={hasDetail ? y - 5 : y - 1}
                textAnchor="middle"
                fontFamily={HEADING_FONT}
                fontSize={compact ? 13.5 : 15}
                fontWeight={800}
                letterSpacing={0.55}
                fill={INK}
            >
                {part.product}
            </text>
            <text
                x={x}
                y={hasDetail ? y + 8 : y + 11}
                textAnchor="middle"
                fontSize={compact ? 8.8 : 9.6}
                fontWeight={800}
                letterSpacing={0.25}
                fill={RED}
            >
                {subLine}
            </text>
            {hasDetail && (
                <text
                    x={x}
                    y={y + 18}
                    textAnchor="middle"
                    fontSize={8.2}
                    fontWeight={700}
                    letterSpacing={0.25}
                    fill={INK_MUTED}
                >
                    {part.detail}
                </text>
            )}
        </g>
    );
}

/** Negative-space knockout butcher cleaver badge with hanging hole & condensed step numeral. */
function CleaverStepBadge({ x, y, step }: { x: number; y: number; step: number }) {
    return (
        <g transform={`translate(${x}, ${y}) rotate(-10)`}>
            <path
                d="M -24 -17
                   L 14 -15
                   L 15 -4
                   L 34 -3
                   C 38 -3, 39 5, 34 6
                   L 14 5
                   L 12 12
                   C 2 16, -15 16, -24 10 Z"
                fill={PARCHMENT}
                stroke={RED}
                strokeWidth={2.2}
                strokeLinejoin="round"
            />
            <line x1={-15} y1={-13.5} x2={11} y2={-12} stroke={INK} strokeWidth={0.9} />
            <circle cx={-18.5} cy={-11.5} r={2.7} fill={PARCHMENT} stroke={RED} strokeWidth={1.6} />
            <circle cx={21} cy={1.2} r={1.2} fill={INK} />
            <circle cx={29} cy={1.6} r={1.2} fill={INK} />
            <text
                x={-5}
                y={8}
                textAnchor="middle"
                fontFamily={HEADING_FONT}
                fontSize={22}
                fontWeight={800}
                fill={RED}
            >
                {`0${step}`}
            </text>
        </g>
    );
}

/** Botanical woodcut citrus wheel with hatched zest rind, 10 pulp segments, and center product stamp. */
function LemonWheelSvg({
    cx,
    cy,
    r,
    hatch,
    part,
}: {
    cx: number;
    cy: number;
    r: number;
    hatch: HatchIds;
    part?: ZonePartCallout;
}) {
    const outerPith = r * 0.91;
    const innerPith = r * 0.82;
    const hub = r * 0.14;
    const segCount = 10;
    const zestTicks = Array.from({ length: 36 }, (_, i) => i * 10);
    const segments = Array.from({ length: segCount }, (_, i) => i);

    return (
        <g>
            <path
                d={`M ${cx - r} ${cy} A ${r} ${r} 0 1 0 ${cx + r} ${cy} A ${r} ${r} 0 1 0 ${cx - r} ${cy} Z
                    M ${cx - outerPith} ${cy} A ${outerPith} ${outerPith} 0 1 1 ${cx + outerPith} ${cy} A ${outerPith} ${outerPith} 0 1 1 ${cx - outerPith} ${cy} Z`}
                fill={`url(#${hatch.fine})`}
                fillRule="evenodd"
                stroke={INK}
                strokeWidth={2.3}
            />
            <circle cx={cx} cy={cy} r={innerPith} fill={PARCHMENT} stroke={INK} strokeWidth={1.3} />
            {zestTicks.map(deg => {
                const rad = (deg * Math.PI) / 180;
                return (
                    <line
                        key={deg}
                        x1={cx + Math.cos(rad) * outerPith}
                        y1={cy + Math.sin(rad) * outerPith}
                        x2={cx + Math.cos(rad) * r}
                        y2={cy + Math.sin(rad) * r}
                        stroke={INK}
                        strokeWidth={0.8}
                    />
                );
            })}
            {segments.map(idx => {
                const a1 = ((idx * 360) / segCount + 3.5) * (Math.PI / 180);
                const a2 = (((idx + 1) * 360) / segCount - 3.5) * (Math.PI / 180);
                const aMid = (a1 + a2) / 2;
                const rIn = hub + 4;
                const rOut = innerPith - 4;
                const x1 = cx + Math.cos(a1) * rIn;
                const y1 = cy + Math.sin(a1) * rIn;
                const x2 = cx + Math.cos(a1) * rOut;
                const y2 = cy + Math.sin(a1) * rOut;
                const x3 = cx + Math.cos(a2) * rOut;
                const y3 = cy + Math.sin(a2) * rOut;
                const x4 = cx + Math.cos(a2) * rIn;
                const y4 = cy + Math.sin(a2) * rIn;
                return (
                    <g key={idx}>
                        <path
                            d={`M ${x1} ${y1} L ${x2} ${y2} A ${rOut} ${rOut} 0 0 1 ${x3} ${y3} L ${x4} ${y4} Z`}
                            fill="none"
                            stroke={INK}
                            strokeWidth={1.25}
                            strokeLinejoin="round"
                        />
                        {[-0.08, 0, 0.08].map((da, vi) => {
                            const va = aMid + da;
                            const vStart = rIn + (vi === 1 ? 8 : 16);
                            const vEnd = rOut - (vi === 1 ? 6 : 14);
                            return (
                                <line
                                    key={da}
                                    x1={cx + Math.cos(va) * vStart}
                                    y1={cy + Math.sin(va) * vStart}
                                    x2={cx + Math.cos(va) * vEnd}
                                    y2={cy + Math.sin(va) * vEnd}
                                    stroke={INK}
                                    strokeWidth={0.85}
                                />
                            );
                        })}
                    </g>
                );
            })}
            <circle cx={cx} cy={cy} r={hub} fill={PARCHMENT} stroke={INK} strokeWidth={1.5} />
            {part && <PartMicroStamp x={cx} y={cy} w={128} part={part} compact />}
        </g>
    );
}

/** True-diameter ring containing an engraved 3D butter pat, top product pill, and slice thickness hint. */
function ButterPatMedallionSvg({
    cx,
    cy,
    r,
    part,
    hatch,
}: {
    cx: number;
    cy: number;
    r: number;
    part?: ZonePartCallout;
    hatch: HatchIds;
}) {
    const isLarge = r >= 55;
    const sx = r * 0.56;
    const sy = r * 0.31;
    const depth = r * 0.21;
    const cubeY = cy + (isLarge ? 2 : 3);
    const pillW = isLarge ? 104 : 84;
    const pillY = cy - r + (isLarge ? 8 : 4);

    return (
        <g>
            {/* True-scale outer placement diameter ring */}
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={RED} strokeWidth={2.4} />
            <circle cx={cx} cy={cy} r={r - 4.5} fill="none" stroke={INK} strokeWidth={0.9} strokeDasharray="5 3" />

            {/* Top knockout product pill ("UNSALTED BUTTER" / "BUTTER PAT") */}
            <rect
                x={cx - pillW / 2}
                y={pillY - 8.5}
                width={pillW}
                height={17}
                rx={3}
                fill={PARCHMENT}
                stroke={RED}
                strokeWidth={1.35}
            />
            <text
                x={cx}
                y={pillY + 4}
                textAnchor="middle"
                fontFamily={HEADING_FONT}
                fontSize={isLarge ? 13 : 11.5}
                fontWeight={800}
                letterSpacing={0.5}
                fill={RED}
            >
                {part?.product ?? 'UNSALTED BUTTER'}
            </text>

            {/* 3D isometric woodcut butter pat inside ring */}
            <path
                d={`M ${cx - sx} ${cubeY - depth * 0.25}
                    L ${cx} ${cubeY + sy - depth * 0.25}
                    L ${cx + sx} ${cubeY - depth * 0.25}
                    L ${cx + sx} ${cubeY + depth * 0.75}
                    L ${cx} ${cubeY + sy + depth * 0.75}
                    L ${cx - sx} ${cubeY + depth * 0.75} Z`}
                fill={`url(#${hatch.fine})`}
                stroke={INK}
                strokeWidth={1.4}
                strokeLinejoin="round"
            />
            <path
                d={`M ${cx} ${cubeY - sy - depth * 0.25}
                    L ${cx + sx} ${cubeY - depth * 0.25}
                    L ${cx} ${cubeY + sy - depth * 0.25}
                    L ${cx - sx} ${cubeY - depth * 0.25} Z`}
                fill={PARCHMENT}
                stroke={INK}
                strokeWidth={1.6}
                strokeLinejoin="round"
            />
            <text
                x={cx}
                y={cubeY + 2}
                textAnchor="middle"
                fontFamily={HEADING_FONT}
                fontSize={isLarge ? 14.5 : 11}
                fontWeight={800}
                letterSpacing={0.4}
                fill={INK}
            >
                {part?.amount ?? '1 TBSP'}
            </text>

            {/* Stick-butter slice thickness guide inside bottom of ring */}
            {part?.detail && (
                <g>
                    <rect
                        x={cx - (isLarge ? 38 : 26)}
                        y={cy + r - (isLarge ? 20 : 15)}
                        width={isLarge ? 76 : 52}
                        height={11}
                        rx={2}
                        fill={PARCHMENT}
                    />
                    <text
                        x={cx}
                        y={cy + r - (isLarge ? 11 : 7)}
                        textAnchor="middle"
                        fontSize={isLarge ? 8.5 : 7.6}
                        fontWeight={800}
                        fill={INK_MUTED}
                    >
                        {part.detail}
                    </text>
                </g>
            )}
        </g>
    );
}

/** Botanical woodcut garlic clove with longitudinal tunic ribs, hatched belly, and root beard. */
function GarlicCloveSvg({
    cx,
    cy,
    w,
    h,
    rotate = 0,
    hatch,
}: {
    cx: number;
    cy: number;
    w: number;
    h: number;
    rotate?: number;
    hatch: HatchIds;
}) {
    const hw = w / 2;
    const hh = h / 2;
    const outer = `M ${-hw} 0 C ${-hw} ${-hh * 0.98}, ${hw * 0.22} ${-hh * 1.02}, ${hw} 0 C ${hw * 0.22} ${hh * 1.02}, ${-hw} ${hh * 0.98}, ${-hw} 0 Z`;
    const shadow = `M ${-hw * 0.92} ${hh * 0.1} C ${-hw * 0.4} ${hh * 0.92}, ${hw * 0.25} ${hh * 0.92}, ${hw * 0.92} ${hh * 0.04}
                    C ${hw * 0.25} ${hh * 0.52}, ${-hw * 0.45} ${hh * 0.48}, ${-hw * 0.92} ${hh * 0.1} Z`;
    return (
        <g transform={`translate(${cx}, ${cy}) rotate(${rotate})`}>
            <path d={outer} fill={PARCHMENT} stroke={INK} strokeWidth={2} />
            <path d={shadow} fill={`url(#${hatch.fine})`} stroke={INK} strokeWidth={0.9} />
            <path d={`M ${-hw * 0.78} ${-hh * 0.12} Q ${-hw * 0.05} ${-hh * 0.56} ${hw * 0.78} ${-hh * 0.04}`} fill="none" stroke={INK} strokeWidth={1.1} />
            <path d={`M ${-hw * 0.8} 0 Q 0 ${-hh * 0.18} ${hw * 0.82} 0`} fill="none" stroke={INK} strokeWidth={0.9} />
            <path d={`M ${-hw * 0.72} ${hh * 0.16} Q 0 ${hh * 0.34} ${hw * 0.7} ${hh * 0.06}`} fill="none" stroke={INK} strokeWidth={0.85} />
            {[-7, -2, 3, 8].map(ry => (
                <line key={ry} x1={-hw} y1={ry} x2={-hw - 7} y2={ry * 1.35} stroke={INK} strokeWidth={1.1} strokeLinecap="round" />
            ))}
        </g>
    );
}

/** Woodcut botanical herb sprig with double-line woody stem, serrated/feathery leaflets, and leaf veins. */
function HerbSprigSvg({
    cx,
    cy,
    len,
    flip = false,
    hatch,
}: {
    cx: number;
    cy: number;
    len: number;
    flip?: boolean;
    hatch: HatchIds;
}) {
    const half = len / 2;
    const dir = flip ? -1 : 1;
    const stops = [-0.74, -0.48, -0.22, 0.04, 0.3, 0.56, 0.78];
    return (
        <g transform={`translate(${cx}, ${cy}) scale(${dir}, 1)`}>
            <path
                d={`M ${-half} 10 Q ${-half * 0.15} -12 ${half} -3`}
                fill="none"
                stroke={INK}
                strokeWidth={2.4}
                strokeLinecap="round"
            />
            {stops.map(t => {
                const lx = t * half;
                const ly = (1 - t * t) * -7 + (t < 0 ? 3 : -1);
                return (
                    <g key={t}>
                        <g transform={`translate(${lx + 6}, ${ly - 13}) rotate(-32)`}>
                            <path d="M -14 0 Q 0 -7.5 15 0 Q 0 7.5 -14 0 Z" fill={PARCHMENT} stroke={INK} strokeWidth={1.45} />
                            <path d="M -13 0 Q 0 7 14 0 Z" fill={`url(#${hatch.fine})`} />
                            <line x1={-12} y1={0} x2={12} y2={0} stroke={INK} strokeWidth={0.95} />
                        </g>
                        <g transform={`translate(${lx + 8}, ${ly + 13}) rotate(28)`}>
                            <path d="M -14 0 Q 0 -7.5 15 0 Q 0 7.5 -14 0 Z" fill={PARCHMENT} stroke={INK} strokeWidth={1.45} />
                            <path d="M -13 0 Q 0 7 14 0 Z" fill={`url(#${hatch.fine})`} />
                            <line x1={-12} y1={0} x2={12} y2={0} stroke={INK} strokeWidth={0.95} />
                        </g>
                    </g>
                );
            })}
        </g>
    );
}

function ZoneShapeSvg({
    zone,
    cx,
    cy,
    hatch,
}: {
    zone: ResolvedSheetZone;
    cx: number;
    cy: number;
    hatch: HatchIds;
}) {
    const { shape, parts } = zone;

    switch (shape) {
        case 'oil-ring':
            return (
                <g>
                    <circle cx={cx} cy={cy} r={90} fill="none" stroke={RED} strokeWidth={2.2} strokeDasharray="10 5" />
                    <circle cx={cx} cy={cy} r={83} fill="none" stroke={INK} strokeWidth={1} />
                    {[-54, -34, 34, 54].map(dy => (
                        <path
                            key={dy}
                            d={`M ${cx - 56} ${cy + dy * 0.55} Q ${cx} ${cy + dy * 1.15} ${cx + 56} ${cy + dy * 0.5}`}
                            fill="none"
                            stroke={INK}
                            strokeWidth={1.15}
                        />
                    ))}
                    <path
                        d={`M ${cx} ${cy - 44} C ${cx + 14} ${cy - 24}, ${cx + 16} ${cy - 6}, ${cx} ${cy + 2} C ${cx - 16} ${cy - 6}, ${cx - 14} ${cy - 24}, ${cx} ${cy - 44} Z`}
                        fill={`url(#${hatch.fine})`}
                        stroke={INK}
                        strokeWidth={1.8}
                    />
                    <PartMicroStamp x={cx} y={cy + 34} w={138} part={parts[0]} compact />
                </g>
            );

        case 'salmon-pair':
            // Two true-size 6 oz fillets: each 2.15 in wide (215) x 5.20 in tall (520)
            return (
                <g>
                    {[-168, 168].map((dx, idx) => {
                        const fx = cx + dx;
                        const roman = idx === 0 ? 'I' : 'II';
                        const outerPath = `M ${fx - 94} ${cy - 256}
                            Q ${fx} ${cy - 266} ${fx + 96} ${cy - 250}
                            C ${fx + 112} ${cy - 110}, ${fx + 106} ${cy + 95}, ${fx + 76} ${cy + 254}
                            Q ${fx} ${cy + 266} ${fx - 80} ${cy + 252}
                            C ${fx - 108} ${cy + 95}, ${fx - 110} ${cy - 110}, ${fx - 94} ${cy - 256} Z`;
                        const innerPath = `M ${fx - 88} ${cy - 248}
                            Q ${fx} ${cy - 258} ${fx + 89} ${cy - 243}
                            C ${fx + 104} ${cy - 108}, ${fx + 98} ${cy + 92}, ${fx + 70} ${cy + 246}
                            Q ${fx} ${cy + 257} ${fx - 74} ${cy + 244}
                            C ${fx - 100} ${cy + 92}, ${fx - 102} ${cy - 108}, ${fx - 88} ${cy - 248} Z`;
                        const skinShadow = `M ${fx - 88} ${cy - 248}
                            C ${fx - 102} ${cy - 108}, ${fx - 100} ${cy + 92}, ${fx - 74} ${cy + 244}
                            L ${fx - 56} ${cy + 245}
                            C ${fx - 80} ${cy + 92}, ${fx - 82} ${cy - 108}, ${fx - 70} ${cy - 250} Z`;
                        return (
                            <g key={dx}>
                                <path d={outerPath} fill="none" stroke={RED} strokeWidth={3} />
                                <path d={innerPath} fill="none" stroke={INK} strokeWidth={1.4} />
                                <path d={skinShadow} fill={`url(#${hatch.cross})`} stroke={INK} strokeWidth={1.1} />
                                <path
                                    d={`M ${fx + 4} ${cy - 246} Q ${fx + 10} ${cy} ${fx - 2} ${cy + 190}`}
                                    fill="none"
                                    stroke={INK}
                                    strokeWidth={1.1}
                                    strokeDasharray="6 4"
                                />
                                {[-205, -155, -105, -55, -5, 45, 95, 145].map(my => (
                                    <g key={my}>
                                        <path
                                            d={`M ${fx - 64} ${cy + my + 18} Q ${fx + 8} ${cy + my - 22} ${fx + 84} ${cy + my + 12}`}
                                            fill="none"
                                            stroke={INK}
                                            strokeWidth={1.65}
                                            strokeLinecap="round"
                                        />
                                        <path
                                            d={`M ${fx + 18} ${cy + my - 7} Q ${fx + 54} ${cy + my - 2} ${fx + 82} ${cy + my + 17}`}
                                            fill="none"
                                            stroke={INK}
                                            strokeWidth={0.95}
                                        />
                                        <path
                                            d={`M ${fx - 62} ${cy + my + 24} Q ${fx - 34} ${cy + my + 9} ${fx - 10} ${cy + my + 1}`}
                                            fill="none"
                                            stroke={INK}
                                            strokeWidth={0.95}
                                        />
                                    </g>
                                ))}
                                <PartMicroStamp x={fx + 8} y={cy - 44} w={164} part={parts[idx] ?? parts[0]} accent />
                                <WoodcutCartouche
                                    x={fx + 4}
                                    y={cy + 216}
                                    w={178}
                                    text={parts[idx]?.cartouche ?? `FILLET ${roman} · 5.2" × 2.2"`}
                                />
                            </g>
                        );
                    })}
                </g>
            );

        case 'pork-tenderloin':
            // Single 7.20 in x 2.25 in (720 x 225) trimmed tenderloin cylinder
            return (
                <g>
                    <path
                        d={`M ${cx - 355} ${cy - 12}
                            C ${cx - 355} ${cy - 98}, ${cx - 210} ${cy - 114}, ${cx + 40} ${cy - 108}
                            C ${cx + 240} ${cy - 102}, ${cx + 358} ${cy - 68}, ${cx + 360} ${cy + 4}
                            C ${cx + 356} ${cy + 78}, ${cx + 235} ${cy + 106}, ${cx + 30} ${cy + 112}
                            C ${cx - 215} ${cy + 114}, ${cx - 355} ${cy + 92}, ${cx - 355} ${cy - 12} Z`}
                        fill="none"
                        stroke={RED}
                        strokeWidth={3}
                    />
                    <path
                        d={`M ${cx - 347} ${cy - 10}
                            C ${cx - 347} ${cy - 91}, ${cx - 205} ${cy - 106}, ${cx + 38} ${cy - 100}
                            C ${cx + 234} ${cy - 95}, ${cx + 350} ${cy - 62}, ${cx + 352} ${cy + 4}
                            C ${cx + 348} ${cy + 72}, ${cx + 230} ${cy + 98}, ${cx + 28} ${cy + 104}
                            C ${cx - 210} ${cy + 106}, ${cx - 347} ${cy + 85}, ${cx - 347} ${cy - 10} Z`}
                        fill="none"
                        stroke={INK}
                        strokeWidth={1.35}
                    />
                    <path
                        d={`M ${cx - 342} ${cy + 26}
                            C ${cx - 220} ${cy + 68}, ${cx + 120} ${cy + 66}, ${cx + 346} ${cy + 18}
                            C ${cx + 332} ${cy + 74}, ${cx + 220} ${cy + 98}, ${cx + 28} ${cy + 104}
                            C ${cx - 208} ${cy + 105}, ${cx - 332} ${cy + 82}, ${cx - 342} ${cy + 26} Z`}
                        fill={`url(#${hatch.diag})`}
                        stroke={INK}
                        strokeWidth={1}
                    />
                    <path d={`M ${cx - 305} ${cy - 54} Q ${cx - 60} ${cy - 82} ${cx + 285} ${cy - 44}`} fill="none" stroke={INK} strokeWidth={1.1} />
                    <path d={`M ${cx - 275} ${cy - 34} Q ${cx - 20} ${cy - 56} ${cx + 255} ${cy - 22}`} fill="none" stroke={INK} strokeWidth={0.9} />
                    {[-225, -82, 82, 225].map(tx => (
                        <g key={tx}>
                            <path
                                d={`M ${cx + tx - 2.5} ${cy - 102} Q ${cx + tx + 10} ${cy} ${cx + tx - 2.5} ${cy + 102}`}
                                fill="none"
                                stroke={INK}
                                strokeWidth={1.5}
                            />
                            <path
                                d={`M ${cx + tx + 2.5} ${cy - 102} Q ${cx + tx + 15} ${cy} ${cx + tx + 2.5} ${cy + 102}`}
                                fill="none"
                                stroke={INK}
                                strokeWidth={1.2}
                            />
                            <circle cx={cx + tx} cy={cy - 103} r={4} fill={PARCHMENT} stroke={INK} strokeWidth={1.5} />
                        </g>
                    ))}
                    <PartMicroStamp x={cx} y={cy - 4} w={308} part={parts[0]} accent />
                </g>
            );

        case 'pork-chops-pair':
            // Two bone-in rib chops: each 3.55 in wide (355) x 4.55 in tall (455)
            return (
                <g>
                    {[-195, 195].map((dx, idx) => {
                        const px = cx + dx;
                        const mirror = idx === 1 ? -1 : 1;
                        const roman = idx === 0 ? 'I' : 'II';
                        return (
                            <g key={dx} transform={`translate(${px}, ${cy}) scale(${mirror}, 1)`}>
                                <path
                                    d="M -140 -222
                                       C -108 -228, -88 -190, -82 -125
                                       C -18 -142, 128 -116, 162 -24
                                       C 186 48, 164 166, 86 212
                                       C 6 236, -98 220, -142 152
                                       C -176 92, -168 -88, -140 -222 Z"
                                    fill="none"
                                    stroke={RED}
                                    strokeWidth={3}
                                />
                                <path
                                    d="M -68 -118
                                       C -8 -134, 122 -108, 154 -20
                                       C 176 46, 156 158, 80 202
                                       L 62 186
                                       C 132 146, 150 48, 130 -12
                                       C 102 -92, -8 -112, -62 -98 Z"
                                    fill={`url(#${hatch.fine})`}
                                    stroke={INK}
                                    strokeWidth={1.3}
                                />
                                <path
                                    d="M -136 -214
                                       C -112 -218, -94 -184, -90 -120
                                       L -96 122
                                       C -118 134, -142 108, -150 58
                                       C -158 -24, -154 -112, -136 -214 Z"
                                    fill={`url(#${hatch.diag})`}
                                    stroke={INK}
                                    strokeWidth={1.8}
                                />
                                <ellipse cx={-122} cy={-204} rx={14} ry={8} transform="rotate(-18 -122 -204)" fill={PARCHMENT} stroke={INK} strokeWidth={1.5} />
                                <ellipse cx={18} cy={38} rx={94} ry={116} fill={PARCHMENT} stroke={INK} strokeWidth={1.8} />
                                <path
                                    d="M -46 -18 Q 16 -46 76 -8 M -58 26 Q 14 -6 82 32 M -52 72 Q 18 42 74 82 M -28 112 Q 20 94 56 118"
                                    fill="none"
                                    stroke={INK}
                                    strokeWidth={1.25}
                                    strokeLinecap="round"
                                />
                                <g transform={`scale(${mirror}, 1)`}>
                                    <PartMicroStamp x={mirror * 18} y={36} w={164} part={parts[idx] ?? parts[0]} accent />
                                    <WoodcutCartouche
                                        x={0}
                                        y={178}
                                        w={182}
                                        text={parts[idx]?.cartouche ?? `CHOP ${roman} · 4.6" × 3.6"`}
                                    />
                                </g>
                            </g>
                        );
                    })}
                </g>
            );

        case 'sausage-trio':
            // Three curved 5.20 in x 1.20 in (520 x 120) Italian sausage links
            return (
                <g>
                    {[-134, 0, 134].map((dy, idx) => {
                        const sy = cy + dy;
                        return (
                            <g key={dy}>
                                <path
                                    d={`M ${cx - 252} ${sy + 14}
                                        C ${cx - 262} ${sy - 46}, ${cx - 120} ${sy - 64}, ${cx} ${sy - 60}
                                        C ${cx + 120} ${sy - 56}, ${cx + 262} ${sy - 42}, ${cx + 252} ${sy + 16}
                                        C ${cx + 244} ${sy + 58}, ${cx + 115} ${sy + 52}, ${cx} ${sy + 50}
                                        C ${cx - 115} ${sy + 48}, ${cx - 244} ${sy + 56}, ${cx - 252} ${sy + 14} Z`}
                                    fill="none"
                                    stroke={RED}
                                    strokeWidth={2.8}
                                />
                                <path
                                    d={`M ${cx - 244} ${sy + 18}
                                        C ${cx - 120} ${sy + 24}, ${cx + 120} ${sy + 24}, ${cx + 244} ${sy + 18}
                                        C ${cx + 236} ${sy + 52}, ${cx + 112} ${sy + 48}, ${cx} ${sy + 46}
                                        C ${cx - 112} ${sy + 44}, ${cx - 236} ${sy + 50}, ${cx - 244} ${sy + 18} Z`}
                                    fill={`url(#${hatch.diag})`}
                                    stroke={INK}
                                    strokeWidth={1.1}
                                />
                                <path
                                    d={`M ${cx - 210} ${sy - 32} Q ${cx} ${sy - 46} ${cx + 210} ${sy - 30}`}
                                    fill="none"
                                    stroke={INK}
                                    strokeWidth={1.1}
                                    strokeDasharray="10 6"
                                />
                                <path
                                    d={`M ${cx - 253} ${sy + 12} L ${cx - 274} ${sy - 2} L ${cx - 269} ${sy + 14} L ${cx - 274} ${sy + 28} Z
                                        M ${cx + 253} ${sy + 14} L ${cx + 274} ${sy} L ${cx + 269} ${sy + 16} L ${cx + 274} ${sy + 30} Z`}
                                    fill={`url(#${hatch.fine})`}
                                    stroke={INK}
                                    strokeWidth={1.6}
                                    strokeLinejoin="round"
                                />
                                <PartMicroStamp x={cx} y={sy - 6} w={252} part={parts[idx] ?? parts[0]} accent compact />
                            </g>
                        );
                    })}
                </g>
            );

        case 'chicken-thighs-pair':
            // Two bone-in skin-on chicken thighs: each 3.55 in wide (355) x 4.35 in tall (435)
            return (
                <g>
                    {[-195, 195].map((dx, idx) => {
                        const tx = cx + dx;
                        const roman = idx === 0 ? 'I' : 'II';
                        return (
                            <g key={dx}>
                                <path
                                    d={`M ${tx - 132} ${cy - 188}
                                        C ${tx - 52} ${cy - 224}, ${tx + 88} ${cy - 216}, ${tx + 148} ${cy - 142}
                                        C ${tx + 188} ${cy - 54}, ${tx + 174} ${cy + 98}, ${tx + 116} ${cy + 182}
                                        C ${tx + 46} ${cy + 224}, ${tx - 84} ${cy + 216}, ${tx - 146} ${cy + 148}
                                        C ${tx - 186} ${cy + 68}, ${tx - 184} ${cy - 114}, ${tx - 132} ${cy - 188} Z`}
                                    fill="none"
                                    stroke={RED}
                                    strokeWidth={3}
                                />
                                <path
                                    d={`M ${tx - 140} ${cy + 140}
                                        C ${tx - 178} ${cy + 64}, ${tx - 176} ${cy - 108}, ${tx - 126} ${cy - 180}
                                        L ${tx - 102} ${cy - 166}
                                        C ${tx - 148} ${cy - 98}, ${tx - 150} ${cy + 58}, ${tx - 116} ${cy + 126}
                                        C ${tx - 64} ${cy + 188}, ${tx + 42} ${cy + 196}, ${tx + 106} ${cy + 162}
                                        L ${tx + 112} ${cy + 176}
                                        C ${tx + 44} ${cy + 216}, ${tx - 80} ${cy + 208}, ${tx - 140} ${cy + 140} Z`}
                                    fill={`url(#${hatch.diag})`}
                                    stroke={INK}
                                    strokeWidth={1.3}
                                />
                                <path
                                    d={`M ${tx - 88} ${cy - 146} Q ${tx + 24} ${cy - 186} ${tx + 118} ${cy - 112}
                                        M ${tx - 64} ${cy - 86} Q ${tx + 22} ${cy - 118} ${tx + 112} ${cy - 44}
                                        M ${tx - 58} ${cy - 18} Q ${tx + 26} ${cy - 48} ${tx + 108} ${cy + 24}
                                        M ${tx - 48} ${cy + 52} Q ${tx + 24} ${cy + 24} ${tx + 96} ${cy + 86}`}
                                    fill="none"
                                    stroke={INK}
                                    strokeWidth={1.25}
                                    strokeLinecap="round"
                                />
                                <line
                                    x1={tx - 68}
                                    y1={cy - 132}
                                    x2={tx + 68}
                                    y2={cy + 112}
                                    stroke={INK}
                                    strokeWidth={1.8}
                                    strokeDasharray="9 5"
                                />
                                <PartMicroStamp x={tx + 8} y={cy - 14} w={176} part={parts[idx] ?? parts[0]} accent />
                                <WoodcutCartouche
                                    x={tx + 4}
                                    y={cy + 158}
                                    w={188}
                                    text={parts[idx]?.cartouche ?? `THIGH ${roman} · 4.35" × 3.55"`}
                                />
                            </g>
                        );
                    })}
                </g>
            );

        case 'pepper-onion-bed':
            return (
                <g>
                    <rect
                        x={cx - 325}
                        y={cy - 104}
                        width={650}
                        height={208}
                        rx={24}
                        fill="none"
                        stroke={INK}
                        strokeWidth={1.8}
                        strokeDasharray="10 5"
                    />
                    {[-52, 26].map((py, i) => (
                        <path
                            key={py}
                            d={`M ${cx - 292} ${cy + py}
                                Q ${cx - 175} ${cy + py + (i === 0 ? -42 : 42)} ${cx - 48} ${cy + py}
                                L ${cx - 48} ${cy + py + 18}
                                Q ${cx - 175} ${cy + py + (i === 0 ? -24 : 60)} ${cx - 292} ${cy + py + 18} Z`}
                            fill={`url(#${hatch.fine})`}
                            stroke={RED}
                            strokeWidth={1.9}
                            strokeLinejoin="round"
                        />
                    ))}
                    <PartMicroStamp x={cx - 170} y={cy - 4} w={154} part={parts[0]} accent compact />

                    <path
                        d={`M ${cx - 12} ${cy - 52} A 86 68 0 0 1 ${cx + 154} ${cy + 34}
                            L ${cx + 136} ${cy + 40} A 68 52 0 0 0 ${cx - 4} ${cy - 34} Z`}
                        fill={`url(#${hatch.diag})`}
                        stroke={INK}
                        strokeWidth={1.6}
                    />
                    <path d={`M ${cx + 8} ${cy - 14} A 64 48 0 0 1 ${cx + 132} ${cy + 56}`} fill="none" stroke={INK} strokeWidth={1.5} />
                    <PartMicroStamp x={cx + 72} y={cy + 36} w={132} part={parts[1]} compact />

                    <circle cx={cx + 244} cy={cy} r={67.5} fill={PARCHMENT} stroke={RED} strokeWidth={2.1} strokeDasharray="6 3" />
                    <circle cx={cx + 244} cy={cy} r={58} fill={`url(#${hatch.fine})`} stroke={INK} strokeWidth={1.1} />
                    <PartMicroStamp x={cx + 244} y={cy} w={114} part={parts[2]} compact />
                </g>
            );

        case 'shallot-oil-bed':
            return (
                <g>
                    <ellipse cx={cx - 68} cy={cy} rx={92.5} ry={57.5} fill={`url(#${hatch.fine})`} stroke={INK} strokeWidth={2.1} />
                    <ellipse cx={cx - 68} cy={cy} rx={78} ry={46} fill={PARCHMENT} stroke={INK} strokeWidth={1.3} />
                    <ellipse cx={cx - 94} cy={cy} rx={36} ry={28} fill="none" stroke={INK} strokeWidth={1.2} />
                    <ellipse cx={cx - 38} cy={cy + 2} rx={30} ry={23} fill="none" stroke={INK} strokeWidth={1.2} />
                    <PartMicroStamp x={cx - 68} y={cy} w={138} part={parts[0]} compact />

                    <circle cx={cx + 96} cy={cy} r={54} fill="none" stroke={RED} strokeWidth={2} strokeDasharray="6 3" />
                    <circle cx={cx + 96} cy={cy} r={45} fill={`url(#${hatch.fine})`} stroke={INK} strokeWidth={1.1} />
                    <PartMicroStamp x={cx + 96} y={cy} w={106} part={parts[1]} compact />
                </g>
            );

        case 'oil-garlic-bed':
            return (
                <g>
                    <circle cx={cx - 66} cy={cy} r={80} fill="none" stroke={RED} strokeWidth={2} strokeDasharray="7 4" />
                    <circle cx={cx - 66} cy={cy} r={70} fill={`url(#${hatch.fine})`} stroke={INK} strokeWidth={1.1} />
                    <PartMicroStamp x={cx - 66} y={cy} w={122} part={parts[0]} compact />

                    <GarlicCloveSvg cx={cx + 76} cy={cy - 30} w={108} h={60} rotate={-12} hatch={hatch} />
                    <GarlicCloveSvg cx={cx + 92} cy={cy + 28} w={108} h={60} rotate={14} hatch={hatch} />
                    <PartMicroStamp x={cx + 88} y={cy + 2} w={136} part={parts[1]} compact />
                </g>
            );

        case 'seasoning-pair': {
            const left = parts[0] ?? { product: 'KOSHER SALT', amount: '1/2 TSP', detail: 'COARSE FLAKE' };
            const right = parts[1] ?? { product: 'BLACK PEPPER', amount: '1/4 TSP', detail: 'CRACKED' };
            return (
                <g>
                    {/* Left seasoning circle with exact product + amount */}
                    <circle cx={cx - 50} cy={cy} r={49} fill={PARCHMENT} stroke={INK} strokeWidth={2.1} />
                    <circle cx={cx - 50} cy={cy} r={43} fill="none" stroke={INK} strokeWidth={0.85} />
                    {[-18, 0, 18].map((sx, i) => (
                        <rect
                            key={sx}
                            x={cx - 50 + sx - 3.5}
                            y={cy - 33 + (i % 2) * 3}
                            width={6}
                            height={6}
                            transform={`rotate(${18 * (i + 1)} ${cx - 50 + sx} ${cy - 30})`}
                            fill="none"
                            stroke={INK}
                            strokeWidth={1.1}
                        />
                    ))}
                    <text
                        x={cx - 50}
                        y={cy - 5}
                        textAnchor="middle"
                        fontFamily={HEADING_FONT}
                        fontSize={14}
                        fontWeight={800}
                        letterSpacing={0.5}
                        fill={INK}
                    >
                        {left.product}
                    </text>
                    <text
                        x={cx - 50}
                        y={cy + 12}
                        textAnchor="middle"
                        fontFamily={HEADING_FONT}
                        fontSize={16}
                        fontWeight={800}
                        letterSpacing={0.5}
                        fill={RED}
                    >
                        {left.amount}
                    </text>
                    {left.detail && (
                        <text x={cx - 50} y={cy + 25} textAnchor="middle" fontSize={7.8} fontWeight={800} fill={INK_MUTED}>
                            {left.detail}
                        </text>
                    )}

                    {/* Right seasoning circle with exact product + amount */}
                    <circle cx={cx + 52} cy={cy} r={43} fill={`url(#${hatch.fine})`} stroke={INK} strokeWidth={2} />
                    <circle cx={cx + 52} cy={cy} r={35} fill={PARCHMENT} stroke={INK} strokeWidth={1} />
                    {[-10, 0, 10].map((px, i) => (
                        <circle key={px} cx={cx + 52 + px} cy={cy - 22 + (i % 2) * 3} r={2} fill={INK} />
                    ))}
                    <text
                        x={cx + 52}
                        y={cy - 4}
                        textAnchor="middle"
                        fontFamily={HEADING_FONT}
                        fontSize={13}
                        fontWeight={800}
                        letterSpacing={0.4}
                        fill={INK}
                    >
                        {right.product}
                    </text>
                    <text
                        x={cx + 52}
                        y={cy + 12}
                        textAnchor="middle"
                        fontFamily={HEADING_FONT}
                        fontSize={15}
                        fontWeight={800}
                        letterSpacing={0.4}
                        fill={RED}
                    >
                        {right.amount}
                    </text>
                    {right.detail && (
                        <text x={cx + 52} y={cy + 23} textAnchor="middle" fontSize={7.4} fontWeight={800} fill={INK_MUTED}>
                            {right.detail}
                        </text>
                    )}
                </g>
            );
        }

        case 'butter-garlic':
            // 1 tbsp butter = Ø 1.25 in (r=62.5), 1/2 tbsp butter = Ø 0.90 in (r=45), 1/2 garlic clove + direct stamp
            return (
                <g>
                    <ButterPatMedallionSvg cx={cx - 72} cy={cy} r={62.5} part={parts[0]} hatch={hatch} />
                    <ButterPatMedallionSvg cx={cx + 40} cy={cy - 6} r={45} part={parts[1]} hatch={hatch} />
                    <GarlicCloveSvg cx={cx + 124} cy={cy - 10} w={76} h={46} rotate={-14} hatch={hatch} />
                    <PartMicroStamp x={cx + 122} y={cy + 34} w={106} part={parts[2]} compact />
                </g>
            );

        case 'butter-mustard':
            return (
                <g>
                    <ButterPatMedallionSvg cx={cx - 58} cy={cy} r={62.5} part={parts[0]} hatch={hatch} />
                    <circle cx={cx + 66} cy={cy} r={47.5} fill={`url(#${hatch.fine})`} stroke={INK} strokeWidth={2} />
                    <circle cx={cx + 66} cy={cy} r={38} fill={PARCHMENT} stroke={INK} strokeWidth={1.1} />
                    <text
                        x={cx + 66}
                        y={cy - 5}
                        textAnchor="middle"
                        fontFamily={HEADING_FONT}
                        fontSize={13.5}
                        fontWeight={800}
                        letterSpacing={0.4}
                        fill={INK}
                    >
                        {parts[1]?.product ?? 'GRAIN MUSTARD'}
                    </text>
                    <text
                        x={cx + 66}
                        y={cy + 12}
                        textAnchor="middle"
                        fontFamily={HEADING_FONT}
                        fontSize={15.5}
                        fontWeight={800}
                        fill={RED}
                    >
                        {parts[1]?.amount ?? '1/2 TBSP'}
                    </text>
                    {parts[1]?.detail && (
                        <text x={cx + 66} y={cy + 24} textAnchor="middle" fontSize={7.5} fontWeight={800} fill={INK_MUTED}>
                            {parts[1].detail}
                        </text>
                    )}
                </g>
            );

        case 'butter-lemon':
            return (
                <g>
                    <ButterPatMedallionSvg cx={cx - 100} cy={cy} r={45} part={parts[0]} hatch={hatch} />
                    <LemonWheelSvg cx={cx + 52} cy={cy} r={107.5} hatch={hatch} part={parts[1]} />
                </g>
            );

        case 'mustard-honey-garlic':
            return (
                <g>
                    <circle cx={cx - 106} cy={cy} r={67.5} fill={`url(#${hatch.fine})`} stroke={INK} strokeWidth={2.1} />
                    <circle cx={cx - 106} cy={cy} r={54} fill={PARCHMENT} stroke={INK} strokeWidth={1.1} />
                    <PartMicroStamp x={cx - 106} y={cy} w={116} part={parts[0]} compact />

                    <circle cx={cx + 38} cy={cy} r={67.5} fill="none" stroke={RED} strokeWidth={2.3} />
                    <circle cx={cx + 38} cy={cy} r={58} fill={`url(#${hatch.redDiag})`} stroke={INK} strokeWidth={1} />
                    <PartMicroStamp x={cx + 38} y={cy} w={116} part={parts[1]} accent compact />

                    <GarlicCloveSvg cx={cx + 158} cy={cy - 14} w={92} h={52} rotate={-14} hatch={hatch} />
                    <PartMicroStamp x={cx + 158} y={cy + 32} w={108} part={parts[2]} compact />
                </g>
            );

        case 'lemon-dill':
            return (
                <g>
                    <LemonWheelSvg cx={cx - 12} cy={cy - 10} r={107.5} hatch={hatch} part={parts[0]} />
                    <HerbSprigSvg cx={cx + 4} cy={cy + 76} len={220} hatch={hatch} />
                    <PartMicroStamp x={cx + 4} y={cy + 78} w={152} part={parts[1]} compact />
                </g>
            );

        case 'cider-thyme':
            return (
                <g>
                    <circle cx={cx} cy={cy - 12} r={105} fill="none" stroke={RED} strokeWidth={2.1} strokeDasharray="8 4" />
                    <circle cx={cx} cy={cy - 12} r={92} fill={`url(#${hatch.fine})`} stroke={INK} strokeWidth={1.1} />
                    <circle cx={cx} cy={cy - 12} r={74} fill={PARCHMENT} stroke={INK} strokeWidth={1.2} />
                    <PartMicroStamp x={cx} y={cy - 14} w={132} part={parts[0]} accent compact />
                    <HerbSprigSvg cx={cx} cy={cy + 74} len={230} hatch={hatch} />
                    <PartMicroStamp x={cx} y={cy + 76} w={146} part={parts[1]} compact />
                </g>
            );

        case 'thyme-sprigs':
            return (
                <g>
                    <HerbSprigSvg cx={cx} cy={cy - 18} len={360} hatch={hatch} />
                    <HerbSprigSvg cx={cx} cy={cy + 24} len={330} flip hatch={hatch} />
                    <PartMicroStamp x={cx} y={cy + 2} w={196} part={parts[0]} compact />
                </g>
            );

        case 'garlic-pair':
            return (
                <g>
                    <GarlicCloveSvg cx={cx - 56} cy={cy - 10} w={95} h={55} rotate={-10} hatch={hatch} />
                    <PartMicroStamp x={cx - 56} y={cy + 30} w={104} part={parts[0]} compact />
                    <GarlicCloveSvg cx={cx + 58} cy={cy - 10} w={95} h={55} rotate={12} hatch={hatch} />
                    <PartMicroStamp x={cx + 58} y={cy + 30} w={104} part={parts[1]} compact />
                </g>
            );

        case 'splash-ring':
            return (
                <g>
                    <circle cx={cx} cy={cy - 8} r={105} fill="none" stroke={RED} strokeWidth={2.2} strokeDasharray="8 4" />
                    <circle cx={cx} cy={cy - 8} r={91} fill={`url(#${hatch.fine})`} stroke={INK} strokeWidth={1.1} />
                    <circle cx={cx} cy={cy - 8} r={72} fill={PARCHMENT} stroke={INK} strokeWidth={1.2} />
                    <circle cx={cx} cy={cy - 8} r={48} fill="none" stroke={RED} strokeWidth={1.2} strokeDasharray="4 3" />
                    <PartMicroStamp x={cx} y={cy - 8} w={148} part={parts[0]} accent />
                </g>
            );

        case 'stock-parsley':
            return (
                <g>
                    <circle cx={cx} cy={cy - 12} r={100} fill="none" stroke={RED} strokeWidth={2.1} strokeDasharray="8 4" />
                    <circle cx={cx} cy={cy - 12} r={87} fill={`url(#${hatch.fine})`} stroke={INK} strokeWidth={1.1} />
                    <circle cx={cx} cy={cy - 12} r={70} fill={PARCHMENT} stroke={INK} strokeWidth={1.2} />
                    <PartMicroStamp x={cx} y={cy - 14} w={136} part={parts[0]} accent compact />
                    <HerbSprigSvg cx={cx} cy={cy + 72} len={215} hatch={hatch} />
                    <PartMicroStamp x={cx} y={cy + 74} w={154} part={parts[1]} compact />
                </g>
            );
    }
}

function wrapSvgLines(text: string, maxChars: number): string[] {
    const words = text.split(/\s+/).filter(Boolean);
    const lines: string[] = [];
    let current = '';
    for (const word of words) {
        if (!current) {
            current = word;
        } else if (current.length + 1 + word.length <= maxChars) {
            current += ` ${word}`;
        } else {
            lines.push(current);
            current = word;
        }
    }
    if (current) lines.push(current);
    return lines;
}

function ZoneAnnotation({ zone, hatch }: { zone: ResolvedSheetZone; hatch: HatchIds }) {
    const cx = zone.cxIn * 100;
    const cy = zone.cyIn * 100;
    const halfW = (zone.widthIn * 100) / 2;
    const halfH = (zone.heightIn * 100) / 2;
    const isBottomCol = zone.cyIn > 8.5 && zone.widthIn < 3.8;

    const isButterLead = zone.shape === 'butter-garlic' || zone.shape === 'butter-mustard';
    const badgeX =
        zone.step === 1
            ? Math.max(176, cx - Math.min(halfW, 275) - 34)
            : isButterLead
              ? cx - halfW - 28
              : isBottomCol
                ? Math.max(166, cx - halfW + 8)
                : Math.max(174, cx - Math.min(halfW, 258) - 20);
    const badgeY =
        zone.step === 1
            ? Math.max(204, cy - halfH + 34)
            : isButterLead
              ? cy - halfH + 18
              : isBottomCol && zone.step === 5
                ? cy - halfH + 22
                : isBottomCol
                  ? cy - halfH + 6
                  : Math.max(154, cy - halfH + 14);

    const maxLabelChars = isBottomCol ? 32 : 68;
    const maxNoteChars = isBottomCol ? 36 : 76;
    const titleLines = wrapSvgLines(`${zone.step}. ${zone.label.toUpperCase()}`, maxLabelChars);
    const noteLines = wrapSvgLines(`${zone.instruction} (${zone.scaleNote})`, maxNoteChars);

    const lineStep = zone.isPrimaryCut ? 22 : 17.5;
    const topBlockHeight = titleLines.length * lineStep + noteLines.length * 13 + 12;

    const extraBottomOffset = zone.shape === 'garlic-pair' ? 14 : 0;
    const rawBottom = cy + halfH + extraBottomOffset;
    const tightBottom = rawBottom > 1025;
    const baseLabelY =
        zone.step === 1
            ? Math.max(141, cy - halfH - topBlockHeight + 12)
            : tightBottom
              ? rawBottom + 19
              : rawBottom + 26;

    const noteStartY = baseLabelY + titleLines.length * lineStep + 1;
    const ruleHalfW = isBottomCol ? 96 : zone.isPrimaryCut ? 185 : 135;

    return (
        <g>
            <ZoneShapeSvg zone={zone} cx={cx} cy={cy} hatch={hatch} />

            {/* Signature Butcher Cleaver Step Tag */}
            <CleaverStepBadge x={badgeX} y={badgeY} step={zone.step} />

            {/* Bold Condensed Woodcut Display Headline */}
            {titleLines.map((line, i) => (
                <text
                    key={line}
                    x={cx}
                    y={baseLabelY + i * lineStep}
                    textAnchor="middle"
                    fontFamily={HEADING_FONT}
                    fontSize={zone.isPrimaryCut ? 23.5 : 18.5}
                    fontWeight={800}
                    letterSpacing={0.8}
                    fill={INK}
                >
                    {line}
                </text>
            ))}

            {/* Engraved hairline rule between display headline and scale instruction */}
            <line
                x1={cx - ruleHalfW}
                y1={noteStartY - 11}
                x2={cx + ruleHalfW}
                y2={noteStartY - 11}
                stroke={INK}
                strokeWidth={0.95}
            />

            {noteLines.map((line, i) => (
                <text
                    key={line}
                    x={cx}
                    y={noteStartY + i * 13}
                    textAnchor="middle"
                    fontSize={11}
                    fontWeight={700}
                    fill={INK_MUTED}
                >
                    {line}
                </text>
            ))}
        </g>
    );
}

/** Compact micro-letterpress recipe tucked into natural right negative space — takes ZERO space from 1:1 portions. */
function ParcelInlineRecipePocket({ sheet }: { sheet: ResolvedCookingSheet }) {
    const xLeft = 852;
    const width = 156;
    const yTop = 356;
    const rows: { text: string; y: number; indent?: number; size?: number }[] = [];
    let y = yTop + 42;

    const allIngredients = [
        `${sheet.primaryBuy.item.name} (${sheet.primaryBuy.label})`,
        ...sheet.scaledIngredients.slice(0, 6),
    ];
    for (const ing of allIngredients) {
        const lines = wrapSvgLines(ing, 25);
        lines.forEach((ln, idx) => {
            rows.push({
                text: `${idx === 0 ? '• ' : '  '}${ln}`,
                y,
                size: 7.6,
            });
            y += 9.4;
        });
        y += 1.0;
    }

    const methodHeadingY = y + 8;
    const methodRuleY = methodHeadingY + 4;
    y = methodRuleY + 10;

    const methodSteps = [
        ...sheet.zones.slice(0, 4).map(z => `${z.instruction} (${z.label.split(',')[0]}).`),
        `Crimp & bake ${sheet.ovenTemp} ${sheet.bakeTime} to ${sheet.pullTemp}.`,
    ];
    methodSteps.forEach((st, sIdx) => {
        const lines = wrapSvgLines(`${sIdx + 1}. ${st}`, 25);
        lines.forEach((ln, idx) => {
            rows.push({
                text: ln,
                y,
                indent: idx === 0 ? 0 : 7,
                size: 7.4,
            });
            y += 9.2;
        });
        y += 1.0;
    });

    const boxHeight = y - yTop + 6;

    return (
        <g>
            <rect
                x={xLeft - 6}
                y={yTop - 4}
                width={width + 10}
                height={boxHeight}
                rx={3}
                fill={PARCHMENT}
                stroke={INK}
                strokeWidth={1.2}
            />
            <text
                x={xLeft}
                y={yTop + 12}
                fontFamily={HEADING_FONT}
                fontSize={13.5}
                fontWeight={800}
                letterSpacing={0.4}
                fill={INK}
            >
                RECIPE · 2 SERVINGS
            </text>
            <text x={xLeft} y={yTop + 22.5} fontSize={7.2} fontWeight={800} fill={INK}>
                {`${sheet.ovenTemp} · ${sheet.bakeTime.toUpperCase()} · ${sheet.pullTemp.toUpperCase()}`}
            </text>
            <line x1={xLeft} y1={yTop + 26.5} x2={xLeft + width - 2} y2={yTop + 26.5} stroke={INK} strokeWidth={1.2} />

            <text x={xLeft} y={yTop + 35.5} fontSize={7.8} fontWeight={800} letterSpacing={0.5} fill={INK}>
                INGREDIENTS
            </text>
            <line
                x1={xLeft}
                y1={yTop + 38}
                x2={xLeft + width - 2}
                y2={yTop + 38}
                stroke={INK}
                strokeWidth={0.75}
                strokeOpacity={0.6}
            />

            <text x={xLeft} y={methodHeadingY} fontSize={7.8} fontWeight={800} letterSpacing={0.5} fill={INK}>
                METHOD
            </text>
            <line
                x1={xLeft}
                y1={methodRuleY}
                x2={xLeft + width - 2}
                y2={methodRuleY}
                stroke={INK}
                strokeWidth={0.75}
                strokeOpacity={0.6}
            />

            {rows.map((r, idx) => (
                <text
                    key={`${r.y}-${idx}`}
                    x={xLeft + (r.indent ?? 0)}
                    y={r.y}
                    fontSize={r.size ?? 7.6}
                    fontWeight={700}
                    fill={INK}
                >
                    {r.text}
                </text>
            ))}
        </g>
    );
}
/** Engraved woodcut corner diamond rosette at the 4 intersections of the cooking bed. */
function BedCornerOrnament({ x, y }: { x: number; y: number }) {
    return (
        <g transform={`translate(${x}, ${y})`}>
            <rect x={-7} y={-7} width={14} height={14} transform="rotate(45)" fill={PARCHMENT} stroke={INK} strokeWidth={1.6} />
            <circle cx={0} cy={0} r={2.4} fill={RED} />
        </g>
    );
}

/** Shared 11.50 in x 12.40 in (1150 x 1240, 100 units = 1.00 in) vector workspace. */
function ParcelWorkspaceSvgContent({ sheet }: { sheet: ResolvedCookingSheet }) {
    const hatch = getHatchIds(sheet.slug);
    const quarterTicks = Array.from({ length: 36 }, (_, i) => i * 10);

    return (
        <>
            <WoodcutDefs hatch={hatch} />

            {/* Subtle inner engraved hairline border inside the central food bed */}
            <rect
                x={143}
                y={123}
                width={864}
                height={994}
                fill="none"
                stroke={INK}
                strokeWidth={0.8}
                strokeOpacity={0.45}
            />

            {/* ── Dashed Fold Lines (1.35 in side flaps, 1.15 in top & bottom end crimps) ── */}
            <g stroke={RED} strokeWidth={2.2} strokeDasharray="12 6" fill="none">
                <line x1={135} y1={0} x2={135} y2={1240} />
                <line x1={1015} y1={0} x2={1015} y2={1240} />
                <line x1={0} y1={115} x2={1150} y2={115} />
                <line x1={0} y1={115} x2={135} y2={0} />
                <line x1={1150} y1={115} x2={1015} y2={0} />
                <line x1={0} y1={1125} x2={1150} y2={1125} />
                <line x1={0} y1={1125} x2={135} y2={1240} />
                <line x1={1150} y1={1125} x2={1015} y2={1240} />
            </g>

            {/* Woodcut corner rosettes at the 4 fold intersections */}
            <BedCornerOrnament x={135} y={115} />
            <BedCornerOrnament x={1015} y={115} />
            <BedCornerOrnament x={135} y={1125} />
            <BedCornerOrnament x={1015} y={1125} />

            {/* ── Condensed Display Fold Labels in Outer Flaps ── */}
            <g fontFamily={HEADING_FONT} fontSize={18.5} fontWeight={800} fill={RED} letterSpacing={1.4}>
                <text x={68} y={620} textAnchor="middle" transform="rotate(-90 68 620)">
                    FOLD STEP 01 · LIFT LONG SIDE UP &amp; DOUBLE-CREASE 1/2 IN TWICE →
                </text>
                <text x={1082} y={620} textAnchor="middle" transform="rotate(90 1082 620)">
                    ← FOLD STEP 01 · MEET AT CENTER ABOVE FOOD &amp; DOUBLE-CREASE
                </text>
                <text x={575} y={40} textAnchor="middle">
                    FOLD STEP 02 · TUCK DIAGONAL CORNERS IN &amp; ROLL TOP FLAP DOWN TIGHT ↓
                </text>
                <text x={575} y={1184} textAnchor="middle">
                    ↑ FOLD STEP 03 · TUCK BOTTOM CORNERS IN, CRIMP HARD UNDERNEATH &amp; BAKE ON PAN
                </text>
            </g>

            {/* ── True-Scale 2.00 Inch Engraved Vernier Ruler + Milled US Quarter Seal ── */}
            <g transform="translate(158, 52)">
                <text
                    x={0}
                    y={6}
                    fontFamily={HEADING_FONT}
                    fontSize={14.5}
                    fontWeight={800}
                    fill={INK}
                    letterSpacing={1.1}
                >
                    100% PRINT SCALE CHECK
                </text>
                <rect x={0} y={14} width={200} height={14} fill="none" stroke={INK} strokeWidth={1.6} />
                <rect x={0} y={14} width={50} height={5} fill={`url(#${hatch.fine})`} />
                <rect x={100} y={14} width={50} height={5} fill={`url(#${hatch.fine})`} />
                {[0, 25, 50, 75, 100, 125, 150, 175, 200].map(tick => {
                    const major = tick % 100 === 0;
                    const half = tick % 50 === 0;
                    const h = major ? 14 : half ? 9 : 5;
                    return (
                        <line
                            key={tick}
                            x1={tick}
                            y1={28 - h}
                            x2={tick}
                            y2={28}
                            stroke={INK}
                            strokeWidth={major ? 1.8 : 1.1}
                        />
                    );
                })}
                <text x={0} y={43} fontFamily={HEADING_FONT} fontSize={14} fontWeight={800} fill={INK}>
                    0 IN
                </text>
                <text x={100} y={43} textAnchor="middle" fontFamily={HEADING_FONT} fontSize={14} fontWeight={800} fill={INK}>
                    1 IN
                </text>
                <text x={200} y={43} textAnchor="end" fontFamily={HEADING_FONT} fontSize={14} fontWeight={800} fill={INK}>
                    2 IN
                </text>
            </g>

            {/* Milled-edge US Quarter (Ø 0.955 in = r 47.75) Woodcut Seal */}
            <g transform="translate(945, 58)">
                <circle cx={0} cy={0} r={47.75} fill={PARCHMENT} stroke={INK} strokeWidth={1.8} />
                <circle cx={0} cy={0} r={42.5} fill="none" stroke={INK} strokeWidth={0.9} />
                {quarterTicks.map(deg => {
                    const rad = (deg * Math.PI) / 180;
                    return (
                        <line
                            key={deg}
                            x1={Math.cos(rad) * 43}
                            y1={Math.sin(rad) * 43}
                            x2={Math.cos(rad) * 47.75}
                            y2={Math.sin(rad) * 47.75}
                            stroke={INK}
                            strokeWidth={0.8}
                        />
                    );
                })}
                <text
                    x={0}
                    y={-2}
                    textAnchor="middle"
                    fontFamily={HEADING_FONT}
                    fontSize={14}
                    fontWeight={800}
                    letterSpacing={0.6}
                    fill={INK}
                >
                    US QUARTER
                </text>
                <text x={0} y={13} textAnchor="middle" fontSize={10} fontWeight={700} fill={RED}>
                    Ø 0.955 in
                </text>
            </g>

            {/* ── Butcher's Parcel Tip & Mandatory Oven Safety Rule inside bottom flap ── */}
            <text x={575} y={1210} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={INK_MUTED}>
                {`BUTCHER'S NOTE — ${sheet.parcelTip}`}
            </text>
            <text x={575} y={1230} textAnchor="middle" fontSize={12} fontWeight={800} fill={INK}>
                {PARCEL_OVEN_SAFETY_WARNING}
            </text>

            {/* ── Numbered Life-Size Woodcut Ingredient Outlines (100% True 1:1 Scale) + Micro-Recipe in Negative Space ── */}
            {sheet.zones.map(zone => (
                <ZoneAnnotation key={zone.step} zone={zone} hatch={hatch} />
            ))}

            <ParcelInlineRecipePocket sheet={sheet} />
        </>
    );
}

/** Miniature header butcher cleaver crest matching the woodcut graphic register. */
function HeaderCleaverCrest() {
    return (
        <svg className={styles.headerCleaverSvg} viewBox="0 0 64 42" aria-hidden="true">
            <path
                d="M 5 6 L 40 8 L 41 18 L 58 19 C 62 19, 62 27, 58 27 L 40 26 L 38 34 C 26 39, 12 38, 4 32 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth={3.2}
                strokeLinejoin="round"
            />
            <circle cx={11} cy={12} r={2.8} fill="none" stroke="currentColor" strokeWidth={2.2} />
            <line x1={17} y1={11} x2={36} y2={12} stroke={INK} strokeWidth={1.6} />
            <circle cx={46} cy={23} r={1.6} fill={INK} />
            <circle cx={54} cy={23} r={1.6} fill={INK} />
        </svg>
    );
}

/** Full 12 x 16 in printable half-sheet liner rendered on /recipes/[slug]/sheet. */
export default function ParcelSheetGraphic({ sheet }: { sheet: ResolvedCookingSheet }) {
    const qr = buildQrSvgPath(sheet.onlineOrderQrUrl, 2);

    return (
        <article
            className={styles.sheetPaper}
            data-testid="cooking-sheet-paper"
            aria-label={`${sheet.sheetTitle} 12 by 16 inch printable cooking sheet`}
        >
            <div className={styles.sheetSafeFrame}>
                <header className={styles.headerBand}>
                    <div className={styles.headerTitleRow}>
                        <HeaderCleaverCrest />
                        <div className={styles.headerTitleBlock}>
                            <h1 className={styles.sheetHeading}>{sheet.sheetTitle}</h1>
                            <p className={styles.sheetSubmeta}>
                                {`HOFHERR 12 × 16 IN PARCHMENT LINER · CUT: ${sheet.recipe.cut.toUpperCase()} · ZONES 01 → 0${sheet.zones.length}`}
                            </p>
                        </div>
                    </div>

                    <dl className={styles.headerSpecs}>
                        <div className={`${styles.specBox} ${styles.specBoxAccent}`}>
                            <dt>Oven</dt>
                            <dd>{sheet.ovenTemp}</dd>
                        </div>
                        <div className={styles.specBox}>
                            <dt>Bake Time</dt>
                            <dd>{sheet.bakeTime}</dd>
                        </div>
                        <div className={styles.specBox}>
                            <dt>Safe Internal</dt>
                            <dd>{sheet.pullTemp}</dd>
                        </div>
                        <div className={styles.specBox}>
                            <dt>Portion</dt>
                            <dd>Serves 2</dd>
                        </div>
                    </dl>
                </header>

                <p className={styles.sheetSafetyBanner} data-testid="sheet-safety-warning">
                    {PARCEL_OVEN_SAFETY_WARNING}
                </p>

                <div className={styles.parcelCanvasWrap}>
                    <svg
                        className={styles.parcelSvg}
                        viewBox="0 0 1150 1240"
                        role="img"
                        aria-label={`Life-size woodcut ingredient placement outlines and dashed parcel fold lines for ${sheet.sheetTitle}`}
                    >
                        <ParcelWorkspaceSvgContent sheet={sheet} />
                    </svg>

                    <aside
                        className={styles.srOnly}
                        aria-label="Printed recipe ingredients and method"
                        data-testid="sheet-recipe-sidebar"
                    >
                        <span>Recipe · 2 Servings</span>
                        <ul>
                            <li>{`${sheet.primaryBuy.item.name} (${sheet.primaryBuy.label})`}</li>
                            {sheet.scaledIngredients.map(ing => (
                                <li key={ing}>{ing}</li>
                            ))}
                        </ul>
                    </aside>
                </div>

                <footer className={styles.footerBand}>
                    <div className={styles.cutBuyBlock}>
                        <div className={styles.qrBox}>
                            <svg
                                className={styles.qrSvg}
                                viewBox={`0 0 ${qr.viewSize} ${qr.viewSize}`}
                                role="img"
                                aria-label="QR code to hofherrmeatco.com"
                            >
                                <path d={qr.path} fill="currentColor" />
                            </svg>
                        </div>
                        <div className={styles.cutBuyText}>
                            <span className={styles.cutBuyKicker}>Hofherr Cut to Buy</span>
                            <span className={styles.cutBuyName}>{sheet.primaryBuy.item.name}</span>
                            <span className={styles.cutBuyDetail}>
                                {`${sheet.primaryBuy.label} · ${sheet.primaryBuy.item.price} (est. ${sheet.estimatedTotal})`}
                            </span>
                            <Link href={sheet.onlineOrderPath} className={styles.cutOrderLink}>
                                Scan QR for hofherrmeatco.com or order cut →
                            </Link>
                        </div>
                    </div>

                    <div className={styles.foldSummaryBlock}>
                        <span className={styles.foldSummaryTitle}>Close the Parcel</span>
                        <ol className={styles.foldSummaryList}>
                            {sheet.foldSteps.map(stepText => (
                                <li key={stepText}>{stepText}</li>
                            ))}
                        </ol>
                    </div>

                    <div className={styles.brandLockupBlock}>
                        <span className={styles.footerLogoMark} role="img" aria-label="Hofherr Meat Co." />
                        <p className={styles.brandMotto}>Quality Meats. No Compromise.</p>
                        <p className={styles.brandLocations}>Northfield &amp; Winnetka, IL · hofherrmeatco.com</p>
                    </div>
                </footer>
            </div>
        </article>
    );
}

/** Pure vector 12:16 woodcut broadside thumbnail of the complete sheet for the /recipes/sheets index cards. */
export function ParcelSheetThumbnail({ sheet }: { sheet: ResolvedCookingSheet }) {
    const qr = buildQrSvgPath(sheet.onlineOrderQrUrl, 1);

    return (
        <svg
            className={styles.thumbSheetSvg}
            viewBox="0 0 1200 1600"
            role="img"
            aria-label={`Miniature preview of ${sheet.sheetTitle} printable parchment sheet`}
        >
            <rect x={25} y={25} width={1150} height={1550} fill="none" stroke={INK} strokeWidth={3} />
            <rect x={31} y={31} width={1138} height={1538} fill="none" stroke={INK} strokeWidth={1} />

            <line x1={25} y1={170} x2={1175} y2={170} stroke={INK} strokeWidth={3} />
            <line x1={25} y1={176} x2={1175} y2={176} stroke={INK} strokeWidth={1} />
            <text x={52} y={98} fontFamily={HEADING_FONT} fontSize={44} fontWeight={800} letterSpacing={1} fill={INK}>
                {sheet.sheetTitle.toUpperCase()}
            </text>
            <text x={52} y={132} fontSize={16} fontWeight={700} letterSpacing={0.6} fill={INK_MUTED}>
                {`${sheet.ovenTemp} · ${sheet.bakeTime.toUpperCase()} · SAFE INTERNAL ${sheet.pullTemp.toUpperCase()} · SERVES 2`}
            </text>
            <text x={52} y={156} fontSize={14.5} fontWeight={800} fill={INK}>
                {PARCEL_OVEN_SAFETY_WARNING}
            </text>
            <text x={1145} y={112} textAnchor="end" fontFamily={HEADING_FONT} fontSize={44} fontWeight={800} fill={RED}>
                {sheet.ovenTemp}
            </text>

            <g transform="translate(25, 170)">
                <ParcelWorkspaceSvgContent sheet={sheet} />
            </g>

            <line x1={25} y1={1410} x2={1175} y2={1410} stroke={INK} strokeWidth={3} />
            <line x1={25} y1={1404} x2={1175} y2={1404} stroke={INK} strokeWidth={1} />
            <g transform="translate(52, 1434)">
                <rect x={0} y={0} width={112} height={112} fill="none" stroke={INK} strokeWidth={2.5} />
                <svg x={6} y={6} width={100} height={100} viewBox={`0 0 ${qr.viewSize} ${qr.viewSize}`}>
                    <path d={qr.path} fill={INK} />
                </svg>
                <text x={134} y={34} fontSize={17} fontWeight={800} letterSpacing={1} fill={RED}>
                    HOFHERR CUT TO BUY
                </text>
                <text x={134} y={76} fontFamily={HEADING_FONT} fontSize={36} fontWeight={800} letterSpacing={0.8} fill={INK}>
                    {sheet.primaryBuy.item.name.toUpperCase()}
                </text>
                <text x={134} y={104} fontSize={17} fontWeight={700} fill={INK_MUTED}>
                    {sheet.primaryBuy.label}
                </text>
            </g>
            <text x={1145} y={1482} textAnchor="end" fontFamily={HEADING_FONT} fontSize={34} fontWeight={800} letterSpacing={1} fill={INK}>
                HOFHERR MEAT CO.
            </text>
            <text x={1145} y={1518} textAnchor="end" fontFamily={HEADING_FONT} fontSize={23} fontWeight={700} letterSpacing={1} fill={RED}>
                QUALITY MEATS. NO COMPROMISE.
            </text>
        </svg>
    );
}
