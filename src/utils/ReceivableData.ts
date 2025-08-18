import { type ReceivableModel } from '@models/ReceivableModel';

export const receivableList: ReceivableModel[] = [
  {
    id: '1',
    customer_id: '1',
    customer_name: 'João da Silva',
    sale_date: new Date('2021-06-01'),
    sale_number: '1',
    invoice_number: '123',
    sale_url:
      'https://automax.s3.amazonaws.com/d4d2d3544d9f717acfcd-Pedido_66.pdf',
    invoice_url:
      'https://automax.s3.amazonaws.com/d4d2d3544d9f717acfcd-Pedido_66.pdf',
    value: 100,
    dueDate: new Date('2021-07-01'),
    status: 'PENDING',
  },
  {
    id: '2',
    customer_id: '2',
    customer_name: 'Maria da Silva',
    sale_date: new Date('2021-06-01'),
    sale_number: '2',
    invoice_number: '124',
    sale_url:
      'https://automax.s3.amazonaws.com/d4d2d3544d9f717acfcd-Pedido_66.pdf',
    invoice_url:
      'https://automax.s3.amazonaws.com/d4d2d3544d9f717acfcd-Pedido_66.pdf',
    value: 200,
    dueDate: new Date('2021-07-01'),
    status: 'PARTIAL',
    partialPayments: [
      {
        id: '1',
        receivable_id: '2',
        value: 100,
        date: new Date('2021-06-15'),
      },
    ],
  },
  {
    id: '3',
    customer_id: '3',
    customer_name: 'José da Silva',
    sale_date: new Date('2021-06-01'),
    sale_number: '3',
    invoice_number: '125',
    sale_url:
      'https://automax.s3.amazonaws.com/d4d2d3544d9f717acfcd-Pedido_66.pdf',
    invoice_url:
      'https://automax.s3.amazonaws.com/d4d2d3544d9f717acfcd-Pedido_66.pdf',
    value: 300,
    dueDate: new Date('2021-07-01'),
    status: 'PENDING',
  },
  {
    id: '4',
    customer_id: '4',
    customer_name: 'Ana da Silva',
    sale_date: new Date('2021-06-01'),
    sale_number: '4',
    invoice_number: '126',
    sale_url:
      'https://automax.s3.amazonaws.com/d4d2d3544d9f717acfcd-Pedido_66.pdf',
    invoice_url:
      'https://automax.s3.amazonaws.com/d4d2d3544d9f717acfcd-Pedido_66.pdf',
    value: 400,
    dueDate: new Date('2021-07-01'),
    status: 'PARTIAL',
    partialPayments: [
      {
        id: '2',
        receivable_id: '4',
        value: 100,
        date: new Date('2021-06-15'),
      },
      {
        id: '3',
        receivable_id: '4',
        value: 200,
        date: new Date('2021-06-30'),
      },
    ],
  },
  {
    id: '5',
    customer_id: '5',
    customer_name: 'Pedro da Silva',
    sale_date: new Date('2021-06-01'),
    sale_number: '5',
    invoice_number: '127',
    sale_url:
      'https://automax.s3.amazonaws.com/d4d2d3544d9f717acfcd-Pedido_66.pdf',
    invoice_url:
      'https://automax.s3.amazonaws.com/d4d2d3544d9f717acfcd-Pedido_66.pdf',
    value: 500,
    dueDate: new Date('2021-07-01'),
    status: 'PENDING',
  },
  {
    id: '6',
    customer_id: '6',
    customer_name: 'Paulo da Silva',
    sale_date: new Date('2021-06-01'),
    sale_number: '6',
    invoice_number: '128',
    sale_url:
      'https://automax.s3.amazonaws.com/d4d2d3544d9f717acfcd-Pedido_66.pdf',
    invoice_url:
      'https://automax.s3.amazonaws.com/d4d2d3544d9f717acfcd-Pedido_66.pdf',
    value: 600,
    dueDate: new Date('2021-07-01'),
    status: 'PAID',
    partialPayments: [
      {
        id: '4',
        receivable_id: '6',
        value: 600,
        date: new Date('2021-06-01'),
      },
    ],
  },
];
