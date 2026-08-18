/* ============================================================
   INTRO-VIDEO
   Speelt elke keer dat je de homepage opent. De inline head-
   script in de HTML bepaalt vóór render of hij aan gaat.
   ============================================================ */
(function(){
  const root=document.documentElement;
  if(!root.classList.contains('intro-on')) return;
  const intro=document.getElementById('intro');
  const video=document.getElementById('intro-video');
  if(!intro||!video){ root.classList.remove('intro-on'); return; }

  let done=false;
  // Elke interactie slaat de intro over: klik, tik, scroll, veeg of een toets.
  // Dat voelt natuurlijker dan alleen de knop, je hoeft nergens op te richten.
  const skipEvents=['pointerdown','wheel','touchstart','keydown'];
  const onInteract=()=>finish();
  const finish=()=>{
    if(done) return;
    done=true;
    skipEvents.forEach(ev=>window.removeEventListener(ev,onInteract));
    // De warp zoomt nog even door (via CSS) en de overlay vervaagt. Het beeld is
    // op het snijpunt abstract, dus de overgang naar de echte pagina valt weg.
    intro.classList.add('intro-out');
    setTimeout(()=>{
      root.classList.remove('intro-on');
      intro.remove();
    },600);
  };

  skipEvents.forEach(ev=>window.addEventListener(ev,onInteract,{passive:true}));
  video.addEventListener('error',finish);
  // De video is precies afgesneden op het warp-moment, dus de overgang start
  // op het allerlaatste frame ('ended' is niet altijd betrouwbaar, vandaar beide)
  video.addEventListener('timeupdate',()=>{
    if(video.duration && video.currentTime >= video.duration-0.06) finish();
  });
  video.addEventListener('ended',finish);
  // Veiligheidsnet: blijf nooit langer dan 5 seconden hangen
  setTimeout(finish,5000);

  // Kies de juiste video: staand op telefoons, liggend daarboven. Pas nu laden,
  // zodat bezoekers die de intro niet krijgen er geen byte van downloaden.
  const phone=window.matchMedia('(max-width:700px)').matches;
  const d=video.dataset;
  const webmEl=video.querySelector('.intro-src-webm');
  const mp4El=video.querySelector('.intro-src-mp4');
  // Safari op de iPhone speelt VP9-webm niet betrouwbaar en kan erover
  // struikelen in plaats van door te vallen naar mp4. Geef de webm-bron daarom
  // alleen aan browsers die hem echt aankunnen; de rest krijgt gewoon mp4.
  if(video.canPlayType('video/webm; codecs="vp9"')){
    webmEl.src = phone ? d.mobileWebm : d.desktopWebm;
  }else{
    webmEl.remove();
  }
  mp4El.src = phone ? d.mobileMp4 : d.desktopMp4;
  video.poster = phone ? d.mobilePoster : d.desktopPoster;
  video.muted = true; // iOS vereist soms de property, niet alleen het attribuut
  video.load();

  // Op iOS mislukt de eerste play() vaak omdat de video nog niet klaar is
  // ('AbortError' door de load()). Dat is geen blokkade: we proberen het opnieuw
  // zodra hij kan spelen. Alleen een echte blokkade (energiebesparing ->
  // 'NotAllowedError') slaat de intro meteen over, zodat de bezoeker niet naar
  // een stilstaand beeld kijkt.
  const tryPlay=()=>{
    const p=video.play();
    if(p&&p.catch) p.catch((err)=>{ if(err && err.name==='NotAllowedError') finish(); });
  };
  video.addEventListener('canplay',tryPlay,{once:true});
  tryPlay();
})();

/* ============================================================
   CONFIG
   Vul hier je ID's in zodra je ze hebt. Zolang ze leeg zijn
   wordt er niets geladen (de cookiebanner werkt wel gewoon).
   ============================================================ */
const S5_CONFIG={
  gaId:'',        // bijv. 'G-XXXXXXXXXX'  (Google Analytics 4)
  adsId:'',       // bijv. 'AW-XXXXXXXXX'  (Google Ads conversietag)
  metaPixelId:'', // bijv. '1234567890'    (Meta pixel)

  // Waar de aanvragen binnenkomen.
  contactEmail:'sarosh@s5onlinemarketing.com'
};

/* ============================================================
   COOKIETOESTEMMING (AVG)
   Niets laadt voordat de bezoeker toestemming geeft.
   ============================================================ */
const CC_KEY='s5_consent_v1';
// De Autoriteit Persoonsgegevens verwacht dat je toestemming periodiek opnieuw
// vraagt in plaats van hem voor altijd te bewaren. Na deze termijn verschijnt
// de banner opnieuw; de vorige keuze staat dan alvast goed ingevuld.
const CC_MAX_DAGEN=180;

// De opgeslagen keuze, ook als die verlopen is. Alleen om de schuifjes mee
// voor te vullen, zodat iemand na 180 dagen niet opnieuw zit te zoeken.
const ccReadRaw=()=>{
  try{ const v=JSON.parse(localStorage.getItem(CC_KEY)); return (v&&typeof v==='object')?v:null; }
  catch(e){ return null; }
};
// De keuze die nu nog geldig is. Verlopen telt als geen keuze: dan vragen we
// het opnieuw en laden we intussen niets.
const ccRead=()=>{
  const v=ccReadRaw();
  if(!v) return null;
  if(v.ts){
    const dagen=(Date.now()-new Date(v.ts).getTime())/86400000;
    if(!(dagen<CC_MAX_DAGEN)) return null; // verlopen, of een onleesbare datum
  }
  return v;
};
const ccWrite=(c)=>{
  try{ localStorage.setItem(CC_KEY,JSON.stringify({...c,ts:new Date().toISOString()})); }catch(e){}
};

// Google Consent Mode v2: standaard alles geweigerd
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{
  ad_storage:'denied',
  ad_user_data:'denied',
  ad_personalization:'denied',
  analytics_storage:'denied',
  functionality_storage:'granted',
  security_storage:'granted'
});

let ccGoogleLoaded=false,ccMetaLoaded=false;

const ccLoadScript=(src)=>{
  const s=document.createElement('script');
  s.async=true; s.src=src;
  document.head.appendChild(s);
  return s;
};

const ccLoadGoogle=()=>{
  if(ccGoogleLoaded) return;
  const id=S5_CONFIG.gaId||S5_CONFIG.adsId;
  if(!id) return; // nog geen ID ingevuld
  ccGoogleLoaded=true;
  ccLoadScript(`https://www.googletagmanager.com/gtag/js?id=${id}`);
  gtag('js',new Date());
  if(S5_CONFIG.gaId) gtag('config',S5_CONFIG.gaId,{anonymize_ip:true});
  if(S5_CONFIG.adsId) gtag('config',S5_CONFIG.adsId);
};

const ccLoadMeta=()=>{
  if(ccMetaLoaded||!S5_CONFIG.metaPixelId) return;
  ccMetaLoaded=true;
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init',S5_CONFIG.metaPixelId);
  fbq('track','PageView');
};

const ccApply=(c)=>{
  gtag('consent','update',{
    analytics_storage:c.analytics?'granted':'denied',
    ad_storage:c.marketing?'granted':'denied',
    ad_user_data:c.marketing?'granted':'denied',
    ad_personalization:c.marketing?'granted':'denied'
  });
  if(c.analytics||c.marketing) ccLoadGoogle();
  if(c.marketing) ccLoadMeta();
};

/* ============================================================
   TEKSTEN
   De JS bouwt zelf de cookiebanner en de knoppen van het
   formulier, dus die teksten staan hier en niet in de HTML.
   Welke taal het wordt, leest hij af aan <html lang>.
   De juridische pagina's zijn alleen in het Nederlands, dus
   daar wijzen beide talen naar dezelfde links.
   ============================================================ */
const S5_LANG = document.documentElement.lang === 'en' ? 'en' : 'nl';

const S5_TEKST = {
  nl: {
    ccKop: 'Wij gebruiken cookies',
    ccIntro: 'Noodzakelijke cookies zorgen dat de site werkt. Analytische en marketingcookies plaatsen we alleen met jouw toestemming. Lees meer in ons <a href="/cookies">cookiebeleid</a> en de <a href="/privacy">privacyverklaring</a>.',
    ccNoodzakelijk: 'Noodzakelijk',
    ccNoodzakelijkUit: 'Nodig om de website te laten werken en om jouw cookiekeuze te onthouden. Deze staan altijd aan.',
    ccNoodzakelijkLabel: 'Noodzakelijke cookies (altijd aan)',
    ccAnalytisch: 'Analytisch',
    ccAnalytischUit: 'Hiermee zien we hoe bezoekers de site gebruiken, zodat we hem kunnen verbeteren (Google Analytics).',
    ccAnalytischLabel: 'Analytische cookies',
    ccMarketing: 'Marketing',
    ccMarketingUit: 'Hiermee meten we onze advertenties en tonen we relevante advertenties (Google Ads, Meta-pixel).',
    ccMarketingLabel: 'Marketingcookies',
    ccAccepteren: 'Alles accepteren',
    ccWeigeren: 'Alleen noodzakelijk',
    ccVoorkeuren: 'Voorkeuren aanpassen',
    ccOpslaan: 'Voorkeuren opslaan',
    ccDialoog: 'Cookievoorkeuren',
    ccFooter: 'Cookie-instellingen',
    fmVerstuur: 'Verstuur bericht',
    fmVersturen: 'Versturen…',
    fmNotitie: 'Je bericht komt rechtstreeks bij Sarosh binnen.',
    fmFout: 'Er ging iets mis bij het versturen. Probeer het opnieuw of mail rechtstreeks naar sarosh@s5onlinemarketing.com.',
    fmNaam: 'Naam', fmEmailLabel: 'E-mail', fmTelefoon: 'Telefoon', fmBedrijf: 'Bedrijf',
    fmBerichtStandaard: 'Bericht',
    fmOnderwerpStandaard: 'Aanvraag via de website',
    bedanktUrl: '/bedankt',
    videoTitel: 'S5Online Marketing, boodschap van de oprichter'
  },
  en: {
    ccKop: 'We use cookies',
    ccIntro: 'Necessary cookies keep the site working. We only place analytics and marketing cookies with your consent. Read more in our <a href="/cookies">cookie policy</a> and <a href="/privacy">privacy statement</a> (both in Dutch).',
    ccNoodzakelijk: 'Necessary',
    ccNoodzakelijkUit: 'Needed to make the website work and to remember your cookie choice. These are always on.',
    ccNoodzakelijkLabel: 'Necessary cookies (always on)',
    ccAnalytisch: 'Analytics',
    ccAnalytischUit: 'Lets us see how visitors use the site so we can improve it (Google Analytics).',
    ccAnalytischLabel: 'Analytics cookies',
    ccMarketing: 'Marketing',
    ccMarketingUit: 'Lets us measure our ads and show relevant ones (Google Ads, Meta pixel).',
    ccMarketingLabel: 'Marketing cookies',
    ccAccepteren: 'Accept all',
    ccWeigeren: 'Necessary only',
    ccVoorkeuren: 'Manage preferences',
    ccOpslaan: 'Save preferences',
    ccDialoog: 'Cookie preferences',
    ccFooter: 'Cookie settings',
    fmVerstuur: 'Send message',
    fmVersturen: 'Sending…',
    fmNotitie: 'Your message goes straight to Sarosh.',
    fmFout: 'Something went wrong sending your message. Please try again or email sarosh@s5onlinemarketing.com directly.',
    fmNaam: 'Name', fmEmailLabel: 'Email', fmTelefoon: 'Phone', fmBedrijf: 'Company',
    fmBerichtStandaard: 'Message',
    fmOnderwerpStandaard: 'Enquiry via the website',
    bedanktUrl: '/en/thank-you',
    videoTitel: 'S5Online Marketing, a message from the founder'
  }
};
const T = S5_TEKST[S5_LANG];

const CC_HTML=`
  <h2>${T.ccKop}</h2>
  <p>${T.ccIntro}</p>
  <div class="cc-prefs">
    <div class="cc-row">
      <div class="cc-row-text">
        <h3>${T.ccNoodzakelijk}</h3>
        <p>${T.ccNoodzakelijkUit}</p>
      </div>
      <label class="cc-toggle"><input type="checkbox" checked disabled aria-label="${T.ccNoodzakelijkLabel}"><span class="cc-track"></span></label>
    </div>
    <div class="cc-row">
      <div class="cc-row-text">
        <h3>${T.ccAnalytisch}</h3>
        <p>${T.ccAnalytischUit}</p>
      </div>
      <label class="cc-toggle"><input type="checkbox" id="cc-analytics" aria-label="${T.ccAnalytischLabel}"><span class="cc-track"></span></label>
    </div>
    <div class="cc-row">
      <div class="cc-row-text">
        <h3>${T.ccMarketing}</h3>
        <p>${T.ccMarketingUit}</p>
      </div>
      <label class="cc-toggle"><input type="checkbox" id="cc-marketing" aria-label="${T.ccMarketingLabel}"><span class="cc-track"></span></label>
    </div>
  </div>
  <div class="cc-actions">
    <button class="btn btn-primary" id="cc-accept" type="button">${T.ccAccepteren}</button>
    <button class="btn btn-neutral" id="cc-reject" type="button">${T.ccWeigeren}</button>
    <button class="cc-link" id="cc-toggle-prefs" type="button">${T.ccVoorkeuren}</button>
    <button class="btn btn-outline" id="cc-save" type="button" style="display:none;">${T.ccOpslaan}</button>
  </div>`;

const ccInit=()=>{
  const banner=document.createElement('aside');
  banner.className='cc-banner';
  banner.id='cc-banner';
  banner.setAttribute('role','dialog');
  banner.setAttribute('aria-label',T.ccDialoog);
  banner.innerHTML=CC_HTML;
  document.body.appendChild(banner);

  const open=(showPrefs)=>{
    banner.classList.add('open');
    document.body.classList.add('cc-open');
    if(showPrefs) showPrefsPanel();
  };
  const close=()=>{
    banner.classList.remove('open','prefs-open');
    document.body.classList.remove('cc-open');
  };
  const showPrefsPanel=()=>{
    banner.classList.add('prefs-open');
    document.getElementById('cc-save').style.display='';
    document.getElementById('cc-toggle-prefs').style.display='none';
    const c=ccReadRaw();
    if(c){
      document.getElementById('cc-analytics').checked=!!c.analytics;
      document.getElementById('cc-marketing').checked=!!c.marketing;
    }
  };
  const decide=(analytics,marketing)=>{
    const c={necessary:true,analytics,marketing};
    ccWrite(c); ccApply(c); close();
  };

  document.getElementById('cc-accept').addEventListener('click',()=>decide(true,true));
  document.getElementById('cc-reject').addEventListener('click',()=>decide(false,false));
  document.getElementById('cc-toggle-prefs').addEventListener('click',showPrefsPanel);
  document.getElementById('cc-save').addEventListener('click',()=>decide(
    document.getElementById('cc-analytics').checked,
    document.getElementById('cc-marketing').checked
  ));

  // Link "Cookie-instellingen" in de footer om de keuze later te wijzigen
  const legal=document.querySelector('.footer-legal');
  if(legal){
    const link=document.createElement('button');
    link.type='button';
    link.className='cc-link';
    link.style.cssText='padding:0;font-weight:inherit;font-size:inherit;color:inherit;text-decoration:none;';
    link.textContent=T.ccFooter;
    link.addEventListener('click',()=>open(true));
    legal.appendChild(link);
  }

  const saved=ccRead();
  if(saved) ccApply(saved); else open(false);
};

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',ccInit);
else ccInit();

document.querySelectorAll('.hero .reveal, .page-hero .reveal').forEach((el,i)=>{
  el.style.transition='opacity .9s ease, transform .9s ease';
  el.style.transitionDelay=(i*0.1)+'s';
  el.classList.add('in');
});

const header=document.getElementById('site-header');
const updateHeader=()=>{
  const y=window.scrollY||document.documentElement.scrollTop||document.body.scrollTop||0;
  header.classList.toggle('solid',y>40);
};
window.addEventListener('scroll',updateHeader,{passive:true});
document.addEventListener('scroll',updateHeader,{capture:true,passive:true});
updateHeader();

const io=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{if(e.isIntersecting) e.target.classList.add('in');});
},{threshold:0.15});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

const toggle=document.getElementById('mobile-toggle');
const navLinks=document.getElementById('nav-links');
toggle.addEventListener('click',()=>{
  const isOpen=navLinks.classList.toggle('open');
  toggle.classList.toggle('open',isOpen);
  toggle.setAttribute('aria-expanded',isOpen);
});
navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
  navLinks.classList.remove('open');
  toggle.classList.remove('open');
}));

const heroVideo=document.getElementById('hero-video');
if(heroVideo){
  // De standaard-snippet van Wistia laadt player.js op elke paginaweergave,
  // ook bij bezoekers die de video nooit aanzetten. Dat is een paar honderd KB
  // aan JavaScript voor niets. Daarom laden we hem pas bij een echte klik en
  // tonen we tot die tijd onze eigen poster.
  const wistiaId=heroVideo.dataset.wistia;

  // Zodra de bezoeker in de buurt van de knop komt (hover op desktop, vinger
  // op het scherm op mobiel) leggen we alvast de verbinding met Wistia. Dat
  // scheelt bij de daadwerkelijke tik het DNS- en TLS-oponthoud.
  let warmed=false;
  const warmUp=()=>{
    if(warmed) return;
    warmed=true;
    // Alleen de twee hosts die de speler echt nodig heeft: fast.wistia.com
    // levert de scripts, fast.wistia.net de video zelf.
    ['https://fast.wistia.com','https://fast.wistia.net'].forEach(h=>{
      const l=document.createElement('link');
      l.rel='preconnect'; l.href=h; l.crossOrigin='';
      document.head.appendChild(l);
    });
  };
  heroVideo.addEventListener('pointerenter',warmUp,{once:true});
  heroVideo.addEventListener('touchstart',warmUp,{once:true,passive:true});

  let started=false;
  const playVideo=()=>{
    if(started) return;
    started=true;
    warmUp();

    const s1=document.createElement('script');
    s1.src='https://fast.wistia.com/player.js'; s1.async=true;
    const s2=document.createElement('script');
    s2.src=`https://fast.wistia.com/embed/${wistiaId}.js`; s2.async=true; s2.type='module';
    // Als Wistia onbereikbaar is, blijft de bezoeker niet naar een spinner staren.
    s1.addEventListener('error',()=>{ heroVideo.classList.remove('loading'); started=false; });
    document.head.appendChild(s1);
    document.head.appendChild(s2);

    const player=document.createElement('wistia-player');
    player.setAttribute('media-id',wistiaId);
    player.setAttribute('aspect','0.5625');
    player.setAttribute('title',T.videoTitel);
    player.setAttribute('autoplay','true');

    // Poster en spinner blijven staan tot de video echt beeld geeft. Het
    // 'play'-event is daar het juiste moment voor: 'api-ready' komt eerder,
    // maar dan is er nog niets te zien.
    const reveal=()=>{
      heroVideo.classList.remove('loading');
      heroVideo.classList.add('playing');
    };
    player.addEventListener('play',reveal);
    // Mocht de browser het automatisch starten toch tegenhouden, dan tonen we
    // de speler alsnog: die heeft een eigen afspeelknop. Beter dan een
    // spinner die blijft draaien.
    player.addEventListener('api-ready',()=>setTimeout(reveal,1500));

    heroVideo.appendChild(player);
    heroVideo.classList.add('loading');
  };
  heroVideo.addEventListener('click',playVideo);
  heroVideo.querySelector('.hero-video-play').addEventListener('click',(e)=>{e.stopPropagation();playVideo();});
}

/* ============================================================
   CONTACTFORMULIER
   Verstuurt rechtstreeks naar Sarosh' e-mail via Web3Forms.
   De bezoeker krijgt bij succes de bedankt-pagina te zien.
   ============================================================ */
const contactForm=document.getElementById('contact-form');
if(contactForm){
  const WEB3FORMS_KEY='9cdc4ea1-7b53-4cd7-9205-f3ee9133874f';
  const knop=document.getElementById('cf-submit');
  const notitie=document.getElementById('cf-note');

  const ICOON_MAIL='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>';

  const teksLabel=ICOON_MAIL+' '+T.fmVerstuur;
  knop.innerHTML=teksLabel;
  knop.classList.remove('btn-whatsapp');
  knop.classList.add('btn-primary');
  notitie.textContent=T.fmNotitie;

  const naarBedankt=()=>{ window.location.href=T.bedanktUrl; };

  contactForm.addEventListener('submit',async(e)=>{
    e.preventDefault();
    knop.disabled=true;
    knop.innerHTML=T.fmVersturen;

    const data=new FormData(contactForm);
    data.append('access_key',WEB3FORMS_KEY);
    data.append('subject',contactForm.dataset.onderwerp||T.fmOnderwerpStandaard);
    data.append('from_name','S5Online Marketing website');
    data.append('botcheck','');

    try{
      const res=await fetch('https://api.web3forms.com/submit',{
        method:'POST',
        headers:{Accept:'application/json'},
        body:data
      });
      const json=await res.json();
      if(json.success){
        naarBedankt();
        return;
      }
      throw new Error(json.message||'submit failed');
    }catch(err){
      notitie.textContent=T.fmFout;
      knop.disabled=false;
      knop.innerHTML=teksLabel;
    }
  });
}
