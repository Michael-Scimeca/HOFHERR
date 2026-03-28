"use client";
import { useRef, Suspense, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

interface ModelViewerProps {
  modelPath: string;
  className?: string;
  style?: React.CSSProperties;
}

function Model({ modelPath, onLoaded }: { modelPath: string; onLoaded: () => void }) {
  const { scene } = useGLTF(modelPath);
  const groupRef = useRef<THREE.Group>(null);
  const progress = useRef(0);
  const lastSpinTime = useRef(0);
  const spinProgress = useRef(1);

  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    // Entrance animation
    if (progress.current < 1) {
      progress.current += delta * 0.9;
      if (progress.current >= 1) {
        progress.current = 1;
        lastSpinTime.current = state.clock.elapsedTime;
      }
      const p = progress.current;
      const c4 = (2 * Math.PI) / 3;
      const elasticScale = p === 0 ? 0 : p === 1 ? 1 : Math.pow(2, -10 * p) * Math.sin((p * 10 - 0.75) * c4) + 1;
      const expRot = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      groupRef.current.scale.setScalar(Math.max(0, elasticScale));
      groupRef.current.rotation.y = 0;
    } else {
      // Recurring spin every 20s
      if (state.clock.elapsedTime - lastSpinTime.current > 20) {
        lastSpinTime.current = state.clock.elapsedTime;
        spinProgress.current = 0;
      }
      if (spinProgress.current < 1) {
        spinProgress.current += delta * 1.5;
        if (spinProgress.current > 1) spinProgress.current = 1;
        const p = spinProgress.current;
        const cubicEase = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
        groupRef.current.rotation.y = 0;
      } else {
        groupRef.current.rotation.y = 0;
      }
    }
  });

  useEffect(() => {
    const timeout = setTimeout(() => onLoaded(), 150);
    return () => clearTimeout(timeout);
  }, [onLoaded]);

  return (
    <group ref={groupRef} scale={0}>
      <Float speed={2.5} rotationIntensity={0} floatIntensity={1.2} floatingRange={[-0.1, 0.1]}>
        <primitive object={clonedScene} position={[0, -0.15, 0]} rotation={[0, -Math.PI / 5, 0]} scale={1.45} />
      </Float>
    </group>
  );
}

export default function ModelViewer({ modelPath, className, style }: ModelViewerProps) {
  const [ready, setReady] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={className}
      style={{
        width: '100%',
        height: '100%',
        ...style,
        opacity: ready ? 1 : 0,
        visibility: ready ? 'visible' : 'hidden',
        transition: 'opacity 0.6s ease, visibility 0.6s ease',
      }}
    >
      {mounted && (
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }} gl={{ alpha: true, antialias: true }} style={{ background: 'transparent' }}>
          <ambientLight intensity={0.8} />
          <spotLight position={[0, 10, 0]} angle={0.5} penumbra={1} intensity={3} castShadow color="#ffffff" />
          <directionalLight position={[5, 2, -5]} intensity={2.5} color="#cc0e1d" />
          <directionalLight position={[-5, 5, 5]} intensity={1.5} color="#f5e1c8" />
          <OrbitControls enableZoom={false} enablePan={false} />
          <Suspense fallback={null}>
            <Environment preset="city" />
            <Model modelPath={modelPath} onLoaded={() => setReady(true)} />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}

// Preload the model for faster first render
useGLTF.preload('/assets/trophy.glb');
