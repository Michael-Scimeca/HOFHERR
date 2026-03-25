import { NextResponse } from 'next/server';
import { adminClient } from '@/sanity/adminClient';
import bcrypt from 'bcryptjs';

// Basic in-memory rate limiting to prevent spam
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_MINUTE = 5;

export async function POST(req: Request) {
    try {
        // Enforce rate limiting by IP
        const ip = req.headers.get('x-forwarded-for') || 'unknown';
        const now = Date.now();
        const rateRecord = rateLimitMap.get(ip) || { count: 0, timestamp: now };
        
        if (now - rateRecord.timestamp < RATE_LIMIT_WINDOW) {
            if (rateRecord.count >= MAX_REQUESTS_PER_MINUTE) {
                return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
            }
            rateRecord.count += 1;
        } else {
            rateRecord.count = 1;
            rateRecord.timestamp = now;
        }
        rateLimitMap.set(ip, rateRecord);

        // Sanitize and Validate Input
        const { email, password, name, phone, address } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        if (!phone || !phone.trim()) {
            return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
        }

        // Validate phone format (at least 10 digits)
        const digitsOnly = phone.replace(/\D/g, '');
        if (digitsOnly.length < 10) {
            return NextResponse.json({ error: 'Please enter a valid phone number' }, { status: 400 });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
        }

        // Enforce strong password complexity
        if (password.length < 8) {
            return NextResponse.json({ error: 'Password must be at least 8 characters long.' }, { status: 400 });
        }

        // Limit name size to prevent string-based DoS
        if (name && name.length > 100) {
            return NextResponse.json({ error: 'Name is too long' }, { status: 400 });
        }

        // 1. Check if user already exists
        const existingUser = await adminClient.fetch(
            `*[_type == "customer" && email == $email][0]`,
            { email: email.toLowerCase() }
        );

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        // 2. Hash password with bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Assign a random default avatar
        const avatarOptions = ['/avatars/avator-chickin.png', '/avatars/avator-cow.png', '/avatars/avator-pig.png', '/avatars/avator-sheep.png'];
        const randomAvatar = avatarOptions[Math.floor(Math.random() * avatarOptions.length)];

        // 4. Create customer in Sanity safely
        const customer = await adminClient.create({
            _type: 'customer',
            email: email.toLowerCase(),
            password: hashedPassword,
            name: name || '',
            phone: phone || '',
            address: address || '',
            avatar: randomAvatar,
            createdAt: new Date().toISOString(),
        });

        return NextResponse.json({
            message: 'Registration successful',
            user: { id: customer._id, email: customer.email, name: customer.name }
        });

    } catch (error: any) {
        return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
    }
}
