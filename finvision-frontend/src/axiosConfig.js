// src/axiosConfig.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://fsd-app-backend.onrender.com',
});

export default instance;
