import axios from 'axios';

// URL base da nossa API Flask
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Funções do CRUD de Endereços
export const getEnderecos = () => apiClient.get('/enderecos');
export const createEndereco = (data) => apiClient.post('/enderecos', data);
export const updateEndereco = (id, data) => apiClient.put(`/enderecos/${id}`, data);
export const deleteEndereco = (id) => apiClient.delete(`/enderecos/${id}`);

// Função da API ViaCEP (através do nosso backend)
export const getViaCep = (cep) => apiClient.get(`/viacep/${cep}`);