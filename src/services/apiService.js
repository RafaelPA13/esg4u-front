// src/services/apiService.js
import axios from "axios";

const API_BASE_URL = "http://localhost:8000"; // TODO: Adicionar url do backend hospedado

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para anexar token, se existir
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("esg4u_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Função para lidar com erros de forma padronizada
const handleError = (error) => {
  let errorMessage = "Ocorreu um erro inesperado.";
  let errorType = "error";

  if (error.response) {
    const { data, status } = error.response;
    if (data && data.detail) {
      if (typeof data.detail === "string") {
        errorMessage = data.detail;
      } else if (Array.isArray(data.detail) && data.detail.length > 0) {
        errorMessage = data.detail
          .map((err) => err.msg || err.message || "Erro de validação")
          .join(", ");
        errorType = "warning";
      }
    } else {
      errorMessage = `Erro ${status}: ${error.response.statusText || "Resposta do servidor sem detalhes."}`;
    }
  } else if (error.request) {
    errorMessage =
      "Não foi possível conectar ao servidor. Verifique sua conexão.";
  } else {
    errorMessage = error.message;
  }
  return { message: errorMessage, type: errorType };
};

// Endpoints de Autenticação
const authService = {
  // POST /auth/cadastro
  cadastro: async (userData) => {
    try {
      const response = await api.post("/auth/cadastro", userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, ...handleError(error) };
    }
  },

  // POST /auth/validar_codigo
  validarCodigo: async (codigo) => {
    try {
      const formData = new FormData();
      formData.append("codigo", codigo);
      const response = await api.post("/auth/validar_codigo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, ...handleError(error) };
    }
  },

  // POST /auth/reenviar_codigo
  reenviarCodigo: async (email) => {
    try {
      const formData = new FormData();
      formData.append("email", email);
      const response = await api.post("/auth/reenviar_codigo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return { success: true, data: response.data.sucesso, type: "success" };
    } catch (error) {
      return { success: false, ...handleError(error) };
    }
  },

  // POST /auth/login
  login: async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, ...handleError(error) };
    }
  },

  // POST /auth/solicitar_reset
  solicitarReset: async (email) => {
    try {
      const formData = new FormData();
      formData.append("email", email);
      const response = await api.post("/auth/solicitar_reset", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return { success: true, data: response.data.sucesso, type: "success" };
    } catch (error) {
      return { success: false, ...handleError(error) };
    }
  },

  // PUT /auth/redefinir_senha
  redefinirSenha: async (token, senha, confirmarSenha) => {
    try {
      const formData = new FormData();
      formData.append("token", token);
      formData.append("senha", senha);
      formData.append("confirmar_senha", confirmarSenha);
      const response = await api.put("/auth/redefinir_senha", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, ...handleError(error) };
    }
  },

  // GET /auth/me
  me: async (tokenFormLogin = null) => {
    try {
      let headers = {};
      if (tokenFormLogin) {
        headers.Authorization = `Bearer ${tokenFormLogin}`;
      }

      const response = await api.get("/auth/me", { headers: headers });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, ...handleError(error) };
    }
  },

  logout: () => {
    localStorage.removeItem("esg4u_token");
    localStorage.removeItem("esg4u_user");
  },
};

// Endpoints de Usuários (Admin)
const usuariosService = {

  // GET /auth/usuarios
  listar: async ({ page = 1, perPage = 10, filtros = {} } = {}) => {
    try {
      const params = {
        page,
        per_page: perPage,
        ...filtros,
      };

      const response = await api.get("/auth/usuarios", { params });
      return { success: true, data: response.data };
    } catch (error) {
      if (error.response?.status === 204) {
        return {
          success: true,
          data: {
            users: [],
            registros: 0,
            pages: 0,
            page,
            per_page: perPage,
            prox_page: false,
            prev_page: false,
          },
        };
      }
      return { success: false, ...handleError(error) };
    }
  },

  // GET /auth/usuario/{id}
  buscarPorId: async (id) => {
    try {
      const response = await api.get(`/auth/usuario/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      if (error.response?.status === 204) {
        return {
          success: false,
          message: "Usuário não encontrado.",
          type: "warning",
        };
      }
      return { success: false, ...handleError(error) };
    }
  },

  // PUT /auth/usuario/{id}
  atualizar: async (id, payload) => {
    try {
      const response = await api.put(`/auth/usuario/${id}`, payload);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, ...handleError(error) };
    }
  },

  // DELETE /auth/usuario/{id}
  deletar: async (id) => {
    try {
      const response = await api.delete(`/auth/usuario/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, ...handleError(error) };
    }
  },
  
  // GET /auth/usuarios/exportar-csv
  exportarCsv: async () => {
    try {
      const response = await api.get("/auth/usuarios/exportar-csv", {
        responseType: "blob", // essencial para download de arquivo
      });

      // Cria link temporário e dispara o download no navegador
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "usuarios.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      if (error.response?.status === 204) {
        return {
          success: false,
          message: "Nenhum registro para exportar.",
          type: "warning",
        };
      }
      return { success: false, ...handleError(error) };
    }
  },
};

// Endpoints de Diagnóstico / Perguntas (Admin)
const perguntasService = {

  // POST /diagnostico/pergunta
  criar: async (payload) => {
    try {
      const response = await api.post("/diagnostico/pergunta", payload);
      return { success: true, data: response.data };
    } catch (error) {
      if (error.response?.status === 409) {
        return {
          success: false,
          message: "Pergunta já cadastrada nesse índice.",
          type: "warning",
        };
      }
      return { success: false, ...handleError(error) };
    }
  },

  // GET /diagnostico/perguntas
  listar: async () => {
    try {
      const response = await api.get("/diagnostico/perguntas");
      return { success: true, data: response.data };
    } catch (error) {
      if (error.response?.status === 204) {
        return { success: true, data: [] };
      }
      return { success: false, ...handleError(error) };
    }
  },

  // GET /diagnostico/pergunta/{id}
  buscarPorId: async (id) => {
    try {
      const response = await api.get(`/diagnostico/pergunta/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      if (error.response?.status === 204) {
        return {
          success: false,
          message: "Pergunta não encontrada.",
          type: "warning",
        };
      }
      return { success: false, ...handleError(error) };
    }
  },

  // PUT /diagnostico/pergunta/{id}
  atualizar: async (id, payload) => {
    try {
      const response = await api.put(`/diagnostico/pergunta/${id}`, payload);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, ...handleError(error) };
    }
  },

  // DELETE /diagnostico/pergunta/{id}
  deletar: async (id) => {
    try {
      await api.delete(`/diagnostico/pergunta/${id}`);
      return { success: true };
    } catch (error) {
      return { success: false, ...handleError(error) };
    }
  },

  // GET /diagnostico/perguntas/exportar-csv
  exportarCsv: async () => {
    try {
      const response = await api.get("/diagnostico/perguntas/exportar-csv", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "perguntas.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      if (error.response?.status === 204) {
        return {
          success: false,
          message: "Nenhum registro para exportar.",
          type: "warning",
        };
      }
      return { success: false, ...handleError(error) };
    }
  },
};

export { usuariosService, perguntasService };
export default authService;
