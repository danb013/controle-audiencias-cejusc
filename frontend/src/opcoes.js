export const VARAS = [
  { valor: "PRE", rotulo: "PRE" },
  { valor: "JEC", rotulo: "JEC" },
  { valor: "1a VARA", rotulo: "1ª Vara" },
  { valor: "2a VARA", rotulo: "2ª Vara" },
];

export const TIPOS = [
  { valor: "conciliacao", rotulo: "Conciliação" },
  { valor: "mediacao", rotulo: "Mediação" },
];

export const RESULTADOS = [
  { valor: "frutifera", rotulo: "Frutífera" },
  { valor: "infrutifera", rotulo: "Infrutífera" },
  { valor: "prejudicada_ausencia_requerido", rotulo: "Prejudicada - ausência do requerido", curto: "Prej. ausência requerido" },
  { valor: "prejudicada_ausencia_partes", rotulo: "Prejudicada - ausência das partes", curto: "Prej. ausência partes" },
  { valor: "cancelada", rotulo: "Cancelada" },
  { valor: "redesignada", rotulo: "Redesignada" },
];

export const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export function rotulo(lista, valor) {
  return lista.find((item) => item.valor === valor)?.rotulo ?? valor;
}

export function formatarData(iso) {
  return iso.split("-").reverse().join("/");
}

export function rotuloCurto(lista, valor) {
  const item = lista.find((i) => i.valor === valor);
  return item?.curto ?? item?.rotulo ?? valor;
}