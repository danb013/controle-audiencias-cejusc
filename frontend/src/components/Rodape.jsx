const AUTOR = "Dan";
const LINK = "https://www.instagram.com/danbrandon.i/";

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