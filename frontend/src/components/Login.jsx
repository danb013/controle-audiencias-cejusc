import { useState } from "react";
import { entrar } from "../api";

const AUTOR = "Dan";

export default function Login({ aviso, demo, onEntrou }) {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function tentar(u, s) {
    setEnviando(true);
    setErro("");
    try {
      onEntrou(await entrar(u, s));
    } catch (err) {
      setErro(err?.detail ?? "Não foi possível conectar ao servidor.");
      setSenha("");
      setEnviando(false);
    }
  }

  function enviar(e) {
    e.preventDefault();
    tentar(usuario.trim(), senha);
  }

  return (
    <div className="login-fundo">
      <form className="login-cartao" onSubmit={enviar}>
        <div className="login-marca">
          <div className="topo-icone">
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7"
              strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3v18M8 21h8M5 7h14" />
              <path d="M5 7l-3 7a3 3 0 0 0 6 0L5 7zM19 7l-3 7a3 3 0 0 0 6 0l-3-7z" />
            </svg>
          </div>
          <div>
            <p className="topo-instituicao">CEJUSC · Pereira Barreto</p>
            <h1>Controle de Audiências</h1>
          </div>
        </div>

        {demo && (
          <div className="login-demo">
              <p><strong>Ambiente de demonstração.</strong> Os dados são fictícios, vistos
              por todos os visitantes e restaurados periodicamente. Não digite dados reais.</p>
            <button type="button" className="botao-largo" disabled={enviando}
              onClick={() => tentar(demo.usuario, demo.senha)}>
              Entrar como visitante
            </button>
            <p className="dica">Usuário: <b>{demo.usuario}</b> · Senha: <b>{demo.senha}</b></p>
          </div>
        )}

        {aviso && !erro && <p className="aviso-info" role="status">{aviso}</p>}
        {erro && <p className="erro" role="alert">{erro}</p>}

        <label>Usuário
          <input value={usuario} onChange={(e) => setUsuario(e.target.value)}
            autoComplete="username" required />
        </label>

        <label>Senha
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)}
            autoComplete="current-password" required />
        </label>

        <button type="submit" className={`botao-largo${demo ? " secundario" : ""}`} disabled={enviando}>
          {enviando ? "Entrando…" : "Entrar"}
        </button>

        <p className="login-credito">Desenvolvido por <strong>{AUTOR}</strong></p>
      </form>
    </div>
  );
}