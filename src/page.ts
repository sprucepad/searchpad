import redirect from "./redirect.ts";
import searchIcon from "./assets/search.svg?raw";
import xIcon from "./assets/x.svg?raw";
import clipboardIcon from "./assets/clipboard.svg?raw";
import clipboardCheckIcon from "./assets/clipboard-check.svg?raw";
import bangs from "./bangs.json";

export default function createPage() {
  const theme = localStorage.getItem("theme") ?? "auto";
  document.documentElement.dataset.theme = theme;

  const root = document.getElementById("app")!;

  root.innerHTML = /* HTML */ `
    <h1 class="title">${searchIcon} searchpad</h1>

    <form method="GET" id="search-form">
      <label class="search">
        ${searchIcon}
        <input
          class="input search-input"
          type="search"
          placeholder="Search..."
        />
        <button class="button search-button" type="submit">Go</button>
      </label>
    </form>

    <ul class="advice">
      <li class="advice-first">
        <button class="advice-item" popovertarget="bang-search">Bangs</button>
      </li>
      <li>
        <button class="advice-item" popovertarget="settings">Settings</button>
      </li>
      <li>
        <button class="advice-item" popovertarget="setup">Setup</button>
      </li>
    </ul>

    <dialog class="dialog" id="bang-search" popover>
      <button class="close" popovertarget="bang-search" popoverhide>
        ${xIcon}
      </button>

      <div class="content">
        <h1 class="content-title">Bangs</h1>

        <form id="search-bangs">
          <label class="search bangs">
            <input
              class="input bang-search-input"
              placeholder="Search bangs..."
            />
            <button class="button search-button" type="submit">Go</button>
          </label>
        </form>

        <div class="results" id="bang-results">
          <p>Press 'Go' to start!</p>
        </div>
      </div>
    </dialog>

    <dialog class="dialog" id="settings" popover>
      <button class="close" popovertarget="settings" popoverhide>
        ${xIcon}
      </button>

      <div class="content">
        <h1>Settings</h1>
        <p class="content-desc">Saved automatically</p>

        <form class="form" action="javascript:void">
          <label for="default-bang">Default bang</label>
          <input
            class="input"
            id="default-bang"
            placeholder="!ddg"
            type="text"
          />

          <label for="theme-select">Theme</label>
          <select class="input" id="theme-select">
            <option value="auto" ${theme === "auto" ? "selected" : ""}>
              System
            </option>
            <option value="light" ${theme === "light" ? "selected" : ""}>
              Light
            </option>
            <option value="dark" ${theme === "dark" ? "selected" : ""}>
              Dark
            </option>
          </select>
        </form>
      </div>
    </dialog>

    <dialog class="dialog" id="setup" popover>
      <button class="close" popovertarget="setup" popoverhide>${xIcon}</button>

      <div class="content">
        <h1 class="content-title">Setup</h1>

        <div class="setup form">
          <p>
            Copy this URL as a custom search engine in your browser settings:
          </p>
          <label class="copy">
            <input
              readonly
              class="input setup-input"
              type="text"
              value="https://search.sprucepad.net/?q=%s"
              id="setup-input"
            />

            <button
              class="button copy-button"
              aria-label="Copy"
              id="copy-button"
            >
              ${clipboardIcon}
            </button>
          </label>
        </div>
      </div>
    </dialog>

    <p class="copyright">Copyright &copy; 2026 sprucepad. MIT License.</p>
  `;

  const searchForm = document.getElementById("search-form");
  searchForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    const q = searchForm.querySelector("input")?.value;
    if (!q) return;
    redirect(q, true);
  });

  const defaultBangInput = document.getElementById("default-bang");
  ((defaultBangInput as HTMLInputElement) ?? { value: "" }).value =
    localStorage.getItem("default") ?? "";

  defaultBangInput?.addEventListener("input", (e) => {
    if (!e.target) return;

    const val = (e.target as HTMLInputElement).value;
    localStorage.setItem("default", val.charAt(0) === "!" ? val.slice(1) : val);
  });

  const themeSelect = document.getElementById("theme-select");
  themeSelect?.addEventListener("change", (e) => {
    const val = (e.target as HTMLSelectElement)?.value ?? "auto";
    document.documentElement.dataset.theme = val;
    localStorage.setItem("theme", val);
  });

  const setupInput = document.getElementById("setup-input");
  const copyButton = document.getElementById("copy-button");
  copyButton?.addEventListener("click", async () => {
    if (!setupInput) return;
    await navigator.clipboard.writeText((setupInput as HTMLInputElement).value);

    copyButton.innerHTML = clipboardCheckIcon;
    setTimeout(() => {
      copyButton.innerHTML = clipboardIcon;
    }, 2500);
  });

  const bangSearch = document.getElementById("search-bangs");
  const results = document.getElementById("bang-results");
  bangSearch?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!results) return;

    const val =
      bangSearch.querySelector("input")?.value.toLowerCase().trim() ?? "";
    const filteredBangs = bangs.filter(
      (b) => b.t.includes(val) || b.s.includes(val),
    );
    results.innerHTML = filteredBangs
      .map(
        (bang) => `
          <div class="bang">
            <p class="bang-name">${bang.s}</p>
            <p class="bang-id">!${bang.t}</p>
          </div>
        `,
      )
      .join("");
  });
}
