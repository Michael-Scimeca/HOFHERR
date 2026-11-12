import { NextRequest, NextResponse } from 'next/server';
import { ANIMAL_IDS, AnimalId, CUT_MAP_DATA } from '@/data/cutMap';

const VALID_ANIMAL_SET = new Set<string>(ANIMAL_IDS);

function buildZoomViewBox(labelX: number, labelY: number): string {
    const zoomW = 520;
    const zoomH = 388;
    const minX = Math.max(40, Math.min(1200 - zoomW - 40, Math.round(labelX - zoomW / 2)));
    const minY = Math.max(45, Math.min(896 - zoomH - 45, Math.round(labelY - zoomH / 2)));
    return `${minX} ${minY} ${zoomW} ${zoomH}`;
}

function escapeXml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const rawAnimal = (searchParams.get('animal') || 'beef').toLowerCase() as AnimalId;
    const animalId: AnimalId = VALID_ANIMAL_SET.has(rawAnimal) ? rawAnimal : 'beef';
    const animal = CUT_MAP_DATA[animalId];

    const cutsParam = searchParams.get('cuts') || searchParams.get('cut') || '';
    const requestedCutIds = new Set(
        cutsParam
            .split(',')
            .map((s) => s.trim().toLowerCase())
            .filter(Boolean)
    );

    const matchedCuts =
        requestedCutIds.size > 0
            ? animal.cuts.filter((c) => requestedCutIds.has(c.id))
            : [animal.cuts[0]];

    const activeCuts = matchedCuts.length > 0 ? matchedCuts : [animal.cuts[0]];
    const primaryCut = activeCuts[0];
    const zoomMode = searchParams.get('zoom') === 'full' ? 'full' : 'piece';

    const viewBox =
        zoomMode === 'piece' && activeCuts.length === 1
            ? buildZoomViewBox(primaryCut.labelX, primaryCut.labelY)
            : animal.viewBox;

    const chartDataUri =
        animal.cleanChartImage || '/assets/identity/cut-charts/flint-flame-butcher-guide-beef-clean.jpg';

    const cutPathsSvg = activeCuts
        .map(
            (cut) =>
                `<path d="${cut.svgPath}" fill="#f7941d" fill-opacity="0.92" stroke="#6b070b" stroke-width="2" stroke-linejoin="round" />`
        )
        .join('\n');

    const cutLabelsSvg = activeCuts
        .map((cut) => {
            if (cut.id === 'feet') return '';
            const isCompact = cut.id === 'short-loin' || cut.id === 'sirloin';
            const isSmall =
                cut.id === 'shank' ||
                cut.id === 'hock-trotter' ||
                cut.id === 'spare-ribs' ||
                cut.id === 'drumstick';
            const isMedium = cut.id === 'shoulder' || cut.id === 'belly';
            const fontSize = isCompact ? 16 : isSmall ? 20 : isMedium ? 26 : 32;

            let labelInner = escapeXml(cut.name.toUpperCase());
            if (cut.id === 'short-loin') {
                labelInner = `<tspan x="${cut.labelX}" dy="-8">SHORT</tspan><tspan x="${cut.labelX}" dy="16">LOIN</tspan>`;
            } else if (cut.id === 'spare-ribs') {
                labelInner = `<tspan x="${cut.labelX}" dy="-9">SPARE</tspan><tspan x="${cut.labelX}" dy="18">RIBS</tspan>`;
            }

            let extraShank = '';
            if (cut.id === 'shank') {
                const rearY = animalId === 'lamb' ? 534 : animalId === 'veal' ? 518 : 506;
                const transform = animalId === 'beef' ? ' transform="rotate(-10 865 506)"' : '';
                extraShank = `<text x="865" y="${rearY}"${transform} fill="#faf0e6" font-family="Impact, 'Arial Black', sans-serif" font-size="20" font-weight="900" letter-spacing="1" text-anchor="middle" dominant-baseline="central">SHANK</text>`;
            } else if (cut.id === 'hock-trotter') {
                extraShank = `<text x="878" y="535" transform="rotate(-10 878 535)" fill="#faf0e6" font-family="Impact, 'Arial Black', sans-serif" font-size="20" font-weight="900" letter-spacing="1" text-anchor="middle" dominant-baseline="central">HOCK</text>`;
            }

            return `<text x="${cut.labelX}" y="${cut.labelY}" fill="#faf0e6" font-family="Impact, 'Arial Black', sans-serif" font-size="${fontSize}" font-weight="900" letter-spacing="1.2" text-anchor="middle" dominant-baseline="central">${labelInner}</text>${extraShank}`;
        })
        .join('\n');

    const woodcutOverlay = animal.woodcutPath
        ? `<path d="${animal.woodcutPath}" fill="#6b070b" shape-rendering="geometricPrecision" />`
        : '';

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="600" height="448">
  <rect x="0" y="0" width="1200" height="896" fill="#f3ead8" />
  <image href="${chartDataUri}" x="0" y="0" width="1200" height="896" preserveAspectRatio="xMidYMid meet" />
  <g>${cutPathsSvg}</g>
  ${woodcutOverlay}
  <g>${cutLabelsSvg}</g>
</svg>`;

    return new NextResponse(svg, {
        status: 200,
        headers: {
            'Content-Type': 'image/svg+xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
        },
    });
}
