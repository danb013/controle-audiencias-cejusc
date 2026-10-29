import { useEffect, useRef, useState } from "react";
import { criarAudiencia, editarAudiencia } from "../api";
import { RESULTADOS, TIPOS, VARAS } from "../opcoes";
import Segmentado from "./Segmentado";

// toLocaleDateString("sv-SE") devolve AAAA-MM-DD na data local (sem erro de fuso)
const hoje = () => new Date().toLocaleDateString("sv-SE");

const PAGAMENTOS = [
  { valor: "voluntaria", rotulo: "Voluntária" },
  { valor: "paga", rotulo: "Paga" },
];

function camposIniciais(audiencia) {
  if (audiencia) {
    const { data, processo, vara, tipo, paga, resultado } = audiencia;
    return { data, processo, vara, tipo, paga, resultado };
  }
  return { data: hoje(), processo: "", vara: "PRE", tipo: "mediacao", paga: false, resultado: "frutifera" };
}

export default function FormAudiencia({
  audiencia, conciliadoras, conciliadoraPadrao, onSalvo, onCancelar,
}) {
  const editando = Boolean(audiencia);
  const [campos, setCampos] = useState(() => camposIniciais(audiencia));
  const [conciliadora, setConciliadora] = useState(audiencia ? String(audiencia.conciliadora) : "");
  const [erros, setErros] = useState(null);
  const [aviso, setAviso] = useState("");
  const processoRef = useRef(null);

  const escolhida = conciliadora || conciliadoraPadrao || conciliadoras[0]?.id || "";
  const ehJec = campos.vara === "JEC";

  // some com o aviso "salva" depois de alguns segundos
  useEffect(() => {
    if (!aviso) return;
    const timer = setTimeout(() => setAviso(""), 3500);
    return () => clearTimeout(timer);
  }, [aviso]);

  function atualizar(campo, valor) {
    setCampos((c) => {
      const novo = { ...c, [campo]: valor };
      if (campo === "vara" && valor === "JEC") novo.paga = false; // JEC é sempre voluntário
      return novo;
    });
  }

  async function enviar(e) {
    e.preventDefault();
    const dados = { ...campos, conciliadora: Number(escolhida) };
    try {
      if (editando) {
        await editarAudiencia(audiencia.id, dados);
      } else {
        await criarAudiencia(dados);
        setCampos((c) => ({ ...c, processo: "" })); // mantém dia, vara e tipo para lançar em sequência
        setAviso("✓ Audiência salva.");
        processoRef.current?.focus();
      }
      setErros(null);
      onSalvo();
    } catch (erro) {
      setErros(erro);
    }
  }

  return (
    <form className={`cartao form${editando ? " editando" : ""}`} onSubmit={enviar}>
      <div className="cartao-topo">
        <h2>{editando ? "Editar audiência" : "Nova audiência"}</h2>
        {editando && <span className="contagem destaque">Editando</span>}
      </div>

      <div className="form-grid">
        <label>Conciliadora
          <select value={escolhida} onChange={(e) => setConciliadora(e.target.value)} required>
            {conciliadoras.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
        </label>

        <label>Dia
          <input type="date" value={campos.data}
            onChange={(e) => atualizar("data", e.target.value)} required />
        </label>

        <label className="c2">Nº do processo
          <input ref={processoRef} value={campos.processo} maxLength={30}
            onChange={(e) => atualizar("processo", e.target.value)} required />
        </label>

        <div className="c2">
          <Segmentado rotulo="Vara" nome="vara" opcoes={VARAS} valor={campos.vara}
            onChange={(v) => atualizar("vara", v)} />
        </div>

        <Segmentado rotulo="Tipo" nome="tipo" opcoes={TIPOS} valor={campos.tipo}
          onChange={(v) => atualizar("tipo", v)} />

        <div className="campo">
          <Segmentado rotulo="Pagamento" nome="pagamento" opcoes={PAGAMENTOS}
            valor={campos.paga ? "paga" : "voluntaria"}
            onChange={(v) => atualizar("paga", v === "paga")}
            desabilitadas={ehJec ? ["paga"] : []} />
          {ehJec && <p className="dica">JEC é sempre voluntária.</p>}
        </div>

        <label className="c2">Resultado
          <select value={campos.resultado} onChange={(e) => atualizar("resultado", e.target.value)}>
            {RESULTADOS.map((r) => <option key={r.valor} value={r.valor}>{r.rotulo}</option>)}
          </select>
        </label>

        <div className="c2 form-rodape">
          <div className="acoes">
            <button type="submit">{editando ? "Salvar alterações" : "Salvar audiência"}</button>
            {editando && (
              <button type="button" className="secundario" onClick={onCancelar}>Cancelar</button>
            )}
          </div>
          {aviso && <span className="aviso-ok" role="status">{aviso}</span>}
        </div>

        {erros && (
          <ul className="erro c4">
            {Object.entries(erros).map(([campo, msgs]) => (
              <li key={campo}>{campo}: {[].concat(msgs).join(" ")}</li>
            ))}
          </ul>
        )}
      </div>
    </form>
  );
}