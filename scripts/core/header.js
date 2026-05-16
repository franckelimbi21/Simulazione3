// header.js - Componente header riusabile con navigazione

/**
 * Crea un elemento header con menu di navigazione tra le pagine.
 * Evidenzia la pagina corrente nel menu.
 * 
 * @param {string} [currentPage="home"] - L'ID della pagina attualmente attiva per evidenziarla nel menu
 * @returns {HTMLElement} - Elemento header con logo e navigazione
 * 
 * @example
 * const header = createHeader("search");
 * // Crea un header con il link "Ricerca" evidenziato come attivo
 */
export function createHeader(currentPage = "home") {
    const header = document.createElement("header");
    header.className = "header";

    const pages = [
        { name: "Home", path: "index.html", id: "home" },
        { name: "Ricerca", path: "search.html", id: "search" },
        { name: "Esplora", path: "explore.html", id: "explore" },
        { name: "Preferiti", path: "favorites.html", id: "favorites" },
        { name: "Dashboard", path: "dashboard.html", id: "dashboard" },
    ];

    const navItems = pages
        .map((page) => {
            const activeClass = page.id === currentPage ? " active" : "";
            return `<li><a href="${page.path}" class="nav-link${activeClass}">${page.name}</a></li>`;
        })
        .join("");

    header.innerHTML = `
        <div class="header-content">
            <h1 class="logo"><a href="index.html">Countries Atlas</a></h1>
            <nav class="header-nav">
                <ul>
                    ${navItems}
                </ul>
            </nav>
        </div>
    `;

    return header;
}

/**
 * Aggiunge l'header al documento HTML, posizionandolo all'inizio.
 * 
 * @param {string} [currentPage="home"] - L'ID della pagina attualmente attiva
 * @param {HTMLElement} [container=document.body] - Elemento dove aggiungere l'header (default: body)
 * 
 * @example
 * mountHeader("dashboard", document.body);
 * // Aggiunge l'header al body con "Dashboard" come pagina attiva
 */
export function mountHeader(currentPage = "home", container = document.body) {
    const header = createHeader(currentPage);
    container.prepend(header);
}
