const BASE = "/api";

let aoExpirar = () => {};
export function definirAoExpirar(fn) {
  aoExpirar = fn;
}

function lerCookie(nome) {
  const par = document.cookie.split("; ").find((c) => c.startsWith(nome + "="));
  return par ? decodeURIComponent(par.split("=")[1]) : "";
}

async function requisicao(caminho, metodo = "GET", corpo) {
  const headers = {};
  if (corpo !== undefined) headers["Content-Type"] = "application/json";
  if (metodo !== "GET") headers["X-CSRFToken"] = lerCookie("csrftoken");

  const resp = await fetch(BASE + caminho, {
    method: metodo,
    headers,
    credentials: "same-origin",
    body: corpo === undefined ? undefined : JSON.stringify(corpo),
  });

  if (resp.status === 204) return null;

  let dados = null;
  try {
    dados = await resp.json();
  } catch {
    /* resposta sem corpo */
  }

  if (!resp.ok) {
    // sessão vencida (fora das rotas de login): volta para a tela de entrada
    if ((resp.status === 401 || resp.status === 403) && !caminho.startsWith("/auth/")) {
      aoExpirar();
    }
    throw dados ?? { detail: `Erro ${resp.status}` };
  }
  return dados;
}

// ---- Autenticação ----
export const verSessao = () => requisicao("/auth/sessao/");
export const entrar = (usuario, senha) => requisicao("/auth/entrar/", "POST", { usuario, senha });
export const sair = () => requisicao("/auth/sair/", "POST");

// ---- Conciliadoras ----
export const listarConciliadoras = () => requisicao("/conciliadoras/");
export const criarConciliadora = (nome) => requisicao("/conciliadoras/", "POST", { nome });
export const editarConciliadora = (id, nome) => requisicao(`/conciliadoras/${id}/`, "PATCH", { nome });
export const apagarConciliadora = (id) => requisicao(`/conciliadoras/${id}/`, "DELETE");

// ---- Audiências ----
function filtro(ano, mes, conciliadoraId) {
  const p = new URLSearchParams({ ano, mes });
  if (conciliadoraId) p.set("conciliadora", conciliadoraId);
  return p.toString();
}

export const listarAudiencias = (ano, mes, conciliadoraId) =>
  requisicao(`/audiencias/?${filtro(ano, mes, conciliadoraId)}`);
export const criarAudiencia = (dados) => requisicao("/audiencias/", "POST", dados);
export const editarAudiencia = (id, dados) => requisicao(`/audiencias/${id}/`, "PATCH", dados);
export const apagarAudiencia = (id) => requisicao(`/audiencias/${id}/`, "DELETE");

// ---- Relatório e Excel ----
export const buscarRelatorio = (ano, mes, conciliadoraId) =>
  requisicao(`/relatorio/?${filtro(ano, mes, conciliadoraId)}`);

export const urlExcel = (ano, mes, sentencas = 0) =>
  `${BASE}/excel/?ano=${ano}&mes=${mes}&sentencas=${sentencas}`;