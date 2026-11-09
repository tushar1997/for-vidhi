/* Single-page flow: hello → us → ask → yes. Scenes swap in place with a book
   page-turn, so nothing reloads. Each scene's animations start the first time it shows. */
(function () {
  const order = ['hello', 'us', 'ask', 'yes'];
  const started = {};
  let current = null, saidYes = false;
  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);

  /* ---------- progress dots ---------- */
  const steps = document.createElement('nav');
  steps.className = 'steps';
  steps.setAttribute('aria-label', 'Scenes');
  document.body.appendChild(steps);
  function drawDots() {
    steps.innerHTML = order.slice(0, saidYes ? 4 : 3)
      .map((id, i) => `<a href="#${id}" data-scene="${id}" class="${id === current ? 'on' : ''}" aria-label="Scene ${i + 1}"></a>`).join('');
  }

  /* ---------- switching ---------- */
  function show(id) {
    if (id === current) return;
    $$('.scene').forEach(s => s.classList.toggle('active', s.id === 's-' + id));
    document.body.dataset.scene = id;
    current = id;
    scrollTo(0, 0);
    if (history.replaceState) history.replaceState(null, '', '#' + id);
    drawDots();
    const no = $('#no');
    if (no && no.parentElement === document.body) no.style.display = id === 'ask' ? '' : 'none';
    if (!started[id]) { started[id] = true; init[id](); }
    if (id !== 'hello') startPeeks();
  }
  window.goScene = function (id) {
    if (id === current) return;
    const oldEl = $('#s-' + current);
    show(id);            // the new scene is laid out underneath…
    pageTurn(oldEl);     // …while the old one turns away like a book page
  };
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-scene]');
    if (!a) return;
    e.preventDefault();
    goScene(a.dataset.scene, e.clientX, e.clientY);
  });

  /* sticker doodles round the edges (once) + the two of us peeking in */
  Doodles.scatter(['brush', 'flower', 'heart', 'palette', 'gem', 'kulhad', 'rose', 'lips', 'cat', 'marigold', 'star', 'sparkle'], 8);
  let peeking = false;
  function startPeeks() {
    if (peeking) return; peeking = true;
    Doodles.peekaboo([
      ['hi Vidhi! 👋', 'hello? 🌸'],
      ['kal free ho? 🥺', 'hmm… 🤔'],
      ['4 baje, pakka?', 'dekhte hain 😌'],
      ['bas haan bol do 🙏', 'hehe 🌼'],
    ]);
  }

  /* ---------- party-popper burst (~2.8s), then calls done() ----------
     Two poppers rise from the bottom corners, wiggle, then POP and fire confetti
     and streamers towards the middle while "YAYYY!" bounces in. */
  function poppers(done) {
    const g = document.createElement('div');
    g.id = 'poppers';
    g.setAttribute('aria-hidden', 'true');
    // a striped party-popper cone, mouth pointing up-right
    const cone = `<svg viewBox="0 0 120 120">
      <defs><clipPath id="pc"><path d="M10 112 L62 30 L92 60 Z"/></clipPath></defs>
      <path d="M10 112 L62 30 L92 60 Z" fill="#ffd43b" stroke="#3a1f2b" stroke-width="3" stroke-linejoin="round"/>
      <g clip-path="url(#pc)" stroke-width="9">
        <path d="M0 90 L60 20" stroke="#d6336c"/><path d="M10 104 L76 32" stroke="#13827b"/><path d="M24 114 L92 44" stroke="#d6336c"/><path d="M44 118 L104 56" stroke="#13827b"/>
      </g>
      <ellipse cx="77" cy="45" rx="22" ry="8" transform="rotate(45 77 45)" fill="#f08c00" stroke="#3a1f2b" stroke-width="3"/>
    </svg>`;
    g.innerHTML = `<div class="wall"></div>
      <div class="popper l">${cone}</div><div class="popper r">${cone}</div>
      <span class="bang" style="left:22vw;bottom:30vh">💥</span><span class="bang" style="right:22vw;bottom:30vh">💥</span>
      <div class="yay">YAYYY! 🎉<small>she said yes!</small></div>`;
    document.body.appendChild(g);
    const L = g.querySelector('.popper.l'), R = g.querySelector('.popper.r');

    const colors = ['#d6336c', '#f08c00', '#13827b', '#ffd43b', '#9775fa', '#f783ac', '#ffffff'];
    const pop = (power) => {
      if (typeof confetti === 'undefined') return;
      const ribbons = { shapes: ['square'], scalar: 1.6, flat: true };
      // left popper fires up-right, right popper fires up-left
      confetti({ particleCount: 120 * power, angle: 60, spread: 48, startVelocity: 70, gravity: .9, ticks: 260, origin: { x: .14, y: .78 }, colors, zIndex: 95 });
      confetti({ particleCount: 120 * power, angle: 120, spread: 48, startVelocity: 70, gravity: .9, ticks: 260, origin: { x: .86, y: .78 }, colors, zIndex: 95 });
      confetti({ particleCount: 40 * power, angle: 62, spread: 30, startVelocity: 60, origin: { x: .14, y: .78 }, colors, zIndex: 95, ...ribbons });
      confetti({ particleCount: 40 * power, angle: 118, spread: 30, startVelocity: 60, origin: { x: .86, y: .78 }, colors, zIndex: 95, ...ribbons });
    };

    gsap.timeline({ onComplete: () => { g.remove(); done(); } })
      .from(g.querySelector('.wall'), { opacity: 0, duration: .25 })
      .from(L, { y: '120%', rotate: -30, duration: .45, ease: 'back.out(1.8)' }, .05)
      .from(R, { y: '120%', rotate: 30, duration: .45, ease: 'back.out(1.8)' }, .1)
      .to([L, R], { rotate: (i) => i ? -8 : 8, duration: .07, yoyo: true, repeat: 5, ease: 'none' }, .55)   // nervous wiggle
      .to([L, R], { scale: .82, duration: .12, ease: 'power2.in' }, 1)                                       // squeeze…
      .call(() => pop(1), null, 1.12)                                                                         // …POP!
      .to([L, R], { scale: 1.12, duration: .18, ease: 'back.out(4)' }, 1.12)
      .to(g.querySelectorAll('.bang'), { opacity: 1, scale: 1.6, duration: .2, ease: 'back.out(3)' }, 1.12)
      .to(g.querySelectorAll('.bang'), { opacity: 0, duration: .3 }, 1.45)
      .to(g.querySelector('.yay'), { scale: 1, duration: .6, ease: 'elastic.out(1.1, .45)' }, 1.2)
      .call(() => pop(.6), null, 1.6)                                                                         // second burst
      .to([L, R], { y: '130%', duration: .4, ease: 'power2.in' }, 2.3)
      .to(g, { opacity: 0, duration: .45 }, 2.4);
  }

  const init = {
    /* ===================== 1 · sketchbook ===================== */
    hello() {
      mountChar('#miniV', 'vidhi', 'wave');
      $('#miniT').innerHTML = `<img class="portrait" src="${PORTRAITS.tusharAsking}" alt="Tushar, happy and a little teary, holding flowers">`;
      const lines = ['mixing some colours…', 'gathering a little courage…', 'okay, ready ♡'];
      const el = $('#lines');
      gsap.to('#wave', { y: -100, duration: 4.2, ease: 'power1.inOut' });
      gsap.to('#wave', { x: 50, duration: 1.2, repeat: -1, ease: 'none' });
      lines.forEach((t, i) => setTimeout(() => { gsap.fromTo(el, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .5 }); el.textContent = t; }, 300 + i * 1400));
      setTimeout(() => gsap.to('#intro', { scale: 1.3, opacity: 0, duration: .6, ease: 'power2.in', onComplete: showBook }), 4700);
      function showBook() {
        $('#intro').style.display = 'none';
        const w = $('#book-wrap'); w.style.display = 'block';
        gsap.from(w, { y: 120, rotate: -8, opacity: 0, duration: 1, ease: 'elastic.out(1, .6)' });
        $('#cover').classList.add('drawn');
      }
      const cover = $('#cover');
      let opened = false;
      function openBook() {
        if (opened) return; opened = true;
        gsap.to('#hint', { opacity: 0, duration: .3 });
        gsap.to(cover, { rotateY: -165, duration: 1.4, ease: 'power3.inOut', onComplete: () => cover.style.pointerEvents = 'none' });
        gsap.to(cover, { opacity: 0, delay: 1.1, duration: .3 });
        gsap.from('#s-hello .page > *', { y: 24, opacity: 0, stagger: .12, delay: .7, duration: .6, ease: 'back.out(2)' });
      }
      cover.addEventListener('click', openBook);
      cover.addEventListener('keydown', e => (e.key === 'Enter' || e.key === ' ') && openBook());
    },

    /* ===================== 2 · meet the two of us ===================== */
    us() {
      mountChar('#artV', 'vidhi', 'paint');
      mountChar('#artT', 'tushar', 'laptop');
      $$('#s-us .stat').forEach(s => s.insertAdjacentHTML('beforeend', '<span class="pct">0%</span>'));
      function fillMeters() {
        $$('#s-us .stat').forEach((s, i) => {
          const bar = s.querySelector('i'), pct = s.querySelector('.pct'), w = +bar.dataset.w, n = { v: 0 };
          gsap.fromTo(bar, { width: '0%' }, { width: w + '%', duration: 1.8, delay: i % 4 * .25, ease: 'power2.out' });
          gsap.to(n, { v: w, duration: 1.8, delay: i % 4 * .25, ease: 'power2.out', onUpdate: () => pct.textContent = Math.round(n.v) + '%' });
        });
      }
      gsap.timeline({ delay: .5 })
        .from('#s-us h1, #s-us .sub', { y: 40, opacity: 0, stagger: .15, duration: .7, ease: 'back.out(1.8)' })
        .from('#cardV', { x: -260, rotate: -18, opacity: 0, duration: 1, ease: 'elastic.out(1, .65)' }, '-=.2')
        .from('#cardT', { x: 260, rotate: 18, opacity: 0, duration: 1, ease: 'elastic.out(1, .65)' }, '<.15')
        .from('#s-us .bubble', { scale: 0, transformOrigin: 'left bottom', stagger: .2, ease: 'back.out(3)', duration: .5 })
        .call(fillMeters, null, '<')
        .from('#s-us .venn-title', { opacity: 0, y: 20, duration: .5 }, '<')
        .from('.vc', { scale: 0, transformOrigin: 'center', stagger: .3, duration: 1.1, ease: 'elastic.out(1, .5)' })
        .from('.vt', { opacity: 0, y: 14, stagger: .35, duration: .6 })
        .from('#vheart', { scale: 0, transformOrigin: '50% 50%', duration: .8, ease: 'elastic.out(1.2, .4)' })
        .to('#cta', { opacity: 1, y: -10, duration: .8 });
      gsap.to('#vheart', { scale: 1.2, transformOrigin: '50% 50%', repeat: -1, yoyo: true, duration: .55, ease: 'sine.inOut', delay: 6 });
      Doodles.note('#cardT', 'yeh main hoon 🙈', { css: 'left:-30px;top:-46px', rot: -10, delay: 2.4, side: 'left' });
      Doodles.note('#cardV', 'aur yeh tum ♡', { css: 'right:-24px;top:-46px', rot: 8, delay: 2.2 });
      $$('#s-us .card').forEach(c => {
        c.addEventListener('pointermove', e => {
          const r = c.getBoundingClientRect();
          gsap.to(c, { rotateY: ((e.clientX - r.left) / r.width - .5) * 14, rotateX: -((e.clientY - r.top) / r.height - .5) * 14, transformPerspective: 800, duration: .4 });
        });
        c.addEventListener('pointerleave', () => gsap.to(c, { rotateX: 0, rotateY: 0, duration: .6, ease: 'elastic.out(1,.5)' }));
      });
    },

    /* ===================== 3 · the question ===================== */
    ask() {
      const img = new Image();
      img.className = 'portrait'; img.alt = 'Tushar on one knee with red roses';
      img.onerror = () => mountChar('#askT', 'tushar', 'flowers');
      img.src = PORTRAITS.tusharKneeling;
      $('#askT').appendChild(img);
      mountChar('#askV', 'vidhi', 'paint');
      [PORTRAITS.hands, PORTRAITS.car].forEach(src => { new Image().src = src; });   // warm up the yes-scene pictures

      gsap.timeline({ delay: .5 })
        .from('#s-ask .easel', { y: -400, rotate: 6, duration: 1.1, ease: 'bounce.out' })
        .from('#whoT', { x: -300, opacity: 0, duration: .9, ease: 'back.out(1.4)' }, '-=.6')
        .from('#whoV', { x: 300, opacity: 0, duration: .9, ease: 'back.out(1.4)' }, '<')
        .to('#reveal', { clipPath: 'inset(0 0% 0 0)', duration: 2, ease: 'power2.inOut' })
        .from('#s-ask .event .tag', { scale: 0, rotate: -20, stagger: .2, ease: 'back.out(3)', duration: .55 }, '-=.6')
        .to('#s-ask .event .tag', { scale: 1.08, duration: .25, yoyo: true, repeat: 1, stagger: .12, ease: 'power1.inOut' })
        .from('#s-ask .choices .btn', { y: 40, opacity: 0, stagger: .12, duration: .5, ease: 'back.out(2)' })
        .call(() => { initNo(); Doodles.note('#choices', 'yeh wala dabao ✓', { css: innerWidth < 700 ? 'left:4px;top:-44px' : 'right:calc(50% + 70px);top:-34px', rot: -8 }); });
      gsap.to('#whoT > div:first-child', { rotate: 2, yoyo: true, repeat: -1, duration: .9, ease: 'sine.inOut', transformOrigin: '50% 100%' });
      gsap.to('#whoV > div:first-child', { rotate: -2, y: -4, yoyo: true, repeat: -1, duration: 1.6, ease: 'sine.inOut', transformOrigin: '50% 100%' });
      gsap.to('#yesBtn', { scale: 1.06, repeat: -1, yoyo: true, duration: .8, ease: 'sine.inOut', delay: 7 });

      /* the "No" button: always says No, glides away (like the Krati page) and can't be clicked */
      const no = $('#no'), slot = $('#noSlot');
      const FLEE_RADIUS = 130, PAD = 16;
      let ready = false, nx = 0, ny = 0;
      function initNo() {
        if (ready) return;
        const r = no.getBoundingClientRect();
        slot.style.width = r.width + 'px'; slot.style.height = r.height + 'px';
        nx = r.left; ny = r.top;
        document.body.appendChild(no);
        Object.assign(no.style, { position: 'fixed', left: nx + 'px', top: ny + 'px', margin: 0, zIndex: 60, pointerEvents: 'none', transition: 'left .45s ease-out, top .45s ease-out' });
        ready = true;
        // phones have no mouse to chase it with, so there it also wanders about by itself
        // (and still slides away whenever a finger lands near it)
        if (matchMedia('(hover: none)').matches) {
          no.style.transition = 'left .9s ease-in-out, top .9s ease-in-out';
          setInterval(() => {
            if (current !== 'ask') return;
            const w = no.offsetWidth, h = no.offsetHeight, yb = $('#yesBtn').getBoundingClientRect();
            let x, y, tries = 0;
            do {
              x = PAD + Math.random() * (innerWidth - w - PAD * 2);
              y = 80 + Math.random() * (innerHeight - h - 100);
              tries++;
            } while (tries < 20 && Math.hypot(x + w / 2 - (yb.left + yb.width / 2), y + h / 2 - (yb.top + yb.height / 2)) < 120);
            nx = x; ny = y;
            no.style.left = nx + 'px'; no.style.top = ny + 'px';
          }, 2200);
        }
      }
      function maybeFlee(px, py) {
        if (!ready || current !== 'ask') return;
        const w = no.offsetWidth, h = no.offsetHeight;
        const dx = px - (nx + w / 2), dy = py - (ny + h / 2);
        if (Math.hypot(dx, dy) >= FLEE_RADIUS) return;
        const jump = 160 + Math.random() * 100;
        const ang = Math.atan2(-dy, -dx) + (Math.random() - .5) * .8;
        let x = nx + Math.cos(ang) * jump, y = ny + Math.sin(ang) * jump;
        const maxX = innerWidth - w - PAD, maxY = innerHeight - h - PAD;
        x = Math.max(PAD, Math.min(maxX, x));
        y = Math.max(70, Math.min(maxY, y));
        if (Math.hypot(px - (x + w / 2), py - (y + h / 2)) < FLEE_RADIUS) {
          x = px < innerWidth / 2 ? Math.min(maxX, px + FLEE_RADIUS + 60) : Math.max(PAD, px - FLEE_RADIUS - 60 - w);
          y = py < innerHeight / 2 ? Math.min(maxY, py + FLEE_RADIUS) : Math.max(70, py - FLEE_RADIUS - h);
        }
        nx = x; ny = y;
        no.style.left = nx + 'px'; no.style.top = ny + 'px';
        gsap.fromTo('#sweat', { opacity: 1, y: 0 }, { opacity: 0, y: 30, duration: .8 });
      }
      addEventListener('pointermove', e => maybeFlee(e.clientX, e.clientY), { passive: true });
      addEventListener('pointerdown', e => maybeFlee(e.clientX, e.clientY));
      addEventListener('touchstart', e => { const t = e.touches[0]; maybeFlee(t.clientX, t.clientY); }, { passive: true });
      no.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); });
      addEventListener('resize', () => {
        if (!ready) return;
        nx = Math.min(nx, innerWidth - no.offsetWidth - PAD); ny = Math.min(ny, innerHeight - no.offsetHeight - PAD);
        no.style.left = nx + 'px'; no.style.top = ny + 'px';
      });
      $('#yesBtn').addEventListener('click', e => { saidYes = true; goScene('yes', e.clientX, e.clientY); });
    },

    /* ===================== 4 · she said yes ===================== */
    yes() {
      saidYes = true; drawDots();
      if (window.Music) Music.dilkashi();   // jump to the "dilkashi" stanza (1:48 → end)
      $('#hands').src = PORTRAITS.hands;
      gsap.set('#photo', { opacity: 0 });
      $('#car').innerHTML = Doodles.car();
      const colors = ['#d6336c', '#f08c00', '#13827b', '#ffd43b', '#9775fa', '#f783ac'];
      const shapes = (typeof confetti !== 'undefined' && confetti.shapeFromText)
        ? ['🌹', '💖', '🎨', '🌸', '✨'].map(t => confetti.shapeFromText({ text: t, scalar: 2 })) : undefined;
      function party() {
        if (typeof confetti === 'undefined') return;
        const end = Date.now() + 2000;
        (function frame() {
          confetti({ particleCount: 6, angle: 60, spread: 70, origin: { x: 0, y: .7 }, colors });
          confetti({ particleCount: 6, angle: 120, spread: 70, origin: { x: 1, y: .7 }, colors });
          if (Date.now() < end) requestAnimationFrame(frame);
        })();
        if (shapes) confetti({ particleCount: 36, spread: 120, startVelocity: 38, origin: { y: .3 }, shapes, scalar: 2 });
      }
      $('#again').onclick = party;

      /* 1) the picture opens big & zoomed-in, zooms out for 3s
         2) then it shrinks into its small polaroid spot
         3) the ticket slides in, then the car road zooms in and the car loops */
      const photo = $('#photo'), road = $('#s-yes .road'), carEl = $('#car');
      const later = ['#ticket', '#plan', '#s-yes .actions'];
      gsap.set(later, { opacity: 0 });
      gsap.set(road, { opacity: 0, scale: .4 });
      const start = () => {
        const r = photo.getBoundingClientRect();
        const big = Math.min(innerWidth * .9 / r.width, innerHeight * .78 / r.height);
        gsap.set(photo, { x: innerWidth / 2 - (r.left + r.width / 2), y: innerHeight / 2 - (r.top + r.height / 2) + 20, scale: big, rotate: 0, transformOrigin: '50% 50%' });
        gsap.set('#hands', { scale: 1.45 });
        gsap.timeline()
          .to(photo, { opacity: 1, duration: .6 })
          .to('#hands', { scale: 1, duration: 3, ease: 'power1.inOut' }, 0)
          .to(photo, { x: 0, y: 0, scale: 1, rotate: -2, duration: 1, ease: 'power3.inOut' }, 3)
          .to('#ticket', { opacity: 1, duration: .1 }, '-=.3')
          .from('#ticket', { x: 80, duration: .7, ease: 'power3.out' }, '<')
          .from('#s-yes .event .tag', { scale: 0, rotate: -20, stagger: .15, duration: .5, ease: 'back.out(3)' }, '-=.3')
          .to('#plan', { opacity: 1, duration: .5 })
          .to('#s-yes .actions', { opacity: 1, duration: .1 }, '<')
          .from('#s-yes .actions .btn', { scale: 0, stagger: .1, ease: 'back.out(3)', duration: .4 }, '<')
          .to(road, { opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.5)' }, '-=.2')
          .call(() => {
            // the white car faces left, so it drives in from the right, on a loop
            gsap.fromTo(carEl, { x: () => road.clientWidth + 20 }, { x: () => -carEl.offsetWidth - 20, duration: 7, ease: 'none', repeat: -1, repeatDelay: .6, invalidateOnRefresh: true });
            gsap.to('#car > *', { y: -4, repeat: -1, yoyo: true, duration: .18 });
            gsap.to(photo, { rotate: 1, y: -5, duration: 2.4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
          });
      };
      // party poppers first, then (once the picture has loaded) the zoom sequence
      const img = $('#hands');
      poppers(() => {
        if (img.complete && img.naturalWidth) requestAnimationFrame(start); else img.addEventListener('load', () => requestAnimationFrame(start), { once: true });
      });

      const target = new Date('2026-11-10T16:00:00+05:30').getTime();
      const cEl = $('#count');
      function tick() {
        let s = Math.max(0, Math.floor((target - Date.now()) / 1000));
        if (s === 0) { cEl.innerHTML = '<div style="flex:1"><b>it\'s date time 💖</b></div>'; return; }
        const d = Math.floor(s / 86400); s %= 86400;
        const h = Math.floor(s / 3600); s %= 3600;
        const m = Math.floor(s / 60); s %= 60;
        cEl.innerHTML = [[d, 'days'], [h, 'hrs'], [m, 'min'], [s, 'sec']]
          .map(([v, u]) => `<div><b>${String(v).padStart(2, '0')}</b><small>${u}</small></div>`).join('');
      }
      tick(); setInterval(tick, 1000);

      $('#cal').onclick = () => {
        const ics = [
          'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//for-vidhi//EN', 'BEGIN:VEVENT',
          'UID:date-001-vidhi-tushar', 'DTSTAMP:20261109T000000Z',
          'DTSTART:20261110T103000Z', 'DTEND:20261110T143000Z',
          'SUMMARY:Date with Tushar 💖', 'DESCRIPTION:Tushar will pick you up from your place at 4 PM.',
          'BEGIN:VALARM', 'TRIGGER:-PT1H', 'ACTION:DISPLAY', 'DESCRIPTION:Date in 1 hour!', 'END:VALARM',
          'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
        a.download = 'date-with-tushar.ics';
        a.click();
      };
      $('#wa').href = 'https://wa.me/?text=' + encodeURIComponent('YES! 🌹💖 See you tomorrow at 4 PM, Tushar.');
    },
  };

  // start on the scene in the address (handy for testing); otherwise show the envelope,
  // whose tap also starts the song with sound, then open the sketchbook
  const start = location.hash.slice(1), gate = $('#gate');
  if (order.includes(start) && start !== 'hello') { gate.remove(); show(start); }
  else {
    let opened = false;
    const open = () => {
      if (opened) return; opened = true;
      gate.classList.add('open');
      setTimeout(() => gsap.to(gate, { opacity: 0, scale: 1.08, duration: .5, onComplete: () => { gate.remove(); show('hello'); } }), 900);
    };
    gate.addEventListener('click', open);
    gate.addEventListener('keydown', e => (e.key === 'Enter' || e.key === ' ') && open());
    gate.focus();
  }
})();
