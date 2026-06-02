import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import styles from './page.module.css';
import ResponsivePreview from './ResponsivePreview';

const IS_DEV = process.env.NODE_ENV === 'development';

export const metadata: Metadata = {
    title: 'Design System | Hofherr Meat Co.',
    robots: { index: false, follow: false },
};

/* ── Color data ── */
const brandColors = [
    { name: '--red', hex: '#CC0E1D', label: 'Brand Red' },
    { name: '--red-dark', hex: '#a00b17', label: 'Red Dark' },
    { name: '--red-light', hex: '#e01e2e', label: 'Red Light' },
    { name: '--gold', hex: '#A8905F', label: 'Brand Gold' },
    { name: '--gold-dark', hex: '#8a7349', label: 'Gold Dark' },
    { name: '--gold-light', hex: '#c4ae82', label: 'Gold Light' },
    { name: '--dark', hex: '#000000', label: 'Dark' },
    { name: '--light', hex: '#F2F2F2', label: 'Light' },
];

const bgColors = [
    { name: '--bg', value: 'transparent', label: 'Canvas' },
    { name: '--bg-2', value: 'rgba(0,0,0,0.45)', label: 'Overlay 45%' },
    { name: '--bg-3', value: 'rgba(0,0,0,0.65)', label: 'Overlay 65%' },
    { name: '--bg-4', value: 'rgba(0,0,0,0.8)', label: 'Overlay 80%' },
];

const textColors = [
    { name: '--text / --fg', hex: '#F2F2F2', label: 'Primary' },
    { name: '--text-2 / --fg-2', hex: '#CCCCCC', label: 'Secondary' },
    { name: '--text-3 / --fg-3', hex: '#999999', label: 'Tertiary' },
    { name: '--text-muted', hex: '#666666', label: 'Muted' },
    { name: '--fg-muted', hex: '#888888', label: 'FG Muted' },
];

const spacingTokens = [
    { name: '--nav-h', value: '68px', desc: 'Navbar height' },
    { name: '--page-stem', value: '40px', desc: 'Page padding top' },
    { name: '--max-w', value: '1200px', desc: 'Max content width' },
    { name: '--radius', value: '10px', desc: 'Default radius' },
    { name: '--radius-sm', value: '6px', desc: 'Small radius' },
    { name: '--radius-lg', value: '18px', desc: 'Large radius' },
];

const motionTokens = [
    { name: '--ease-out', value: 'cubic-bezier(0.16, 1, 0.3, 1)', desc: 'Decelerate (buttons, hovers)' },
    { name: '--ease-in-out', value: 'cubic-bezier(0.4, 0, 0.2, 1)', desc: 'Smooth (transitions)' },
];

export default function DesignSystemPage() {
    if (!IS_DEV) return notFound();

    return (
        <div className={styles.page}>
            <div className={styles.container}>

                {/* ── Header ── */}
                <header className={styles.header}>
                    <div className="section-label">Internal Reference</div>
                    <h1 className={styles.title}>Design System</h1>
                    <p className={styles.subtitle}>
                        Typography, color palette, spacing tokens, and component library for
                        Hofherr Meat Co. — <code>globals.css</code> reference.
                    </p>
                </header>

                {/* ── 01 Typography ── */}
                <section className={styles.section} id="typography">
                    <h2 className={styles.sectionTitle}>
                        <span className={styles.sectionNum}>01</span>
                        Typography
                    </h2>

                    <div className={styles.subsection}>
                        <h3 className={styles.subsectionTitle}>Font Families</h3>
                        <div className={styles.fontGrid}>
                            <div className={styles.fontCard}>
                                <span className={styles.fontPreview} style={{ fontFamily: '"Yanone Kaffeesatz", sans-serif', fontWeight: 700, fontSize: 48, textTransform: 'uppercase' }}>
                                    Aa
                                </span>
                                <div className={styles.fontMeta}>
                                    <strong>Yanone Kaffeesatz</strong>
                                    <code>var(--font-heading)</code>
                                    <span className={styles.fontUsage}>H1–H4, section labels, tags</span>
                                    <span className={styles.fontWeights}>Weights: 400 · 500 · 600 · 700</span>
                                </div>
                            </div>
                            <div className={styles.fontCard}>
                                <span className={styles.fontPreview} style={{ fontFamily: '"Inter", sans-serif', fontWeight: 400, fontSize: 36 }}>
                                    Aa
                                </span>
                                <div className={styles.fontMeta}>
                                    <strong>Inter</strong>
                                    <code>var(--font-body)</code>
                                    <span className={styles.fontUsage}>Body text, paragraphs, inputs</span>
                                    <span className={styles.fontWeights}>Weights: 100–900 (variable)</span>
                                </div>
                            </div>
                            <div className={styles.fontCard}>
                                <span className={styles.fontPreview} style={{ fontFamily: '"Outfit", sans-serif', fontWeight: 500, fontSize: 36 }}>
                                    Aa
                                </span>
                                <div className={styles.fontMeta}>
                                    <strong>Outfit</strong>
                                    <code>var(--font-outfit)</code>
                                    <span className={styles.fontUsage}>Alternative body, UI elements</span>
                                    <span className={styles.fontWeights}>Weights: 100–900 (variable)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.subsection}>
                        <h3 className={styles.subsectionTitle}>Heading Scale</h3>
                        <div className={styles.typeScale}>
                            <div className={styles.typeRow}>
                                <div className={styles.typeMeta}>
                                    <code>&lt;h1&gt;</code>
                                    <span>clamp(2.4rem, 6vw, 4.5rem)</span>
                                </div>
                                <h1 style={{ fontSize: 'clamp(2.4rem, 6vw, 4.5rem)' }}>Premium Craft Butchery</h1>
                            </div>
                            <div className={styles.typeRow}>
                                <div className={styles.typeMeta}>
                                    <code>&lt;h2&gt;</code>
                                    <span>clamp(1.8rem, 4vw, 3rem)</span>
                                </div>
                                <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>Dry-Aged USDA Prime</h2>
                            </div>
                            <div className={styles.typeRow}>
                                <div className={styles.typeMeta}>
                                    <code>&lt;h3&gt;</code>
                                    <span>clamp(1.4rem, 3vw, 2rem)</span>
                                </div>
                                <h3 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>Custom Cuts To Order</h3>
                            </div>
                            <div className={styles.typeRow}>
                                <div className={styles.typeMeta}>
                                    <code>&lt;h4&gt;</code>
                                    <span>clamp(1.1rem, 2vw, 1.5rem)</span>
                                </div>
                                <h4 style={{ fontSize: 'clamp(1.1rem, 2vw, 1.5rem)' }}>Northfield &amp; Winnetka</h4>
                            </div>
                            <div className={styles.typeRow}>
                                <div className={styles.typeMeta}>
                                    <code>&lt;h5&gt;</code>
                                    <span>1rem / 700</span>
                                </div>
                                <h5 style={{ fontSize: '1rem', fontWeight: 700, fontFamily: '"Inter", sans-serif', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Section Heading Five</h5>
                            </div>
                            <div className={styles.typeRow}>
                                <div className={styles.typeMeta}>
                                    <code>&lt;h6&gt;</code>
                                    <span>0.85rem / 700</span>
                                </div>
                                <h6 style={{ fontSize: '0.85rem', fontWeight: 700, fontFamily: '"Inter", sans-serif', letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>Section Heading Six</h6>
                            </div>
                        </div>
                    </div>

                    <div className={styles.subsection}>
                        <h3 className={styles.subsectionTitle}>Body &amp; Inline</h3>
                        <div className={styles.bodyExamples}>
                            <div className={styles.bodyRow}>
                                <code>&lt;p&gt;</code>
                                <p style={{ lineHeight: 1.8, maxWidth: 600 }}>
                                    Craft butchery since 1903. Every cut made to order, every animal traceable to a named family farm. We don&apos;t just sell meat — we craft experiences.
                                </p>
                            </div>
                            <div className={styles.bodyRow}>
                                <code>&lt;p&gt; small</code>
                                <p style={{ fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.7, maxWidth: 600 }}>
                                    Per-pound items will be finalized at pickup based on exact weight. Call (847) 441-MEAT with any questions.
                                </p>
                            </div>
                            <div className={styles.bodyRow}>
                                <code>&lt;a&gt;</code>
                                <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
                                    <a href="#" style={{ color: 'var(--red)', fontWeight: 600 }}>Standard link →</a>
                                    <a href="#" style={{ color: 'var(--fg-2)', textDecoration: 'underline', textUnderlineOffset: 3 }}>Underlined link</a>
                                    <a href="#" className="btn-ghost" style={{ color: 'var(--red)', borderBottom: '1px solid rgba(209,72,54,0.3)', paddingBottom: 2, fontSize: 12, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Ghost link</a>
                                </div>
                            </div>
                            <div className={styles.bodyRow}>
                                <code>.section-label</code>
                                <div className="section-label">Featured Cuts</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── 02 Color Palette ── */}
                <section className={styles.section} id="colors">
                    <h2 className={styles.sectionTitle}>
                        <span className={styles.sectionNum}>02</span>
                        Color Palette
                    </h2>

                    <div className={styles.subsection}>
                        <h3 className={styles.subsectionTitle}>Brand Colors</h3>
                        <div className={styles.colorGrid}>
                            {brandColors.map(c => (
                                <div key={c.name} className={styles.colorCard}>
                                    <div className={styles.colorSwatch} style={{ background: c.hex }} />
                                    <div className={styles.colorInfo}>
                                        <strong>{c.label}</strong>
                                        <code>{c.name}</code>
                                        <span className={styles.colorHex}>{c.hex}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.subsection}>
                        <h3 className={styles.subsectionTitle}>Text Colors</h3>
                        <div className={styles.colorGrid}>
                            {textColors.map(c => (
                                <div key={c.name} className={styles.colorCard}>
                                    <div className={styles.colorSwatch} style={{ background: c.hex }} />
                                    <div className={styles.colorInfo}>
                                        <strong>{c.label}</strong>
                                        <code>{c.name}</code>
                                        <span className={styles.colorHex}>{c.hex}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.subsection}>
                        <h3 className={styles.subsectionTitle}>Background Layers</h3>
                        <div className={styles.bgGrid}>
                            {bgColors.map(c => (
                                <div key={c.name} className={styles.bgCard}>
                                    <div className={styles.bgSwatch} style={{ background: c.value, border: c.value === 'transparent' ? '1px dashed var(--border)' : 'none' }}>
                                        {c.value === 'transparent' && <span style={{ fontSize: 10, color: 'var(--fg-muted)' }}>transparent</span>}
                                    </div>
                                    <code>{c.name}</code>
                                    <span>{c.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── 03 Components ── */}
                <section className={styles.section} id="components">
                    <h2 className={styles.sectionTitle}>
                        <span className={styles.sectionNum}>03</span>
                        Components
                    </h2>

                    <div className={styles.subsection}>
                        <h3 className={styles.subsectionTitle}>Buttons</h3>
                        <div className={styles.componentRow}>
                            <div className={styles.componentDemo}>
                                <button className="btn btn-primary">Primary Button</button>
                                <code>.btn .btn-primary</code>
                            </div>
                            <div className={styles.componentDemo}>
                                <button className="btn btn-secondary">Secondary Button</button>
                                <code>.btn .btn-secondary</code>
                            </div>
                            <div className={styles.componentDemo}>
                                <button className="btn btn-ghost">Ghost Link →</button>
                                <code>.btn .btn-ghost</code>
                            </div>
                        </div>
                    </div>

                    <div className={styles.subsection}>
                        <h3 className={styles.subsectionTitle}>Tags</h3>
                        <div className={styles.componentRow}>
                            <div className={styles.componentDemo}>
                                <span className="tag tag-red">New</span>
                                <code>.tag .tag-red</code>
                            </div>
                            <div className={styles.componentDemo}>
                                <span className="tag tag-green">In Stock</span>
                                <code>.tag .tag-green</code>
                            </div>
                            <div className={styles.componentDemo}>
                                <span className="tag tag-gold">Premium</span>
                                <code>.tag .tag-gold</code>
                            </div>
                            <div className={styles.componentDemo}>
                                <span className="tag tag-seasonal">Seasonal</span>
                                <code>.tag .tag-seasonal</code>
                            </div>
                        </div>
                    </div>

                    <div className={styles.subsection}>
                        <h3 className={styles.subsectionTitle}>Cards</h3>
                        <div className={styles.cardRow}>
                            <div className="card" style={{ padding: 24, maxWidth: 320 }}>
                                <h4 style={{ marginBottom: 8 }}>Dry-Aged Ribeye</h4>
                                <p style={{ fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.6, marginBottom: 12 }}>
                                    28-day dry-aged, hand-cut to your preferred thickness.
                                </p>
                                <span style={{ color: 'var(--gold)', fontWeight: 700 }}>$40.99/lb</span>
                            </div>
                            <div className="card" style={{ padding: 24, maxWidth: 320 }}>
                                <h4 style={{ marginBottom: 8 }}>BBQ Catering</h4>
                                <p style={{ fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.6, marginBottom: 12 }}>
                                    Full-service BBQ events from 20 to 500+ guests.
                                </p>
                                <span className="tag tag-red" style={{ marginRight: 6 }}>Popular</span>
                                <span style={{ color: 'var(--fg-3)', fontSize: 13 }}>From $16/person</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.subsection}>
                        <h3 className={styles.subsectionTitle}>Dividers</h3>
                        <div style={{ padding: '0 0 8px' }}>
                            <code style={{ fontSize: 12, color: 'var(--fg-muted)' }}>.divider</code>
                            <div className="divider" style={{ marginTop: 8 }} />
                        </div>
                        <div style={{ padding: '16px 0 0' }}>
                            <code style={{ fontSize: 12, color: 'var(--fg-muted)' }}>.divider-left</code>
                            <div className="divider divider-left" style={{ marginTop: 8 }} />
                        </div>
                    </div>
                </section>

                {/* ── 04 Spacing & Layout ── */}
                <section className={styles.section} id="spacing">
                    <h2 className={styles.sectionTitle}>
                        <span className={styles.sectionNum}>04</span>
                        Spacing &amp; Layout
                    </h2>
                    <div className={styles.tokenTable}>
                        <div className={styles.tokenHeader}>
                            <span>Token</span>
                            <span>Value</span>
                            <span>Usage</span>
                        </div>
                        {spacingTokens.map(t => (
                            <div key={t.name} className={styles.tokenRow}>
                                <code>{t.name}</code>
                                <span>{t.value}</span>
                                <span className={styles.tokenDesc}>{t.desc}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── 05 Motion ── */}
                <section className={styles.section} id="motion">
                    <h2 className={styles.sectionTitle}>
                        <span className={styles.sectionNum}>05</span>
                        Motion &amp; Easing
                    </h2>
                    <div className={styles.tokenTable}>
                        <div className={styles.tokenHeader}>
                            <span>Token</span>
                            <span>Value</span>
                            <span>Usage</span>
                        </div>
                        {motionTokens.map(t => (
                            <div key={t.name} className={styles.tokenRow}>
                                <code>{t.name}</code>
                                <span style={{ fontSize: 12 }}>{t.value}</span>
                                <span className={styles.tokenDesc}>{t.desc}</span>
                            </div>
                        ))}
                    </div>

                    <div className={styles.subsection} style={{ marginTop: 32 }}>
                        <h3 className={styles.subsectionTitle}>Animation Classes</h3>
                        <div className={styles.componentRow}>
                            <div className={styles.componentDemo}>
                                <code>.animate-fade-up</code>
                                <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>fadeInUp 0.5s ease-out</span>
                            </div>
                            <div className={styles.componentDemo}>
                                <code>.animate-fade</code>
                                <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>fadeIn 0.4s ease-out</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── 06 Shadows ── */}
                <section className={styles.section} id="shadows">
                    <h2 className={styles.sectionTitle}>
                        <span className={styles.sectionNum}>06</span>
                        Shadows
                    </h2>
                    <div className={styles.shadowGrid}>
                        {[
                            { name: '--shadow-sm', label: 'Small' },
                            { name: '--shadow-md', label: 'Medium' },
                            { name: '--shadow-lg', label: 'Large' },
                            { name: '--shadow-red', label: 'Red Glow' },
                        ].map(s => (
                            <div key={s.name} className={styles.shadowCard} style={{ boxShadow: `var(${s.name})` }}>
                                <strong>{s.label}</strong>
                                <code>{s.name}</code>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── 07 Responsive ── */}
                <section className={styles.section} id="responsive">
                    <h2 className={styles.sectionTitle}>
                        <span className={styles.sectionNum}>07</span>
                        Responsive &amp; Breakpoints
                    </h2>

                    <div className={styles.subsection}>
                        <h3 className={styles.subsectionTitle}>Breakpoint Scale</h3>
                        <div className={styles.tokenTable}>
                            <div className={styles.tokenHeader}>
                                <span>Breakpoint</span>
                                <span>Usage Count</span>
                                <span>Devices</span>
                            </div>
                            {[
                                { bp: '480px', count: '11', device: 'Small phones (portrait)' },
                                { bp: '600px', count: '17', device: 'Large phones (landscape)' },
                                { bp: '768px', count: '20', device: 'Tablets (portrait)' },
                                { bp: '900px', count: '18', device: 'Tablets (landscape) / Small laptops' },
                                { bp: '1024px', count: '3', device: 'Laptops' },
                                { bp: '1200px', count: '2', device: 'Desktops (max content width)' },
                            ].map(b => (
                                <div key={b.bp} className={styles.tokenRow}>
                                    <code>max-width: {b.bp}</code>
                                    <span>{b.count}×</span>
                                    <span className={styles.tokenDesc}>{b.device}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.subsection} style={{ marginTop: 40 }}>
                        <h3 className={styles.subsectionTitle}>Live Viewport Preview</h3>
                        <p style={{ fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.7, marginBottom: 20, maxWidth: 560 }}>
                            Preview any page at different viewport widths. Select a device preset or enter a custom URL to test responsive behavior.
                        </p>
                        <ResponsivePreview />
                    </div>
                </section>

            </div>
        </div>
    );
}
