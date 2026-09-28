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
  else {
    let component: string;
    // does this url end with query params (`?hello=world`) or hash (`#hello=world`)?
    if (/(?:\?[^#]*|#.*)$/.test(bang.d)) {
      // then, encode slashes, to not break the URL (!g, !ddg, etc.)
      component = encodeURIComponent(query);
    } else {
      // else, don't encode them (!ghr)
      component = encodeURI(query);
    }

    url = url = bang.u.replace("{{{s}}}", component);
  }

  document.title = `${query || bang.s} - searchpad`;

  if (keepHistory) location.href = url;
  else location.replace(url);
}
