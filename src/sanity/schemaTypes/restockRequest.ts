export default {
  name: 'restockRequest',
  title: 'Restock Request',
  type: 'document',
  fields: [
    {
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
    },
    {
      name: 'contactType',
      title: 'Contact Type',
      type: 'string',
      options: { list: ['phone', 'email'] },
    },
    {
      name: 'contactValue',
      title: 'Contact Information',
      type: 'string',
    },
    {
      name: 'item',
      title: 'Requested Item',
      type: 'string',
    },
    {
      name: 'qty',
      title: 'Quantity Requested',
      type: 'number',
    },
    {
      name: 'store',
      title: 'Store',
      type: 'string',
      options: { list: ['butcher', 'depot'] },
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: ['pending', 'notified'] },
      initialValue: 'pending',
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
    },
  ],
  preview: {
    select: {
      title: 'item',
      subtitle: 'customerName',
      store: 'store',
    },
    prepare(selection: any) {
      const { title, subtitle, store } = selection;
      return {
        title: `Restock: ${title}`,
        subtitle: `${subtitle} (${store})`,
      };
    },
  },
}
