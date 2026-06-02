import 'dotenv/config';
import { createClient } from '@sanity/client';
import bcrypt from 'bcryptjs';

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_WRITE_TOKEN,
    useCdn: false,
});

if (!process.env.SANITY_API_WRITE_TOKEN) {
    console.error('❌ SANITY_API_WRITE_TOKEN not set. Ensure .env.local is configured.');
    process.exit(1);
}

const email = process.argv[2] || 'mikeyscimeca@gmail.com';
const newPassword = process.argv[3];

if (!newPassword) {
    console.error('Usage: node reset-admin-pass.mjs [email] <new-password>');
    process.exit(1);
}

const hash = await bcrypt.hash(newPassword, 10);
const user = await client.fetch(`*[_type == "customer" && email == $email][0]{_id, name, isAdmin}`, { email });

if (!user) { console.log('❌ User not found'); process.exit(1); }

await client.patch(user._id).set({ password: hash, isAdmin: true }).commit();
console.log(`✅ Password reset for ${email}`);
console.log(`   isAdmin: true`);
console.log(`   _id: ${user._id}`);
