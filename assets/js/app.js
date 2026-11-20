(() => {
  const songs = Array.isArray(window.KAIVAZ_SONGS) ? window.KAIVAZ_SONGS : [];
  const audio = document.getElementById('audio');
  const list = document.getElementById('track-list');
  const title = document.getElementById('track-title');
  const sub = document.getElementById('track-sub');
  const play = document.getElementById('play');
  const seek = document.getElementById('seek');
  const current = document.getElementById('current-time');
  const duration = document.getElementById('duration');
  const volume = document.getElementById('volume');
  let index = -1;
  const time = value => { if (!Number.isFinite(value)) return '0:00'; const m=Math.floor(value/60); const s=Math.floor(value%60); return m+':'+String(s).padStart(2,'0'); };
  function render(){
    list.innerHTML='';
    if(!songs.length){list.innerHTML='<li class="empty">No tracks configured yet. Add them in assets/js/songs.js.</li>';return;}
    songs.forEach((song,i)=>{const li=document.createElement('li');li.className=i===index?'active':'';li.innerHTML='<span class="number">'+String(i+1).padStart(2,'0')+'</span><span class="track-name"></span><span class="track-state">'+(i===index&& !audio.paused?'PLAYING':'OPEN TRACK ↗')+'</span>';li.querySelector('.track-name').textContent=song.title;li.addEventListener('click',()=>load(i,true));list.appendChild(li);});
  }
  function load(i,autoplay){if(!songs.length)return;index=(i+songs.length)%songs.length;const song=songs[index];document.body.dataset.theme=song.theme||'messiah';audio.src='songs/'+encodeURIComponent(song.file).replace(/%2F/gi,'/');title.textContent=song.title;sub.textContent='KAIVAZ / '+(song.title==='Messiah'?'GOLD MODE':'GREEN MODE');seek.value=0;current.textContent='0:00';duration.textContent='0:00';render();if(autoplay)audio.play().then(()=>{play.textContent='Ⅱ';render();}).catch(()=>{sub.textContent='Audio file missing or unavailable: '+song.file;});}
  play.addEventListener('click',()=>{if(index<0){load(0,true);return;}if(audio.paused)audio.play().then(()=>{play.textContent='Ⅱ';render();}).catch(()=>{});else{audio.pause();play.textContent='▶';render();}});
  document.getElementById('prev').addEventListener('click',()=>load(index<=0?songs.length-1:index-1,true));
  document.getElementById('next').addEventListener('click',()=>load(index+1,true));
  audio.addEventListener('timeupdate',()=>{if(Number.isFinite(audio.duration)){seek.value=audio.currentTime/audio.duration*100;current.textContent=time(audio.currentTime);}});
  audio.addEventListener('loadedmetadata',()=>duration.textContent=time(audio.duration));
  audio.addEventListener('ended',()=>load(index+1,true));
  audio.addEventListener('error',()=>{if(index>=0)sub.textContent='Audio file missing or unavailable: '+songs[index].file;play.textContent='▶';render();});
  audio.addEventListener('pause',()=>{play.textContent='▶';render();});
  audio.addEventListener('play',()=>{play.textContent='Ⅱ';render();});
  seek.addEventListener('input',()=>{if(Number.isFinite(audio.duration))audio.currentTime=(Number(seek.value)/100)*audio.duration;});
  volume.addEventListener('input',()=>audio.volume=Number(volume.value));audio.volume=.8;
  document.body.dataset.theme='messiah';

  // Short shutter-glitch at irregular 5–7 second intervals.
  const quoteGlitch = document.querySelector('.quote .glitch-text');
  if (quoteGlitch && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const scheduleGlitch = () => {
      const delay = 5000 + Math.random() * 2000;
      window.setTimeout(() => {
        quoteGlitch.classList.remove('is-glitching');
        void quoteGlitch.offsetWidth;
        quoteGlitch.classList.add('is-glitching');
        window.setTimeout(() => quoteGlitch.classList.remove('is-glitching'), 700);
        scheduleGlitch();
      }, delay);
    };
    scheduleGlitch();
  }

  // Reveal sections as they enter the viewport. Keep everything visible if unsupported.
  const revealTargets = document.querySelectorAll(
    '.section, .quote, .project, .now-item, .upcoming-card, .player, .social-grid a'
  );
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealTargets.forEach((el, i) => {
      el.classList.add('reveal');
      el.style.setProperty('--reveal-delay', (i % 4) * 75 + 'ms');
    });
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealTargets.forEach(el => observer.observe(el));
  }

  render();
})();