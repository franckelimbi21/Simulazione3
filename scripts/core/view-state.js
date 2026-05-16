// view-state.js - Helper per gestire sezioni asincrone (caricamento, successo, errore)

import { clearContainer, showLoading } from "./errors.js";

/**
 * Esegue una operazione asincrona gestendo automaticamente i vari stati.
 * Mostra il caricamento, poi il successo o l'errore a operazione completata.
 * 
 * @param {Object} options - Configurazione della sezione asincrona
 * @param {HTMLElement} options.loadingContainer - Elemento dove mostrare il caricamento
 * @param {string} [options.loadingMessage="Caricamento..."] - Messaggio di caricamento
 * @param {Function} options.request - Funzione async che effettua l'operazione
 * @param {Function} options.onSuccess - Callback(data) quando la richiesta ha successo
 * @param {Function} [options.onError] - Callback(error) se la richiesta fallisce
 * @param {Array} [options.clearContainers=[]] - Array di elementi da pulire durante il caricamento
 * @returns {Promise<*>} - Promise che risolve con il risultato di onSuccess o onError
 * 
 * @example
 * await runAsyncSection({
 *   loadingContainer: document.getElementById("results"),
 *   loadingMessage: "Caricamento dati...",
 *   request: () => getAllCountries(),
 *   onSuccess: (countries) => {
 *     console.log("Caricamento completato:", countries.length);
 *     renderTable(countries);
 *   },
 *   onError: (error) => {
 *     console.error("Errore:", error.message);
 *   }
 * });
 */
export async function runAsyncSection({
    loadingContainer,
    loadingMessage = "Caricamento...",
    request,
    onSuccess,
    onError,
    clearContainers = [],
}) {
    if (!loadingContainer || typeof request !== "function" || typeof onSuccess !== "function") {
        return;
    }

    showLoading(loadingContainer, loadingMessage);

    clearContainers.forEach((container) => {
        clearContainer(container);
    });

    try {
        const data = await request();
        return onSuccess(data);
    } catch (error) {
        if (typeof onError === "function") {
            return onError(error);
        }

        throw error;
    }
}
