'use client';
import Wall from '@/components/TestimonialWall';

export default function TestimonialWall() {
    return (
        <main style={{ minHeight: '100vh', paddingTop: 'calc(var(--nav-h, 68px) + 24px)' }}>
            <p style={{ maxWidth: 760, margin: '0 auto', padding: '10px 16px', border: '1px dashed rgba(var(--gold-rgb), .6)', borderRadius: 6, fontSize: '.85rem', color: 'var(--fg-2)', textAlign: 'center' }}>
                Test page · reviews are <b>placeholders</b> — swap in real customer quotes before launch.
            </p>
            <Wall />
        </main>
    );
}
