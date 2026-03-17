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
  const customer = await client.fetch(`*[_type == "customer" && name match "Michael*"][0]`);
  if (!customer) {
    console.log("Customer not found.");
    return;
  }
  
  console.log("Found customer:", customer.name, customer._id);
  
  // Create 1 order with 3 different items from the Butcher Shop
  const order = {
    _type: 'order',
    orderNumber: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
    status: 'paid',
    total: 21500, // $215.00
    customer: { _type: 'reference', _ref: customer._id },
    items: [
      { _key: '1', name: 'USDA Prime Ribeye', qty: 2, price: '$45.00/lb', note: 'Thick cut' },
      { _key: '2', name: 'House-Made Italian Sausage', qty: 3, price: '$12.00/lb' },
      { _key: '3', name: 'Beef Tenderloin Roast', qty: 1, price: '$180.00' }
    ],
    createdAt: new Date().toISOString(), // today
    pickupTime: '2:00 PM',
    metadata: { customer_name: customer.name, customer_email: customer.email }
  };

  const res = await client.create(order);
  console.log("Created order:", res._id);
}

run().catch(console.error);
