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
  
  // Create 3 orders
  const orders = [
    {
      _type: 'order',
      orderNumber: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      status: 'completed',
      total: 14500, // $145.00
      customer: { _type: 'reference', _ref: customer._id },
      items: [
        { name: 'USDA Prime Ribeye', qty: 2, price: '$45.00/lb', note: 'Thick cut' }
      ],
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      pickupTime: '12:00 PM',
      metadata: { customer_name: customer.name, customer_email: customer.email }
    },
    {
      _type: 'order',
      orderNumber: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      status: 'completed',
      total: 8900, // $89.00
      customer: { _type: 'reference', _ref: customer._id },
      items: [
        { name: 'House-Made Italian Sausage', qty: 3, price: '$12.00/lb' },
        { name: 'Bacon', qty: 1, price: '$15.00/lb' }
      ],
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
      pickupTime: '4:00 PM',
      metadata: { customer_name: customer.name, customer_email: customer.email }
    },
    {
      _type: 'order',
      orderNumber: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      status: 'paid',
      total: 21000, // $210.00
      customer: { _type: 'reference', _ref: customer._id },
      items: [
        { name: 'Beef Tenderloin Roast', qty: 1, price: '$180.00', note: 'Tied for roasting' },
        { name: 'Truffle Butter', qty: 2, price: '$15.00' }
      ],
      createdAt: new Date().toISOString(), // today
      pickupTime: '2:00 PM',
      metadata: { customer_name: customer.name, customer_email: customer.email }
    }
  ];

  for (const order of orders) {
    const res = await client.create(order);
    console.log("Created order:", res._id);
  }
}

run().catch(console.error);
