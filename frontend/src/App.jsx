import { useEffect, useState } from "react";
import { definirAoExpirar, sair, verSessao } from "./api";
import Login from "./components/Login";
import Painel from "./Painel";
import "./App.css";

export default function App() {
  const [sessao, setSessao] = useState(undefined); // undefined = ainda verificando
  const [semServidor, setSemServidor] = useState(false);

  useEffect(() => {
    definirAoExpirar(() => {
      verSessao()
        .then((s) => setSessao({ ...s, expirou: true }))
        .catch(() => setSessao({ autenticado: false, expirou: true }));
    });
    verSessao().then(setSessao).catch(() => setSemServidor(true));
  }, []);

  async function aoSair() {
    try {
      await sair();
      setSessao(await verSessao());
    } catch {
      setSessao({ autenticado: false });
    }
  }

  if (semServidor) {
    return (
      <p className="erro" role="alert" style={{ margin: 24 }}>
        Não foi possível conectar ao servidor. Se este for o site de demonstração,
        aguarde cerca de 1 minuto e recarregue a página.
      </p>
    );
  }
  if (sessao === undefined) return <p className="carregando">Carregando…</p>;

  if (!sessao.autenticado) {
    return (
      <Login
        aviso={sessao.expirou ? "Sua sessão expirou. Entre novamente." : ""}
        demo={sessao.demo}
        onEntrou={setSessao}
      />
    );
  }

  return <Painel usuario={sessao} onSair={aoSair} />;
}