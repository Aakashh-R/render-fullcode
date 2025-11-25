// import axios from 'axios'; const API = axios.create({ baseURL: 'http://localhost:5001/api' }); export default API;
import axios from 'axios';

const baseHost = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
const baseURL = baseHost.replace(/\/$/, '') + '/api';

const api = axios.create({ baseURL });

export default api;
