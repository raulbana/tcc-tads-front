import axios from "axios";

const apiFactory = (baseURL: string) => {
  const apiInstance = axios.create({
    baseURL,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  apiInstance.interceptors.response.use(
    response => response,
    error => {
      if (error.response) {
        console.error('API Error:', error.response.data);
      }

      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(typeof error === 'string' ? error : JSON.stringify(error)));
      }
    }
  );

  return apiInstance;
};

export default apiFactory;