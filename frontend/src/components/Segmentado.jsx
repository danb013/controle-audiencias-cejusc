export default function Segmentado({ rotulo, nome, opcoes, valor, onChange, desabilitadas = [] }) {
  return (
    <div className="campo" role="radiogroup" aria-label={rotulo}>
      <span className="campo-rotulo">{rotulo}</span>
      <div className="segmentado">
        {opcoes.map((o) => (
          <label key={o.valor}>
            <input
              type="radio"
              name={nome}
              value={o.valor}
              checked={valor === o.valor}
              disabled={desabilitadas.includes(o.valor)}
              onChange={() => onChange(o.valor)}
            />
            <span>{o.rotulo}</span>
          </label>
        ))}
      </div>
    </div>
  );
}