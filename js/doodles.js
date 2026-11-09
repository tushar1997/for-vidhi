/* Hand-drawn cartoon doodles + peeking caricature heads.
   Doodles "boil" (wobble like hand-drawn animation) via an SVG turbulence filter. */
(function () {
  /* Style nod to @neha.doodles: thin wobbly black ink, flat muted fills,
     die-cut "sticker" edges and little handwritten Hinglish notes. */
  const C = { rose: '#f28fb0', mari: '#e8a33d', gold: '#f0c75e', sage: '#7fb59a', lilac: '#b79cf2', cream: '#fff8ee', ink: '#1e1420', teal: '#5f9ea0', terra: '#b9653e' };
  const O = C.ink;
  const S = 'stroke-linecap="round" stroke-linejoin="round"';

  const lib = {
    brush: `<g ${S}><path d="M18 82 L62 30" stroke="${C.mari}" stroke-width="9"/><path d="M60 32 l10 -10 l8 8 l-10 10 Z" fill="#c9ccd4" stroke="${O}" stroke-width="2"/><path d="M70 22 Q84 4 92 8 Q90 18 78 30 Z" fill="${C.rose}" stroke="${O}" stroke-width="2.4"/></g>`,
    tube: `<g ${S}><path d="M20 40 L70 30 L78 62 L28 74 Z" fill="${C.lilac}" stroke="${O}" stroke-width="2.6"/><path d="M70 30 l14 -2 l4 18 l-12 4" fill="#c9ccd4" stroke="${O}" stroke-width="2.6"/><path d="M88 44 q10 4 6 16 q-4 10 4 18" fill="none" stroke="${C.lilac}" stroke-width="6"/><path d="M34 50 L62 44" stroke="${O}" stroke-width="2.6"/></g>`,
    palette: `<g ${S}><path d="M14 56 Q8 20 50 16 Q90 14 92 46 Q94 66 74 62 Q62 60 66 74 Q70 88 44 88 Q18 88 14 56 Z" fill="#f0d4ac" stroke="${O}" stroke-width="2.6"/><circle cx="34" cy="38" r="7" fill="${C.rose}"/><circle cx="54" cy="30" r="7" fill="${C.mari}"/><circle cx="74" cy="38" r="7" fill="${C.sage}"/><circle cx="30" cy="62" r="7" fill="${C.lilac}"/></g>`,
    pencil: `<g ${S}><path d="M14 80 L22 60 L70 12 L88 30 L40 78 Z" fill="${C.gold}" stroke="${O}" stroke-width="2.6"/><path d="M14 80 L22 60 L34 72 Z" fill="#f0d4ac"/><path d="M14 80 l3 -8 l5 5 Z" fill="${C.ink}"/><path d="M70 12 L88 30" stroke="${C.rose}" stroke-width="8"/></g>`,
    flower: `<g ${S}><path d="M50 90 Q46 70 50 52" stroke="${C.sage}" stroke-width="4" fill="none"/><path d="M50 72 Q30 64 30 52 Q44 56 50 70" fill="${C.sage}"/>${[0, 72, 144, 216, 288].map(a => `<ellipse cx="50" cy="28" rx="10" ry="16" fill="${C.mari}" stroke="${O}" stroke-width="2" transform="rotate(${a} 50 42)"/>`).join('')}<circle cx="50" cy="42" r="9" fill="${C.rose}" stroke="${O}" stroke-width="2"/></g>`,
    marigold: `<g>${Array.from({ length: 14 }, (_, i) => `<circle cx="${50 + Math.cos(i) * (i % 3 ? 22 : 12)}" cy="${50 + Math.sin(i) * (i % 3 ? 22 : 12)}" r="${i % 3 ? 11 : 13}" fill="${i % 2 ? C.mari : '#f58a1f'}" stroke="${C.cream}" stroke-width="1.5"/>`).join('')}<circle cx="50" cy="50" r="10" fill="${C.gold}"/></g>`,
    heart: `<path d="M50 86 C14 62 8 36 24 24 C36 14 48 22 50 32 C52 22 64 14 76 24 C92 36 86 62 50 86 Z" fill="${C.rose}" stroke="${O}" stroke-width="2.6" ${S}/><path d="M30 34 q4 -6 10 -6" stroke="${O}" stroke-width="2.6" fill="none" ${S}/>`,
    star: `<path d="M50 10 L60 38 L90 40 L66 58 L74 88 L50 70 L26 88 L34 58 L10 40 L40 38 Z" fill="${C.gold}" stroke="${O}" stroke-width="2.6" ${S}/>`,
    swirl: `<path d="M50 50 m0 -4 a4 4 0 1 1 -4 4 a10 10 0 1 1 10 10 a18 18 0 1 1 -18 -18 a28 28 0 1 1 28 28" fill="none" stroke="${C.lilac}" stroke-width="4" ${S}/>`,
    cup: `<g ${S}><path d="M22 40 L78 40 L72 84 Q50 92 28 84 Z" fill="${C.cream}" stroke="${C.mari}" stroke-width="3"/><path d="M78 50 q16 0 12 14 q-4 10 -16 8" fill="none" stroke="${C.mari}" stroke-width="4"/><path d="M40 30 q-6 -10 2 -18 M54 30 q-6 -10 2 -18" fill="none" stroke="${O}" stroke-width="2.6" opacity=".8"/><path d="M42 62 C34 56 36 48 42 50 C46 50 47 54 48 55 C49 54 50 50 54 50 C60 48 62 56 54 62 L48 68 Z" fill="${C.rose}"/></g>`,
    sparkle: `<path d="M50 8 Q54 46 92 50 Q54 54 50 92 Q46 54 8 50 Q46 46 50 8 Z" fill="${C.gold}" ${S}/>`,
    lips: `<g ${S}><path d="M10 50 Q30 26 50 38 Q70 26 90 50 Q70 80 50 78 Q30 80 10 50 Z" fill="#d8344c" stroke="${O}" stroke-width="2.6"/><path d="M14 50 Q50 58 86 50" fill="none" stroke="${O}" stroke-width="2.4"/><path d="M28 62 Q50 70 72 62 L66 56 Q50 60 34 56 Z" fill="#fff"/></g>`,
    gem: `<g ${S}><path d="M50 12 L84 36 L72 84 L28 84 L16 36 Z" fill="${C.sage}" stroke="${O}" stroke-width="2.6"/><path d="M16 36 L50 50 L84 36 M50 12 L50 50 L28 84 M50 50 L72 84" fill="none" stroke="${O}" stroke-width="2"/><path d="M8 18 l6 4 M14 8 l2 7 M92 18 l-6 4" stroke="${O}" stroke-width="2.4"/></g>`,
    kulhad: `<g ${S}><path d="M26 38 L74 38 L66 86 Q50 92 34 86 Z" fill="${C.terra}" stroke="${O}" stroke-width="2.6"/><ellipse cx="50" cy="38" rx="24" ry="6" fill="#d9a066" stroke="${O}" stroke-width="2.4"/><path d="M40 28 q-6 -8 2 -16 M54 28 q-6 -8 2 -16" fill="none" stroke="${O}" stroke-width="2" opacity=".7"/><path d="M34 56 Q50 62 66 56" fill="none" stroke="${O}" stroke-width="1.8"/></g>`,
    cat: `<g ${S}><path d="M22 86 Q18 56 30 46 L26 22 L42 36 Q50 33 58 36 L74 22 L70 46 Q82 56 78 86 Z" fill="${C.cream}" stroke="${O}" stroke-width="2.6"/><circle cx="41" cy="54" r="2.6" fill="${O}"/><circle cx="59" cy="54" r="2.6" fill="${O}"/><path d="M46 62 q4 4 8 0 M38 64 l-12 -2 M38 68 l-12 2 M62 64 l12 -2 M62 68 l12 2" fill="none" stroke="${O}" stroke-width="1.8"/><path d="M78 80 q14 -4 12 -20" fill="none" stroke="${O}" stroke-width="2.6"/></g>`,
    rose: `<g ${S}><path d="M50 92 Q48 70 50 56" stroke="${C.sage}" stroke-width="4" fill="none"/><path d="M50 74 q16 -8 20 -18 q-14 2 -20 14" fill="${C.sage}"/><circle cx="50" cy="40" r="22" fill="#d81f2a" stroke="${O}" stroke-width="2.4"/><path d="M38 40 Q50 24 62 40 Q50 52 38 40 Z M44 44 Q50 34 56 44" fill="none" stroke="#7d0d16" stroke-width="2.5"/></g>`,
  };

  function boilFilter() {
    if (document.getElementById('boil')) return;
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('width', 0); s.setAttribute('height', 0); s.style.position = 'absolute';
    // static hand-drawn wobble (animating the seed re-rendered every sticker 8×/s and made the page sluggish)
    s.innerHTML = `<filter id="boil"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="3"/>
      <feDisplacementMap in="SourceGraphic" scale="3.5"/></filter>`;
    document.body.appendChild(s);
  }

  function svg(name, size) {
    return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" style="filter:url(#boil);overflow:visible">${lib[name]}</svg>`;
  }

  /* scatter doodles along the edges of the page, away from the content */
  function scatter(names, count) {
    boilFilter();
    const layer = document.createElement('div');
    layer.className = 'doodle-layer';
    layer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:2;overflow:hidden';
    const small = innerWidth < 700;
    const n = small ? Math.ceil(count / 2) : count;
    for (let i = 0; i < n; i++) {
      const d = document.createElement('div');
      const size = (small ? 38 : 54) + Math.random() * (small ? 18 : 34);
      const left = i % 2 ? 88 + Math.random() * 8 : 1 + Math.random() * 8;
      const top = 10 + (i / n) * 80 + Math.random() * 6;
      d.className = 'sticker';
      d.style.cssText = `position:absolute;left:${left}vw;top:${top}vh;transform:rotate(${(Math.random() - .5) * 40}deg)`;
      d.innerHTML = svg(names[i % names.length], size);
      layer.appendChild(d);
      if (window.gsap) {
        gsap.from(d, { scale: 0, rotate: -90, duration: .9, delay: .4 + i * .08, ease: 'back.out(2)' });
        gsap.to(d.firstChild, { y: -10 - Math.random() * 10, rotate: (Math.random() - .5) * 20, repeat: -1, yoyo: true, duration: 2 + Math.random() * 2, ease: 'sine.inOut' });
      }
    }
    document.body.appendChild(layer);
  }

  /* just the head of a caricature, cropped from the full drawing */
  function head(who, attrs = '') {
    if (window.PORTRAITS && PORTRAITS[who]) return `<img class="portrait head" src="${PORTRAITS[who]}" alt="">`;
    const full = (who === 'vidhi' ? vidhiSVG : tusharSVG)({ pose: 'none' });
    const crop = who === 'vidhi' ? '44 22 212 236' : '58 -2 184 262';
    return full.replace(/<svg class="char ([^"]+)" viewBox="0 0 300 430"/, `<svg class="char $1 head" viewBox="${crop}" ${attrs}`);
  }

  /* the two of them take turns peeking up from the bottom corners */
  function peekaboo(lines) {
    const mk = (who, side) => {
      const el = document.createElement('div');
      el.className = 'peek';
      el.dataset.side = side;
      // sits a little above the bottom edge so it clears the Windows taskbar / phone home bar
      el.style.cssText = `position:fixed;bottom:${innerWidth < 700 ? 8 : 18}px;${side}:${innerWidth < 700 ? 8 : 26}px;width:${innerWidth < 700 ? 86 : 140}px;z-index:40;transform:translateY(105%);cursor:pointer`;
      el.innerHTML = head(who) + `<div class="peek-bubble" style="position:absolute;bottom:92%;${side === 'left' ? 'left:60%' : 'right:60%'};background:#fff;color:#2a1626;border-radius:14px;padding:4px 10px;font:700 1.15rem 'Caveat',cursive;white-space:nowrap;opacity:0;box-shadow:0 6px 14px -6px rgba(0,0,0,.5)"></div>`;
      document.body.appendChild(el);
      return el;
    };
    const t = mk('tushar', 'left'), v = mk('vidhi', 'right');
    const say = (el, text) => {
      const b = el.querySelector('.peek-bubble'); b.textContent = text;
      gsap.fromTo(b, { opacity: 0, y: 8, scale: .6 }, { opacity: 1, y: 0, scale: 1, duration: .35, ease: 'back.out(3)' });
      gsap.to(b, { opacity: 0, delay: 2.2, duration: .3 });
    };
    // both rise once and stay up; they just take turns talking (with a little hop)
    gsap.to(t, { y: '6%', rotate: 6, duration: .8, ease: 'back.out(1.6)', delay: 1.2 });
    gsap.to(v, { y: '6%', rotate: -6, duration: .8, ease: 'back.out(1.6)', delay: 1.6 });
    [t, v].forEach((el, k) => gsap.to(el.firstElementChild, { y: -5, duration: 1.4 + k * .3, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2.4 }));
    let i = 0;
    function cycle() {
      const el = i % 2 ? v : t;
      const line = lines[(i >> 1) % lines.length][i % 2];
      gsap.fromTo(el, { y: '6%' }, { y: '0%', duration: .25, yoyo: true, repeat: 1, ease: 'power1.out' });
      say(el, line);
      i++;
      setTimeout(cycle, 3200);
    }
    setTimeout(cycle, 2600);
    [t, v].forEach(el => el.addEventListener('click', () => { gsap.fromTo(el, { y: '6%' }, { y: '0%', duration: .25, yoyo: true, repeat: 1 }); say(el, el === v ? 'hehe 🌸' : 'hi! 👋'); }));
  }

  /* cartoon car with both of them in the windows */
  function car() {
    if (window.PORTRAITS && PORTRAITS.car) return `<img class="portrait" src="${PORTRAITS.car}" alt="Tushar driving Vidhi in a pink car">`;
    return `<svg viewBox="0 0 240 130" style="width:100%;overflow:visible">
      <path d="M66 40 L184 40 L190 66 L58 66 Z" fill="#ffe9f0"/>
      ${head('tushar', 'x="70" y="18" width="46" height="54"')}
      ${head('vidhi', 'x="130" y="20" width="48" height="52"')}
      <path fill-rule="evenodd" d="M14 92 Q10 70 34 66 L62 40 Q74 28 96 28 L150 28 Q170 28 182 42 L204 66 Q230 70 228 92 Z
               M70 46 Q78 36 96 36 L118 36 L118 64 L60 64 Z M126 36 L150 36 Q164 36 172 46 L188 64 L126 64 Z"
            fill="${C.rose}" stroke="${O}" stroke-width="2.6" stroke-linejoin="round"/>
      <circle cx="218" cy="80" r="5" fill="${C.gold}"/>
      <path d="M100 4 C92 -2 92 -10 98 -10 C101 -10 102 -7 103 -6 C104 -7 105 -10 108 -10 C114 -10 114 -2 106 4 L103 7 Z" fill="${C.rose}" transform="translate(16 14)"/>
      <g><circle cx="62" cy="96" r="18" fill="${C.ink}" stroke="${O}" stroke-width="2.6"/><circle cx="62" cy="96" r="7" fill="${C.gold}"/></g>
      <g><circle cx="182" cy="96" r="18" fill="${C.ink}" stroke="${O}" stroke-width="2.6"/><circle cx="182" cy="96" r="7" fill="${C.gold}"/></g>
      <path d="M0 78 q-10 2 -20 0 M2 88 q-14 2 -26 0" stroke="${O}" stroke-width="2.6" stroke-linecap="round" opacity=".6"/>
    </svg>`;
  }

  /* handwritten note with a wobbly arrow, pinned next to an element */
  function note(target, text, o = {}) {
    if (typeof target === 'string') target = document.querySelector(target);
    if (!target) return;
    boilFilter();
    const n = document.createElement('div');
    n.className = 'hand-note';
    const flip = o.side === 'left';
    n.innerHTML = `<span>${text}</span><svg viewBox="0 0 80 50" width="64" height="40" style="filter:url(#boil);${flip ? 'transform:scaleX(-1)' : ''}">
      <path d="M6 8 Q40 4 62 36 M62 36 l-12 -2 M62 36 l0 -12" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>`;
    n.style.cssText = `position:absolute;${o.css || ''};display:flex;flex-direction:${flip ? 'row-reverse' : 'row'};align-items:flex-start;gap:2px;pointer-events:none;z-index:25;transform:rotate(${o.rot || -6}deg)`;
    target.style.position = target.style.position || 'relative';
    target.appendChild(n);
    if (window.gsap) gsap.from(n, { opacity: 0, scale: .6, duration: .6, delay: o.delay || 0, ease: 'back.out(2)' });
    return n;
  }

  window.Doodles = { lib, svg, scatter, head, peekaboo, car, note };
})();
