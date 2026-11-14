'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { AnimationItem } from 'lottie-web';
import styles from './Process.module.css';

type PointingHandLottieProps = {
    size: number;
    stepIndex?: number;
    className?: string;
};

const LOTTIE_JSON_PATH = '/assets/process/flint-flame-pointing-hand-lottie.json?v=3';
const STATIC_SVG_PATH = '/assets/process/flint-flame-pointing-hand.svg';
const LOOP_FRAMES = 90;

export default function PointingHandLottie({
    size,
    stepIndex = 0,
    className,
}: PointingHandLottieProps) {
    const stageRef = useRef<HTMLDivElement>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const container = stageRef.current;
        if (!container) return;

        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (mediaQuery.matches) {
            return;
        }

        let cancelled = false;
        let anim: AnimationItem | null = null;
        let domLoadedHandler: (() => void) | null = null;

        const handleMotionChange = (event: MediaQueryListEvent) => {
            if (!anim) return;
            if (event.matches) {
                anim.pause();
            } else {
                anim.play();
            }
        };

        mediaQuery.addEventListener('change', handleMotionChange);

        import('lottie-web/build/player/lottie_light')
            .then((mod) => {
                if (cancelled || !stageRef.current) return;

                const lottie = mod.default;
                const instance = lottie.loadAnimation({
                    container: stageRef.current,
                    renderer: 'svg',
                    loop: true,
                    autoplay: false,
                    path: LOTTIE_JSON_PATH,
                    rendererSettings: {
                        preserveAspectRatio: 'xMidYMid meet',
                        progressiveLoad: false,
                    },
                });

                anim = instance;

                domLoadedHandler = () => {
                    if (cancelled) return;
                    const startFrame = (stepIndex * 30) % LOOP_FRAMES;
                    if (mediaQuery.matches) {
                        instance.goToAndStop(0, true);
                    } else {
                        instance.goToAndPlay(startFrame, true);
                    }
                    setReady(true);
                };

                instance.addEventListener('DOMLoaded', domLoadedHandler);
            })
            .catch(() => {
                // Keep crisp static SVG fallback visible if player load fails
            });

        return () => {
            cancelled = true;
            mediaQuery.removeEventListener('change', handleMotionChange);
            if (anim) {
                if (domLoadedHandler) {
                    anim.removeEventListener('DOMLoaded', domLoadedHandler);
                }
                anim.destroy();
                anim = null;
            }
        };
    }, [stepIndex]);

    const rootClass = className
        ? `${styles.lottieHandRoot} ${className}`
        : styles.lottieHandRoot;

    return (
        <div className={rootClass} aria-hidden="true">
            <div
                ref={stageRef}
                className={`${styles.lottieStage} ${ready ? styles.lottieStageVisible : ''}`}
            />
            {!ready && (
                <Image
                    src={STATIC_SVG_PATH}
                    alt=""
                    width={size}
                    height={size}
                    unoptimized
                    className={styles.lottieFallback}
                />
            )}
        </div>
    );
}
