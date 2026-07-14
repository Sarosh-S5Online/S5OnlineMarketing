# S5Online Marketing — website

Statische website (HTML, CSS, JavaScript). **Geen build-stap, geen framework, geen npm.**
Alle bestanden staan los in deze map en werken direct. Vercel kan dit 1-op-1 hosten zonder configuratie.

## Wat zit erin

| Pagina | Bestand |
|---|---|
| Home | `index.html` |
| Diensten (overzicht) | `diensten.html` |
| Webdesign | `webdesign.html` |
| Google Ads | `google-ads.html` |
| Meta Ads | `meta-ads.html` |
| SEO & Lokale SEO | `seo.html` |
| Over mij | `over-mij.html` |
| Werk | `werk.html` |
| Contact | `contact.html` |
| Strategiegesprek | `strategiegesprek.html` |
| Gratis website demo | `gratis-demo.html` |
| Gratis SEO-audit | `seo-audit.html` |
| Privacyverklaring | `privacy.html` |
| Algemene voorwaarden | `voorwaarden.html` |
| Cookiebeleid | `cookies.html` |

Gedeelde bestanden: `styles.css` (opmaak), `site.js` (interacties), plus de lettertypes
(`Kameron-*.ttf`, `Inter-*.woff2`), het logo (`s5-logo.png`), de foto (`founder.jpg`)
en de video-poster (`hero-poster.jpg`).

---

## Publiceren: GitHub → Vercel

### Stap 1 — Naar GitHub

**Makkelijkste manier (GitHub Desktop):**
1. Installeer [GitHub Desktop](https://desktop.github.com/) en log in met je GitHub-account.
2. Menu **File → Add local repository…** en kies deze map.
   (Git staat al klaar met een eerste commit, dus je ziet meteen een nette repo.)
3. Klik rechtsboven op **Publish repository**.
   - Vink **"Keep this code private"** aan als je de code privé wilt houden.
   - Klik **Publish repository**.

**Alternatief (via de website, zonder Git-kennis):**
1. Ga naar [github.com/new](https://github.com/new) en maak een lege repository (bijv. `s5online-website`).
2. Klik op **"uploading an existing file"**.
3. Sleep **alle bestanden uit deze map** in het venster (niet de map zelf, maar de inhoud).
4. Klik onderaan op **Commit changes**.

### Stap 2 — Naar Vercel

1. Ga naar [vercel.com](https://vercel.com) en log in met je GitHub-account.
2. Klik **Add New… → Project**.
3. Kies de repository die je net hebt gepubliceerd en klik **Import**.
4. Laat alle instellingen op de standaardwaarde staan:
   - **Framework Preset:** Other (of "No Framework")
   - **Build Command:** leeg laten
   - **Output Directory:** leeg laten
   - **Root Directory:** `./`
5. Klik **Deploy**.

Na ~20 seconden staat de site live op een `*.vercel.app`-adres. 🎉

### Stap 3 — Eigen domein (later)

In Vercel: **Project → Settings → Domains** → voeg `s5onlinemarketing.com` toe en volg
de DNS-instructies. Vercel regelt automatisch een gratis SSL-certificaat.

---

## De site later aanpassen

- **GitHub Desktop:** wijzig een bestand → in GitHub Desktop verschijnt de wijziging →
  typ een korte omschrijving → **Commit to main** → **Push origin**.
  Vercel zet de nieuwe versie automatisch live.
- **Via de website:** open het bestand op GitHub → potloodje (Edit) → **Commit changes**.

---

## Lokaal bekijken (optioneel)

Dubbelklikken op `index.html` werkt grotendeels, maar sommige browsers blokkeren dan het
laden van de lettertypes. Beter is een kleine lokale server. Met Python:

```
python -m http.server 5050
```

Open daarna `http://localhost:5050` in je browser.

---

## Nog te doen (voor "finished")

- [ ] Cookiebanner toevoegen zodra Google Analytics / Meta-pixel actief wordt
      (nu staat er nog geen tracking op de site).
- [ ] In het cookiebeleid een regel over de YouTube-embed opnemen.
- [ ] In privacyverklaring/cookiebeleid "Squarespace" vervangen door de echte host (Vercel)
      en "Tally/Formspree" nalopen (contact loopt nu via WhatsApp).
- [ ] Echte cases/portfolio toevoegen op `werk.html`.
