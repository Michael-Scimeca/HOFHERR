import { createClient } from '@sanity/client';
import bcrypt from 'bcryptjs';

const client = createClient({
    projectId: 'a2p2fvte',
    dataset: 'production',
    apiVersion: '2024-01-01',
    token: 'skkAMMLNehuTzoLhkTtglIsj6Ub4cPJy7clLdw361NQMbgjwpTbYIzZGJL7R9IogrC0s4KplTo8i2nHBKWCkOrr1X0C4is8dD0S0Vl7MCw3YMhCvcjhVxGbTHaW2grwh6Bya3xBfAdUdtJ88zEgu58etnJixY1GRcBhh5ZTn4kr5XUZkDZlC',
    useCdn: false,
});

const email = 'mikeyscimeca@gmail.com';
const newPassword = 'Hofherr2026!';

const hash = await bcrypt.hash(newPassword, 10);
const user = await client.fetch(`*[_type == "customer" && email == $email][0]{_id, name, isAdmin}`, { email });

if (!user) { console.log('❌ User not found'); process.exit(1); }

await client.patch(user._id).set({ password: hash, isAdmin: true }).commit();
console.log(`✅ Password reset for ${email}`);
console.log(`   New password: ${newPassword}`);
console.log(`   isAdmin: true`);
console.log(`   _id: ${user._id}`);
