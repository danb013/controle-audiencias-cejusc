export default function Indicadores({ relatorio }) {
  const itens = [
    { chave: "agendadas", rotulo: "Agendadas", valor: relatorio?.total_agendadas,
      nota: "Todas, inclusive canceladas e redesignadas" },
    { chave: "realizadas", rotulo: "Realizadas", valor: relatorio?.realizadas,
      nota: "Frutíferas e infrutíferas" },
    { chave: "acordos", rotulo: "Acordos", valor: relatorio?.acordos,
      nota: "Audiências frutíferas" },
  ];

  return (
    <section className="indicadores" aria-label="Resumo do mês">
      {itens.map((i) => (
        <div className={`indicador ind-${i.chave}`} key={i.chave}>
          <span className="rotulo">{i.rotulo}</span>
          <strong>{i.valor ?? "–"}</strong>
          <small>{i.nota}</small>
        </div>
      ))}
    </section>
  );
}