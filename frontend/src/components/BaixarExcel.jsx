import { useState } from "react";
import { urlExcel } from "../api";

export default function BaixarExcel({ ano, mes }) {
  const [sentencas, setSentencas] = useState(0);

  return (
    <div className="cartao baixar">
      <div>
        <h2>Resumo em Excel</h2>
        <p className="sub">Soma todas as conciliadoras do mês selecionado.</p>
      </div>

      <label>Sentenças proferidas pré-processual
        <input type="number" min="0" value={sentencas}
          onChange={(e) => setSentencas(Math.max(0, Number(e.target.value)))} />
      </label>

      <a className="botao botao-largo" href={urlExcel(ano, mes, sentencas)}>Baixar Excel</a>
    </div>
  );
}