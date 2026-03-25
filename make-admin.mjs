import { createClient } from '@sanity/client';

const client = createClient({
    projectId: 'a2p2fvte',
    dataset: 'production',
    apiVersion: '2024-01-01',
    token: 'skkAMMLNehuTzoLhkTtglIsj6Ub4cPJy7clLdw361NQMbgjwpTbYIzZGJL7R9IogrC0s4KplTo8i2nHBKWCkOrr1X0C4is8dD0S0Vl7MCw3YMhCvcjhVxGbTHaW2grwh6Bya3xBfAdUdtJ88zEgu58etnJixY1GRcBhh5ZTn4kr5XUZkDZlC',
    useCdn: false,
});

const email = 'mikeyscimeca@gmail.com';
const result = await client.fetch(`*[_type == "customer" && email == $email]{_id, name, email, isAdmin}`, { email });
console.log('Found:', JSON.stringify(result, null, 2));

if (result.length > 0) {
    const id = result[0]._id;
    await client.patch(id).set({ isAdmin: true }).commit();
    console.log(`✅ Set isAdmin=true for ${email} (${id})`);
} else {
    console.log(`❌ No customer found with email: ${email}`);
    console.log('Creating admin account...');
    const bcrypt = await import('bcryptjs');
    const hash = await bcrypt.default.hash('Hofherr2024!', 10);
    const doc = await client.create({
        _type: 'customer',
        name: 'Michael Scimeca',
        email,
        password: hash,
        isAdmin: true,
        avatar: '/avatars/avator-pig.png',
    });
    console.log(`✅ Created admin account: ${doc._id}`);
}
