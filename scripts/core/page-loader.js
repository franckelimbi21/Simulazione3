// page-loader.js - Funzioni condivise per il fetch dei dati e rendering automatico delle liste

import { runAsyncSection } from "./view-state.js";
import { showError, showEmpty } from "./errors.js";

/**
 * Funzione generica per caricare una collezione di dati e visualizzarla.
 * Gestisce automaticamente lo stato di caricamento, errori e rendering.
 * 
 * @param {Object} options - Configurazione del caricamento
 * @param {HTMLElement} options.container - Elemento dove mostrare i dati
 * @param {Function} options.request - Funzione async che fetcha i dati
 * @param {string} options.loadingMessage - Messaggio da mostrare mentre carica
 * @param {string} options.emptyMessage - Messaggio se non ci sono dati
 * @param {Function} options.render - Funzione che renderizza i dati nel container
 * @returns {Promise<void>}
 * 
 * @example
 * await loadCollection({
 *   container: document.getElementById("results"),
 *   request: () => searchCountriesByName("Italy"),
 *   loadingMessage: "Ricerca in corso...",
 *   emptyMessage: "Nessun risultato",
 *   render: (countries) => renderCountryCards({ container: resultsDiv, countries })
 * });
 */
export async function loadCollection({
    container,
    request,
    loadingMessage,
    emptyMessage,
    render,
}) {
    return runAsyncSection({
        loadingContainer: container,
        loadingMessage,
        request,
        onSuccess: (items) => {
            if (!Array.isArray(items) || items.length === 0) {
                showEmpty(container, emptyMessage);
                return;
            }

            render(items);
        },
        onError: (error) => {
            showError(container, "Errore nel caricamento", error.message || "Operazione non riuscita");
        },
    });
}
