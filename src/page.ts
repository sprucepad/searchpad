import redirect from "./redirect.ts";
import searchIcon from "./assets/search.svg?raw";
import xIcon from "./assets/x.svg?raw";

export default function createPage() {
  const root = document.getElementById("app")!;

  root.innerHTML = /* HTML */ `
    <h1 id="title">${searchIcon} searchpad</h1>

    <form method="GET" id="search-form">
      <label id="search">
        ${searchIcon}
        <input type="search" placeholder="Search..." />
        <button type="submit">Go</button>
      </label>
    </form>

    <ul id="advice">
      <li><button popovertarget="bang-search">Bangs</button></li>
      <li><button popovertarget="settings">Settings</button></li>
      <li><button popovertarget="setup">Setup</button></li>
    </ul>

    <dialog id="bang-search" popover>
      <div class="content">
        <h1>Bangs</h1>
      </div>

      <button class="close" popovertarget="bang-search" popoverhide>
        ${xIcon}
      </button>
    </dialog>

    <dialog id="settings" popover>
      <div class="content">
        <h1>Settings</h1>
      </div>

      <button class="close" popovertarget="settings" popoverhide>
        ${xIcon}
      </button>
    </dialog>

    <dialog id="setup" popover>
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
    redirect(q);
  });
}
