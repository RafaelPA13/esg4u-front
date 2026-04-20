// src/services/apiService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // TODO: Adicionar url do backend hospedado

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Função para lidar com erros de forma padronizada
const handleError = (error) => {
  let errorMessage = 'Ocorreu um erro inesperado.';
  let errorType = 'error';

  if (error.response) {
    const { data, status } = error.response;
    if (data && data.detail) {
      if (typeof data.detail === 'string') {
        errorMessage = data.detail;
      } else if (Array.isArray(data.detail) && data.detail.length > 0) {
        errorMessage = data.detail.map(err => err.msg || err.message || 'Erro de validação').join(', ');
        errorType = 'warning';
      }
    } else {
      errorMessage = `Erro ${status}: ${error.response.statusText || 'Resposta do servidor sem detalhes.'}`;
    }
  } else if (error.request) {
    errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
  } else {
    errorMessage = error.message;
  }
  return { message: errorMessage, type: errorType };
};

// Endpoints de Autenticação
const authService = {
  cadastro: async (userData) => {
    try {
      const response = await api.post('/auth/cadastro', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, ...handleError(error) };
    }
  },

  validarCodigo: async (codigo) => {
    try {
      const formData = new FormData();
      formData.append('codigo', codigo);
      const response = await api.post('/auth/validar_codigo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, ...handleError(error) };
    }
  },

  reenviarCodigo: async (email) => {
    try {
      const formData = new FormData();
      formData.append('email', email);
      const response = await api.post('/auth/reenviar_codigo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return { success: true, data: response.data.sucesso, type: 'success' };
    } catch (error) {
      return { success: false, ...handleError(error) };
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, ...handleError(error) };
    }
  },

  solicitarReset: async (email) => {
    try {
      const formData = new FormData();
      formData.append('email', email);
      const response = await api.post('/auth/solicitar_reset', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return { success: true, data: response.data.sucesso, type: 'success' };
    } catch (error) {
      return { success: false, ...handleError(error) };
    }
  },

  redefinirSenha: async (token, senha, confirmarSenha) => {
    try {
      const formData = new FormData();
      formData.append('token', token);
      formData.append('senha', senha);
      formData.append('confirmar_senha', confirmarSenha);
      const response = await api.put('/auth/redefinir_senha', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, ...handleError(error) };
    }
  },
};

export default authService;