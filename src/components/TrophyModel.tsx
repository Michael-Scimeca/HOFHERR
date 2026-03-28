'use client';
import { useRef, Suspense, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

function Trophy({ onLoaded }: { onLoaded: () => void }) {
    // Load the GLTF model from the public directory
    const { scene } = useGLTF('/assets/trophy.glb');
    const groupRef = useRef<THREE.Group>(null);
    const progress = useRef(0); // Tracks our single-run entrance physics
    const lastSpinTime = useRef(0); // Tracks the clock time of the last scheduled spin
    const spinProgress = useRef(1); // 1 = fully idle, 0 = actively spinning

    // Deep-clone the scene to prevent Next.js Fast Refresh from corrupting the cached WebGL graph on unmount
    const clonedScene = useMemo(() => scene.clone(), [scene]);

    // Physically simulate a bouncy scale entrance, followed by a scheduled 360 spin every 20 seconds
    useFrame((state, delta) => {
        if (!groupRef.current) return;

        // 1. Initial Entrance Pop
        if (progress.current < 1) {
            progress.current += delta * 0.9;
            if (progress.current >= 1) {
                progress.current = 1;
                // Seed the timer the moment the entrance pop perfectly finishes!
                lastSpinTime.current = state.clock.elapsedTime;
            }

            const p = progress.current;
            const c4 = (2 * Math.PI) / 3;
            const elasticScale = p === 0 ? 0 : p === 1 ? 1 : Math.pow(2, -10 * p) * Math.sin((p * 10 - 0.75) * c4) + 1;
            const expRot = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);

            groupRef.current.scale.setScalar(Math.max(0, elasticScale));
            groupRef.current.rotation.y = (1 - expRot) * -(Math.PI * 2);
        } 
        // 2. Scheduled 20-Second Recurring Spin
        else {
            if (state.clock.elapsedTime - lastSpinTime.current > 20) {
                // Trip the 20-second breaker and reset the clock!
                lastSpinTime.current = state.clock.elapsedTime;
                spinProgress.current = 0; // Trigger the physical spin sequence
            }

            // If we are actively engaged in a spin sequence
            if (spinProgress.current < 1) {
                spinProgress.current += delta * 1.5; // Controls the exact speed of the 360 whip
                if (spinProgress.current > 1) spinProgress.current = 1;

                const p = spinProgress.current;
                
                // High-performance Cubic Ease In-Out
                const cubicEase = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
                
                // Sweep a pristine 360 degrees (2 PI)
                groupRef.current.rotation.y = 0;
            } else {
                // Lock absolute 0 when idle to prevent mathematical drift
                groupRef.current.rotation.y = 0;
            }
        }
    });

    // Alert the parent container that the model has successfully hydrated the 3D space
    useEffect(() => {
        // We inject a tiny delay here because if the GLTF is already cached, it loads instantly,
        // causing the canvas to appear before WebGL physically clears the native white background!
        const timeout = setTimeout(() => {
            onLoaded();
        }, 150);
        return () => clearTimeout(timeout);
    }, [onLoaded]);

    return (
        <group ref={groupRef} scale={0}>
            <Float
                speed={2.5} // Slower, heavier bob
                rotationIntensity={0.2} // Much more subtle twisting limits
                floatIntensity={1.2} // Reduced magnitude
                floatingRange={[-0.1, 0.1]} // Tight, controlled travel boundaries
            >
                <primitive
                    object={clonedScene}
                    position={[0, -0.15, 0]} // Perfectly balanced vertically
                    rotation={[0, -Math.PI / 5, 0]}
                    scale={1.45} // Shrunk enough to absolutely guarantee 100% camera clearance
                />
            </Float>
        </group>
    );
}

export default function TrophyCanvas({ className, style }: { className?: string, style?: React.CSSProperties }) {
    const [ready, setReady] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Completely block the raw <Canvas> tag from being rendered on the Server (SSR)
    // because un-hydrated HTML canvases default to a blinding white box in the browser!
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div
            className={className}
            style={{
                width: '100%',
                height: '100%',
                cursor: 'default',
                background: 'transparent',
                opacity: ready ? 1 : 0,
                visibility: ready ? 'visible' : 'hidden',
                transition: 'opacity 0.6s ease, visibility 0.6s ease',
                ...style
            }}
        >
            {mounted && (
                <Canvas
                    camera={{ position: [0, 0, 5], fov: 45 }}
                    gl={{ alpha: true, antialias: true }}
                    style={{ background: 'transparent' }}
                >
                    {/* Ambient light for base visibility */}
                    <ambientLight intensity={0.8} />

                    {/* Dramatic top spotlight */}
                    <spotLight
                        position={[0, 10, 0]}
                        angle={0.5}
                        penumbra={1}
                        intensity={3}
                        castShadow
                        color="#ffffff"
                    />

                    {/* Sexy red rim light from the side/back to match the brand */}
                    <directionalLight
                        position={[5, 2, -5]}
                        intensity={2.5}
                        color="#cc0e1d"
                    />

                    {/* Main front fill light */}
                    <directionalLight
                        position={[-5, 5, 5]}
                        intensity={1.5}
                        color="#f5e1c8" // slightly warm gold tint
                    />

                    {/* Combine Environment and Trophy into ONE Suspense boundary!
                        This guarantees the model CANNOT fade in until the lighting map is compiled. */}
                    <Suspense fallback={null}>
                        <Environment preset="city" />
                        <Trophy onLoaded={() => setReady(true)} />
                    </Suspense>
                </Canvas>
            )}
        </div>
    );
}

// Preload the model so it doesn't pop in weirdly
useGLTF.preload('/assets/trophy.glb');
