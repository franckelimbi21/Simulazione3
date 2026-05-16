// errors.js - Utility per mostrare stati di caricamento, errori e messaggi vuoti; sanitizzazione HTML

/**
 * Mostra un messaggio di caricamento in un contenitore.
 * 
 * @param {HTMLElement} container - Elemento dove mostrare il caricamento
 * @param {string} [message="Caricamento..."] - Testo del messaggio di caricamento
 * 
 * @example
 * showLoading(document.getElementById("results"), "Ricerca in corso...");
 */
export function showLoading(container, message = "Caricamento...") {
    if (!container) {
        return;
    }

    container.innerHTML = `<div class="loading">${sanitizeHTML(message)}</div>`;
}

/**
 * Mostra un messaggio di errore in un contenitore.
 * 
 * @param {HTMLElement} container - Elemento dove mostrare l'errore
 * @param {string} [title="Errore"] - Titolo dell'errore (in grassetto)
 * @param {string} [message=""] - Descrizione dell'errore
 * 
 * @example
 * showError(document.getElementById("results"), "Errore", "La richiesta non ha avuto successo");
 */
export function showError(container, title = "Errore", message = "") {
    if (!container) {
        return;
    }

    container.innerHTML = `
        <div class="error">
            <strong>${sanitizeHTML(title)}</strong>
            ${message ? `<p>${sanitizeHTML(message)}</p>` : ""}
        </div>
    `;
}

/**
 * Mostra un messaggio quando non ci sono dati da visualizzare.
 * 
 * @param {HTMLElement} container - Elemento dove mostrare il messaggio vuoto
 * @param {string} [message="Nessun dato disponibile."] - Testo del messaggio
 * 
 * @example
 * showEmpty(document.getElementById("results"), "Nessun risultato trovato");
 */
export function showEmpty(container, message = "Nessun dato disponibile.") {
    if (!container) {
        return;
    }

    container.innerHTML = `<div class="empty">${sanitizeHTML(message)}</div>`;
}

/**
 * Svuota un contenitore rimuovendo tutto il contenuto HTML.
 * 
 * @param {HTMLElement} container - Elemento da svuotare
 * 
 * @example
 * clearContainer(document.getElementById("results"));
 */
export function clearContainer(container) {
    if (!container) {
        return;
    }

    container.innerHTML = "";
}

/**
 * Sanifica (puolisce) una stringa per evitare attacchi XSS.
 * Converte i caratteri speciali HTML in entità HTML sicure.
 * IMPORTANTE: usare questa funzione su tutti i dati dinamici prima di inserirli nel DOM.
 * 
 * @param {*} value - Valore da sanificare (viene convertito a stringa)
 * @returns {string} - Stringa sanificata, sicura da inserire in innerHTML
 * 
 * @example
 * const userInput = "<script>alert('hacked')</script>";
 * const safe = sanitizeHTML(userInput);
 * console.log(safe); // "&lt;script&gt;alert('hacked')&lt;/script&gt;"
 * element.innerHTML = safe; // Mostra il testo letterale, non esegue lo script
 */
export function sanitizeHTML(value) {
    const map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
    };

    return String(value ?? "").replace(/[&<>"']/g, (match) => map[match]);
}
