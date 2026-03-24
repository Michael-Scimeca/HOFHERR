'use client';
import { useState } from 'react';
import styles from './QuotesSection.module.css';

export default function QuotesSection() {
    const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');
    const [contactPref, setContactPref] = useState<'phone' | 'email'>('phone');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        // Simulate sending
        setTimeout(() => setStatus('success'), 1500);
    };

    if (status === 'success') {
        return (
            <section className={styles.section}>
                <div className={`container ${styles.inner}`}>
                    <div style={{ textAlign: 'center', width: '100%', padding: '64px 0' }}>
                        <h2 className={styles.title}>Quote Request <em>Sent!</em></h2>
                        <p className={styles.sub}>Thanks for reaching out. Sean will get back to you personally — usually same day.</p>
                        <button onClick={() => setStatus('idle')} className="btn btn-secondary">Send Another Request</button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className={styles.section} id="get-a-quote">
            <div className={`container ${styles.inner}`}>
                {/* ── Left Side ── */}
                <div className={styles.left}>
                    <div className="section-label">Custom & Catering</div>
                    <h2 className={styles.title}>Get a <em>Quote</em></h2>
                    <p className={styles.sub}>
                        Catering an event? Need a whole animal? Ordering for a restaurant or wholesale account? 
                        Tell us what you need and Sean will get back to you personally — usually same day.
                    </p>

                    <div className={styles.perks}>
                        {[
                            'Pig roasts & whole animals',
                            'BBQ catering for 20–500+ guests',
                            'Bulk & wholesale orders',
                            'Custom aging & specialty cuts',
                            'Holiday pre-orders',
                        ].map(perk => (
                            <div key={perk} className={styles.perk}>
                                <span className={styles.check}>✓</span> {perk}
                            </div>
                        ))}
                    </div>

                    <div className={styles.contactBoxes}>
                        <a href="tel:8474416328" className={styles.contactBox}>
                            <div className={styles.contactIcon}>📞</div>
                            <div className={styles.contactInfo}>
                                <h4>Call or Text</h4>
                                <div className={styles.contactValue}>(847) 441-6328</div>
                            </div>
                        </a>
                        <a href="mailto:butcher@hofherrmeatco.com" className={styles.contactBox}>
                            <div className={styles.contactIcon}>✉️</div>
                            <div className={styles.contactInfo}>
                                <h4>Email</h4>
                                <div className={styles.contactValue}>butcher@hofherrmeatco.com</div>
                            </div>
                        </a>
                        <a href="#chat" className={styles.contactBox}>
                            <div className={styles.contactIcon}>💬</div>
                            <div className={styles.contactInfo}>
                                <h4>Live Chat</h4>
                                <div className={styles.contactValue}>Order via Chatbox</div>
                            </div>
                        </a>
                    </div>
                </div>

                {/* ── Right Side (Form) ── */}
                <div className={styles.formBox}>
                    <form onSubmit={handleSubmit} className={styles.formGrid}>
                        <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                            <label className={styles.label}>Your Name</label>
                            <input type="text" placeholder="John Smith" required className={styles.input} />
                        </div>
                        <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                            <label className={styles.label}>How should we reach you?</label>
                            <div className={styles.contactRow}>
                                <div className={styles.contactToggle}>
                                    <button type="button"
                                        className={`${styles.contactToggleBtn} ${contactPref === 'phone' ? styles.contactToggleBtnActive : ''}`}
                                        onClick={() => setContactPref('phone')}
                                    >📞 Call Me</button>
                                    <button type="button"
                                        className={`${styles.contactToggleBtn} ${contactPref === 'email' ? styles.contactToggleBtnActive : ''}`}
                                        onClick={() => setContactPref('email')}
                                    >✉️ Email Me</button>
                                </div>
                                {contactPref === 'phone'
                                    ? <input type="tel" placeholder="(847) 555-0100" required className={styles.input} />
                                    : <input type="email" placeholder="your@email.com" required className={styles.input} />
                                }
                            </div>
                        </div>
                        
                        <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                            <label className={styles.label}>What are you looking for?</label>
                            <select className={styles.select} required defaultValue="">
                                <option value="" disabled>Select an option...</option>
                                <option value="pig-roast">Pig Roast / Whole Animal</option>
                                <option value="bbq">BBQ Catering</option>
                                <option value="wholesale">Wholesale / Restaurant Account</option>
                                <option value="custom">Custom Aging / Specialty Cut</option>
                                <option value="other">Other Inquiry</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Event / Pickup Date</label>
                            <input type="date" className={styles.input} style={{ colorScheme: 'dark' }} />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Guest Count (Max 500)</label>
                            <input type="number" min={1} max={500} placeholder="e.g. 75" className={styles.input} />
                        </div>

                        <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                            <label className={styles.label}>Details & Special Requests</label>
                            <textarea 
                                placeholder="Tell us anything that will help us give you an accurate quote — cuts, quantities, dietary needs, event style, etc."
                                className={styles.textarea}
                            ></textarea>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ gridColumn: '1 / -1', marginTop: '12px' }}>
                            {status === 'sending' ? 'Sending Request...' : 'Send My Request'}
                        </button>

                        <p className={styles.note}>
                            We respond within a few hours during business hours. For urgent requests, call us directly.
                        </p>
                    </form>
                </div>
            </div>
        </section>
    );
}
