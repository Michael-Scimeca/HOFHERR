'use client';
import { useEffect, useState } from 'react';

export default function Receiver() {
    const [msg, setMsg] = useState('Waiting for data…');
    useEffect(() => {
        let cancelled = false;
        async function sendPayload() {
            let raw = '';
            try {
                raw = decodeURIComponent(window.location.hash.slice(1));
            } catch {
                if (!cancelled) setMsg('Malformed data in URL.');
                return;
            }
            if (!raw) {
                if (!cancelled) setMsg('No data in URL.');
                return;
            }
            try {
                const r = await fetch('/api/dev/import-toast-images', {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/plain' },
                    body: raw,
                });
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                const d = (await r.json()) as { received: number };
                if (!cancelled) {
                    setMsg(`Received ${d.received} photos.`);
                    history.replaceState(null, '', '/dev-toast-import');
                }
            } catch (e) {
                if (!cancelled) setMsg(`Error: ${(e as Error).message}`);
            }
        }
        void sendPayload();
        return () => {
            cancelled = true;
        };
    }, []);
    return (
        <main className="section container">
            <h1 id="status">{msg}</h1>
        </main>
    );
}
