import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export interface Category {
  id: number;
  name: string;
}

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get('/categories'); 
  return response.data;
};