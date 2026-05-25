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

// Endpoints de Diagnóstico / Questionário (Todos os usuários)
const diagnosticoService = {
  // GET /diagnostico/sessao-atual
  obterSessaoAtual: async (signal) => {
    try {
      const response = await api.get("/diagnostico/sessao-atual", { signal });
      return { success: true, data: response.data };
    } catch (error) {
      if (axios.isCancel(error) || error.code === "ERR_CANCELED") {
        return { success: false, message: "Cancelado", type: "canceled" };
      }
      return { success: false, ...handleError(error) };
    }
  },

  // POST /diagnostico/respostas?finalizado=true|false
  salvarRespostasLote: async (respostas, finalizado = false) => {
    try {
      const user = JSON.parse(localStorage.getItem("esg4u_user") || "{}");

      const payload = {
        respostas: respostas.map(({ id_pergunta, pontuacao }) => ({
          id_pergunta,
          respondido_por: user.id,
          pontuacao,
        })),
      };

      const response = await api.post(
        `/diagnostico/respostas?finalizado=${finalizado}`,
        payload,
      );
      return { success: true, data: response.data };
    } catch (error) {
      if (error.response?.status === 422) {
        return {
          success: false,
          message:
            error.response.data?.erro ||
            "Pontuação inválida em uma ou mais respostas.",
          type: "warning",
        };
      }
      return { success: false, ...handleError(error) };
    }
  },
};

const evidenciasService = {
  // GET /evidencias/minhas-evidencias
  listarMinhasEvidencias: async () => {
    try {
      const response = await api.get("/evidencias/minhas-evidencias");
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, ...handleError(error) };
    }
  },

  // GET /evidencias/{id}
  buscarEvidencia: async (id) => {
    try {
      const response = await api.get(`/evidencias/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, ...handleError(error) };
    }
  },

  // POST /evidencias/adicionar
  adicionarEvidencia: async (formData) => {
    try {
      const response = await api.post("/evidencias/adicionar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, ...handleError(error) };
    }
  },
};

// Edpoints de convite
const convitesService = {
  // POST /convites/enviar_convite
  enviarConvite: async (email) => {
    try {
      const payload = { email }; // Enviar como JSON
      const response = await api.post("/convites/enviar_convite", payload);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, ...handleError(error) };
    }
  },

  // GET /convites/{remetente_uuid}
  listarMeusConvites: async ({
    remetenteUuid,
    page = 1,
    perPage = 10,
    filtros = {},
  } = {}) => {
    try {
      const params = {
        page,
        per_page: perPage,
        ...filtros,
      };
      const response = await api.get(`/convites/${remetenteUuid}`, { params });
      return { success: true, data: response.data };
    } catch (error) {
      if (error.response?.status === 204) {
        return {
          success: true,
          data: {
            convites: [],
            registros: 0,
            convertidos: 0,
            pendentes: 0,
            page,
            pages: 1,
            per_page: perPage,
            prev_page: false,
            prox_page: false,
          },
        };
      }
      return { success: false, ...handleError(error) };
    }
  },

  // GET /convites (para admin)
  listarTodosConvites: async ({
    page = 1,
    perPage = 10,
    filtros = {},
  } = {}) => {
    try {
      const params = {
        page,
        per_page: perPage,
        ...filtros,
      };
      const response = await api.get("/convites", { params });
      return { success: true, data: response.data };
    } catch (error) {
      if (error.response?.status === 204) {
        return {
          success: true,
          data: {
            convites: [],
            registros: 0,
            page,
            pages: 1,
            per_page: perPage,
            prev_page: false,
            prox_page: false,
          },
        };
      }
      return { success: false, ...handleError(error) };
    }
  },

  // GET /convites/exportar-csv (para admin)
  exportarCsv: async () => {
    try {
      const response = await api.get("/convites/exportar-csv", {
        responseType: "blob", // essencial para download de arquivo
      });

      // Cria link temporário e dispara o download no navegador
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "convites.csv");
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

const validacoesService = {
  // POST /validacoes/pedir_validacao
  pedirValidacao: async (id_resposta, avaliador_email, avaliador_nome="") => {
    try {
      const user = JSON.parse(localStorage.getItem("esg4u_user") || "{}");
      const payload = {
        id_resposta: id_resposta,
        pedido_por: user.email,
        avaliador_email: avaliador_email,
        avaliador_nome: avaliador_nome,
        validado: "pendente",
      };
      const response = await api.post("/validacoes/pedir_validacao", payload);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, ...handleError(error) };
    }
  },

  // PUT /validacoes/validar/{id}
  validarResposta: async (validacao_id, validado) => {
    try {
      const response = await api.put(`/validacoes/validar/${validacao_id}`, {
        validado,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, ...handleError(error) };
    }
  },

  // GET /validacoes/{avaliador_email} (para o avaliador)
  listarValidacoesParaAvaliar: async (avaliador_email) => {
    // era avaliador_uuid
    try {
      const response = await api.get(`/validacoes/${avaliador_email}`);
      return { success: true, data: response.data };
    } catch (error) {
      if (error.response?.status === 204) {
        return { success: true, data: [] };
      }
      return { success: false, ...handleError(error) };
    }
  },

  // GET /validacoes/minhas_validacoes/{pedido_por_email} (para o solicitante)
  listarMinhasValidacoes: async (pedido_por_email) => {
    // era pedido_por_uuid
    try {
      const response = await api.get(
        `/validacoes/minhas_validacoes/${pedido_por_email}`,
      );
      return { success: true, data: response.data };
    } catch (error) {
      if (error.response?.status === 204) {
        return { success: true, data: [] };
      }
      return { success: false, ...handleError(error) };
    }
  },
};

export {
  usuariosService,
  perguntasService,
  diagnosticoService,
  evidenciasService,
  convitesService,
  validacoesService,
};
export default authService;
