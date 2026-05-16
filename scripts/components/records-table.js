// records-table.js - Componente tabella riusabile per visualizzare dati in tabella

import { sanitizeHTML } from "../core/errors.js";

/**
 * Renderizza una tabella con dati e colonne configurabili.
 * Supporta azioni come click su righe, eliminazione di singoli record o di tutti.
 * 
 * @param {Object} options - Configurazione della tabella
 * @param {HTMLElement} options.container - Elemento dove inserire la tabella
 * @param {string} options.emptyMessage - Messaggio da mostrare se non ci sono dati
 * @param {Array} options.records - Array di dati da visualizzare (una riga per elemento)
 * @param {Array} options.columns - Array di definizioni colonna { header: string, render: function }
 *   - header: intestazione della colonna
 *   - render: funzione(record, index) che ritorna il valore da mostrare
 * @param {Function} [options.onRowClick] - Callback quando si clicca una riga
 * @param {Function} [options.onDelete] - Callback quando si clicca il pulsante elimina riga
 * @param {Function} [options.onDeleteAll] - Callback quando si clicca il pulsante elimina tutto
 * @param {string} [options.clearAllLabel="Cancella tutti"] - Testo del pulsante elimina tutto
 * @param {string} [options.deleteLabel="Rimuovi"] - Testo del pulsante elimina riga
 * 
 * @example
 * renderRecordsTable({
 *   container: document.getElementById("table"),
 *   emptyMessage: "Nessun dato.",
 *   records: countries,
 *   columns: [
 *     { header: "Nome", render: (c) => c.name },
 *     { header: "Popolazione", render: (c) => c.population.toLocaleString() }
 *   ],
 *   onRowClick: (country) => console.log("Cliccato:", country.name),
 *   onDelete: (country) => removeCountry(country.code),
 *   onDeleteAll: () => clearAllCountries()
 * });
 */
export function renderRecordsTable({
    container,
    emptyMessage,
    records,
    columns,
    onRowClick,
    onDelete,
    onDeleteAll,
    clearAllLabel = "Cancella tutti",
    deleteLabel = "Rimuovi",
}) {
    if (!container) {
        return;
    }

    if (!Array.isArray(records) || records.length === 0) {
        container.innerHTML = `<div class="empty">${sanitizeHTML(emptyMessage)}</div>`;
        return;
    }

    const withActions = typeof onDelete === "function";
    const headerCells = columns.map((column) => `<th>${sanitizeHTML(column.header)}</th>`).join("");
    const finalHeader = withActions ? `${headerCells}<th>Azioni</th>` : headerCells;

    const rowsHtml = records
        .map((record, index) => {
            const cells = columns
                .map((column) => `<td>${sanitizeHTML(String(column.render(record, index)))}</td>`)
                .join("");

            const actionCell = withActions
                ? `<td><button type="button" class="btn btn-danger btn-delete" data-row="${index}">${deleteLabel}</button></td>`
                : "";

            return `<tr class="records-row" data-row="${index}" tabindex="0">${cells}${actionCell}</tr>`;
        })
        .join("");

    container.innerHTML = `
        <section class="records-panel">
            <div class="records-header">
                ${typeof onDeleteAll === "function" ? `<button id="btn-clear-all" class="btn btn-danger" type="button">${sanitizeHTML(clearAllLabel)}</button>` : ""}
            </div>
            <div class="records-table-wrapper">
                <table class="records-table">
                    <thead><tr>${finalHeader}</tr></thead>
                    <tbody>${rowsHtml}</tbody>
                </table>
            </div>
        </section>
    `;

    if (typeof onRowClick === "function") {
        const rows = container.querySelectorAll(".records-row");

        rows.forEach((row) => {
            row.addEventListener("click", () => {
                const index = Number(row.dataset.row);
                onRowClick(records[index]);
            });

            row.addEventListener("keydown", (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    const index = Number(row.dataset.row);
                    onRowClick(records[index]);
                }
            });
        });
    }

    if (withActions) {
        const deleteButtons = container.querySelectorAll(".btn-delete");

        deleteButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
                event.stopPropagation();
                const index = Number(button.dataset.row);
                onDelete(records[index]);
            });
        });
    }

    if (typeof onDeleteAll === "function") {
        const clearButton = container.querySelector("#btn-clear-all");

        clearButton?.addEventListener("click", () => {
            const confirmed = confirm("Sei sicuro di voler rimuovere tutti i record?");

            if (confirmed) {
                onDeleteAll();
            }
        });
    }
}
