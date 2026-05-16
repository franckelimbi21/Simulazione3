// search.js - Controller della pagina di ricerca per nome o capitale nazione

import { renderCountryCards } from "../components/country-card.js";
import { setupCountrySuggestions } from "../components/country-suggestions.js";
import { mountFooter } from "../core/footer.js";
import { mountHeader } from "../core/header.js";
import { showEmpty } from "../core/errors.js";
import { loadCollection } from "../core/page-loader.js";
import { searchCountriesByCapital, searchCountriesByName } from "../services/api.js";
import { isFavoriteCode, toggleFavoriteCode } from "../services/storage.js";

const searchTypeSelect = document.getElementById("search-type");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("btn-search");
const suggestionsContainer = document.getElementById("search-suggestions");
const resultsContainer = document.getElementById("search-results");

/**
 * Ritorna la funzione di ricerca appropriata (per nome o per capitale).
 * 
 * @returns {Function} - searchCountriesByName o searchCountriesByCapital
 */
function getSearchHandler() {
    return searchTypeSelect.value === "capital" ? searchCountriesByCapital : searchCountriesByName;
}

/**
 * Aggiorna la visualizzazione dei risultati di ricerca con le card paesi.
 * Mostra il pulsante preferito e gestisce il toggle favorito.
 * 
 * @param {Array} countries - Array di paesi da mostrare
 */
function refreshResultCards(countries) {
    renderCountryCards({
        container: resultsContainer,
        countries,
        showFavoriteButton: true,
        isFavorite: (country) => isFavoriteCode(country.code),
        onToggleFavorite: (country, button) => {
            const nowFavorite = toggleFavoriteCode(country.code);
            button.textContent = nowFavorite ? "★" : "☆";
        },
    });
}

/**
 * Esegue la ricerca in base al testo inserito e al tipo di ricerca selezionato.
 * Mostra i risultati o un messaggio di errore/vuoto.
 */
async function runSearch() {
    const query = searchInput.value.trim();

    if (!query) {
        showEmpty(resultsContainer, "Inserisci un valore di ricerca.");
        return;
    }

    const handler = getSearchHandler();

    await loadCollection({
        container: resultsContainer,
        loadingMessage: "Ricerca in corso...",
        emptyMessage: "Nessun risultato trovato.",
        request: () => handler(query),
        render: refreshResultCards,
    });
}

/**
 * Configura i listener di eventi della pagina di ricerca.
 * Gestisce: click sul pulsante ricerca, invio da tastiera, cambio tipo ricerca, suggerimenti.
 */
function setupEvents() {
    searchButton.addEventListener("click", runSearch);

    searchInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            runSearch();
        }
    });

    searchTypeSelect.addEventListener("change", () => {
        suggestionsContainer.classList.add("hidden");
        suggestionsContainer.innerHTML = "";
    });

    setupCountrySuggestions({
        input: searchInput,
        suggestions: suggestionsContainer,
        fetchSuggestions: (query) => getSearchHandler()(query),
        onSelect: (country) => {
            searchInput.value = searchTypeSelect.value === "capital" ? country.capital : country.name;
            refreshResultCards([country]);
        },
        getLabel: (country) => `${country.name} (${country.code})`,
    });
}

/**
 * Inizializza la pagina di ricerca.
 * Monta header e footer, configura gli eventi.
 */
function init() {
    mountHeader("search");
    mountFooter();
    setupEvents();

    showEmpty(resultsContainer, "Inserisci un nome nazione o una capitale per iniziare.");
}

init();
