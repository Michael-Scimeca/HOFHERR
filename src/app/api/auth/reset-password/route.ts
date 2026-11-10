import { NextRequest, NextResponse } from 'next/server';
import { adminClient } from '@/sanity/adminClient';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { token, email, password } = body;

        if (!password?.trim() || (!token?.trim() && !email?.trim())) {
            return NextResponse.json({ error: 'Email or reset token and a new password are required.' }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
        }

        const now = new Date().toISOString();
        let user = null;

        if (token?.trim()) {
            user = await adminClient.fetch(
                `*[_type == "customer" && resetToken == $token && resetTokenExpiry > $now][0]`,
                { token: token.trim(), now }
            );
        }

        if (!user && email?.trim()) {
            const normalizedEmail = email.toLowerCase().trim();
            user = await adminClient.fetch(
                `*[_type == "customer" && email == $email][0]`,
                { email: normalizedEmail }
            );
        }

        // 2. Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if (user?._id) {
            // 3. Update user in Sanity and clear token
            await adminClient
                .patch(user._id)
                .set({ password: hashedPassword })
                .unset(['resetToken', 'resetTokenExpiry'])
                .commit();

            return NextResponse.json({ success: true, message: 'Password updated successfully!' });
        }

        if (token?.trim()) {
            return NextResponse.json({ error: 'Invalid or expired password reset token.' }, { status: 400 });
        }

        return NextResponse.json({ error: 'No customer account found with that email address.' }, { status: 404 });

    } catch (err) {
        console.error('[Reset Password Error]', err);
        return NextResponse.json({ error: 'An error occurred while resetting password.' }, { status: 500 });
    }
}
