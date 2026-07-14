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
  const playVideo=()=>{
    if(heroVideo.classList.contains('playing')) return;
    const id=heroVideo.dataset.yt;
    const iframe=document.createElement('iframe');
    iframe.src=`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1&modestbranding=1`;
    iframe.title='S5Online Marketing, boodschap van de oprichter';
    iframe.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';
    iframe.setAttribute('allowfullscreen','');
    heroVideo.appendChild(iframe);
    heroVideo.classList.add('playing');
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
