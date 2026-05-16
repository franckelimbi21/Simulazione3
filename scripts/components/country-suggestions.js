// country-suggestions.js - Componente autocomplete riusabile per suggerimenti paesi

import { sanitizeHTML } from "../core/errors.js";

/**
 * Crea una funzione "debounced" che attende prima di eseguirsi.
 * Utile per evitare troppe richieste al server mentre l'utente digita.
 * 
 * @param {Function} callback - Funzione da eseguire dopo il delay
 * @param {number} [waitMs=350] - Millisecondi da aspettare dopo l'ultimo input
 * @returns {Function} - Funzione debounced che accetta gli stessi parametri del callback
 * 
 * @example
 * const debouncedSearch = debounce((query) => {
 *   console.log("Ricerca:", query);
 * }, 500);
 * 
 * // Viene eseguita una sola volta, 500ms dopo l'ultimo input
 * debouncedSearch("It");
 * debouncedSearch("Ita");
 * debouncedSearch("Italy");
 */
function debounce(callback, waitMs = 350) {
    let timeoutId;

    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => callback(...args), waitMs);
    };
}

/**
 * Configura un campo input con un menu di suggerimenti autocomplete.
 * Ascolta gli input dell'utente, chiama una funzione di fetch e mostra i risultati.
 * 
 * @param {Object} options - Configurazione dell'autocomplete
 * @param {HTMLElement} options.input - Campo input dove l'utente digita
 * @param {HTMLElement} options.suggestions - Contenitore dove mostrare i suggerimenti
 * @param {Function} options.fetchSuggestions - Funzione async che ritorna i suggerimenti per una query
 * @param {Function} options.onSelect - Callback quando l'utente seleziona un suggerimento
 * @param {Function} [options.getLabel] - Funzione per estrarre l'etichetta da mostrare (default: item.name)
 * 
 * @example
 * setupCountrySuggestions({
 *   input: document.getElementById("search"),
 *   suggestions: document.getElementById("suggestions"),
 *   fetchSuggestions: async (query) => {
 *     return await searchCountriesByName(query);
 *   },
 *   onSelect: (country) => {
 *     console.log("Selezionato:", country.name);
 *   },
 *   getLabel: (country) => `${country.name} (${country.code})`
 * });
 */
export function setupCountrySuggestions({
    input,
    suggestions,
    fetchSuggestions,
    onSelect,
    getLabel = (item) => item.name,
}) {
    if (!input || !suggestions || typeof fetchSuggestions !== "function" || typeof onSelect !== "function") {
        return;
    }

    const renderSuggestions = (items) => {
        if (!Array.isArray(items) || items.length === 0) {
            suggestions.innerHTML = "";
            suggestions.classList.add("hidden");
            return;
        }

        suggestions.innerHTML = items
            .map((item, index) => {
                const label = sanitizeHTML(getLabel(item));
                return `<button type="button" class="suggestion-item" data-index="${index}">${label}</button>`;
            })
            .join("");

        suggestions.classList.remove("hidden");

        const buttons = suggestions.querySelectorAll(".suggestion-item");

        buttons.forEach((button) => {
            button.addEventListener("click", () => {
                const index = Number(button.dataset.index);
                const selected = items[index];

                onSelect(selected);
                suggestions.classList.add("hidden");
            });
        });
    };

    const handleInput = debounce(async () => {
        const query = input.value.trim();

        if (query.length < 2) {
            suggestions.classList.add("hidden");
            suggestions.innerHTML = "";
            return;
        }

        try {
            const result = await fetchSuggestions(query);
            renderSuggestions(result.slice(0, 7));
        } catch (_error) {
            suggestions.classList.add("hidden");
            suggestions.innerHTML = "";
        }
    }, 300);

    input.addEventListener("input", handleInput);

    document.addEventListener("click", (event) => {
        if (!suggestions.contains(event.target) && event.target !== input) {
            suggestions.classList.add("hidden");
        }
    });
}
