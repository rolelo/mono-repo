import axios from 'axios';
import Amplify from '../services/Amplify';

const instance = axios.create({
  baseURL: 'http://localhost:8080/',
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
