const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });
const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-01-01',
    useCdn: false
});
client.fetch('*[_type == "order"]').then(orders => {
    const johndoe = orders.find(o => o.metadata?.customer_name?.includes('John Doe'));
    if (johndoe) console.log(JSON.stringify(johndoe, null, 2));
    else console.log('Not found');
}).catch(console.error);
