import { useCallback, useEffect, useState } from "react";
import { buscarRelatorio, listarAudiencias, listarConciliadoras } from "./api";
import BaixarExcel from "./components/BaixarExcel";
import BarraPeriodo from "./components/BarraPeriodo";
import Cabecalho from "./components/Cabecalho";
import Conciliadoras from "./components/Conciliadoras";
import FormAudiencia from "./components/FormAudiencia";
import Indicadores from "./components/Indicadores";
import Relatorio from "./components/Relatorio";
import Rodape from "./components/Rodape";
import TabelaAudiencias from "./components/TabelaAudiencias";
import "./App.css";

const ABAS = [
  { id: "audiencias", rotulo: "Audiências" },
  { id: "relatorio", rotulo: "Relatório do mês" },
  { id: "conciliadoras", rotulo: "Conciliadoras" },
];

export default function Painel({ usuario, onSair }) {
  const hoje = new Date();
  const [ano, setAno] = useState(hoje.getFullYear());
  const [mes, setMes] = useState(hoje.getMonth() + 1);
  const [conciliadoras, setConciliadoras] = useState([]);
  const [conciliadoraId, setConciliadoraId] = useState(""); // "" = todas
  const [audiencias, setAudiencias] = useState([]);
  const [relatorio, setRelatorio] = useState(null);
  const [editando, setEditando] = useState(null); // audiência sendo editada
  const [aba, setAba] = useState("audiencias");
  const [erro, setErro] = useState("");

  const carregarConciliadoras = useCallback(async () => {
    try {
      const lista = await listarConciliadoras();
      setConciliadoras(lista);
      // se a conciliadora filtrada foi excluída, volta para "Todas"
      setConciliadoraId((atual) =>
        lista.some((c) => String(c.id) === String(atual)) ? atual : ""
      );
    } catch {
      setErro("Não foi possível conectar ao servidor. O backend está rodando?");
    }
  }, []);

  const carregar = useCallback(async () => {
    if (!ano) return;
    try {
      const [lista, rel] = await Promise.all([
        listarAudiencias(ano, mes, conciliadoraId),
        buscarRelatorio(ano, mes, conciliadoraId),
      ]);
      setAudiencias(lista);
      setRelatorio(rel);
      setErro("");
    } catch {
      setErro("Não foi possível carregar os dados do mês.");
    }
  }, [ano, mes, conciliadoraId]);

  useEffect(() => {
    carregarConciliadoras();
  }, [carregarConciliadoras]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  function mudarPeriodo(novoAno, novoMes) {
    setAno(novoAno);
    setMes(novoMes);
  }

  function aoSalvarAudiencia() {
    setEditando(null);
    carregar();
  }

  function aoEditar(audiencia) {
    setEditando(audiencia);
    setAba("audiencias");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function aoMudarConciliadoras() {
    carregarConciliadoras();
    carregar(); // o nome na tabela pode ter mudado
  }

  const total = audiencias.length;

    const nomeConciliadora =
    conciliadoras.find((c) => String(c.id) === String(conciliadoraId))?.nome
    ?? "Todas as conciliadoras";

  return (
    <>
      <Cabecalho usuario={usuario} onSair={onSair} />

      <BarraPeriodo
        ano={ano}
        mes={mes}
        onPeriodo={mudarPeriodo}
        conciliadoras={conciliadoras}
        conciliadoraId={conciliadoraId}
        onConciliadora={setConciliadoraId}
      />

      <main>
        {erro && <p className="erro" role="alert">{erro}</p>}

        <Indicadores relatorio={relatorio} />

        <div className="abas" role="tablist">
          {ABAS.map((a) => (
            <button key={a.id} role="tab" aria-selected={aba === a.id}
              onClick={() => setAba(a.id)}>
              {a.rotulo}
            </button>
          ))}
        </div>

        {aba === "audiencias" && (
          <div className="painel" role="tabpanel">
            <FormAudiencia
              key={editando ? editando.id : "nova"}
              audiencia={editando}
              conciliadoras={conciliadoras}
              conciliadoraPadrao={conciliadoraId}
              onSalvo={aoSalvarAudiencia}
              onCancelar={() => setEditando(null)}
            />
            <section className="cartao">
              <div className="cartao-topo">
                <h2>Audiências do mês</h2>
                <span className="contagem">
                  {total} {total === 1 ? "audiência" : "audiências"}
                </span>
              </div>
              <TabelaAudiencias audiencias={audiencias} onMudou={carregar} onEditar={aoEditar} />
            </section>
          </div>
        )}

        {aba === "relatorio" && (
          <div className="painel" role="tabpanel">
            <div className="duas">
              <Relatorio relatorio={relatorio} ano={ano} mes={mes} conciliadora={nomeConciliadora} />
              <BaixarExcel ano={ano} mes={mes} />
            </div>
          </div>
        )}

        {aba === "conciliadoras" && (
          <div className="painel" role="tabpanel">
            <Conciliadoras conciliadoras={conciliadoras} onMudou={aoMudarConciliadoras} />
          </div>
        )}
      </main>

      <Rodape />
    </>
  );
}