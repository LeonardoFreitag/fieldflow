import { type CustomerModel } from '../models/CustomerModel';

export const customerList: CustomerModel[] = [
  {
    id: '1',
    name: 'Cliente 1',
    address: 'Rua dos Bolos, 0',
    logo: 'https://cdn6.campograndenews.com.br/uploads/noticias/2024/01/19/1ahow021mk825.png',
    route: 'Rota 1',
    seller: 'Vendedor 1',
    photos: [
      'https://www.santacarmem.mt.gov.br/fotos_bancoimagens/3373.jpeg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhg_vg5vdPMeOAncjgdNJhQN7eMQLpaJ7hcw&s',
      'https://saodesiderio.ba.gov.br/wp-content/uploads/2022/03/01-5.jpg',
    ],
    accountsReceivable: [
      {
        id: '1',
        value: 1000,
        dueDate: '2022-04-30',
        status: 'PENDING',
      },
      {
        id: '2',
        value: 2000,
        dueDate: '2022-05-30',
        status: 'PAID',
      },
    ],
  },
  {
    id: '2',
    name: 'Cliente 2',
    address: 'Av. das Tortas, 0',
    logo: 'https://www.santacarmem.mt.gov.br/fotos_bancoimagens/3373.jpeg',
    route: 'Rota 2',
    seller: 'Vendedor 2',
    photos: [
      'https://www.santacarmem.mt.gov.br/fotos_bancoimagens/3373.jpeg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhg_vg5vdPMeOAncjgdNJhQN7eMQLpaJ7hcw&s',
    ],
    accountsReceivable: [],
  },
  {
    id: '3',
    name: 'Cliente 3',
    address: 'Rua dos Doces, 0',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhg_vg5vdPMeOAncjgdNJhQN7eMQLpaJ7hcw&s',
    route: 'Rota 3',
    seller: 'Vendedor 3',
    photos: [
      'https://www.santacarmem.mt.gov.br/fotos_bancoimagens/3373.jpeg',
      'https://saodesiderio.ba.gov.br/wp-content/uploads/2022/03/01-5.jpg',
    ],
    accountsReceivable: [
      {
        id: '3',
        value: 3000,
        dueDate: '2022-06-30',
        status: 'PENDING',
      },
    ],
  },
  {
    id: '4',
    name: 'Cliente 4',
    address: 'Av. dos Salgados, 0',
    logo: 'https://saodesiderio.ba.gov.br/wp-content/uploads/2022/03/01-5.jpg',
    route: 'Rota 4',
    seller: 'Vendedor 4',
    photos: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhg_vg5vdPMeOAncjgdNJhQN7eMQLpaJ7hcw&s',
      'https://saodesiderio.ba.gov.br/wp-content/uploads/2022/03/01-5.jpg',
    ],
    accountsReceivable: [
      {
        id: '4',
        value: 4000,
        dueDate: '2022-07-30',
        status: 'PENDING',
      },
      {
        id: '5',
        value: 5000,
        dueDate: '2022-08-30',
        status: 'PENDING',
      },
    ],
  },
];
