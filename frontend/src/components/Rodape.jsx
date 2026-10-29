const AUTOR = "Dan";
const LINK = "https://www.linkedin.com/in/danb013";

export default function Rodape() {
  return (
    <footer className="rodape">
      Sistema desenvolvido por{" "}
      {LINK ? (
        <a href={LINK} target="_blank" rel="noreferrer"><strong>{AUTOR}</strong></a>
      ) : (
        <strong>{AUTOR}</strong>
      )}
      {" "}· CEJUSC · Pereira Barreto
    </footer>
  );
}