import axios from 'axios';

export const makeAxios = axios.create({
    baseURL: import.meta.env.MODE === 'development' ? `http://localhost:5001/api` : '/api',

    withCredentials: true,
    timeout: 10000,
});
