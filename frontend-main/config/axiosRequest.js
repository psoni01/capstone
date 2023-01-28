import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
// import { LOCAL_BASE_URL, REQUEST_TIMEOUT } from './api-config';
let axiosRequest = axios.create({
  baseURL: ""
  // commented for now! will enable later
  //   paramsSerializer: params => (params ? qs.stringify(params, { arrayFormat: 'repeat' }) : {}),
});
axiosRequest.interceptors.request.use(
  async config => {
    const token = await SecureStore.getItemAsync("userToken");
    if (token) {
      config.headers = { Authorization: `Bearer ${token}` };
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);
export default axiosRequest;