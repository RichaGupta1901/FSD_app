// src/axiosConfig.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://finvision-backend-1.onrender.com',
});

export default instance;
