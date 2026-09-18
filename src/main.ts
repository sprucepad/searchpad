import redirect from "./redirect.ts";
import createPage from "./page.ts";

const params = new URLSearchParams(location.search);
const q = params.get("q")?.trim();

if (!q) createPage();
else redirect(q);
