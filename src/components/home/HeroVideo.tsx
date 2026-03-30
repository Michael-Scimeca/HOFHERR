'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './HeroVideo.module.css';

/* ── Config ── */
const VIDEO_ID = 'Q1IwML8BKdU';
const START_SEC = 440;   // 7:20
const END_SEC = 740;     // 12:20

declare global {
    interface Window {
        onYouTubeIframeAPIReady?: () => void;
        YT: typeof YT;
    }
}

export default function HeroVideo() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const containerRef = useRef<HTMLDivElement>(null);
    const wrapRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<YT.Player | null>(null);

    const [hasStarted, setHasStarted] = useState(false);
    const [uiIsDragging, setUiIsDragging] = useState(false);
    
    // Draggable refs for 60fps performance
    const dragData = useRef({
        isDragging: false,
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        requestRef: 0,
        moved: false
    });

    useEffect(() => {
        if (!hasStarted) return;
        const loadAPI = () => {
            if (window.YT?.Player) createPlayer();
            else {
                const tag = document.createElement('script');
                tag.src = 'https://www.youtube.com/iframe_api';
                document.head.appendChild(tag);
                window.onYouTubeIframeAPIReady = createPlayer;
            }
        };

        function createPlayer() {
            if (!containerRef.current || playerRef.current) return;
            playerRef.current = new window.YT.Player(containerRef.current, {
                videoId: VIDEO_ID,
                playerVars: {
                    start: START_SEC, end: END_SEC, rel: 0, modestbranding: 1, 
                    controls: 1, showinfo: 0, fs: 1, playsinline: 1, autoplay: 1,
                },
                events: {
                    onReady: (e: YT.PlayerEvent) => {
                        e.target.seekTo(START_SEC, true);
                        e.target.playVideo();
                    },
                },
            });
        }
        loadAPI();
    }, [hasStarted]);

    // Raw DOM Updates for butter-smooth movement
    const animate = useCallback(() => {
        if (!wrapRef.current || hasStarted) return;
        wrapRef.current.style.transform = `translate3d(${dragData.current.currentX}px, ${dragData.current.currentY}px, 0)`;
        dragData.current.requestRef = requestAnimationFrame(animate);
    }, [hasStarted]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (hasStarted) return;
        
        // Prevent default browser drag ghosting
        e.preventDefault(); 
        
        dragData.current.isDragging = true;
        setUiIsDragging(true);
        dragData.current.startX = e.clientX - dragData.current.currentX;
        dragData.current.startY = e.clientY - dragData.current.currentY;
        dragData.current.moved = false;
        
        if (wrapRef.current) wrapRef.current.style.transition = 'none';
        dragData.current.requestRef = requestAnimationFrame(animate);
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!dragData.current.isDragging) return;
            
            dragData.current.currentX = e.clientX - dragData.current.startX;
            dragData.current.currentY = e.clientY - dragData.current.startY;
            
            if (Math.abs(dragData.current.currentX) > 10 || Math.abs(dragData.current.currentY) > 10) {
                dragData.current.moved = true;
            }
        };

        const handleMouseUp = () => {
            if (!dragData.current.isDragging) return;
            dragData.current.isDragging = false;
            setUiIsDragging(false);
            cancelAnimationFrame(dragData.current.requestRef);
            
            if (wrapRef.current) {
                wrapRef.current.style.transition = 'all 0.4s var(--ease-out)';
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            cancelAnimationFrame(dragData.current.requestRef);
        };
    }, []);

    const handlePlayAction = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (dragData.current.moved) return;
        setHasStarted(true);
    };

    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (playerRef.current) try { playerRef.current.pauseVideo(); } catch (err) {}
        setHasStarted(false);
        dragData.current.currentX = 0;
        dragData.current.currentY = 0;
        if (wrapRef.current) {
            wrapRef.current.style.transform = 'translate3d(0,0,0)';
        }
    };

    return (
        <div className={`${styles.heroVideo} ${styles.idle}`}>
            <div
                ref={wrapRef}
                className={`${styles.videoWrap} ${styles.circleBubble}`}
                onMouseDown={handleMouseDown}
                onClick={handlePlayAction}
                style={{ 
                    cursor: hasStarted ? 'default' : (uiIsDragging ? 'grabbing' : 'grab'),
                    touchAction: 'none'
                }}
            >
                <div className={styles.bubbleInner}>
                    <video 
                        src="/video-clips/beef.mp4" 
                        muted 
                        playsInline 
                        autoPlay 
                        loop
                        className={styles.poster} 
                        draggable={false}
                    />
                </div>
                
                {/* Elevated completely outside of the bubble mask so it doesn't get clipped */}
                <div className={styles.playIconOverlay}>
                    <svg viewBox="0 0 24 24" fill="#fff" width="22" height="22" style={{ transform: 'translateX(2.5px)' }}>
                        <path d="M8 5v14l11-7z" />
                    </svg>
                </div>
            </div>

            {/* Safe portal escape hatch for the full-screen fixed player */}
            {mounted && hasStarted && createPortal(
                <div className={styles.playing} onClick={handleClose}>
                    {/* Inner wrapper simulating the scaled-up box */}
                    <div 
                        className={`${styles.videoWrap} ${styles.normalRect}`} 
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={`${styles.playerWrapper} ${styles.visible}`}>
                            <div ref={containerRef} className={styles.player} />
                            <button className={styles.closeBtn} onClick={handleClose}>✕</button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
