const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-10-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

async function run() {
  const admins = await client.fetch(`*[_type == "customer" && isAdmin == true]`);
  console.log("Admins:", admins.map(a => ({ email: a.email, name: a.name })));
}

run().catch(console.error);
