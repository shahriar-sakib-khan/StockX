import API from '../services/apiClient';

export const login = async (data) => API.post('/auth/login', data);
export const register = async (data) => API.post('/auth/register', data);
