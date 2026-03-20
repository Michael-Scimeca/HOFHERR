import { NextRequest, NextResponse } from 'next/server';
import { adminClient } from '@/sanity/adminClient';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { token, password } = body;

        if (!token?.trim() || !password?.trim()) {
            return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
        }

        // 1. Find user with this token
        // Token must match and expiry must be greater than current time
        const now = new Date().toISOString();
        const user = await adminClient.fetch(
            `*[_type == "customer" && resetToken == $token && resetTokenExpiry > $now][0]`,
            { token, now }
        );

        if (!user) {
            return NextResponse.json({ error: 'Invalid or expired password reset token.' }, { status: 400 });
        }

        // 2. Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Update user and clear token
        await adminClient
            .patch(user._id)
            .set({ password: hashedPassword })
            .unset(['resetToken', 'resetTokenExpiry'])
            .commit();

        return NextResponse.json({ success: true, message: 'Password updated successfully!' });

    } catch (err) {
        console.error('[Reset Password Error]', err);
        return NextResponse.json({ error: 'An error occurred while resetting password.' }, { status: 500 });
    }
}
