/* Hand-built SVG caricatures of Vidhi & Tushar, drawn from their photos.
   Vidhi: round soft face, long straight centre-parted hair with brown ends,
          huge open smile, smiling eyes, chandbali earrings, black ruffled saree.
   Tushar: oval face, tall swept-up quiff, thick brows, light stubble,
           soft closed-lip smile, stud earring, black embroidered kurta.      */

let _uid = 0;
const SKIN_V = '#f6cdb0', SKIN_V_SH = '#e8a98a', SKIN_V_DEEP = '#d98f72';
const SKIN_T = '#f2c7a4', SKIN_T_SH = '#dda483', SKIN_T_DEEP = '#c98b6b';

function eye(cx, cy, skin, shade, o = {}) {
  const id = 'ec' + (++_uid);
  const w = o.w || 15, top = o.top || 13, bot = o.bot || 8;
  const shape = `M${cx - w} ${cy} Q${cx} ${cy - top} ${cx + w} ${cy} Q${cx} ${cy + bot} ${cx - w} ${cy} Z`;
  return `
  <g class="eye">
    <clipPath id="${id}"><path d="${shape}"/></clipPath>
    <path d="${shape}" fill="#fffaf5"/>
    <g clip-path="url(#${id})">
      <g class="pupil">
        <circle cx="${cx}" cy="${cy - 1}" r="${o.iris || 7.5}" fill="${o.irisColor || '#5a3220'}"/>
        <circle cx="${cx}" cy="${cy - 1}" r="${(o.iris || 7.5) * .52}" fill="#140a07"/>
        <circle cx="${cx + 2.6}" cy="${cy - 3.6}" r="2.3" fill="#fff"/>
      </g>
      <rect class="lid" x="${cx - w - 2}" y="${cy - top - 2}" width="${w * 2 + 4}" height="${top + bot + 4}" fill="${skin}"/>
    </g>
    <path d="M${cx - w - 1} ${cy + 1} Q${cx} ${cy - top - 1} ${cx + w + 1} ${cy - 1}" fill="none" stroke="#1d1012" stroke-width="${o.liner || 2.6}" stroke-linecap="round"/>
    ${o.lash ? `<path d="M${o.flip ? cx - w - 1 : cx + w + 1} ${cy - 1} l${o.flip ? -6 : 6} -4" stroke="#1d1012" stroke-width="2.4" stroke-linecap="round"/>` : ''}
    <path d="M${cx - w + 4} ${cy + bot + 3} Q${cx} ${cy + bot + 7} ${cx + w - 4} ${cy + bot + 3}" fill="none" stroke="${shade}" stroke-width="2" stroke-linecap="round"/>
    <path d="M${cx - w + 3} ${cy - top + 1} Q${cx} ${cy - top - 6} ${cx + w - 3} ${cy - top + 1}" fill="none" stroke="${shade}" stroke-width="1.6" stroke-linecap="round" opacity=".7"/>
  </g>`;
}

window.vidhiSVG = function (opts = {}) {
  const pose = opts.pose || 'paint'; // paint | wave | none
  const g = 'vh' + (++_uid);
  return `
<svg class="char char-vidhi" viewBox="0 0 300 430" xmlns="http://www.w3.org/2000/svg" aria-label="Cartoon of Vidhi">
  <defs>
    <linearGradient id="${g}h" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#24140f"/><stop offset=".45" stop-color="#3d2218"/><stop offset=".8" stop-color="#6e4027"/><stop offset="1" stop-color="#9a6238"/>
    </linearGradient>
    <linearGradient id="${g}g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f7dc8c"/><stop offset="1" stop-color="#b8862e"/>
    </linearGradient>
    <radialGradient id="${g}f" cx=".5" cy=".42" r=".6">
      <stop offset=".7" stop-color="${SKIN_V}"/><stop offset="1" stop-color="${SKIN_V_SH}"/>
    </radialGradient>
  </defs>

  <!-- long straight hair (back) -->
  <g class="hair-sway">
    <path d="M58 150 Q52 38 150 30 Q248 38 242 150 L262 352 Q236 376 204 364 L196 300 L104 300 L96 364 Q64 376 38 352 Z" fill="url(#${g}h)"/>
    <path d="M62 210 Q56 290 60 350 M240 210 Q246 290 242 350 M80 250 L78 362 M222 250 L224 362" stroke="#a4683e" stroke-width="2.5" opacity=".5" stroke-linecap="round" fill="none"/>
  </g>

  <!-- neck -->
  <path d="M128 232 L128 290 Q150 302 172 290 L172 232 Z" fill="${SKIN_V_SH}"/>
  <path d="M128 250 Q150 266 172 250 L172 236 L128 236 Z" fill="${SKIN_V_DEEP}" opacity=".45"/>

  <!-- magenta sleeveless blouse + mauve silk saree with gold zari border (from her photos) -->
  <path d="M62 334 Q72 294 116 284 L150 330 L184 284 Q228 294 238 334 L254 430 L46 430 Z" fill="#c4177f"/>
  <path d="M116 284 L150 330 L184 284 Q166 292 150 300 Q134 292 116 284 Z" fill="${SKIN_V_SH}"/>
  <path d="M70 396 Q150 410 230 396" fill="none" stroke="#f1c76b" stroke-width="3" stroke-dasharray="2 4"/>
  <path d="M176 282 Q226 290 242 338 L224 430 L100 430 Q150 360 176 282 Z" fill="#b9a2b8"/>
  <path d="M176 282 Q150 360 100 430 L124 430 Q168 362 190 286 Z" fill="url(#${g}g)"/>
  <path d="M184 288 Q166 360 120 430" fill="none" stroke="#8a5e1e" stroke-width="1.6" stroke-dasharray="3 3"/>
  <path d="M196 300 Q206 360 196 430 M214 306 Q222 360 214 430" fill="none" stroke="#d4c1d2" stroke-width="2" opacity=".7"/>

  <!-- face: round & soft with full cheeks -->
  <path d="M70 152 Q70 68 150 66 Q230 68 230 152 Q230 214 198 238 Q174 256 150 256 Q126 256 102 238 Q70 214 70 152 Z" fill="url(#${g}f)"/>

  <!-- front hair: middle parting, framing the forehead, strands in front of shoulders -->
  <path d="M150 50 Q92 52 72 112 Q64 146 66 196 Q72 148 90 120 Q114 82 150 72 Z" fill="url(#${g}h)"/>
  <path d="M150 50 Q208 52 228 112 Q236 146 234 196 Q228 148 210 120 Q186 82 150 72 Z" fill="url(#${g}h)"/>
  <path d="M68 160 Q58 240 66 334 L86 340 Q78 250 80 190 Z" fill="url(#${g}h)"/>
  <path d="M232 160 Q242 240 234 334 L214 340 Q222 250 220 190 Z" fill="url(#${g}h)"/>
  <path d="M150 50 L150 72" stroke="#7a4a30" stroke-width="2"/>
  <path d="M136 56 Q104 70 86 112 M164 56 Q196 70 214 112" stroke="#5a3424" stroke-width="2" fill="none" opacity=".7"/>

  <!-- chandbali earrings peeking under the hair -->
  <g class="earring" style="transform-origin:80px 196px">
    <circle cx="80" cy="198" r="3.5" fill="url(#${g}g)"/>
    <path d="M66 206 Q80 232 94 206 Q80 216 66 206 Z" fill="url(#${g}g)" stroke="#9b6b1c" stroke-width="1.2"/>
    <circle cx="72" cy="224" r="2.6" fill="#e2306c"/><circle cx="80" cy="229" r="2.6" fill="#e2306c"/><circle cx="88" cy="224" r="2.6" fill="#e2306c"/>
  </g>
  <g class="earring" style="transform-origin:220px 196px">
    <circle cx="220" cy="198" r="3.5" fill="url(#${g}g)"/>
    <path d="M206 206 Q220 232 234 206 Q220 216 206 206 Z" fill="url(#${g}g)" stroke="#9b6b1c" stroke-width="1.2"/>
    <circle cx="212" cy="224" r="2.6" fill="#e2306c"/><circle cx="220" cy="229" r="2.6" fill="#e2306c"/><circle cx="228" cy="224" r="2.6" fill="#e2306c"/>
  </g>

  <!-- red rose tucked into her hair -->
  <g transform="translate(84 112)">
    <circle r="13" fill="#d81f2a"/><path d="M-8 -2 Q0 -12 8 -2 Q0 6 -8 -2 Z M-5 4 Q0 -4 6 4" fill="none" stroke="#8e0f18" stroke-width="2"/>
    <path d="M10 6 q10 2 12 10 q-10 0 -12 -10 Z" fill="#3d7d46"/>
  </g>
  <!-- full, defined brows -->
  <path d="M98 132 Q114 114 140 124 Q138 128 134 128 Q116 122 102 134 Z" fill="#24140f" stroke="#24140f" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M202 132 Q186 114 160 124 Q162 128 166 128 Q184 122 198 134 Z" fill="#24140f" stroke="#24140f" stroke-width="2.5" stroke-linejoin="round"/>
  <!-- little red bindi -->
  <circle cx="150" cy="128" r="3.4" fill="#d81f2a"/>
  ${eye(120, 154, SKIN_V, SKIN_V_SH, { lash: true, flip: true, w: 17, top: 17, bot: 9, liner: 3.2, iris: 9, irisColor: '#6e5a32' })}
  ${eye(180, 154, SKIN_V, SKIN_V_SH, { lash: true, w: 17, top: 17, bot: 9, liner: 3.2, iris: 9, irisColor: '#6e5a32' })}

  <!-- small soft nose + tiny nose stud -->
  <path d="M146 166 Q143 180 150 182 Q156 182 158 178" fill="none" stroke="${SKIN_V_DEEP}" stroke-width="2.6" stroke-linecap="round"/>
  <circle cx="160" cy="177" r="1.8" fill="#fff" stroke="#c9c9d6" stroke-width=".8"/>
  <!-- round apple cheeks -->
  <ellipse cx="102" cy="190" rx="17" ry="12" fill="#ff8aa0" opacity=".38"/>
  <ellipse cx="198" cy="190" rx="17" ry="12" fill="#ff8aa0" opacity=".38"/>
  <!-- her signature big open smile -->
  <path d="M108 198 Q150 250 192 198 Q150 210 108 198 Z" fill="#8e1f38"/>
  <path d="M112 200 Q150 211 188 200 L183 210 Q150 220 117 210 Z" fill="#fff"/>
  <path d="M130 228 Q150 238 170 228 Q150 232 130 228 Z" fill="#e2647a"/>
  <path d="M106 196 Q150 212 194 196" fill="none" stroke="#c4475f" stroke-width="3" stroke-linecap="round"/>
  <path d="M104 194 q-4 2 -4 6 M196 194 q4 2 4 6" fill="none" stroke="${SKIN_V_DEEP}" stroke-width="2" stroke-linecap="round"/>

  ${pose === 'paint' ? `
  <g class="prop-palette">
    <path d="M18 362 Q8 320 58 312 Q108 308 114 342 Q118 366 94 364 Q80 362 84 378 Q88 398 56 398 Q24 398 18 362 Z" fill="#f0d4ac" stroke="#8a6238" stroke-width="2.5"/>
    <circle cx="42" cy="336" r="7" fill="#ff6f91"/><circle cx="64" cy="328" r="7" fill="#f6a43a"/>
    <circle cx="88" cy="334" r="7" fill="#7cc6a4"/><circle cx="36" cy="362" r="7" fill="#7b6cf6"/>
    <circle cx="58" cy="380" r="6" fill="#f1c76b"/>
  </g>
  <g class="prop-brush">
    <g transform="rotate(-25 236 305)">
      <rect x="232" y="250" width="8" height="110" rx="4" fill="#c0392b"/>
      <rect x="230" y="236" width="12" height="16" fill="#c9ccd4"/>
      <path d="M231 236 Q236 206 241 236 Z" fill="#ff6f91"/>
    </g>
    <circle cx="212" cy="352" r="12" fill="${SKIN_V}"/>
  </g>` : ''}
  ${pose === 'wave' ? `
  <g class="prop-wave"><path d="M232 334 Q262 294 268 254" stroke="${SKIN_V}" stroke-width="18" stroke-linecap="round" fill="none"/>
  <circle cx="270" cy="246" r="14" fill="${SKIN_V}"/></g>` : ''}
</svg>`;
};

window.tusharSVG = function (opts = {}) {
  const pose = opts.pose || 'flowers'; // flowers | laptop | none
  const g = 'th' + (++_uid);
  return `
<svg class="char char-tushar" viewBox="0 0 300 430" xmlns="http://www.w3.org/2000/svg" aria-label="Cartoon of Tushar">
  <defs>
    <pattern id="${g}k" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="14" height="14" fill="#16151c"/>
      <rect x="3" y="3" width="8" height="8" fill="none" stroke="#45434f" stroke-width="1.4"/>
      <circle cx="7" cy="7" r="1.3" fill="#a6abc0"/>
    </pattern>
    <radialGradient id="${g}f" cx=".5" cy=".4" r=".62">
      <stop offset=".68" stop-color="${SKIN_T}"/><stop offset="1" stop-color="${SKIN_T_SH}"/>
    </radialGradient>
    <linearGradient id="${g}h" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#2c2633"/><stop offset=".5" stop-color="#151117"/><stop offset="1" stop-color="#0d0a0e"/>
    </linearGradient>
  </defs>

  <!-- neck -->
  <path d="M126 230 L126 292 Q150 304 174 292 L174 230 Z" fill="${SKIN_T_SH}"/>
  <path d="M126 246 Q150 268 174 246 L174 232 L126 232 Z" fill="${SKIN_T_DEEP}" opacity=".45"/>
  <!-- black embroidered kurta, open mandarin collar -->
  <path d="M54 330 Q74 290 122 284 L150 300 L178 284 Q226 290 246 330 L260 430 L40 430 Z" fill="url(#${g}k)"/>
  <path d="M124 286 L150 344 L176 286 Z" fill="${SKIN_T_SH}"/>
  <path d="M138 312 q6 4 12 0 q6 4 12 0" fill="none" stroke="#7a5a48" stroke-width="1.4" opacity=".6"/>
  <path d="M120 282 Q124 294 134 304 L150 344 M180 282 Q176 294 166 304" fill="none" stroke="#0c0b10" stroke-width="7" stroke-linecap="round"/>
  <path d="M154 344 L154 430" stroke="#0c0b10" stroke-width="5"/>
  <circle cx="150" cy="360" r="3" fill="#d6d9e4"/><circle cx="150" cy="382" r="3" fill="#d6d9e4"/><circle cx="150" cy="404" r="3" fill="#d6d9e4"/>

  <!-- ears + stud -->
  <path d="M82 146 Q66 144 68 168 Q70 190 86 190" fill="${SKIN_T_SH}"/>
  <path d="M218 146 Q234 144 232 168 Q230 190 214 190" fill="${SKIN_T_SH}"/>
  <circle cx="226" cy="184" r="3.2" fill="#f2f4fa" stroke="#9aa0b8" stroke-width="1"/>

  <!-- oval face with a defined jaw -->
  <path d="M80 148 Q80 74 150 70 Q220 74 220 148 Q220 208 198 236 Q176 258 150 258 Q124 258 102 236 Q80 208 80 148 Z" fill="url(#${g}f)"/>
  <!-- light stubble: jaw, chin, moustache -->
  <path d="M84 176 Q88 236 150 256 Q212 236 216 176 Q212 214 190 232 Q170 226 150 228 Q130 226 110 232 Q88 214 84 176 Z" fill="#3b2b24" opacity=".2"/>
  <path d="M124 202 Q150 192 176 202 Q150 198 124 202 Z" fill="#3b2b24" opacity=".35"/>

  <!-- tall, textured swept-up quiff -->
  <g class="hair-bounce">
    <path d="M82 152 L80 122 Q86 112 94 112 L92 152 Z M218 152 L220 122 Q214 112 206 112 L208 152 Z" fill="#231e27"/>
    <path d="M82 132 Q74 98 88 78 Q82 56 102 46 Q98 26 122 22 Q130 4 154 10 Q166 -4 188 8 Q210 4 216 24 Q236 28 232 52 Q246 70 230 90 Q236 108 220 126
             Q214 106 200 100 Q190 110 174 102 Q160 112 146 104 Q130 112 116 104 Q102 112 94 106 Q86 116 82 132 Z" fill="url(#${g}h)"/>
    <path d="M96 96 Q110 56 150 40 Q184 28 220 44" fill="none" stroke="#4b4357" stroke-width="5" stroke-linecap="round" opacity=".75"/>
    <path d="M108 100 Q130 70 172 60 Q204 54 226 70 M122 40 Q150 18 196 22 M138 102 Q160 82 200 80" fill="none" stroke="#3a3344" stroke-width="3" stroke-linecap="round" opacity=".9"/>
  </g>

  <!-- thick groomed brows -->
  <path d="M100 128 Q118 116 140 124" fill="none" stroke="#151012" stroke-width="7" stroke-linecap="round"/>
  <path d="M160 124 Q182 116 200 128" fill="none" stroke="#151012" stroke-width="7" stroke-linecap="round"/>
  ${eye(120, 152, SKIN_T, SKIN_T_SH, { top: 14, bot: 8, w: 16, liner: 2.8, iris: 8.5, irisColor: '#4a2a1a' })}
  ${eye(180, 152, SKIN_T, SKIN_T_SH, { top: 14, bot: 8, w: 16, liner: 2.8, iris: 8.5, irisColor: '#4a2a1a' })}

  <!-- straight, longer nose -->
  <path d="M148 140 Q146 166 142 180 Q146 188 154 186 Q160 186 162 182" fill="none" stroke="${SKIN_T_DEEP}" stroke-width="3" stroke-linecap="round"/>
  <!-- soft closed-lip smile, a little lopsided -->
  <path d="M132 216 Q152 234 172 212 Q152 224 132 216 Z" fill="#d98c8c"/>
  <path d="M124 212 Q150 226 180 206" fill="none" stroke="#9c4a55" stroke-width="3.4" stroke-linecap="round"/>
  <path d="M182 202 q4 4 2 9" fill="none" stroke="${SKIN_T_DEEP}" stroke-width="2.4" stroke-linecap="round"/>
  <ellipse cx="104" cy="190" rx="14" ry="9" fill="#ff8f8f" opacity=".18"/>
  <ellipse cx="196" cy="190" rx="14" ry="9" fill="#ff8f8f" opacity=".18"/>

  ${pose === 'flowers' ? `
  <g class="prop-flowers">
    <path d="M226 410 L250 300 M214 410 L226 310 M238 410 L274 318" stroke="#4c9a5f" stroke-width="5"/>
    <g fill="#f6a43a"><circle cx="250" cy="296" r="15"/><circle cx="226" cy="306" r="12"/><circle cx="274" cy="314" r="12"/></g>
    <g fill="#ff6f91"><circle cx="250" cy="296" r="6"/><circle cx="226" cy="306" r="5"/><circle cx="274" cy="314" r="5"/></g>
    <circle cx="228" cy="396" r="14" fill="${SKIN_T}"/>
  </g>` : ''}
  ${pose === 'laptop' ? `
  <g class="prop-laptop">
    <path d="M60 330 L240 330 L226 410 L74 410 Z" fill="#cfd2db" stroke="#6b6f7d" stroke-width="2"/>
    <rect x="80" y="338" width="140" height="64" rx="4" fill="#2a1726"/>
    <path class="beat" d="M150 392 C120 372 128 350 142 352 C148 353 150 358 150 360 C150 358 152 353 158 352 C172 350 180 372 150 392 Z" fill="#ff6f91"/>
  </g>` : ''}
</svg>`;
};

/* Mount a character: draws the SVG right away, then swaps in the
   photo-based caricature (images/<name>.png) if that file exists. */
window.mountChar = function (el, who, pose) {
  if (typeof el === 'string') el = document.querySelector(el);
  if (!window.PORTRAITS || !PORTRAITS[who]) { el.innerHTML = (who === 'vidhi' ? vidhiSVG : tusharSVG)({ pose }); return; }
  const img = new Image();
  img.className = 'portrait';
  img.alt = who === 'vidhi' ? 'Vidhi' : 'Tushar';
  img.decoding = 'async';
  img.onerror = () => { el.innerHTML = (who === 'vidhi' ? vidhiSVG : tusharSVG)({ pose }); };
  img.src = PORTRAITS[who];
  el.innerHTML = ''; el.appendChild(img);
};
/* Caricatures generated from their photos (maa-style), with the SVG drawings as fallback */
window.PORTRAITS = {
  vidhi: 'images/vidhi.png', tushar: 'images/tushar.png', car: 'images/car.png',
  tusharAsking: 'images/tushar-asking.png',     // happy tears, holding flowers
  tusharKneeling: 'images/tushar-kneeling.png', // on one knee with red roses
  hands: 'images/holding-hands.jpg',            // the two of them, hands raised
};

/* eyes follow the pointer */
window.enableEyeTracking = function () {
  if (window.__eyes) return; window.__eyes = true;
  addEventListener('pointermove', e => {
    document.querySelectorAll('.eye').forEach(el => {
      const p = el.querySelector('.pupil');
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const a = Math.atan2(e.clientY - cy, e.clientX - cx);
      const d = Math.min(4, Math.hypot(e.clientX - cx, e.clientY - cy) / 40);
      p.setAttribute('transform', `translate(${Math.cos(a) * d} ${Math.sin(a) * d * .7})`);
    });
  }, { passive: true });
};
