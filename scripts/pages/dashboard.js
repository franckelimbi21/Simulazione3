// dashboard.js - Controller della pagina dashboard con statistiche e ordinamento paesi

import { renderRecordsTable } from "../components/records-table.js";
import { mountFooter } from "../core/footer.js";
import { mountHeader } from "../core/header.js";
import { showError, showLoading } from "../core/errors.js";
import { getAllCountries, sortCountries } from "../services/api.js";

const metricSelect = document.getElementById("metric-select");
const orderSelect = document.getElementById("order-select");
const limitSelect = document.getElementById("limit-select");
const tableContainer = document.getElementById("dashboard-table");

let allCountries = [];

/**
 * Formatta un numero per la visualizzazione nel formato locale italiano.
 * 
 * @param {number} value - Numero da formattare
 * @returns {string} - Stringa formattata
 */
function formatNumber(value) {
    return Number(value || 0).toLocaleString("it-IT");
}

/**
 * Renderizza la tabella dashboard con i paesi ordinati secondo le opzioni selezionate.
 * Ordina per metrica (popolazione, area, densita) e direzione (crescente/decrescente).
 */
function renderDashboardTable() {
    const metric = metricSelect.value;
    const order = orderSelect.value;
    const limit = Number(limitSelect.value);

    const ordered = sortCountries(allCountries, metric, order).slice(0, limit);

    renderRecordsTable({
        container: tableContainer,
        emptyMessage: "Nessun dato disponibile.",
        records: ordered,
        columns: [
            { header: "#", render: (_country, index) => index + 1 },
            { header: "Nazione", render: (country) => country.name },
            { header: "ISO", render: (country) => country.code },
            { header: "Regione", render: (country) => country.region },
            { header: "Popolazione", render: (country) => formatNumber(country.population) },
            { header: "Area km2", render: (country) => formatNumber(country.area) },
            { header: "Densita", render: (country) => country.densityLabel },
        ],
    });
}

/**
 * Carica tutti i dati dei paesi dall'API e li memorizza per l'ordinamento.
 * Mostra un caricamento mentre fetcha, poi renderizza la tabella.
 */
async function loadDashboardData() {
    showLoading(tableContainer, "Caricamento dati globali...");

    try {
        allCountries = await getAllCountries();
        renderDashboardTable();
    } catch (error) {
        showError(tableContainer, "Errore", error.message || "Impossibile caricare le statistiche.");
    }
}

function setupEvents() {
    [metricSelect, orderSelect, limitSelect].forEach((element) => {
        element.addEventListener("change", renderDashboardTable);
    });
}

function init() {
    mountHeader("dashboard");
    mountFooter();

    setupEvents();
    loadDashboardData();
}

init();
