'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');
    const emailStr = searchParams.get('email');

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    if (!token) {
        return (
            <div style={{ padding: '60px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '24px', color: 'var(--red)', marginBottom: '16px' }}>Invalid Reset Link</h2>
                <p>This password reset link is missing or invalid. Please request a new one.</p>
                <div style={{ marginTop: '24px' }}>
                    <Link href="/" style={{ color: 'var(--red)', textDecoration: 'underline' }}>Back to Home</Link>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        if (password !== confirm) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Failed to update password.');
            } else {
                setSuccess(true);
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div style={{ padding: '60px', textAlign: 'center', maxWidth: '500px', margin: '0 auto', background: '#fff', border: '1px solid var(--border-soft)', borderRadius: 'var(--radius-lg)' }}>
                <h2 style={{ fontSize: '28px', color: 'var(--red)', marginBottom: '16px' }}>Password Saved!</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Your password has been successfully completely updated. You can now use your new password to log in.</p>
                <Link href="/online-orders" style={{ background: 'var(--red)', color: '#fff', padding: '12px 24px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }}>
                    Go to Login
                </Link>
            </div>
        );
    }

    return (
        <div style={{ padding: '40px 20px', maxWidth: '500px', margin: '0 auto' }}>
            <div style={{ background: '#fff', border: '1px solid var(--border-soft)', padding: '40px', borderRadius: 'var(--radius-lg)' }}>
                <h2 style={{ fontSize: '28px', color: 'var(--brand-dark)', marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>Set New Password</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '15px' }}>
                    Enter a new password for {emailStr ? <strong>{emailStr}</strong> : 'your account'}.
                </p>

                {error && <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px', border: '1px solid #fca5a5' }}>
                    {error}
                </div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--brand-dark)' }}>New Password</label>
                        <input 
                            type="password" 
                            required 
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ padding: '12px', borderRadius: '6px', border: '1px solid var(--border-soft)', fontSize: '16px' }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--brand-dark)' }}>Confirm Password</label>
                        <input 
                            type="password" 
                            required 
                            minLength={6}
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            style={{ padding: '12px', borderRadius: '6px', border: '1px solid var(--border-soft)', fontSize: '16px' }}
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{ marginTop: '16px', background: 'var(--red)', color: '#fff', padding: '14px', borderRadius: '6px', fontWeight: 'bold', fontSize: '16px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? 'Saving...' : 'Save New Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div style={{ minHeight: '80vh', background: 'var(--bg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '80px' }}>
            <Suspense fallback={<div>Loading...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
