# Countries Atlas

Applicazione web in Vanilla JavaScript che usa la REST API pubblica https://restcountries.com per cercare, esplorare e confrontare nazioni.

## Architettura e Struttura Directory

Il progetto adotta un approccio modulare basato su ES6 Modules, strutturando il codice in base al principio di *Separation of Concerns* per disaccoppiare strato dati, logica di view e controller di pagina.

```text
├── public/                # Viste HTML
│   ├── style.css          # Foglio di stile globale
│   ├── dashboard.html     # Dashboard statistiche e ordinamento
│   ├── explore.html       # Esplorazione per regione/continente
│   ├── favorites.html     # Gestione nazioni preferite
│   ├── index.html         # Entry point e panoramica app
│   └── search.html        # Ricerca per nome o capitale
├── scripts/               # Logica di business e manipolazione DOM
│   ├── components/        # UI Modules (card, suggerimenti, tabelle)
│   ├── core/              # Stato globale, bootstrap ed error handling
│   ├── pages/             # Controller di binding per le singole view
│   └── services/          # Data access layer e persistenza localStorage
├── LICENSE
└── README.md
```

## Funzionalità Core

* **Ricerca Intelligente (`search.js`, `api.js`):** Ricerca asincrona per nome paese o capitale, con suggerimenti dinamici e parsing dei dati della REST API.
* **Esplorazione Geografica (`explore.js`):** Filtro e visualizzazione dei paesi per regione o continente con schede informative dettagliate.
* **Dashboard Statistiche (`dashboard.js`):** Ordinamento e confronto nazioni per popolazione, area geografica e densità abitativa.
* **Gestione Preferiti (`storage.js`):** Persistenza client-side dei codici ISO alpha-3 mediante `localStorage` per mantenere le preferenze tra sessioni.
* **Dynamic UI (`country-card.js`, `records-table.js`):** Aggiornamento asincrono e reattivo del DOM con schede paese, tabelle informative e caricamento dati in background.

## Setup ed Esecuzione

Trattandosi di un'architettura puramente front-end (statica) priva di build step, non è richiesta l'installazione di pacchetti npm. È sufficiente servire i file statici tramite un local web server (es. estensione `Live Server` per VS Code o Node `http-server`) puntando alla directory root del progetto. L'entry point di navigazione è `public/index.html`.

A quel punto l'applicazione sarà accessibile all'indirizzo locale e potete esplorare tutte le funzionalità offerte, dalla ricerca di singoli paesi, all'esplorazione geografica, fino alla consultazione del dashboard statistico e la gestione dei preferiti.

# Esercizi da Svolgere

Gli esercizi totali sono suddivisi in 3 macro-aree di intervento, ognuna con un peso specifico in termini di punteggio finale.
I primi due avranno anche dei commenti `TODO` all'interno del codice per guidarvi nei punti esatti in cui intervenire.
Il terzo esercizio richiede invece un'attività di debugging logico, per cui dovrete esplorare autonomamente i file per trovare e risolvere il problema.

### 1. INTEGRAZIONI DATI (60p)

**Obiettivo:** Ripristinare il sistema di recupero e visualizzazione dei dati delle nazioni. Il sito per ora da errore o mostra dati incompleti in praticamente tutte le sezioni chiave.

**Task richiesti:**

1. **Data Fetching in [scripts/services/api.js](scripts/services/api.js)**\
   Completa la logica della funzione `requestCountryList` per effettuare una fetch all'endpoint passato come parametro. Dovrai gestire correttamente la risposta, trasformare i dati ricevuti e implementare una gestione degli errori corretta.

2. **Data Binding & UI Rendering in [scripts/components/country-card.js](scripts/components/country-card.js)**\
   Una volta recuperati i dati, completa la funzione `createCountryCard` per popolare correttamente la card di ogni paese. Dovrai sanificare i dati dinamici con `sanitizeHTML` e assicurarti che tutte le informazioni richieste (bandiera, nome, codice, capitale, regione, popolazione, area e densità) siano visualizzate in modo chiaro e ordinato.

### 2. CORREZIONE LAYOUT (30p)

**Obiettivo:** Ripristinare la visualizzazione di alcune sezioni del sito che presentano anomalie strutturali ed estetiche.

**Task richiesti:**

1. **Correzione Form in [public/dashboard.html](public/dashboard.html)**\
   Nella sezione del form per la selezione di metrica, ordine e numero di elementi, manca la classe corretta per mostrare i gruppi del form in modo ordinato. Cerca la classe corretta da inserire nei div che contengono i gruppi per ripristinare l'allineamento e la spaziatura corretta tra i campi del form. (cerca la classe nelle altre pagine che hanno il form corretto)

2. **Select con bordo errato [public/style.css](public/style.css)**\
   Gli elementi `select` all'interno del form del dashboard non hanno il bordo arrotondato come previsto dallo stile generale dell'app. Completa la sezione CSS relativa agli elementi `select` in `style.css` indicata da `input, select` per aggiungere il bordo arrotondato mancante.

3. **Stile Tabella [public/style.css](public/style.css)**\
   La tabella che mostra i risultati del dashboard non ha un layout difficile da leggere. Completa la sezione CSS relativa alla tabella in `style.css` indicata da `.records-table th, .records-table td`. Indicazioni più specifiche sono presenti nei commenti `TODO` all'interno del file CSS.

### 3. DEBUGGING LOGICO (10p)

**Obiettivo:** Individuare e risolvere un'anomalia nel flusso esecutivo della user interface.

**Problema riscontrato:**\
Quando si accede alla pagina di ricerca (`search.html`) e si esegue una query, si può scegliere di cercare per nazione o per capitale. Tuttavia, quando si seleziona la ricerca per capitale, non vengono restituiti risultati anche se esistono paesi con quella capitale (es. "Roma" per l'Italia).

**Task richiesti:**
1. Esamina il codice e comprendi da dove nasce il problema, identificando la causa logica che impedisce il corretto funzionamento della ricerca per capitale.
2. Correggi il bug in modo che la ricerca per capitale funzioni correttamente, restituendo i risultati attesi quando si inserisce una query valida.
