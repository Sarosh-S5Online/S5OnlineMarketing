/* ============================================================
   INTRO-VIDEO
   Speelt alleen op de landingspagina en alleen bij het
   allereerste bezoek. Wie de site binnenkomt (op welke pagina
   dan ook) heeft zijn kans gehad: daarna nooit meer.
   ============================================================ */
(function(){
  const root=document.documentElement;
  // Markeer direct als 'gezien', op elke pagina. Zo speelt de intro niet
  // alsnog als iemand later binnen de site naar Home navigeert.
  try{ localStorage.setItem('s5_intro_seen','1'); }catch(e){}

  if(!root.classList.contains('intro-on')) return;
  const intro=document.getElementById('intro');
  const video=document.getElementById('intro-video');
  const videoBg=document.getElementById('intro-video-bg');
  if(!intro||!video){ root.classList.remove('intro-on'); return; }

  let done=false;
  const finish=()=>{
    if(done) return;
    done=true;
    // Bereken hoeveel de video moet doorzoomen om het scherm precies te vullen,
    // zodat de laatste beelden schermvullend zijn en de overgang naadloos is
    const iw=video.videoWidth||1764, ih=video.videoHeight||1176;
    const vw=window.innerWidth, vh=window.innerHeight;
    const containScale=Math.min(vw/iw,vh/ih);
    if(containScale>0){
      // Op brede schermen is dit ~1,35x en vult het beeld precies. Op staande
      // schermen zou het 3x worden: dat begrenzen we, want zo'n sprong zie je
      // wel en het beeld zou uit elkaar vallen. Daar volstaat de fade, omdat de
      // achtergrond van de overlay dezelfde is als die van de hero.
      const s=Math.min(Math.max(vw/iw,vh/ih)/containScale,1.6);
      if(s>1&&isFinite(s)) intro.style.setProperty('--cover-scale',s.toFixed(3));
    }
    intro.classList.add('intro-out');
    setTimeout(()=>{
      root.classList.remove('intro-on');
      intro.remove();
    },600);
  };

  document.getElementById('intro-skip').addEventListener('click',finish);
  document.addEventListener('keydown',(e)=>{ if(e.key==='Escape') finish(); });
  video.addEventListener('error',finish);
  // De video is precies afgesneden op het warp-moment, dus de overgang start
  // op het allerlaatste frame ('ended' is niet altijd betrouwbaar, vandaar beide)
  video.addEventListener('timeupdate',()=>{
    if(video.duration && video.currentTime >= video.duration-0.06) finish();
  });
  video.addEventListener('ended',finish);
  // Veiligheidsnet: blijf nooit langer dan 6 seconden hangen
  setTimeout(finish,6000);

  // De onscherpe achtergrondkopie is op telefoons via CSS uitgezet. Daar laden
  // we hem dus ook niet: twee video's decoderen plus een schermvullende blur
  // is precies wat een telefoon traag maakt.
  const useBg = videoBg && getComputedStyle(videoBg).display!=='none';

  // Bron en poster pas nu laden: bezoekers die de intro niet krijgen,
  // downloaden ook geen enkele byte ervan
  if(video.dataset.poster) video.poster=video.dataset.poster;
  const load=(v)=>{
    v.querySelectorAll('source').forEach(s=>{ s.src=s.dataset.src; });
    v.load();
  };
  load(video);
  if(useBg) load(videoBg);

  const p=video.play();
  if(p&&p.catch) p.catch(finish); // autoplay geblokkeerd -> meteen door naar de site
  if(useBg){
    const pb=videoBg.play();
    if(pb&&pb.catch) pb.catch(()=>{}); // achtergrond is puur decoratie
    // Houd de onscherpe kopie gelijk lopen met de hoofdvideo
    video.addEventListener('timeupdate',()=>{
      if(Math.abs(videoBg.currentTime-video.currentTime)>0.12) videoBg.currentTime=video.currentTime;
    });
  }else if(videoBg){
    videoBg.remove();
  }
})();

/* ============================================================
   TRACKING-CONFIG
   Vul hier je ID's in zodra je ze hebt. Zolang ze leeg zijn
   wordt er niets geladen (de cookiebanner werkt wel gewoon).
   ============================================================ */
const S5_CONFIG={
  gaId:'',        // bijv. 'G-XXXXXXXXXX'  (Google Analytics 4)
  adsId:'',       // bijv. 'AW-XXXXXXXXX'  (Google Ads conversietag)
  metaPixelId:''  // bijv. '1234567890'    (Meta pixel)
};

/* ============================================================
   COOKIETOESTEMMING (AVG)
   Niets laadt voordat de bezoeker toestemming geeft.
   ============================================================ */
const CC_KEY='s5_consent_v1';

const ccRead=()=>{
  try{ const v=JSON.parse(localStorage.getItem(CC_KEY)); return (v&&typeof v==='object')?v:null; }
  catch(e){ return null; }
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

const CC_HTML=`
  <h2>Wij gebruiken cookies</h2>
  <p>Noodzakelijke cookies zorgen dat de site werkt. Analytische en marketingcookies plaatsen we alleen met jouw toestemming. Lees meer in ons <a href="/cookies">cookiebeleid</a> en de <a href="/privacy">privacyverklaring</a>.</p>
  <div class="cc-prefs">
    <div class="cc-row">
      <div class="cc-row-text">
        <h3>Noodzakelijk</h3>
        <p>Nodig om de website te laten werken en om jouw cookiekeuze te onthouden. Deze staan altijd aan.</p>
      </div>
      <label class="cc-toggle"><input type="checkbox" checked disabled aria-label="Noodzakelijke cookies (altijd aan)"><span class="cc-track"></span></label>
    </div>
    <div class="cc-row">
      <div class="cc-row-text">
        <h3>Analytisch</h3>
        <p>Hiermee zien we hoe bezoekers de site gebruiken, zodat we hem kunnen verbeteren (Google Analytics).</p>
      </div>
      <label class="cc-toggle"><input type="checkbox" id="cc-analytics" aria-label="Analytische cookies"><span class="cc-track"></span></label>
    </div>
    <div class="cc-row">
      <div class="cc-row-text">
        <h3>Marketing</h3>
        <p>Hiermee meten we onze advertenties en tonen we relevante advertenties (Google Ads, Meta-pixel).</p>
      </div>
      <label class="cc-toggle"><input type="checkbox" id="cc-marketing" aria-label="Marketingcookies"><span class="cc-track"></span></label>
    </div>
  </div>
  <div class="cc-actions">
    <button class="btn btn-primary" id="cc-accept" type="button">Alles accepteren</button>
    <button class="btn btn-outline" id="cc-reject" type="button">Alleen noodzakelijk</button>
    <button class="cc-link" id="cc-toggle-prefs" type="button">Voorkeuren aanpassen</button>
    <button class="btn btn-outline" id="cc-save" type="button" style="display:none;">Voorkeuren opslaan</button>
  </div>`;

const ccInit=()=>{
  const banner=document.createElement('aside');
  banner.className='cc-banner';
  banner.id='cc-banner';
  banner.setAttribute('role','dialog');
  banner.setAttribute('aria-label','Cookievoorkeuren');
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
    const c=ccRead();
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
    link.textContent='Cookie-instellingen';
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
  // Zodra de bezoeker in de buurt van de knop komt (hover op desktop, vinger
  // op het scherm op mobiel) leggen we alvast de verbinding met YouTube. Dat
  // scheelt bij de daadwerkelijke tik het DNS- en TLS-oponthoud.
  let warmed=false;
  const warmUp=()=>{
    if(warmed) return;
    warmed=true;
    // Bewust alleen de twee hosts die de embed echt nodig heeft: geen
    // advertentiedomeinen, dat zou de cookiebanner ondermijnen.
    ['https://www.youtube-nocookie.com','https://i.ytimg.com'].forEach(h=>{
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
    const id=heroVideo.dataset.yt;
    const iframe=document.createElement('iframe');
    iframe.src=`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1&modestbranding=1`;
    iframe.title='S5Online Marketing, boodschap van de oprichter';
    iframe.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';
    iframe.setAttribute('allowfullscreen','');
    // Poster en spinner blijven staan tot de speler er echt is. Pas dan
    // schakelen we om, zodat er nooit een leeg zwart vlak in beeld staat.
    iframe.addEventListener('load',()=>{
      heroVideo.classList.remove('loading');
      heroVideo.classList.add('playing');
    });
    heroVideo.appendChild(iframe);
    heroVideo.classList.add('loading');
  };
  heroVideo.addEventListener('click',playVideo);
  heroVideo.querySelector('.hero-video-play').addEventListener('click',(e)=>{e.stopPropagation();playVideo();});
}

const waForm=document.getElementById('whatsapp-form');
if(waForm){
  waForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const naam=waForm.naam.value.trim();
    const bedrijf=waForm.bedrijf.value.trim();
    const contact=waForm.contact.value.trim();
    const bericht=waForm.bericht.value.trim();
    const intro=waForm.dataset.waIntro||'Hoi Sarosh, ik wil graag meer weten over S5Online Marketing.';
    const berichtLabel=waForm.dataset.waBerichtLabel||'Bericht';
    let text=`${intro}\n\nNaam: ${naam}\nBedrijf: ${bedrijf}\nContact: ${contact}\n`;
    if(bericht) text+=`${berichtLabel}: ${bericht}\n`;
    window.open(`https://wa.me/31627875141?text=${encodeURIComponent(text)}`,'_blank');
  });
}
