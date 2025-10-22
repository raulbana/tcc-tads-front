import axios from 'axios';

const TOKEN_KEY = 'dailyiu_token';
const USER_KEY = 'dailyiu_user';

const apiFactory = (baseURL: string) => {
  const apiInstance = axios.create({
    baseURL,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - adiciona token JWT e user-id automaticamente
  apiInstance.interceptors.request.use(
    (config) => {
      // Adicionar token de autenticação
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Adicionar user-id para endpoints que precisam
        const userData = localStorage.getItem(USER_KEY);
        if (userData) {
          try {
            const user = JSON.parse(userData);
            if (user?.id) {
              config.headers['user-id'] = user.id.toString();
            }
          } catch (error) {
            console.warn('Erro ao parsear dados do usuário:', error);
          }
        }
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - trata erros de autenticação
  apiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        console.error('API Error:', error.response.data);

        // Se o erro for 401 (Unauthorized), limpar dados de autenticação
        if (error.response.status === 401 && typeof window !== 'undefined') {
          console.warn('Token inválido ou expirado, limpando dados de autenticação');
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          window.location.href = '/authentication/login';
        }
      }

      return Promise.reject(error);
    }
  );

  return apiInstance;
};

export default apiFactory;