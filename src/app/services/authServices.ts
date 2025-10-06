import { loginRequest, loginResponse, registerRequest, registerResponse } from '@/app/types/auth';
import apiRoutes from "@/app/utils/apiRoutes"
import apiFactory from './apiFactory';
import { API_BASE_URL } from '@/app/config/env';

const apiInstance = apiFactory(API_BASE_URL);

class AuthService {
  async login(credentials: loginRequest): Promise<loginResponse> {
    const response = await apiInstance.post(
      apiRoutes.authentication.login,
      credentials
    );
    return response.data;
  }

  async register(userData: registerRequest): Promise<registerResponse> {
    const response = await apiInstance.post(
      apiRoutes.authentication.register,
      userData
    );
    return response.data;
  }
}

export const authService = new AuthService();