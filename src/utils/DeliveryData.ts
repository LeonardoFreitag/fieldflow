import { type DeliveryModel } from '@models/DeliveryModel';

export const mockDeliveries: DeliveryModel[] = [
  {
    id: '1',
    customer_id: '1',
    customer: 'John Doe',
    address: '1234 Main St, Anytown, USA',
    sale: 'Sale001',
    total: 100,
    seller: 'Seller001',
    route: 'Route001',
    status: 'Pending',
    photo: 'photo_url_1',
    url_sale:
      'https://automax.s3.amazonaws.com/d4d2d3544d9f717acfcd-Pedido_66.pdf',
    url_nf:
      'https://automax.s3.amazonaws.com/d4d2d3544d9f717acfcd-Pedido_66.pdf',
  },
  {
    id: '2',
    customer_id: '2',
    customer: 'Jane Smith',
    address: '5678 Elm St, Anytown, USA',
    sale: 'Sale002',
    total: 200,
    seller: 'Seller002',
    route: 'Route002',
    status: 'Delivered',
    photo: 'photo_url_2',
    url_sale:
      'https://automax.s3.amazonaws.com/d4d2d3544d9f717acfcd-Pedido_66.pdf',
    url_nf:
      'https://automax.s3.amazonaws.com/d4d2d3544d9f717acfcd-Pedido_66.pdf',
  },
  {
    id: '3',
    customer_id: '3',
    customer: 'Alice Johnson',
    address: '91011 Oak St, Anytown, USA',
    sale: 'Sale003',
    total: 300,
    seller: 'Seller003',
    route: 'Route003',
    status: 'In Transit',
    photo: 'photo_url_3',
    url_sale:
      'https://automax.s3.amazonaws.com/d4d2d3544d9f717acfcd-Pedido_66.pdf',
    url_nf:
      'https://automax.s3.amazonaws.com/d4d2d3544d9f717acfcd-Pedido_66.pdf',
  },
  {
    id: '4',
    customer_id: '4',
    customer: 'Bob Brown',
    address: '121314 Pine St, Anytown, USA',
    sale: 'Sale004',
    total: 400,
    seller: 'Seller004',
    route: 'Route001',
    status: 'Pending',
    photo: 'photo_url_4',
    url_sale:
      'https://automax.s3.amazonaws.com/d4d2d3544d9f717acfcd-Pedido_66.pdf',
    url_nf:
      'https://automax.s3.amazonaws.com/d4d2d3544d9f717acfcd-Pedido_66.pdf',
  },
  {
    id: '5',
    customer_id: '5',
    customer: 'Charlie Davis',
    address: '151617 Cedar St, Anytown, USA',
    sale: 'Sale005',
    total: 500,
    seller: 'Seller005',
    route: 'Route001',
    status: 'Delivered',
    photo: 'photo_url_5',
    url_sale:
      'https://automax.s3.amazonaws.com/d4d2d3544d9f717acfcd-Pedido_66.pdf',
    url_nf:
      'https://automax.s3.amazonaws.com/d4d2d3544d9f717acfcd-Pedido_66.pdf',
  },
  {
    id: '6',
    customer_id: '6',
    customer: 'Diana Evans',
    address: '181920 Birch St, Anytown, USA',
    sale: 'Sale006',
    total: 600,
    seller: 'Seller006',
    route: 'Route002',
    status: 'In Transit',
    photo: 'photo_url_6',
    url_sale:
      'https://automax.s3.amazonaws.com/d4d2d3544d9f717acfcd-Pedido_66.pdf',
    url_nf:
      'https://automax.s3.amazonaws.com/d4d2d3544d9f717acfcd-Pedido_66.pdf',
  },
];
