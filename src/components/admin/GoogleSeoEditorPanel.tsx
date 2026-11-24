'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import styles from './GoogleSeoEditorPanel.module.css';

const GooglePreviewInline = dynamic(() => import('@/app/google-preview/GooglePreviewClient'), {
    ssr: false,
    loading: () => <div className={styles.loading}>Loading Google Search &amp; Local Pack Preview…</div>,
});

interface SeoFormState {
    seoTitle: string;
    seoDescription: string;
    ogTitle: string;
    ogDescription: string;
    seoKeywords: string;
    shopName: string;
    phone: string;
    email: string;
}

const DEFAULT_FORM: SeoFormState = {
    seoTitle: "Hofherr Meat Co. | Northfield's Premier Craft Butcher",
    seoDescription:
        'Craft butchery in Northfield & Winnetka, IL. Order hand-cut USDA Prime steaks, whole-hog roasts, Italian beef, and BBQ catering online.',
    ogTitle: "Hofherr Meat Co. | Northfield's Premier Craft Butcher",
    ogDescription: "Northfield's Premier Craft Butcher & BBQ Pitmasters",
    seoKeywords:
        'Hofherr Meat Co, butcher shop Northfield IL, craft butcher North Shore, USDA Prime steaks, Winnetka Depot, BBQ catering Chicago North Shore, whole pig roast, house-made sausages',
    shopName: 'Hofherr Meat Co.',
    phone: '(847) 441-MEAT',
    email: 'butcher@hofherrmeatco.com',
};

export default function GoogleSeoEditorPanel() {
    const [form, setForm] = useState<SeoFormState>(DEFAULT_FORM);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);

    useEffect(() => {
        let cancelled = false;
        async function loadSeo() {
            try {
                const res = await fetch('/api/admin/seo', { cache: 'no-store' });
                if (!res.ok) return;
                const data = (await res.json()) as {
                    seoTitle?: string;
                    seoDescription?: string;
                    ogTitle?: string;
                    ogDescription?: string;
                    seoKeywords?: string[];
                    shopName?: string;
                    phone?: string;
                    email?: string;
                };
                if (!cancelled) {
                    setForm({
                        seoTitle: data.seoTitle ?? DEFAULT_FORM.seoTitle,
                        seoDescription: data.seoDescription ?? DEFAULT_FORM.seoDescription,
                        ogTitle: data.ogTitle ?? DEFAULT_FORM.ogTitle,
                        ogDescription: data.ogDescription ?? DEFAULT_FORM.ogDescription,
                        seoKeywords: Array.isArray(data.seoKeywords)
                            ? data.seoKeywords.join(', ')
                            : DEFAULT_FORM.seoKeywords,
                        shopName: data.shopName ?? DEFAULT_FORM.shopName,
                        phone: data.phone ?? DEFAULT_FORM.phone,
                        email: data.email ?? DEFAULT_FORM.email,
                    });
                }
            } catch {
                // Keep defaults if fetch fails
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        void loadSeo();
        return () => {
            cancelled = true;
        };
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setStatus(null);
        try {
            const res = await fetch('/api/admin/seo', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = (await res.json()) as { ok?: boolean; error?: string };
            if (!res.ok || !data.ok) {
                setStatus({ ok: false, text: data.error ?? 'Could not save Google SEO settings.' });
            } else {
                setStatus({
                    ok: true,
                    text: 'Published live ✓ — Site <title>, <meta description>, OpenGraph, and Google JSON-LD structured data are now updated and revalidated for Googlebot.',
                });
            }
        } catch {
            setStatus({ ok: false, text: 'Network error while publishing SEO settings.' });
        } finally {
            setSaving(false);
        }
    };

    const titleLen = form.seoTitle.trim().length;
    const descLen = form.seoDescription.trim().length;

    return (
        <div className={styles.wrap}>
            <section id="live-google-seo-editor" aria-labelledby="live-google-seo-heading" className={styles.editorCard}>
                <div className={styles.editorHead}>
                    <div>
                        <h2 id="live-google-seo-heading" className={styles.editorTitle}>
                            Live Google Search &amp; Knowledge Panel Editor
                        </h2>
                        <p className={styles.editorSub}>
                            Changes saved here write directly to Sanity CMS and immediately update your live site&apos;s{' '}
                            <code>&lt;title&gt;</code>, <code>&lt;meta name=&quot;description&quot;&gt;</code>, OpenGraph share cards, and{' '}
                            <code>JSON-LD</code> structured data so Google updates your search listing on its next crawl.
                        </p>
                    </div>
                </div>

                {/* Live SERP Snippet Preview */}
                <div className={styles.serpPreview} aria-label="Live Google Search snippet preview">
                    <div className={styles.serpSiteRow}>
                        <span className={styles.serpFavicon}>H</span>
                        <div>
                            <div className={styles.serpSiteName}>{form.shopName || 'Hofherr Meat Co.'}</div>
                            <div className={styles.serpUrl}>https://hofherrmeatco.com</div>
                        </div>
                    </div>
                    <div className={styles.serpTitle}>{form.seoTitle || DEFAULT_FORM.seoTitle}</div>
                    <p className={styles.serpDesc}>{form.seoDescription || DEFAULT_FORM.seoDescription}</p>
                    <div className={styles.serpMetaLine}>
                        <span>📞 {form.phone || DEFAULT_FORM.phone}</span>
                        <span>·</span>
                        <span>✉️ {form.email || DEFAULT_FORM.email}</span>
                    </div>
                </div>

                <form onSubmit={handleSave} className={styles.form}>
                    <div className={styles.gridTwo}>
                        <label className={styles.field}>
                            <span className={styles.labelRow}>
                                <span>Google Search Title</span>
                                <span className={titleLen > 60 ? styles.countWarn : styles.countOk}>
                                    {titleLen} / 60 chars
                                </span>
                            </span>
                            <input
                                type="text"
                                className={styles.input}
                                value={form.seoTitle}
                                onChange={(e) => setForm((f) => ({ ...f, seoTitle: e.target.value }))}
                                disabled={loading || saving}
                                required
                            />
                        </label>

                        <label className={styles.field}>
                            <span className={styles.labelRow}>
                                <span>Social / OpenGraph Share Title</span>
                                <span className={styles.countOk}>{form.ogTitle.trim().length} chars</span>
                            </span>
                            <input
                                type="text"
                                className={styles.input}
                                value={form.ogTitle}
                                onChange={(e) => setForm((f) => ({ ...f, ogTitle: e.target.value }))}
                                disabled={loading || saving}
                            />
                        </label>
                    </div>

                    <div className={styles.gridTwo}>
                        <label className={styles.field}>
                            <span className={styles.labelRow}>
                                <span>Google Meta Description</span>
                                <span className={descLen > 160 ? styles.countWarn : styles.countOk}>
                                    {descLen} / 160 chars
                                </span>
                            </span>
                            <textarea
                                rows={3}
                                className={styles.textarea}
                                value={form.seoDescription}
                                onChange={(e) => setForm((f) => ({ ...f, seoDescription: e.target.value }))}
                                disabled={loading || saving}
                                required
                            />
                        </label>

                        <label className={styles.field}>
                            <span className={styles.labelRow}>
                                <span>Social / OpenGraph Share Description</span>
                                <span className={styles.countOk}>{form.ogDescription.trim().length} chars</span>
                            </span>
                            <textarea
                                rows={3}
                                className={styles.textarea}
                                value={form.ogDescription}
                                onChange={(e) => setForm((f) => ({ ...f, ogDescription: e.target.value }))}
                                disabled={loading || saving}
                            />
                        </label>
                    </div>

                    <div className={styles.gridThree}>
                        <label className={styles.field}>
                            <span className={styles.labelRow}>
                                <span>Business Name (JSON-LD)</span>
                            </span>
                            <input
                                type="text"
                                className={styles.input}
                                value={form.shopName}
                                onChange={(e) => setForm((f) => ({ ...f, shopName: e.target.value }))}
                                disabled={loading || saving}
                            />
                        </label>

                        <label className={styles.field}>
                            <span className={styles.labelRow}>
                                <span>Public Phone (JSON-LD)</span>
                            </span>
                            <input
                                type="text"
                                className={styles.input}
                                value={form.phone}
                                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                                disabled={loading || saving}
                            />
                        </label>

                        <label className={styles.field}>
                            <span className={styles.labelRow}>
                                <span>Public Email (JSON-LD)</span>
                            </span>
                            <input
                                type="email"
                                className={styles.input}
                                value={form.email}
                                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                                disabled={loading || saving}
                            />
                        </label>
                    </div>

                    <label className={styles.field}>
                        <span className={styles.labelRow}>
                            <span>SEO Keywords (comma-separated)</span>
                        </span>
                        <input
                            type="text"
                            className={styles.input}
                            value={form.seoKeywords}
                            onChange={(e) => setForm((f) => ({ ...f, seoKeywords: e.target.value }))}
                            disabled={loading || saving}
                        />
                    </label>

                    <div className={styles.actions}>
                        <button type="submit" className={styles.saveBtn} disabled={loading || saving}>
                            {saving ? 'Publishing to Live Site…' : '💾 Save & Publish to Live Site'}
                        </button>
                        <button
                            type="button"
                            className={styles.resetBtn}
                            disabled={loading || saving}
                            onClick={() => {
                                setForm(DEFAULT_FORM);
                                setStatus(null);
                            }}
                        >
                            ↺ Reset to Defaults
                        </button>
                    </div>

                    {status && (
                        <div className={status.ok ? styles.statusOk : styles.statusErr} role="status">
                            {status.text}
                        </div>
                    )}
                </form>
            </section>

            {/* Full Interactive Google SERP, Local Pack & Knowledge Panel Preview */}
            <section aria-label="Full Google Search and Business Profile Preview" className={styles.previewWrap}>
                <GooglePreviewInline />
            </section>
        </div>
    );
}
