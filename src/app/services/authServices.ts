import {
  loginRequest,
  loginResponse,
  registerRequest,
  registerResponse,
  forgotPasswordRequestRequest,
  forgotPasswordRequestResponse,
  forgotPasswordValidateRequest,
  forgotPasswordValidateResponse,
} from "@/app/types/auth";
import { apiRoutes } from "@/app/utils/apiRoutes";
import apiFactory from "./apiFactory";
import { API_BASE_URL } from "@/app/config/env";

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

  async forgotPasswordRequest(
    data: forgotPasswordRequestRequest
  ): Promise<forgotPasswordRequestResponse> {
    const response = await apiInstance.post(
      apiRoutes.authentication.forgotPasswordRequest,
      {},
      {
        headers: {
          "x-user-email": data.email,
        },
      }
    );

    if (response.status === 204 || !response.data) {
      return {
        status: "success",
        message: "Código de verificação enviado com sucesso",
      };
    }

    return response.data;
  }

  async forgotPasswordReset(
    data: forgotPasswordValidateRequest
  ): Promise<forgotPasswordValidateResponse> {
    const response = await apiInstance.post(
      apiRoutes.authentication.forgotPasswordValidate,
      data
    );

    if (response.status === 204 || !response.data) {
      return {
        status: "success",
        message: "Senha redefinida com sucesso",
      };
    }

    return response.data;
  }
}

export const authService = new AuthService();