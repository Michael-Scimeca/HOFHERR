import { NextRequest, NextResponse } from 'next/server';
import { adminClient } from '@/sanity/adminClient';
import { buildPasswordResetEmail } from '@/lib/email-templates';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email } = body;

        if (!email?.trim()) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Admin accounts use env vars — cannot be reset via this flow
        const adminEmails = [
            process.env.ADMIN_EMAIL?.toLowerCase(),
            process.env.BUTCHER_ADMIN_EMAIL?.toLowerCase(),
            process.env.DEPOT_ADMIN_EMAIL?.toLowerCase(),
        ].filter(Boolean);

        if (adminEmails.includes(normalizedEmail)) {
            // Don't reveal that this is an admin account, return same generic message
            return NextResponse.json({ success: true, message: 'If an account exists, a reset link has been sent.' });
        }

        const user = await adminClient.fetch(
            `*[_type == "customer" && email == $email][0]`,
            { email: normalizedEmail }
        );

        if (!user) {
            // For security reasons, don't disclose that the email isn't registered
            return NextResponse.json({ success: true, message: 'If an account exists, a reset link has been sent.' });
        }

        // Generate a secure random token
        const resetToken = crypto.randomBytes(32).toString('hex');
        
        // Expiry time: 1 hour from now
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);

        // Save token to Sanity
        await adminClient
            .patch(user._id)
            .set({ 
                resetToken: resetToken,
                resetTokenExpiry: expiryDate.toISOString()
            })
            .commit();

        // Base URL for the reset link
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin || 'http://localhost:2000';
        const resetLink = `${baseUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(normalizedEmail)}`;

        // Check for SMTP / email credentials (same logic as restock)
        const smtpHost = process.env.SMTP_HOST;
        const smtpUser = process.env.SMTP_USER;
        const smtpPass = process.env.SMTP_PASS;

        if (smtpHost && smtpUser && smtpPass) {
            // Send real email via nodemailer
            const nodemailer = await import('nodemailer');
            const transporter = nodemailer.createTransport({
                host: smtpHost,
                port: Number(process.env.SMTP_PORT || 587),
                secure: process.env.SMTP_SECURE === 'true',
                auth: { user: smtpUser, pass: smtpPass },
            });

            const resetEmail = buildPasswordResetEmail(normalizedEmail, resetLink);
            await transporter.sendMail({
                from: smtpUser,
                to: normalizedEmail,
                subject: resetEmail.subject,
                html: resetEmail.html,
                text: resetEmail.text,
            });

            console.log(`[Forgot Password] Reset email sent to ${normalizedEmail}`);
        } else {
            // Dev mode — just log
            console.log(`\n==========================================`);
            console.log(`[Forgot Password] DEVELOPMENT MODE`);
            console.log(`Reset link for ${normalizedEmail}:`);
            console.log(`${resetLink}`);
            console.log(`==========================================\n`);
        }

        return NextResponse.json({
            success: true,
            message: 'If an account exists, a reset link has been sent.',
            ...(process.env.NODE_ENV !== 'production' ? { devToken: resetToken, devResetLink: resetLink } : {}),
        });

    } catch (err) {
        console.error('[Forgot Password Error]', err);
        return NextResponse.json({ error: 'An error occurred. Please try again.' }, { status: 500 });
    }
}
