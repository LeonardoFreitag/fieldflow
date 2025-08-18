import { type ZipCodeModel } from '@models/ZipCodeModel';
import axios from 'axios';

const apiZipCode = axios.create({
  baseURL: 'https://viacep.com.br/ws/',
});

export const findZipCode = async (zipCode: string): Promise<any> => {
  const onlyNumber = zipCode.replace(/\D/g, '');
  // let returnedAddress = {} as ZipCodeModel;
  const data = await apiZipCode.get<ZipCodeModel>(`${onlyNumber}/json/`);
  return data;
};
