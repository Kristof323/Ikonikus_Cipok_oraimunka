# Ikonikus cipők

Ez egy React + TypeScript alapú webalkalmazás, amely ikonikus cipőket jelenít meg. Az adatokat a **json-server** szolgálja ki, az új cipők felvételéhez **POST** kérés használható, a megjelenést pedig a **Bootstrap** biztosítja.

## Funkciók

- Legalább 5 cipő adata egy JSON-adatbázisban
- String, number, boolean és date típusú mezők
- Cipők listázása `GET` kéréssel
- Új cipő felvétele űrlapon keresztül `POST` kéréssel
- Sikeres mentés után a lista automatikusan frissül
- Reszponzív, Bootstrap-alapú megjelenés

## Telepítés

```bash
npm install
```

## Futtatás

Nyiss két terminált:

```bash
# 1. terminál: JSON szerver
npm run json-server

# 2. terminál: React alkalmazás
npm run dev
```

A json-server a `http://localhost:3000/cipok` végponton érhető el, a React alkalmazás pedig általában a `http://localhost:5173` címen nyílik meg.

## Adatszerkezet

```json
{
  "id": 1,
  "nev": "Air Jordan 1",
  "marka": "Nike",
  "kiadasDatuma": "1985-04-01",
  "ar": 28990,
  "kollekcios": true,
  "kep": "https://...",
  "leiras": "..."
}
```
