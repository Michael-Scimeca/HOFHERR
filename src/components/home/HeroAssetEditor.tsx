'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ASSET_DEFAULTS, type Asset } from './HeroParallaxAssets';

const SRCS = [
    '/home-hero-assets/steak1.png',
    '/home-hero-assets/steak2.png',
    '/home-hero-assets/steak3blur.png',
    '/home-hero-assets/green.png',
    '/home-hero-assets/green2.png',
    '/home-hero-assets/green3.png',
    '/home-hero-assets/green4.png',
    '/home-hero-assets/salt1.png',
    '/home-hero-assets/salt2.png',
];
const NAMES = ['steak1','steak2','steak3blur','green','green2','green3','green4','salt1','salt2'];
const STORAGE_KEY = 'hofherr_asset_editor';

// ─── Global event bus → HeroParallaxAssets subscribes to this ───
export const assetEditorBus = {
    listeners: new Set<(assets: Asset[]) => void>(),
    current: null as Asset[] | null,
    emit(assets: Asset[]) {
        this.current = assets;
        this.listeners.forEach(fn => fn(assets));
    },
};

export default function FloatingAssetEditor() {
    const [open, setOpen]       = useState(false);
    const [active, setActive]   = useState(false);
    const [selected, setSelected] = useState<number | null>(null);
    const [copied, setCopied]   = useState(false);
    const [assets, setAssets]   = useState<Asset[]>(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem(STORAGE_KEY);
                if (saved) return JSON.parse(saved);
            } catch {}
        }
        return ASSET_DEFAULTS.map(d => ({ ...d }));
    });

    // Emit to bus + save whenever assets change
    useEffect(() => {
        assetEditorBus.emit(assets);
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(assets)); } catch {}
    }, [assets]);

    const setAsset = useCallback((i: number, key: keyof Asset, val: number) => {
        setAssets(prev => prev.map((a, idx) => idx === i ? { ...a, [key]: val } : a));
    }, []);

    // ─── Interaction refs ───
    const dragRef = useRef<{ i:number; sx:number; sy:number; ol:number; ot:number; pw:number; ph:number } | null>(null);
    const rotRef  = useRef<{ i:number; cx:number; cy:number; sa:number; or:number } | null>(null);
    const scaRef  = useRef<{ i:number; cx:number; cy:number; sd:number; os:number; ow:number } | null>(null);

    const getHero = useCallback(() =>
        document.querySelector('[data-asset-editor-root]') as HTMLElement | null, []);

    const startDrag = useCallback((e: React.MouseEvent, i: number) => {
        e.preventDefault(); e.stopPropagation();
        setSelected(i);
        const hero = getHero();
        if (!hero) return;
        const r = hero.getBoundingClientRect();
        dragRef.current = { i, sx: e.clientX, sy: e.clientY,
            ol: assets[i].left, ot: assets[i].top, pw: r.width, ph: r.height };
    }, [assets, getHero]);

    const startRotate = useCallback((e: React.MouseEvent, i: number) => {
        e.preventDefault(); e.stopPropagation();
        const hero = getHero();
        if (!hero) return;
        const r = hero.getBoundingClientRect();
        const a = assets[i];
        const cx = r.left + (a.left / 100) * r.width;
        const cy = r.top  + (a.top  / 100) * r.height;
        rotRef.current = { i, cx, cy, sa: Math.atan2(e.clientY-cy, e.clientX-cx)*(180/Math.PI), or: a.rotate };
    }, [assets, getHero]);

    const startScale = useCallback((e: React.MouseEvent, i: number) => {
        e.preventDefault(); e.stopPropagation();
        const hero = getHero();
        if (!hero) return;
        const r = hero.getBoundingClientRect();
        const a = assets[i];
        const cx = r.left + (a.left / 100) * r.width;
        const cy = r.top  + (a.top  / 100) * r.height;
        const dx = e.clientX-cx; const dy = e.clientY-cy;
        scaRef.current = { i, cx, cy, sd: Math.sqrt(dx*dx+dy*dy)||1, os: a.scale, ow: a.width };
    }, [assets, getHero]);

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            if (dragRef.current) {
                const d = dragRef.current;
                setAsset(d.i, 'left', d.ol + (e.clientX - d.sx) / d.pw * 100);
                setAsset(d.i, 'top',  d.ot + (e.clientY - d.sy) / d.ph * 100);
            }
            if (rotRef.current) {
                const d = rotRef.current;
                const ang = Math.atan2(e.clientY-d.cy, e.clientX-d.cx)*(180/Math.PI);
                setAsset(d.i, 'rotate', d.or + (ang - d.sa));
            }
            if (scaRef.current) {
                const d = scaRef.current;
                const dx = e.clientX-d.cx; const dy = e.clientY-d.cy;
                const ratio = Math.sqrt(dx*dx+dy*dy)/d.sd;
                setAsset(d.i, 'scale', Math.max(0.05, d.os * ratio));
                setAsset(d.i, 'width', Math.max(10, d.ow * ratio));
            }
        };
        const onUp = () => { dragRef.current=null; rotRef.current=null; scaRef.current=null; };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
        return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    }, [setAsset]);

    // ─── Live overlay positions ───
    const [heroRect, setHeroRect] = useState<DOMRect | null>(null);
    useEffect(() => {
        if (!active) return;
        const update = () => {
            const el = getHero();
            if (el) setHeroRect(el.getBoundingClientRect());
        };
        update();
        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
        return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
    }, [active, getHero]);

    // ─── CSS export ───
    const copyCSS = () => {
        const out = assets.map((a, i) => {
            const blur = i === 2 ? '\n    filter: blur(4px);' : '';
            return `.a${i+1} {\n    width: ${Math.round(a.width)}px;\n    top: ${a.top.toFixed(1)}%;\n    left: ${a.left.toFixed(1)}%;\n    rotate: ${a.rotate.toFixed(1)}deg;\n    transform: scale(${a.scale.toFixed(3)});\n    opacity: ${a.opacity.toFixed(2)};${blur}\n    z-index: ${a.zIndex};\n    /* scroll: speed=${(a.scrollSpeed ?? 0.02).toFixed(4)} rotation=${(a.scrollRotation ?? 0).toFixed(4)} */\n}`;
        }).join('\n\n');
        navigator.clipboard.writeText(out).then(() => { setCopied(true); setTimeout(()=>setCopied(false), 3000); });
    };

    const s = selected !== null ? assets[selected] : null;

    // ─── Styles ───
    const panel: React.CSSProperties = {
        position:'fixed', bottom:20, left:20, zIndex:2147483647,
        background:'rgba(8,8,8,0.97)', border:'1px solid rgba(255,255,255,0.12)',
        borderRadius:14, padding:16, width:272,
        maxHeight:'calc(100vh - 40px)', overflowY:'auto',
        boxShadow:'0 12px 48px rgba(0,0,0,0.9)',
        fontFamily:'monospace', fontSize:12, color:'#ccc',
        backdropFilter:'blur(24px)',
    };
    const row = { display:'flex', justifyContent:'space-between', fontSize:10, color:'#777' } as React.CSSProperties;
    const val = { color:'#fff', fontWeight:700 } as React.CSSProperties;
    const sl  = { width:'100%', accentColor:'#cc0e1d', margin:'3px 0 10px', display:'block' } as React.CSSProperties;
    const lbl = { fontSize:11, color:'#888', marginBottom:2 } as React.CSSProperties;

    return (
        <>
            {/* TOGGLE BUTTON */}
            {!open && (
                <button onClick={()=>setOpen(true)} style={{
                    position:'fixed', bottom:80, left:20, zIndex:2147483647,
                    background:'#cc0e1d', color:'#fff', border:'none',
                    borderRadius:10, padding:'10px 16px',
                    fontWeight:700, fontSize:13, cursor:'pointer',
                    boxShadow:'0 4px 20px rgba(0,0,0,0.7)', fontFamily:'monospace',
                }}>🎨 Edit Assets</button>
            )}

            {/* PANEL */}
            {open && (
                <div style={panel}>
                    {/* Header */}
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
                        <span style={{fontWeight:700,fontSize:13,color:'#fff'}}>🎨 Asset Editor</span>
                        <div style={{display:'flex',gap:6,alignItems:'center'}}>
                            <button onClick={()=>setActive(a=>!a)} style={{
                                background: active ? '#1a5e2e' : '#2a2a2a',
                                border: active ? '1px solid #2a9e5e' : '1px solid #444',
                                color: active ? '#4eff9e' : '#888',
                                borderRadius:6, padding:'3px 8px', cursor:'pointer', fontSize:11,
                            }}>
                                {active ? '● Handles ON' : '○ Handles OFF'}
                            </button>
                            <button onClick={()=>setOpen(false)} style={{background:'none',border:'none',color:'#555',cursor:'pointer',fontSize:18,lineHeight:1}}>✕</button>
                        </div>
                    </div>

                    {/* Instruction */}
                    {active && (
                        <div style={{background:'rgba(255,255,255,0.04)',borderRadius:8,padding:'7px 10px',marginBottom:12,fontSize:10,lineHeight:1.7,color:'#777'}}>
                            <b style={{color:'#ccc'}}>Click image</b> to select ·  <b style={{color:'#ccc'}}>Drag</b> to move (X/Y)<br/>
                            <span style={{color:'#f90'}}>⬡ top-right</span> = rotate · <span style={{color:'#0f0'}}>⬡ bottom-right</span> = scale (Z-size)
                        </div>
                    )}

                    {/* Thumbnails */}
                    <div style={{display:'flex',flexWrap:'wrap',gap:4,marginBottom:12}}>
                        {SRCS.map((src,i)=>(
                            <button key={i} onClick={()=>setSelected(i)} title={NAMES[i]} style={{
                                width:30,height:30,
                                background: selected===i ? '#cc0e1d' : '#1a1a1a',
                                border: selected===i ? '2px solid #ff4455' : '1px solid rgba(255,255,255,0.1)',
                                borderRadius:6,cursor:'pointer',padding:2,overflow:'hidden',
                            }}>
                                <img src={src} alt="" style={{width:'100%',height:'100%',objectFit:'contain'}}/>
                            </button>
                        ))}
                    </div>

                    {/* Per-asset controls */}
                    {s !== null && selected !== null && (
                        <div>
                            <div style={{color:'#555',fontSize:10,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:8}}>
                                a{selected+1} — {NAMES[selected]}
                            </div>

                            {/* Live position readout */}
                            <div style={{...row, marginBottom:10, background:'rgba(255,255,255,0.03)', borderRadius:6, padding:'5px 8px', gap:8, flexWrap:'wrap'}}>
                                <span>X <b style={val}>{s.left.toFixed(1)}%</b></span>
                                <span>Y <b style={val}>{s.top.toFixed(1)}%</b></span>
                                <span>R <b style={val}>{s.rotate.toFixed(0)}°</b></span>
                                <span>S <b style={val}>{s.scale.toFixed(2)}</b></span>
                                <span>Z <b style={val}>{s.zIndex}</b></span>
                                <span>⬇ <b style={val}>{(s.scrollSpeed ?? 0.02).toFixed(3)}</b></span>
                                <span>🔄 <b style={val}>{(s.scrollRotation ?? 0).toFixed(3)}</b></span>
                            </div>

                            {/* X (left) */}
                            <div style={lbl}>X Position <b style={val}>{s.left.toFixed(1)}%</b></div>
                            <input type="range" min={-20} max={120} step={0.2} style={sl} value={s.left}
                                onChange={e=>setAsset(selected,'left',+e.target.value)}/>

                            {/* Y (top) */}
                            <div style={lbl}>Y Position <b style={val}>{s.top.toFixed(1)}%</b></div>
                            <input type="range" min={-20} max={120} step={0.2} style={sl} value={s.top}
                                onChange={e=>setAsset(selected,'top',+e.target.value)}/>

                            {/* Z (z-index) */}
                            <div style={lbl}>Z-Index (layer) <b style={val}>{s.zIndex}</b></div>
                            <input type="range" min={-5} max={20} step={1} style={sl} value={s.zIndex}
                                onChange={e=>setAsset(selected,'zIndex',+e.target.value)}/>

                            {/* Rotate */}
                            <div style={lbl}>Rotate <b style={val}>{s.rotate.toFixed(0)}°</b></div>
                            <input type="range" min={-180} max={180} step={1} style={sl} value={s.rotate}
                                onChange={e=>setAsset(selected,'rotate',+e.target.value)}/>

                            {/* Scale */}
                            <div style={lbl}>Scale <b style={val}>{s.scale.toFixed(2)}×</b></div>
                            <input type="range" min={0.1} max={6} step={0.05} style={sl} value={s.scale}
                                onChange={e=>setAsset(selected,'scale',+e.target.value)}/>

                            {/* Width */}
                            <div style={lbl}>Width <b style={val}>{Math.round(s.width)}px</b></div>
                            <input type="range" min={10} max={400} step={1} style={sl} value={s.width}
                                onChange={e=>setAsset(selected,'width',+e.target.value)}/>

                            {/* Opacity */}
                            <div style={lbl}>Opacity <b style={val}>{s.opacity.toFixed(2)}</b></div>
                            <input type="range" min={0} max={1} step={0.01} style={sl} value={s.opacity}
                                onChange={e=>setAsset(selected,'opacity',+e.target.value)}/>

                            {/* ── Scroll Behavior ── */}
                            <div style={{height:1,background:'rgba(255,255,255,0.07)',margin:'8px 0'}}/>
                            <div style={{fontSize:10,color:'#cc0e1d',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:6}}>⬇ Scroll Parallax</div>

                            {/* Scroll Speed */}
                            <div style={lbl}>Scroll Speed <b style={val}>{(s.scrollSpeed ?? 0.02).toFixed(4)}</b></div>
                            <input type="range" min={-0.1} max={0.1} step={0.001} style={{...sl, accentColor:'#4488ff'}} value={s.scrollSpeed ?? 0.02}
                                onChange={e=>setAsset(selected,'scrollSpeed',+e.target.value)}/>

                            {/* Scroll Rotation */}
                            <div style={lbl}>Scroll Twist <b style={val}>{(s.scrollRotation ?? 0).toFixed(4)}°/px</b></div>
                            <input type="range" min={-0.02} max={0.02} step={0.0005} style={{...sl, accentColor:'#ff8800'}} value={s.scrollRotation ?? 0}
                                onChange={e=>setAsset(selected,'scrollRotation',+e.target.value)}/>
                        </div>
                    )}

                    <div style={{height:1,background:'rgba(255,255,255,0.07)',margin:'10px 0'}}/>
                    <button onClick={copyCSS} style={{
                        width:'100%', background: copied ? '#1a6e3a' : '#cc0e1d',
                        color:'#fff', border:'none', borderRadius:8,
                        padding:'9px', cursor:'pointer', fontWeight:700, fontSize:12,
                        transition:'background 0.3s',
                    }}>
                        {copied ? '✅ Copied — paste to me to save!' : '📋 Copy All Positions'}
                    </button>
                </div>
            )}

            {/* DRAG OVERLAYS — rendered at root level, uses hero bounding rect */}
            {active && heroRect && assets.map((a,i)=>{
                const isSel = selected===i;
                const left = heroRect.left + (a.left/100)*heroRect.width;
                const top  = heroRect.top  + (a.top /100)*heroRect.height;
                const w    = a.width * a.scale;
                return (
                    <div key={i} style={{
                        position:'fixed', left, top, width:w, height:w,
                        transform:`rotate(${a.rotate}deg)`,
                        transformOrigin:'top left',
                        zIndex:2147483640,
                        pointerEvents:'auto',
                        cursor:'grab',
                        outline: isSel ? '2px dashed rgba(120,180,255,0.9)' : '1px dashed rgba(255,255,255,0.18)',
                        outlineOffset:3, boxSizing:'border-box',
                    }}
                        onMouseDown={e=>startDrag(e,i)}
                        onClick={e=>{e.stopPropagation();setSelected(i);}}
                    >
                        {/* Index label */}
                        <div style={{
                            position:'absolute',top:-18,left:0,
                            background: isSel ? '#cc0e1d' : 'rgba(0,0,0,0.65)',
                            color:'#fff',fontSize:9,fontFamily:'monospace',
                            fontWeight:700,padding:'1px 5px',borderRadius:3,
                            pointerEvents:'none',whiteSpace:'nowrap',
                        }}>a{i+1} · Z:{a.zIndex}</div>

                        {isSel && <>
                            {/* Rotate handle */}
                            <div onMouseDown={e=>startRotate(e,i)} style={{
                                position:'absolute',top:-16,right:-16,
                                width:24,height:24,borderRadius:'50%',
                                background:'#f90',border:'2.5px solid #fff',
                                cursor:'crosshair',zIndex:2,
                                display:'flex',alignItems:'center',justifyContent:'center',
                                fontSize:13,color:'#000',fontWeight:900,userSelect:'none',
                            }}>↻</div>
                            {/* Scale handle */}
                            <div onMouseDown={e=>startScale(e,i)} style={{
                                position:'absolute',bottom:-16,right:-16,
                                width:24,height:24,borderRadius:5,
                                background:'#0f0',border:'2.5px solid #fff',
                                cursor:'nwse-resize',zIndex:2,
                                display:'flex',alignItems:'center',justifyContent:'center',
                                fontSize:13,color:'#000',userSelect:'none',
                            }}>⤡</div>
                        </>}
                    </div>
                );
            })}
        </>
    );
}
