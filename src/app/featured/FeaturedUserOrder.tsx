'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function FeaturedUserOrder({ order, userEmail, userName }: { order: any, userEmail: string, userName: string }) {
    const router = useRouter();

    const handleReorder = () => {
        const cartItems = order.items.map((item: any) => ({
            name: item.name,
            price: typeof item.price === 'number' ? `$${(item.price / 100).toFixed(2)}` : (item.price || '$0.00'),
            qty: item.qty || item.quantity || 1,
            note: item.note || '',
            desc: item.desc || '',
        }));
        const storeId = order.metadata?.store_id || 'butcher';
        localStorage.setItem(`hofherr_cart_${storeId}`, JSON.stringify(cartItems));
        router.push(`/online-orders?cart=open&store=${storeId}`);
    };

    return (
        <div style={{ background: 'var(--bg)', padding: '32px', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '24px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
                    {userName.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 700 }}>{userName}</h3>
                    <p style={{ color: 'var(--fg-muted)', fontSize: '0.9rem', margin: 0 }}>{userEmail}</p>
                </div>
            </div>

            {!order ? (
                <div style={{ color: 'var(--fg-muted)', padding: '24px', textAlign: 'center', background: '#000', borderRadius: '8px', border: '1px dashed var(--border)' }}>
                    No orders found for this account. Create an order to see it here!
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--fg-muted)', fontWeight: 700 }}>Last Purchase</span>
                            <h4 style={{ fontSize: '1.1rem', margin: '4px 0 0', fontWeight: 600 }}>Order #{order.orderNumber}</h4>
                            <p style={{ color: 'var(--fg-muted)', fontSize: '0.85rem', margin: '2px 0 0' }}>
                                {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--fg-muted)', fontWeight: 700 }}>Total</span>
                            <div style={{ fontWeight: 'bold', color: '#4ade80', fontSize: '1.1rem', margin: '4px 0 0' }}>
                                ${((order.total || 0) / 100).toFixed(2)}
                            </div>
                        </div>
                    </div>
                    
                    <div style={{ background: '#000', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        {(order.items || []).map((item: any, i: number) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: i === order.items.length - 1 ? 0 : '8px', fontSize: '0.95rem' }}>
                                <span style={{ color: '#e2e8f0' }}>{item.qty || item.quantity || 1}x {item.name}</span>
                            </div>
                        ))}
                    </div>

                    <button 
                        onClick={handleReorder} 
                        style={{ 
                            alignSelf: 'stretch', 
                            background: 'var(--red)', 
                            color: '#fff', 
                            border: 'none', 
                            padding: '12px 20px', 
                            borderRadius: '8px', 
                            cursor: 'pointer', 
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'background 0.2s ease'
                        }}
                    >
                        <span>🛒</span> Repurchase Entire Order
                    </button>
                </div>
            )}
        </div>
    );
}
