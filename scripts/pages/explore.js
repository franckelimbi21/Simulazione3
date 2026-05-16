// explore.js - Controller della pagina di esplorazione per regione/continente

import { renderCountryCards } from "../components/country-card.js";
import { mountFooter } from "../core/footer.js";
import { mountHeader } from "../core/header.js";
import { loadCollection } from "../core/page-loader.js";
import { getCountriesByRegion } from "../services/api.js";
import { isFavoriteCode, toggleFavoriteCode } from "../services/storage.js";

const regionSelect = document.getElementById("region-select");
const resultsContainer = document.getElementById("explore-results");

/**
 * Renderizza i paesi di una regione come card.
 * Include il pulsante favorito e gestisce il toggle.
 * 
 * @param {Array} countries - Array di paesi da visualizzare
 */
function renderRegionCountries(countries) {
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
 * Carica e visualizza i paesi della regione selezionata.
 * Effettua la fetch dei dati e aggiorna l'interfaccia.
 */
async function loadRegion() {
    const region = regionSelect.value;

    await loadCollection({
        container: resultsContainer,
        loadingMessage: "Caricamento regione...",
        emptyMessage: "Nessuna nazione disponibile per questa regione.",
        request: () => getCountriesByRegion(region),
        render: renderRegionCountries,
    });
}

/**
 * Inizializza la pagina di esplorazione.
 * Monta header e footer, configura il dropdown regioni.
 */
function init() {
    mountHeader("explore");
    mountFooter();

    regionSelect.addEventListener("change", loadRegion);
    loadRegion();
}

init();
