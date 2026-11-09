/* Shared magic for the single page: fairy lights, falling petals,
   the scroll cursor swap and the book page-turn used when switching scenes. */
(function () {
  const colors = ['#f08c00', '#d6336c', '#13827b', '#e8961e', '#9775fa'];

  // fairy lights strung across the top
  const W = 1200, n = 26;
  let path = 'M0 8', bulbs = '';
  for (let i = 0; i <= n; i++) {
    const x = (W / n) * i, y = 8 + Math.sin(i / n * Math.PI * 4) * 4 + (i % 2 ? 18 : 10);
    path += ` Q${x - W / n / 2} ${y + 14} ${x} ${y}`;
    const c = colors[i % colors.length];
    bulbs += `<g class="bulb" style="animation-delay:${(i * 0.37) % 2.4}s"><circle cx="${x}" cy="${y + 6}" r="9" fill="${c}" opacity=".25"/><circle cx="${x}" cy="${y + 6}" r="4" fill="${c}"/></g>`;
  }
  const lights = document.createElement('div');
  lights.innerHTML = `<svg class="lights" viewBox="0 0 ${W} 70" preserveAspectRatio="none"><path d="${path}"/>${bulbs}</svg>`;
  document.body.prepend(lights.firstChild);

  // falling petals, flowers & little art bits
  const bits = ['🌼', '🌸', '✿', '❀', '🎨', '🖌️', '✨', '♡', '🌷', '⭐'];
  const box = document.createElement('div');
  box.className = 'doodles';
  for (let i = 0; i < 20; i++) {
    const d = document.createElement('span');
    d.className = 'doodle';
    d.textContent = bits[i % bits.length];
    d.style.left = Math.random() * 100 + 'vw';
    d.style.color = colors[i % colors.length];
    d.style.fontSize = (12 + Math.random() * 16) + 'px';
    d.style.animationDuration = (14 + Math.random() * 16) + 's';
    d.style.animationDelay = (-Math.random() * 30) + 's';
    box.appendChild(d);
  }
  document.body.prepend(box);

  /* book page turn: the old scene is lifted off as a "page" and turned over to the left
     (hinged on the left edge, with a soft shadow), revealing the new scene underneath */
  window.pageTurn = function (oldEl) {
    if (!oldEl || !window.gsap) return;
    oldEl.classList.add('active', 'leaving');
    const shade = document.createElement('div');
    shade.className = 'page-shade';
    oldEl.appendChild(shade);
    gsap.timeline({ onComplete: () => { oldEl.classList.remove('active', 'leaving'); shade.remove(); gsap.set(oldEl, { clearProps: 'transform,boxShadow' }); } })
      .fromTo(oldEl, { rotateY: 0, transformPerspective: 2200 }, { rotateY: -105, duration: 1.05, ease: 'power2.in' })
      .fromTo(shade, { opacity: 0 }, { opacity: .55, duration: 1.05, ease: 'power1.in' }, 0);
  };

  // the cursor itself is pure CSS (instant); this only swaps it to the palette while scrolling
  let scrollT;
  const root = document.documentElement;
  const scrolling = () => { root.classList.add('is-scroll'); clearTimeout(scrollT); scrollT = setTimeout(() => root.classList.remove('is-scroll'), 450); };
  addEventListener('wheel', scrolling, { passive: true });
  addEventListener('scroll', scrolling, { passive: true });
})();
