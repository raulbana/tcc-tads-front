import axios from "axios";

const TOKEN_KEY = "dailyiu_token";
const USER_KEY = "dailyiu_user";

const apiFactory = (baseURL: string) => {
  const apiInstance = axios.create({
    baseURL,
    timeout: 15000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  apiInstance.interceptors.request.use(
    (config) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        const userData = localStorage.getItem(USER_KEY);
        if (userData) {
          try {
            const user = JSON.parse(userData);
            if (user?.id) {
              const userId = user.id.toString();
              config.headers["X-User-Id"] = userId;
            }
          } catch (error) {
          }
        }
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  apiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        if (error.response.status === 401 && typeof window !== "undefined") {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          window.location.href = "/authentication/login";
        }
      }

      return Promise.reject(error);
    }
  );

  return apiInstance;
};

export default apiFactory;
