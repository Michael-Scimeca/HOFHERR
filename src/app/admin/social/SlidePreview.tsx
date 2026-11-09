'use client';

import React from 'react';
import type { Slide } from '@/lib/social/types';
import s from './social.module.css';

const STICKER_MAP: Record<string, string> = {
    cow: '/assets/identity/stickers/sticker-cow.svg',
    pig: '/assets/identity/stickers/sticker-pig.svg',
    chicken: '/assets/identity/stickers/sticker-chicken.svg',
    lamb: '/assets/identity/stickers/sticker-lamb.svg',
    cheese: '/assets/identity/stickers/sticker-cheese.svg',
    soup: '/assets/identity/stickers/sticker-soup.svg',
    fish: '/assets/identity/stickers/sticker-fish.svg',
    seafood: '/assets/identity/stickers/sticker-seafood.svg',
    duck: '/assets/identity/stickers/sticker-duck.svg',
    truck: '/assets/identity/stickers/sticker-truck.svg',
};

export function getStickerSrc(iconId?: string): string {
    return STICKER_MAP[iconId ?? 'cow'] ?? STICKER_MAP.cow;
}

interface SlidePreviewProps {
    slide: Slide;
    format?: 'portrait' | 'landscape';
    editable?: boolean;
    onFieldChange?: (field: keyof Slide, value: string | string[]) => void;
}

export default function SlidePreview({
    slide,
    format = 'portrait',
    editable = false,
    onFieldChange,
}: SlidePreviewProps) {
    const iconSrc = getStickerSrc(slide.iconId);

    if (format === 'landscape') {
        const isList =
            (slide.template === 'howto-steps' ||
                slide.template === 'guide' ||
                slide.template === 'recipe-ingredients') &&
            (slide.items?.length ?? 0) > 0;
        const bodyText = slide.template === 'trivia-q' ? 'Reply with your answer below' : (slide.body ?? '');

        return (
            <div className={s.slideLandscape}>
                <div className={s.slideLandscapeLeft}>
                    <img src="/assets/logo.svg" alt="Hofherr Meat Co." className={s.slideLogoSm} />
                    <div className={s.slideLandscapeMain}>
                        {slide.kicker && <span className={s.slideKicker}>{slide.kicker}</span>}
                        {slide.headline && slide.template !== 'trivia-a' && (
                            <div
                                className={s.slideHeadlineMd}
                                contentEditable={editable}
                                suppressContentEditableWarning
                                onBlur={(e) => onFieldChange?.('headline', e.currentTarget.textContent ?? '')}
                            >
                                {slide.headline}
                            </div>
                        )}
                        {isList ? (
                            <div className={s.slideLandscapeList}>
                                {(slide.items ?? []).slice(0, 6).map((item, idx) => {
                                    const [colA, , colC] = item.split('|').map((x) => x.trim());
                                    return (
                                        <div key={`landscape-row-${item}`} className={s.slideLandscapeRow}>
                                            <span className={s.slideLandscapeKey}>
                                                {slide.template === 'guide'
                                                    ? colA
                                                    : slide.template === 'recipe-ingredients'
                                                      ? '•'
                                                      : `${idx + 1}.`}
                                            </span>
                                            <span>{slide.template === 'guide' ? (colC ?? '') : colA}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : bodyText ? (
                            <div
                                className={s.slideBodyMd}
                                contentEditable={editable}
                                suppressContentEditableWarning
                                onBlur={(e) => onFieldChange?.('body', e.currentTarget.textContent ?? '')}
                            >
                                {bodyText}
                            </div>
                        ) : null}
                    </div>
                    <div className={s.slideLandscapeFoot}>
                        @hofherrmeatco · <span className={s.goldText}>Northfield · Winnetka Depot</span>
                    </div>
                </div>
                    <div
                        className={`${s.slideLandscapeRight} ${slide.template === 'tip'
                                ? s.bgAmber
                                : slide.template === 'fact' && slide.tone === 'cream'
                                    ? s.bgCream
                                    : s.bgCrimson
                            }`}
                    >
                        {slide.photo ? (
                            <img src={slide.photo} alt="" className={s.slidePhotoCover} />
                        ) : (
                            <img src={iconSrc} alt="" className={s.slideIconHero} />
                        )}
                    </div>
                </div>
                );
    }

                /* Portrait 4:5 (1080 × 1350 aspect ratio) */
                switch (slide.template) {
        case 'chart':
                return (
                <div className={`${s.slidePortrait} ${s.bgCream}`}>
                    <div className={s.slideChartWrap}>
                        <img
                            src={slide.photo || '/assets/social/cut-chart-beef.svg'}
                            alt={slide.headline || 'Butcher cut chart'}
                            className={s.slideChartImg}
                        />
                    </div>
                    <SlideFooter />
                </div>
                );

                case 'specials':
                case 'recipe-cover':
                case 'howto-cover':
                return (
                <div className={`${s.slidePortrait} ${s.bgCharcoal}`}>
                    {slide.photo && <img src={slide.photo} alt="" className={s.slidePhotoBg} />}
                    <div className={s.slidePhotoScrim} />
                    <div className={s.slideFrameAmber} />
                    <div className={s.slideTopBar}>
                        {slide.kicker && (
                            <span
                                className={s.slideKicker}
                                contentEditable={editable}
                                suppressContentEditableWarning
                                onBlur={(e) => onFieldChange?.('kicker', e.currentTarget.textContent ?? '')}
                            >
                                {slide.kicker}
                            </span>
                        )}
                    </div>
                    <div className={s.slideHeroBottom}>
                        <div
                            className={s.slideHeadlineLg}
                            contentEditable={editable}
                            suppressContentEditableWarning
                            onBlur={(e) => onFieldChange?.('headline', e.currentTarget.textContent ?? '')}
                        >
                            {slide.headline}
                        </div>
                        {slide.body && (
                            <div
                                className={slide.template === 'specials' ? s.slidePriceBig : s.slideSubAmber}
                                contentEditable={editable}
                                suppressContentEditableWarning
                                onBlur={(e) => onFieldChange?.('body', e.currentTarget.textContent ?? '')}
                            >
                                {slide.body}
                            </div>
                        )}
                    </div>
                    <SlideFooter />
                </div>
                );

                case 'howto-steps':
                return (
                <div className={`${s.slidePortrait} ${s.bgCream}`}>
                    <div className={s.slideTopStripeCrimson} />
                    <div className={s.slidePadBody}>
                        <div className={s.slideHeaderFlex}>
                            <div
                                className={`${s.slideHeadlineMd} ${s.crimsonText}`}
                                contentEditable={editable}
                                suppressContentEditableWarning
                                onBlur={(e) => onFieldChange?.('headline', e.currentTarget.textContent ?? '')}
                            >
                                {slide.headline}
                            </div>
                            <img src={iconSrc} alt="" className={s.slideCornerIcon} />
                        </div>
                        <div className={s.slideStepsList}>
                            {(slide.items ?? []).map((step, idx) => (
                                    <div key={`step-${step}`} className={s.slideStepItem}>
                                        <span className={s.slideStepNum}>{idx + 1}</span>
                                        <span
                                            className={s.slideStepText}
                                            contentEditable={editable}
                                            suppressContentEditableWarning
                                            onBlur={(e) => {
                                                const next = [...(slide.items ?? [])];
                                                next[idx] = e.currentTarget.textContent ?? '';
                                                onFieldChange?.('items', next);
                                            }}
                                        >
                                            {step}
                                        </span>
                                    </div>
                            ))}
                                </div>
                    </div>
                        <SlideFooter />
                    </div>
                    );

                    case 'recipe-ingredients':
                    return (
                    <div className={`${s.slidePortrait} ${s.bgCream}`}>
                        <div className={s.slideTopStripeCrimson} />
                        <div className={s.slidePadBody}>
                            <div className={s.slideHeaderFlex}>
                                <div className={s.slideColGap}>
                                    {slide.kicker && <span className={s.slideKicker}>{slide.kicker}</span>}
                                    <div
                                        className={`${s.slideHeadlineMd} ${s.crimsonText}`}
                                        contentEditable={editable}
                                        suppressContentEditableWarning
                                        onBlur={(e) => onFieldChange?.('headline', e.currentTarget.textContent ?? '')}
                                    >
                                        {slide.headline}
                                    </div>
                                </div>
                                <img src={iconSrc} alt="" className={s.slideCornerIcon} />
                            </div>
                            <div className={s.slideIngList}>
                                {(slide.items ?? []).map((ing, idx) => (
                                        <div key={`ing-${ing}`} className={s.slideIngItem}>
                                            <span className={s.slideIngDot} />
                                            <span
                                                className={s.slideIngText}
                                                contentEditable={editable}
                                                suppressContentEditableWarning
                                                onBlur={(e) => {
                                                    const next = [...(slide.items ?? [])];
                                                    next[idx] = e.currentTarget.textContent ?? '';
                                                    onFieldChange?.('items', next);
                                                }}
                                            >
                                                {ing}
                                            </span>
                                        </div>
                            ))}
                                    </div>
                    </div>
                            <SlideFooter />
                        </div>
                        );

                        case 'guide':
                        return (
                        <div className={`${s.slidePortrait} ${s.bgCharcoal}`}>
                            <div className={s.slidePadBody}>
                                <div className={s.slideHeaderFlex}>
                                    <div className={s.slideColGap}>
                                        {slide.kicker && <span className={s.slideKicker}>{slide.kicker}</span>}
                                        <div
                                            className={s.slideHeadlineLg}
                                            contentEditable={editable}
                                            suppressContentEditableWarning
                                            onBlur={(e) => onFieldChange?.('headline', e.currentTarget.textContent ?? '')}
                                        >
                                            {slide.headline}
                                        </div>
                                    </div>
                                    <img src={iconSrc} alt="" className={s.slideCornerIcon} />
                                </div>
                                <div className={s.slideGuideTable}>
                                    {(slide.items ?? []).map((row, idx) => {
                                        const [cutName, whereFrom, bestFor] = row.split('|').map((x) => x.trim());
                                        return (
                                                <div key={`guide-${row}`} className={s.slideGuideRow}>
                                                    <div className={s.slideGuideLeft}>
                                                        <span
                                                            className={s.slideGuideCut}
                                                            contentEditable={editable}
                                                            suppressContentEditableWarning
                                                            onBlur={(e) => {
                                                                const next = [...(slide.items ?? [])];
                                                                next[idx] = `${e.currentTarget.textContent ?? ''} | ${whereFrom ?? ''} | ${bestFor ?? ''}`;
                                                                onFieldChange?.('items', next);
                                                            }}
                                                        >
                                                            {cutName}
                                                        </span>
                                                        <span className={s.slideGuideWhere}>{whereFrom}</span>
                                                    </div>
                                                    <span
                                                        className={s.slideGuideBest}
                                                        contentEditable={editable}
                                                        suppressContentEditableWarning
                                                        onBlur={(e) => {
                                                            const next = [...(slide.items ?? [])];
                                                            next[idx] = `${cutName ?? ''} | ${whereFrom ?? ''} | ${e.currentTarget.textContent ?? ''}`;
                                                            onFieldChange?.('items', next);
                                                        }}
                                                    >
                                                        {bestFor}
                                                    </span>
                                                </div>
                                                );
                            })}
                                            </div>
                    </div>
                                <SlideFooter />
                            </div>
                            );

                            case 'fact': {
            const isCream = slide.tone === 'cream';
                            return (
                            <div className={`${s.slidePortrait} ${isCream ? s.bgCream : s.bgCrimson}`}>
                                <div className={isCream ? s.slideFrameCrimson : s.slideFrameCream} />
                                <div className={s.slidePadBody}>
                                    <div className={s.slideFactHeader}>
                                        <img src={iconSrc} alt="" className={s.slideCornerIcon} />
                                        <div className={s.slideColGap}>
                                            {slide.kicker && <span className={s.slideKicker}>{slide.kicker}</span>}
                                            <span className={isCream ? s.slideFactSubDark : s.slideFactSubLight}>
                                                {slide.headline}
                                            </span>
                                        </div>
                                    </div>
                                    <div
                                        className={isCream ? s.slideFactBodyCrimson : s.slideFactBodyCream}
                                        contentEditable={editable}
                                        suppressContentEditableWarning
                                        onBlur={(e) => onFieldChange?.('body', e.currentTarget.textContent ?? '')}
                                    >
                                        {slide.body}
                                    </div>
                                </div>
                                <SlideFooter />
                            </div>
                            );
        }

                            case 'trivia-q':
                            return (
                            <div className={`${s.slidePortrait} ${s.bgCrimson}`}>
                                <div className={s.slideFrameCream} />
                                <div className={s.slideTriviaCenter}>
                                    {slide.kicker && <span className={s.slideKicker}>{slide.kicker}</span>}
                                    <span className={s.slideQuestionMark}>?</span>
                                    <div
                                        className={s.slideTriviaQ}
                                        contentEditable={editable}
                                        suppressContentEditableWarning
                                        onBlur={(e) => onFieldChange?.('headline', e.currentTarget.textContent ?? '')}
                                    >
                                        {slide.headline}
                                    </div>
                                    <span className={s.slideTriviaHint}>{slide.body}</span>
                                </div>
                                <SlideFooter />
                            </div>
                            );

                            case 'trivia-a':
                            return (
                            <div className={`${s.slidePortrait} ${s.bgCharcoal}`}>
                                <div className={s.slidePadBody}>
                                    <img src={iconSrc} alt="" className={s.slideCornerIcon} />
                                    {slide.kicker && <span className={s.slideKicker}>{slide.kicker}</span>}
                                    <div
                                        className={s.slideTriviaA}
                                        contentEditable={editable}
                                        suppressContentEditableWarning
                                        onBlur={(e) => onFieldChange?.('body', e.currentTarget.textContent ?? '')}
                                    >
                                        {slide.body}
                                    </div>
                                </div>
                                <SlideFooter />
                            </div>
                            );

                            case 'tip':
                            default:
                            return (
                            <div className={`${s.slidePortrait} ${s.bgAmber}`}>
                                <div className={s.slidePadBody}>
                                    <div className={s.slideHeaderFlex}>
                                        {slide.kicker && <span className={s.slideKickerDark}>{slide.kicker}</span>}
                                        <img src={iconSrc} alt="" className={s.slideCornerIcon} />
                                    </div>
                                    <div
                                        className={`${s.slideHeadlineLg} ${s.crimsonText}`}
                                        contentEditable={editable}
                                        suppressContentEditableWarning
                                        onBlur={(e) => onFieldChange?.('headline', e.currentTarget.textContent ?? '')}
                                    >
                                        {slide.headline}
                                    </div>
                                    <div
                                        className={s.slideTipBody}
                                        contentEditable={editable}
                                        suppressContentEditableWarning
                                        onBlur={(e) => onFieldChange?.('body', e.currentTarget.textContent ?? '')}
                                    >
                                        {slide.body}
                                    </div>
                                </div>
                                <SlideFooter />
                            </div>
                            );
    }
}

                            function SlideFooter() {
    return (
                            <div className={s.slideFootBar}>
                                <img src="/assets/logo.svg" alt="Hofherr Meat Co." className={s.slideFootLogo} />
                                <div className={s.slideFootMeta}>
                                    <span>@hofherrmeatco</span>
                                    <span className={s.goldText}>Northfield · Winnetka Depot</span>
                                </div>
                            </div>
                            );
}

