import { NextRequest, NextResponse } from 'next/server';
import { adminClient } from '@/sanity/adminClient';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email } = body;

        if (!email?.trim()) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Check if user exists (excluding master admin)
        if (normalizedEmail === 'admin@hofherrmeats.com') {
             // Let's send a special email to the developer's email with the hardcoded credentials
             const smtpHost = process.env.SMTP_HOST;
             const smtpUser = process.env.SMTP_USER;
             const smtpPass = process.env.SMTP_PASS;
             
             if (smtpHost && smtpUser && smtpPass) {
                 const nodemailer = await import('nodemailer');
                 const transporter = nodemailer.createTransport({
                     host: smtpHost,
                     port: Number(process.env.SMTP_PORT || 587),
                     secure: process.env.SMTP_SECURE === 'true',
                     auth: { user: smtpUser, pass: smtpPass },
                 });
                 
                 await transporter.sendMail({
                     from: smtpUser,
                     to: 'mikeyscimeca@gmail.com',
                     subject: 'Master Admin Account Access | Hofherr Meat Co.',
                     html: `
                         <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
                             <h2 style="color: #800020;">Master Admin Recovery</h2>
                             <p>A password reset was requested for the Master Admin account.</p>
                             <p>Because this account is hardcoded into the application code (and not stored in the database), the password cannot be reset via the normal flow.</p>
                             <p>The current Master Admin credentials are:</p>
                             <ul>
                                 <li><strong>Email:</strong> admin@hofherrmeats.com</li>
                                 <li><strong>Password:</strong> PremiumCuts2026!</li>
                             </ul>
                         </div>
                     `
                 });
                 console.log(`[Forgot Password] Sent master admin credentials to mikeyscimeca@gmail.com`);
             }
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
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
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

            await transporter.sendMail({
                from: smtpUser,
                to: normalizedEmail,
                subject: 'Password Reset Request | Hofherr Meat Co.',
                html: `
                    <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #800020;">Reset Your Password</h2>
                        <p>We received a request to reset your password for your Hofherr Meat Co. account.</p>
                        <p>Click the link below to set a new password. This link will expire in 1 hour.</p>
                        <div style="margin: 30px 0;">
                            <a href="${resetLink}" style="background-color: #800020; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
                        </div>
                        <p style="font-size: 13px; color: #666;">If you didn't request a password reset, you can safely ignore this email.</p>
                    </div>
                `
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

        return NextResponse.json({ success: true, message: 'If an account exists, a reset link has been sent.' });

    } catch (err) {
        console.error('[Forgot Password Error]', err);
        return NextResponse.json({ error: 'An error occurred. Please try again.' }, { status: 500 });
    }
}
