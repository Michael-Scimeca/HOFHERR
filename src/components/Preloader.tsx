'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import styles from './Preloader.module.css';
import { lockScroll } from '@/lib/scrollLock';

// The fire/burn engine is heavy (three.js + per-pixel canvas), so it loads on the client only.
// The black overlay below is server-rendered, so the page never flashes before it appears.
const FireTestClient = dynamic(() => import('@/app/fire-test/FireTestClient'), { ssr: false });

/** Routes that skip the automatic initial preloader (CMS, admin, dashboard, and the fire test page). */
const SKIP = ['/studio', '/admin', '/dashboard', '/fire-test'];
const PRELOADER_SYNC_VERSION = 7;

/**
 * Site preloader, shown on every full page load and controllable on-demand from the
 * unified Transition UI HUD (via 'preloader-hud-command').
 */
export default function Preloader() {
    const pathname = usePathname();
    const [revealed, setRevealed] = useState(false);
    const [done, setDone] = useState(false);
    const [initialStep, setInitialStep] = useState<number | null>(null);
    const [alwaysShowFlame, setAlwaysShowFlame] = useState(false);
    const [initialPaused, setInitialPaused] = useState(false);
    const [interactiveDrag, setInteractiveDrag] = useState(false);
    const [runKey, setRunKey] = useState(0);
    const syncVerRef = useRef(PRELOADER_SYNC_VERSION);

    // No scrolling while the preloader is on screen.
    const skipped = SKIP.some(p => pathname?.startsWith(p));
    useEffect(() => {
        if (done || skipped) return;
        return lockScroll();
    }, [done, skipped]);

    useEffect(() => {
        if (syncVerRef.current !== PRELOADER_SYNC_VERSION) {
            syncVerRef.current = PRELOADER_SYNC_VERSION;
            window.dispatchEvent(new CustomEvent('preloader-hud-command', { detail: { replay: true } }));
        }
    });

    const handleReveal = useCallback(() => setRevealed(true), []);
    const handleDone = useCallback(() => {
        setDone(true);
        window.dispatchEvent(new CustomEvent('preloader-step-report', { detail: { step: 6, pct: 100 } }));
    }, []);
    const handleStepChange = useCallback((step: number, pct: number) => {
        window.dispatchEvent(new CustomEvent('preloader-step-report', { detail: { step, pct } }));
    }, []);

    useEffect(() => {
        const onHudCommand = (e: Event) => {
            const detail = (e as CustomEvent<{
                step?: number;
                replay?: boolean;
                togglePause?: boolean;
                editFlame?: boolean;
                hideFlame?: boolean;
                dragFlame?: boolean;
                darkStage?: boolean;
            }>).detail;
            if (!detail) return;

            if (detail.editFlame) {
                setAlwaysShowFlame(true);
                setInitialPaused(true);
                setRevealed(!detail.darkStage);
                if (done) {
                    setInitialStep(5);
                    setDone(false);
                    setRunKey(k => k + 1);
                } else {
                    window.dispatchEvent(new CustomEvent('preloader-step-control', { detail: { step: 5 } }));
                    window.dispatchEvent(new CustomEvent('preloader-step-control', { detail: { togglePause: true } }));
                    window.dispatchEvent(new CustomEvent('flame-settings-external', { detail: { alwaysShow: true } }));
                }
            } else if (detail.hideFlame) {
                setAlwaysShowFlame(false);
                setInteractiveDrag(false);
                setDone(true);
            } else if (typeof detail.dragFlame === 'boolean') {
                setInteractiveDrag(detail.dragFlame);
            } else if (typeof detail.darkStage === 'boolean') {
                setRevealed(!detail.darkStage);
            } else if (detail.replay) {
                setAlwaysShowFlame(false);
                setInitialPaused(false);
                setInteractiveDrag(false);
                setRevealed(false);
                setInitialStep(1);
                setDone(false);
                setRunKey(k => k + 1);
            } else if (typeof detail.step === 'number') {
                const stepId = detail.step;
                setRevealed(stepId >= 4);
                if (done) {
                    setInitialStep(stepId);
                    setDone(false);
                    setRunKey(k => k + 1);
                } else {
                    window.dispatchEvent(new CustomEvent('preloader-step-control', { detail: { step: stepId } }));
                }
            } else if (typeof detail.togglePause === 'boolean') {
                if (done) {
                    setInitialStep(1);
                    setRevealed(false);
                    setDone(false);
                    setRunKey(k => k + 1);
                } else {
                    window.dispatchEvent(new CustomEvent('preloader-step-control', { detail: { togglePause: detail.togglePause } }));
                }
            }
        };

        window.addEventListener('preloader-hud-command', onHudCommand);
        return () => window.removeEventListener('preloader-hud-command', onHudCommand);
    }, [done]);

    if (done || skipped) return null;

    return (
        <div
            className={`${styles.overlay} ${revealed ? styles.revealed : ''} ${interactiveDrag ? styles.interactive : ''}`}
            aria-hidden="true"
        >
            <FireTestClient
                key={runKey}
                preloader
                initialStep={initialStep}
                alwaysShowFlameProp={alwaysShowFlame}
                initialPaused={initialPaused}
                onReveal={handleReveal}
                onDone={handleDone}
                onStepChange={handleStepChange}
            />
        </div>
    );
}
