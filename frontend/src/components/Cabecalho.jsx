const UNIDADE = "CEJUSC · Pereira Barreto";

export default function Cabecalho({ usuario, onSair }) {
  return (
    <header className="topo">
      {usuario?.demo && (
        <div className="faixa-demo">
          Ambiente de demonstração · dados fictícios · não digite dados reais
        </div>
      )}
      <div className="topo-conteudo">
        <div className="topo-icone">
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7"
            strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3v18M8 21h8M5 7h14" />
            <path d="M5 7l-3 7a3 3 0 0 0 6 0L5 7zM19 7l-3 7a3 3 0 0 0 6 0l-3-7z" />
          </svg>
        </div>
        <div>
          <p className="topo-instituicao">{UNIDADE}</p>
          <h1>Controle de Audiências</h1>
        </div>

        {usuario && (
          <div className="topo-usuario">
            <span>Olá, <strong>{usuario.nome}</strong></span>
            <button className="sair" onClick={onSair}>Sair</button>
          </div>
        )}
      </div>
    </header>
  );
}