import redirect from "./redirect.ts";
import searchIcon from "./assets/search.svg?raw";
import xIcon from "./assets/x.svg?raw";

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
      <div class="content">
        <h1>Bangs</h1>
      </div>

      <button class="close" popovertarget="bang-search" popoverhide>
        ${xIcon}
      </button>
    </dialog>

    <dialog class="dialog" id="settings" popover>
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

      <button class="close" popovertarget="settings" popoverhide>
        ${xIcon}
      </button>
    </dialog>

    <dialog class="dialog" id="setup" popover>
      <div class="content">
        <h1>Setup</h1>
      </div>

      <button class="close" popovertarget="setup" popoverhide>${xIcon}</button>
    </dialog>
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
}
