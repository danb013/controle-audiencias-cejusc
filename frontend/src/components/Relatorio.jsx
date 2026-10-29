import { MESES } from "../opcoes";

const CATEGORIAS = [
  { chave: "PRE", rotulo: "PRE" },
  { chave: "JEC", rotulo: "JEC" },
  { chave: "FAMILIA", rotulo: "Família" },
  { chave: "CIVEL", rotulo: "Cível" },
];

const COLUNAS = [
  { chave: "frutifera", rotulo: "Frut." },
  { chave: "infrutifera", rotulo: "Infrut." },
  { chave: "prejudicada_ausencia_requerido", rotulo: "Prej. req." },
  { chave: "prejudicada_ausencia_partes", rotulo: "Prej. partes" },
  { chave: "cancelada", rotulo: "Cancel." },
  { chave: "redesignada", rotulo: "Redesig." },
];

export default function Relatorio({ relatorio, ano, mes, conciliadora }) {
  if (!relatorio) return null;

  return (
    <section className="cartao relatorio-imprimivel">
      {/* Cabeçalho que só aparece na folha impressa */}
      <div className="so-impressao">
        <p className="imp-unidade">CEJUSC · Pereira Barreto</p>
        <h1>Relatório de audiências</h1>
        <p className="imp-info">
          <strong>{MESES[mes - 1]} de {ano}</strong> · {conciliadora}
        </p>
        <p className="imp-info">
          Agendadas: <strong>{relatorio.total_agendadas}</strong> ·
          Realizadas: <strong>{relatorio.realizadas}</strong> ·
          Acordos: <strong>{relatorio.acordos}</strong>
        </p>
      </div>

      <div className="cartao-topo">
        <div>
          <h2>Resultado por categoria</h2>
          <p className="sub">Mesmos totais da ficha de cada conciliadora, no mês e filtro escolhidos.</p>
        </div>
        <button className="secundario nao-imprimir" onClick={() => window.print()}>
          🖨 Imprimir relatório
        </button>
      </div>

      <div className="rolagem">
        <table className="tabela-relatorio">
          <thead>
            <tr>
              <th></th><th>Agendadas</th>
              {COLUNAS.map((c) => <th key={c.chave}>{c.rotulo}</th>)}
              <th>Volunt.</th><th>Pagas</th>
            </tr>
          </thead>
          <tbody>
            {CATEGORIAS.map(({ chave, rotulo }) => (
              <tr key={chave}>
                <th>{rotulo}</th>
                <td>{relatorio.agendadas[chave]}</td>
                {COLUNAS.map((c) => <td key={c.chave}>{relatorio.resultados[chave][c.chave]}</td>)}
                <td>{relatorio.voluntarias[chave]}</td>
                <td>{relatorio.pagas[chave]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="so-impressao imp-rodape">
        Emitido em {new Date().toLocaleDateString("pt-BR")}
      </p>
    </section>
  );
}