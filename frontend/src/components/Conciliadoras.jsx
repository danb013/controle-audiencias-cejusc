import { useState } from "react";
import { apagarConciliadora, criarConciliadora, editarConciliadora } from "../api";

function mensagem(erro) {
  return Object.values(erro).flat().join(" ") || "Não foi possível concluir a operação.";
}

export default function Conciliadoras({ conciliadoras, onMudou }) {
  const [novoNome, setNovoNome] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [nomeEditado, setNomeEditado] = useState("");
  const [erro, setErro] = useState("");

  // Roda uma ação da API; se der certo atualiza a tela, se não mostra o erro.
  async function executar(acao) {
    try {
      await acao();
      setErro("");
      onMudou();
      return true;
    } catch (e) {
      setErro(mensagem(e));
      return false;
    }
  }

  async function cadastrar(e) {
    e.preventDefault();
    if (await executar(() => criarConciliadora(novoNome.trim()))) setNovoNome("");
  }

  async function salvarEdicao(id) {
    if (await executar(() => editarConciliadora(id, nomeEditado.trim()))) setEditandoId(null);
  }

  async function apagar(c) {
    if (!window.confirm(`Excluir ${c.nome}?`)) return;
    await executar(() => apagarConciliadora(c.id));
  }

  return (
    <section className="cartao estreito">
      <div className="cartao-topo">
        <div>
          <h2>Conciliadoras</h2>
          <p className="sub">Cadastre, renomeie ou exclua. Quem já tem audiências não pode ser excluída.</p>
        </div>
      </div>

      {erro && <p className="erro" role="alert">{erro}</p>}

      <ul className="lista">
        {conciliadoras.map((c) => (
          <li key={c.id}>
            {editandoId === c.id ? (
              <>
                <input value={nomeEditado} onChange={(e) => setNomeEditado(e.target.value)} />
                <button onClick={() => salvarEdicao(c.id)}>Salvar</button>
                <button className="secundario" onClick={() => setEditandoId(null)}>Cancelar</button>
              </>
            ) : (
              <>
                <span>{c.nome}</span>
                <button className="secundario"
                  onClick={() => { setEditandoId(c.id); setNomeEditado(c.nome); }}>Editar</button>
                <button className="perigo" onClick={() => apagar(c)}>Excluir</button>
              </>
            )}
          </li>
        ))}
      </ul>

      <form className="linha-form" onSubmit={cadastrar}>
        <input placeholder="Nome da nova conciliadora" value={novoNome} maxLength={120}
          onChange={(e) => setNovoNome(e.target.value)} required />
        <button type="submit">Cadastrar</button>
      </form>
    </section>
  );
}