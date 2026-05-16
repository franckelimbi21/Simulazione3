// favorites.js - Gestione preferiti (codici ISO alpha-3)

import { renderRecordsTable } from "../components/records-table.js";
import { mountFooter } from "../core/footer.js";
import { mountHeader } from "../core/header.js";
import { showError } from "../core/errors.js";
import { getCountriesByCodes } from "../services/api.js";
import { clearFavoriteCodes, getFavoriteCodes, removeFavoriteCode } from "../services/storage.js";

const tableContainer = document.getElementById("favorites-table");

function formatNumber(value) {
    return Number(value || 0).toLocaleString("it-IT");
}

async function renderFavoritesTable() {
    try {
        const codes = getFavoriteCodes();
        const countries = await getCountriesByCodes(codes);

        renderRecordsTable({
            container: tableContainer,
            emptyMessage: "Non hai ancora aggiunto nazioni preferite.",
            records: countries,
            columns: [
                { header: "ISO", render: (country) => country.code },
                { header: "Nazione", render: (country) => country.name },
                { header: "Capitale", render: (country) => country.capital },
                { header: "Regione", render: (country) => country.region },
                { header: "Popolazione", render: (country) => formatNumber(country.population) },
                { header: "Densita", render: (country) => country.densityLabel },
            ],
            onDelete: (country) => {
                removeFavoriteCode(country.code);
                renderFavoritesTable();
            },
            onDeleteAll: () => {
                clearFavoriteCodes();
                renderFavoritesTable();
            },
            clearAllLabel: "Svuota preferiti",
            deleteLabel: "Rimuovi",
        });
    } catch (error) {
        showError(tableContainer, "Errore", error.message || "Impossibile caricare i preferiti.");
    }
}

function init() {
    mountHeader("favorites");
    mountFooter();

    renderFavoritesTable();
}

init();
