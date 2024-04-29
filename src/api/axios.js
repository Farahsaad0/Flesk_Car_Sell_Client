import axios from 'axios';

export default axios.create({
    baseURL: 'http://localhost:8000'
});

export const axios_private = axios.create({
    baseURL: 'http://localhost:8000',
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

// import axios from "axios";

// export default axios.create({
//   baseURL: "https://8n7vlqww-8000.euw.devtunnels.ms/",
// });

// export const axios_private = axios.create({
//   baseURL: "https://8n7vlqww-8000.euw.devtunnels.ms/",
//   headers: { "Content-Type": "application/json" },
//   withCredentials: true,
// });
