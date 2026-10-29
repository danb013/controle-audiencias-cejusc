import { apagarAudiencia } from "../api";
import { RESULTADOS, TIPOS, VARAS, formatarData, rotulo, rotuloCurto } from "../opcoes";

export default function TabelaAudiencias({ audiencias, onMudou, onEditar }) {
  async function apagar(id) {
    if (!window.confirm("Apagar esta audiência?")) return;
    await apagarAudiencia(id);
    onMudou();
  }

  if (audiencias.length === 0) {
    return (
      <div className="vazio">
        <strong>Nenhuma audiência neste mês.</strong>
        Use o formulário acima para lançar a primeira.
      </div>
    );
  }

  return (
    <div className="rolagem">
      <table>
        <thead>
          <tr>
            <th>Dia</th><th>Processo</th><th>Vara</th><th>Tipo</th>
            <th>Pagamento</th><th>Resultado</th><th>Conciliadora</th><th></th>
          </tr>
        </thead>
        <tbody>
          {audiencias.map((a) => (
            <tr key={a.id}>
              <td>{formatarData(a.data)}</td>
              <td className="mono">{a.processo}</td>
              <td className="nowrap">{rotulo(VARAS, a.vara)}</td>
              <td className="nowrap">{rotulo(TIPOS, a.tipo)}</td>
              <td className="nowrap">{a.paga ? "Paga" : "Voluntária"}</td>
              <td>
                <span className={`selo selo-${a.resultado}`} title={rotulo(RESULTADOS, a.resultado)}>
                  {rotuloCurto(RESULTADOS, a.resultado)}
                </span>
              </td>
              <td>{a.conciliadora_nome}</td>
              <td className="acoes">
                <button onClick={() => onEditar(a)}>Editar</button>
                <button className="perigo" onClick={() => apagar(a.id)}>Apagar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}