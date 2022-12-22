import axios from 'axios';

const axiosDo = axios.create({
  // baseURL: "http://10.0.2.2:3000",
  baseURL: "http://192.168.0.10:3000",
});

export default axiosDo;