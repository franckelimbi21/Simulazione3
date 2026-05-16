// footer.js - Componente footer riusabile

/**
 * Crea un elemento footer con informazioni sull'app e crediti.
 * 
 * @returns {HTMLElement} - Elemento footer con contenuto
 * 
 * @example
 * const footer = createFooter();
 * document.body.appendChild(footer);
 */
export function createFooter() {
    const footer = document.createElement("footer");
    footer.className = "footer";

    footer.innerHTML = `
        <div class="footer-content">
            <p>Countries Atlas | Dati da <a href="https://restcountries.com" target="_blank" rel="noreferrer">REST Countries</a></p>
            <p>Ricerca, esplorazione per regione, preferiti e dashboard statistiche.</p>
        </div>
    `;

    return footer;
}

/**
 * Aggiunge il footer al documento HTML, posizionandolo alla fine.
 * 
 * @param {HTMLElement} [container=document.body] - Elemento dove aggiungere il footer (default: body)
 * 
 * @example
 * mountFooter(document.body);
 * // Aggiunge il footer al body
 */
export function mountFooter(container = document.body) {
    const footer = createFooter();
    container.appendChild(footer);
}
