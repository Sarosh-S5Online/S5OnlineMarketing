# S5Online Marketing — website

Statische website (HTML, CSS, JavaScript). **Geen build-stap, geen framework, geen npm.**
Alle bestanden staan los in deze map en werken direct.

## ⚙️ Analytics aanzetten (Google Analytics / Ads / Meta pixel)

Er staat **nog geen tracking op de site**. De cookiebanner werkt al wel volledig.
Zodra je je ID's hebt, open je `site.js` en vul je bovenin in:

```js
const S5_CONFIG={
  gaId:'',        // bijv. 'G-XXXXXXXXXX'  (Google Analytics 4)
  adsId:'',       // bijv. 'AW-XXXXXXXXX'  (Google Ads conversietag)
  metaPixelId:''  // bijv. '1234567890'    (Meta pixel)
};
```

Meer hoef je niet te doen. De scripts worden **alleen** geladen nadat een bezoeker
toestemming geeft via de cookiebanner (AVG-proof, met Google Consent Mode v2).
Laat een veld leeg als je die dienst niet gebruikt.

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

## 🎬 Intro-video

`intro.mp4` / `intro.webm` spelen als volledig scherm bij het **allereerste bezoek**
op de landingspagina (`/`). Daarna nooit meer: dat wordt onthouden in `localStorage`
onder de sleutel `s5_intro_seen`.

- Komt iemand binnen op een andere pagina (bijv. via Google op `/seo`)? Dan wordt de
  intro direct als "gezien" gemarkeerd en speelt hij ook later niet meer.
- Er wordt **geen enkele byte** van de video geladen voor wie hem niet krijgt.
- Op staande schermen staat de video volledig in beeld met huisstijl-randen. Zodra er
  een 9:16-versie is, kan die erin: voeg hem toe als `intro-mobile.mp4/webm` en pas de
  `<source>`-regels in `index.html` aan met een `media`-attribuut.
- Testen? Wis `localStorage` (F12 → Console → `localStorage.clear()`) en herlaad `/`.

## URL's (SEO)

`vercel.json` zet **cleanUrls** aan. Daardoor worden de adressen netjes:

- `/index.html` → `/`
- `/diensten.html` → `/diensten`
- `/gratis-demo.html` → `/gratis-demo`

Alle interne links en canonical-tags staan al op deze schone slugs, met
`https://s5onlinemarketing.com` als domein. Er zijn ook een `sitemap.xml` en
`robots.txt` toegevoegd.

> **Let op:** verander je later van domein? Pas dan de canonicals in de HTML-bestanden
> en de URL's in `sitemap.xml` + `robots.txt` aan.

## Nog te doen (voor "finished")

- [x] ~~Cookiebanner~~ — staat er (categorieën + Consent Mode v2, niets laadt vóór toestemming).
- [x] ~~Juridische teksten kloppend maken~~ — Vercel, YouTube-embed en WhatsApp verwerkt.
- [x] ~~Schone URL-slugs~~ — via `vercel.json`.
- [x] ~~Eerste case op `werk`~~ — Rijschool Stripes.
- [ ] Je GA4 / Google Ads / Meta pixel-ID invullen in `site.js` (zie boven).
- [ ] Video voor de 3e animatie toevoegen.
- [ ] Meer cases toevoegen op `werk.html` (kopieer het `<article class="case-card">`-blok).
- [ ] Domein koppelen in Vercel (Settings → Domains).
