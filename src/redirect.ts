import bangs from "./bangs.json";
const DEFAULT_BANG = "ddg";

export default function redirect(q: string, keepHistory = false) {
  const match =
    q.match(/!(\S+)/i)?.[1]?.toLowerCase() ?? localStorage.getItem("default");
  const bang =
    bangs.find((b) => b.t === match) ??
    bangs.find((b) => b.t === DEFAULT_BANG)!;

  const query = q.replace(/!\S+\s*/i, "").trim();

  let url: string | undefined;
  if (!query) url = `https://${bang.d}`;
  else url = url = bang.u.replace("{{{s}}}", encodeURI(query));

  document.title = `${query || bang.s} - searchpad`;

  if (keepHistory) location.href = url;
  else location.replace(url);
}
