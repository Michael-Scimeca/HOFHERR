'use client';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type AssetOverride = {
    top: number;
    left: number;
    rotate: number;
    scale: number;
    opacity: number;
    width: number;
};

type EditorCtx = {
    overrides: AssetOverride[];
    setOverride: (index: number, key: keyof AssetOverride, value: number) => void;
};

const Ctx = createContext<EditorCtx | null>(null);

export const EDITOR_DEFAULTS: AssetOverride[] = [
    { top: 14.6, left: 1.1,  rotate: -20, scale: 1.0,  opacity: 0.92, width: 100 },
    { top: 11.7, left: 14.8, rotate: 14,  scale: 1.0,  opacity: 0.90, width: 95  },
    { top: 14.7, left: 23.3, rotate: 5,   scale: 1.0,  opacity: 0.50, width: 85  },
    { top: 25.6, left: 29.8, rotate: 48,  scale: 3.3,  opacity: 0.85, width: 42  },
    { top: 10.1, left: 1.5,  rotate: 5,   scale: 1.0,  opacity: 0.88, width: 85  },
    { top: 48.4, left: 2.0,  rotate: -8,  scale: 1.0,  opacity: 0.80, width: 60  },
    { top: 42.5, left: 36.6, rotate: 20,  scale: 1.0,  opacity: 0.75, width: 35  },
    { top: 33.6, left: 36.7, rotate: 8,   scale: 1.0,  opacity: 0.70, width: 75  },
    { top: 7.8,  left: 33.6, rotate: -5,  scale: 1.0,  opacity: 0.75, width: 38  },
];

export function HeroAssetEditorProvider({ children }: { children: ReactNode }) {
    const [overrides, setOverrides] = useState<AssetOverride[]>(EDITOR_DEFAULTS);

    const setOverride = useCallback((index: number, key: keyof AssetOverride, value: number) => {
        setOverrides(prev => prev.map((a, i) => i === index ? { ...a, [key]: value } : a));
    }, []);

    return <Ctx.Provider value={{ overrides, setOverride }}>{children}</Ctx.Provider>;
}

export function useAssetEditor() {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error('useAssetEditor must be used inside HeroAssetEditorProvider');
    return ctx;
}
