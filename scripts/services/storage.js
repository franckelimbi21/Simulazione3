// storage.js - Persistenza localStorage per i codici ISO alpha-3 delle nazioni preferite

const STORAGE_KEYS = {
    FAVORITES: "countries_favorites_cca3",
};

/**
 * Legge i codici ISO alpha-3 dei paesi preferiti dal localStorage.
 * Normalizza i codici (uppercase) e filtra quelli non validi.
 * 
 * @returns {Array<string>} - Array di codici ISO validi, o array vuoto se errore di lettura
 * 
 * @example
 * const codes = readFavoriteCodes();
 * console.log(codes); // ["ITA", "FRA", "DEU"]
 */
function readFavoriteCodes() {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
        const parsed = raw ? JSON.parse(raw) : [];

        if (!Array.isArray(parsed)) {
            return [];
        }

        return [...new Set(parsed
            .map((code) => String(code || "").trim().toUpperCase())
            .filter((code) => /^[A-Z]{3}$/.test(code)))];
    } catch (error) {
        console.error("Errore lettura preferiti", error);
        return [];
    }
}

/**
 * Scrive i codici ISO alpha-3 nel localStorage.
 * 
 * @param {Array<string>} codes - Array di codici ISO da salvare
 * 
 * @example
 * writeFavoriteCodes(["ITA", "FRA"]);
 * // Ora localStorage contiene: {"countries_favorites_cca3": '["ITA","FRA"]'}
 */
function writeFavoriteCodes(codes) {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(codes));
}

/**
 * Recupera l'array di codici preferiti dal localStorage.
 * 
 * @returns {Array<string>} - Array di codici ISO preferiti
 * 
 * @example
 * const favorites = getFavoriteCodes();
 * console.log(favorites); // ["ITA", "FRA"]
 */
export function getFavoriteCodes() {
    return readFavoriteCodes();
}

/**
 * Verifica se un codice paese è nei preferiti.
 * 
 * @param {string} code - Il codice ISO alpha-3 (es: "ITA")
 * @returns {boolean} - true se il paese è nei preferiti, false altrimenti
 * 
 * @example
 * console.log(isFavoriteCode("ITA")); // true (se aggiunto)
 * console.log(isFavoriteCode("JPN")); // false (se non aggiunto)
 */
export function isFavoriteCode(code) {
    const candidate = String(code || "").trim().toUpperCase();
    return readFavoriteCodes().includes(candidate);
}

/**
 * Aggiunge un codice paese ai preferiti (se non gia presente).
 * 
 * @param {string} code - Il codice ISO alpha-3 da aggiungere
 * @returns {boolean} - true se aggiunto con successo, false se gia presente o codice non valido
 * 
 * @example
 * const success = addFavoriteCode("ITA");
 * console.log(success); // true se aggiunto, false se gia c'era
 */
export function addFavoriteCode(code) {
    const candidate = String(code || "").trim().toUpperCase();

    if (!/^[A-Z]{3}$/.test(candidate)) {
        return false;
    }

    const current = readFavoriteCodes();

    if (current.includes(candidate)) {
        return false;
    }

    current.push(candidate);
    writeFavoriteCodes(current);
    return true;
}

/**
 * Rimuove un codice paese dai preferiti.
 * 
 * @param {string} code - Il codice ISO alpha-3 da rimuovere
 * 
 * @example
 * removeFavoriteCode("ITA");
 * // Ora "ITA" non è piu nei preferiti
 */
export function removeFavoriteCode(code) {
    const candidate = String(code || "").trim().toUpperCase();
    const updated = readFavoriteCodes().filter((entry) => entry !== candidate);

    writeFavoriteCodes(updated);
}

/**
 * Aggiunge o rimuove un codice paese dai preferiti (toggle).
 * Se gia presente, lo rimuove; se non presente, lo aggiunge.
 * 
 * @param {string} code - Il codice ISO alpha-3 da aggiungere/rimuovere
 * @returns {boolean} - true se ora è un favorito, false se stato rimosso
 * 
 * @example
 * toggleFavoriteCode("ITA");  // Aggiunge - ritorna true
 * toggleFavoriteCode("ITA");  // Rimuove - ritorna false
 */
export function toggleFavoriteCode(code) {
    if (isFavoriteCode(code)) {
        removeFavoriteCode(code);
        return false;
    }

    addFavoriteCode(code);
    return true;
}

/**
 * Svuota completamente la lista dei preferiti.
 * 
 * @example
 * clearFavoriteCodes();
 * // Ora non ci sono piu preferiti salvati
 */
export function clearFavoriteCodes() {
    writeFavoriteCodes([]);
}
