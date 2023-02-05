import axios from 'axios';
import Amplify from '../services/Amplify';

const instance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL_BASE,
});

instance.interceptors.request.use(async (config) => {
  const newConfig = { ...config };
  const jwtToken = await Amplify.verifyUser();
  newConfig.headers = {
    ...newConfig.headers,
    authorization: jwtToken,
  };

  return newConfig;
});

export default instance;
