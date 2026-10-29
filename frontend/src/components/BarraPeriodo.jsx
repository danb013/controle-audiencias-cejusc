import { MESES } from "../opcoes";

export default function BarraPeriodo({
  ano, mes, onPeriodo, conciliadoras, conciliadoraId, onConciliadora,
}) {
  const anoAtual = new Date().getFullYear();
  const anos = [];
  for (let a = Math.min(2023, ano); a <= Math.max(anoAtual + 1, ano); a++) anos.push(a);

  function andar(delta) {
    const data = new Date(ano, mes - 1 + delta, 1); // o JS acerta a virada de ano sozinho
    onPeriodo(data.getFullYear(), data.getMonth() + 1);
  }

  return (
    <div className="barra">
      <div className="barra-conteudo">
        <div className="periodo">
          <button className="secundario" aria-label="Mês anterior" onClick={() => andar(-1)}>‹</button>
          <select aria-label="Mês" value={mes}
            onChange={(e) => onPeriodo(ano, Number(e.target.value))}>
            {MESES.map((nome, i) => <option key={nome} value={i + 1}>{nome}</option>)}
          </select>
          <select aria-label="Ano" value={ano}
            onChange={(e) => onPeriodo(Number(e.target.value), mes)}>
            {anos.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          <button className="secundario" aria-label="Próximo mês" onClick={() => andar(1)}>›</button>
        </div>

        <label className="rotulo-inline">Conciliadora
          <select value={conciliadoraId} onChange={(e) => onConciliadora(e.target.value)}>
            <option value="">Todas as conciliadoras</option>
            {conciliadoras.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
        </label>
      </div>
    </div>
  );
}