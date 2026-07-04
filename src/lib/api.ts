import axios from 'axios';

const api = axios.create({
  // Jika sedang didevelop (localhost), arahkan ke rute internal
  baseURL: '/api', 
});

export default api;