import styles from './TrustBar.module.css';

const SIGNALS = [
    { icon: '🌾', label: 'Farm Sourced', desc: 'Traced to named family farms' },
    { icon: '🔪', label: 'Custom Cuts', desc: 'Any cut, any size, any quantity' },
    { icon: '🚗', label: 'VIP Curbside', desc: 'Pickup available on request' },
    { icon: '📅', label: 'Est. 2014', desc: 'A decade of craft butchery' },
];

export default function TrustBar() {
    return (
        <div className={styles.bar}>
            <div className={styles.inner}>
                {SIGNALS.map((s, i) => (
                    <div key={i} className={styles.signal}>
                        <span className={styles.icon}>{s.icon}</span>
                        <div>
                            <div className={styles.label}>{s.label}</div>
                            <div className={styles.desc}>{s.desc}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
