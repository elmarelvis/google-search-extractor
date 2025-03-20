# Detailní popis aplikace Google Search Extractor

## Úvod

Tato aplikace demonstruje základní znalosti webového vývoje, včetně práce s HTML, CSS, JavaScriptem, Node.js a API. Jedná se o jednoduchý nástroj, který umožňuje vyhledávat výrazy na Google, extrahovat výsledky vyhledávání a ukládat je ve formátu JSON nebo CSV.

## Technická implementace

### Frontend (klientská část)

Frontend aplikace je implementován v souboru `public/index.html` s využitím čistého HTML, CSS (`public/styles.css`) a JavaScriptu (`public/app.js`). Aplikace využívá moderní JavaScript přístupy bez externích knihoven.

#### HTML struktura (`index.html`)

HTML soubor definuje základní strukturu aplikace:
- Vyhledávací formulář
- Kontejner pro zobrazení výsledků
- Tlačítka pro stažení výstupů
- Indikátor načítání
- Oblast pro zobrazení chybových zpráv

Struktura je sémantická, využívá vhodné HTML elementy a třídy pro styling.

#### CSS styly (`styles.css`)

Styly jsou navrženy pro čisté a responsivní uživatelské rozhraní. Aplikace používá flexbox pro rozvržení a moderní stylovací přístupy. Styly jsou organizovány podle komponent aplikace pro snadnou údržbu.

#### JavaScript logika (`app.js`)

JavaScript kód je strukturován do několika klíčových částí:
1. **Inicializace** - načtení DOM elementů, přiřazení event listenerů
2. **Vyhledávání** - asynchronní funkce pro komunikaci s backend API
3. **Zobrazení výsledků** - vytváření DOM elementů pro výsledky vyhledávání
4. **Stahování dat** - konverze dat do požadovaných formátů a vytvoření stažitelných souborů
5. **Pomocné funkce** - zobrazení/skrytí chybových zpráv a indikátoru načítání

Kód využívá moderní JavaScript přístupy jako async/await, arrow funkce, template literals a další.

### Backend (serverová část)

Backend je implementován ve dvou variantách:
1. **Express server** (`server.js`) - pro lokální vývoj a nasazení na klasické servery
2. **Serverless API** (`api/search.js`) - pro nasazení na platformy jako Vercel

#### Express server (`server.js`)

Server používá Express.js framework pro vytvoření RESTful API. Klíčové části:
- Nastavení middlewarů (JSON parsing, CORS, statické soubory)
- Definice endpointu `/api/search` pro zpracování vyhledávání
- Implementace funkce `scrapeGoogleResults` pro extrakci dat z Google

Server používá knihovny axios pro HTTP požadavky a cheerio pro parsování HTML.

#### Serverless API (`api/search.js`)

Serverless funkce sdílí stejnou logiku jako Express server, ale je optimalizována pro nasazení na serverless platformy. Funkce je exportována v formátu očekávaném platformou Vercel.

### Scraping techniky

Aplikace používá několik technik pro úspěšné extrahování dat z vyhledávače Google:

1. **Napodobení běžného prohlížeče** - nastavení User-Agent a dalších hlaviček pro minimalizaci blokování
2. **Selektivní parsování** - využití CSS selektorů pro přesné cílení na relevantní elementy
3. **Filtrování obsahu** - odstranění reklam a irelevantních výsledků
4. **Zpracování URL** - parsování a čištění odkazů na skutečné URL adresy

### Bezpečnost a výkon

Aplikace implementuje několik bezpečnostních a výkonnostních opatření:
- **Ošetření vstupů** - validace a enkódování uživatelských vstupů
- **Zpracování chyb** - robustní zachytávání a zpracování chyb
- **Asynchronní operace** - neblokující zpracování požadavků
- **Informativní zpětná vazba** - jasné zprávy o průběhu a chybách

## Možnosti rozšíření

Aplikace představuje základní implementaci, kterou lze dále rozšířit o:
1. **Stránkování výsledků** - získávání více stránek výsledků
2. **Filtry vyhledávání** - možnost omezit výsledky podle data, typu obsahu, atd.
3. **Autentizace** - přidání uživatelských účtů a historie vyhledávání
4. **Pokročilá analýza dat** - statistiky, grafy a další analytické nástroje
5. **Podpora více vyhledávačů** - rozšíření pro Bing, DuckDuckGo a další

## Závěr

Tato aplikace demonstruje znalost základních webových technologií a jejich propojení do funkčního celku. Kombinuje frontend a backend vývoj, práci s API, asynchronní operace, zpracování dat a další důležité koncepty moderního webového vývoje.

Pro produkční nasazení by bylo vhodné implementovat pokročilejší techniky cachování, respektování robots.txt, a potenciálně využití oficiálních API namísto scrapingu, pokud jsou dostupná.