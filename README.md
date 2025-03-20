# Google Search Extractor

Jednoduchá webová aplikace pro extrakci výsledků vyhledávání z Google. Aplikace umožňuje vyhledat dotaz na Google, získat první stránku výsledků a stáhnout je ve formátu JSON nebo CSV.

## Funkce

- Vyhledávání libovolného dotazu na Google
- Extrakce titulků, URL a popisů výsledků vyhledávání
- Export výsledků ve formátu JSON nebo CSV
- Jednoduchý a intuitivní uživatelský interface

## Technologie

- **Frontend**: HTML, CSS, JavaScript (vanilla)
- **Backend**: Node.js, Express.js
- **Scraping**: Axios, Cheerio
- **Kontejnerizace**: Docker

## Instalace a spuštění

### Lokální spuštění

1. Naklonujte repozitář:
   ```
   git clone https://github.com/username/google-search-extractor.git
   cd google-search-extractor
   ```

2. Nainstalujte závislosti:
   ```
   npm install
   ```

3. Spusťte aplikaci:
   ```
   npm start
   ```

4. Otevřete prohlížeč na adrese [http://localhost:3000](http://localhost:3000)

### Spuštění v Dockeru

1. Sestavte Docker image:
   ```
   docker build -t google-search-extractor .
   ```

2. Spusťte kontejner:
   ```
   docker run -p 3000:3000 google-search-extractor
   ```

3. Otevřete prohlížeč na adrese [http://localhost:3000](http://localhost:3000)

### Spuštění pomocí Docker Compose

1. Spusťte aplikaci pomocí Docker Compose:
   ```
   docker-compose up
   ```

2. Otevřete prohlížeč na adrese [http://localhost:3000](http://localhost:3000)

## Použití

1. Do vyhledávacího pole zadejte hledaný výraz
2. Klikněte na tlačítko "Vyhledat" nebo stiskněte Enter
3. Počkejte na zobrazení výsledků
4. Pro stažení výsledků klikněte na "Stáhnout jako JSON" nebo "Stáhnout jako CSV"

## Struktura projektu

- `public/` - Frontendové soubory (HTML, CSS, JS)
- `api/` - API endpoint pro serverless nasazení (např. Vercel)
- `server.js` - Express server pro lokální vývoj
- `Dockerfile` a `docker-compose.yml` - Konfigurace pro Docker

## Licence

Tento projekt je licencován pod MIT licencí - viz soubor LICENSE pro více informací.

## Poznámka

Tato aplikace je určena pouze pro vzdělávací účely. Používání této aplikace pro masové scrapování Google může být v rozporu s podmínkami služby Google. Používejte zodpovědně.