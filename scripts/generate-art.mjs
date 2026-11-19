// Generates the seed flash artwork in /public/art. Run: node scripts/generate-art.mjs
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.join(process.cwd(), 'public', 'art');
fs.mkdirSync(OUT, { recursive: true });

const BONE = '#efe5d3';
const RED = '#c8322b';
const GOLD = '#d9a441';
const INK = '#0d0b0a';
const GREEN = '#5b7a45';

const r = (n) => Math.round(n * 100) / 100;
const polar = (cx, cy, rad, deg) => [r(cx + rad * Math.cos((deg * Math.PI) / 180)), r(cy + rad * Math.sin((deg * Math.PI) / 180))];

function frame(body, { title = '', bg1 = '#1f1917', bg2 = '#0c0a09' } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="600" height="750">
<defs>
  <radialGradient id="bg" cx="50%" cy="45%" r="75%"><stop offset="0" stop-color="${bg1}"/><stop offset="1" stop-color="${bg2}"/></radialGradient>
  <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 .95  0 0 0 0 .9  0 0 0 .05 0"/></filter>
</defs>
<rect width="600" height="750" fill="url(#bg)"/>
<rect width="600" height="750" filter="url(#grain)"/>
<rect x="22" y="22" width="556" height="706" fill="none" stroke="${BONE}" stroke-opacity=".14" stroke-width="1.5"/>
<g stroke-linecap="round" stroke-linejoin="round">${body}</g>
<text x="300" y="704" text-anchor="middle" font-family="Georgia, serif" font-size="15" letter-spacing="6" fill="${BONE}" fill-opacity=".38">${title.toUpperCase().replace(/&/g, "&amp;")}</text>
</svg>`;
}

const write = (name, svg) => fs.writeFileSync(path.join(OUT, name + '.svg'), svg);

/* ---------- 1. Serpent & dagger ---------- */
write('dagger-snake', frame(`
  <g stroke="${BONE}" stroke-width="5">
    <path d="M300 610 L276 300 L324 300 Z" fill="#cfc6b6"/>
    <path d="M300 600 L300 305" stroke="${INK}" stroke-width="3"/>
    <rect x="222" y="282" width="156" height="24" rx="12" fill="${GOLD}"/>
    <circle cx="222" cy="294" r="16" fill="${GOLD}"/><circle cx="378" cy="294" r="16" fill="${GOLD}"/>
    <rect x="286" y="190" width="28" height="94" rx="6" fill="${INK}"/>
    <circle cx="300" cy="176" r="20" fill="${GOLD}"/>
  </g>
  <g stroke="${BONE}" stroke-width="3" opacity=".8">${[204, 220, 236, 252, 268].map((y) => `<path d="M288 ${y} L312 ${y + 10}"/>`).join('')}</g>
  <path d="M372 236 C440 270,400 336,300 346 C196 356,196 420,300 430 C398 440,410 494,318 512 C262 522,240 552,268 590" fill="none" stroke="${BONE}" stroke-width="34"/>
  <path d="M372 236 C440 270,400 336,300 346 C196 356,196 420,300 430 C398 440,410 494,318 512 C262 522,240 552,268 590" fill="none" stroke="${RED}" stroke-width="24"/>
  <path d="M372 236 C440 270,400 336,300 346 C196 356,196 420,300 430 C398 440,410 494,318 512 C262 522,240 552,268 590" fill="none" stroke="${INK}" stroke-width="3" stroke-dasharray="2 14"/>
  <path d="M300 300 L300 330" stroke="#cfc6b6" stroke-width="20"/>
  <g transform="translate(372 232) rotate(-28)">
    <ellipse rx="40" ry="24" fill="${RED}" stroke="${BONE}" stroke-width="5"/>
    <circle cx="14" cy="-8" r="6" fill="${GOLD}" stroke="${INK}" stroke-width="2"/>
    <path d="M38 4 L62 8 L72 0 M62 8 L72 14" fill="none" stroke="${RED}" stroke-width="3"/>
  </g>
  <g fill="${GOLD}">${[[160, 200], [450, 420], [180, 560], [430, 600]].map(([x, y]) => `<path d="M${x} ${y - 14} L${x + 4} ${y - 4} L${x + 14} ${y} L${x + 4} ${y + 4} L${x} ${y + 14} L${x - 4} ${y + 4} L${x - 14} ${y} L${x - 4} ${y - 4} Z"/>`).join('')}</g>
`, { title: 'Serpent & Dagger' }));

/* ---------- 2. Sacred heart ---------- */
const rays = Array.from({ length: 36 }, (_, i) => {
  const a = i * 10 - 90;
  const [x1, y1] = polar(300, 440, 175, a);
  const [x2, y2] = polar(300, 440, i % 2 ? 215 : 250, a);
  return `<path d="M${x1} ${y1} L${x2} ${y2}"/>`;
}).join('');
write('sacred-heart', frame(`
  <g stroke="${GOLD}" stroke-width="4">${rays}</g>
  <path d="M276 330 C250 280,280 250,272 210 C300 240,296 200,312 180 C318 220,350 240,326 290 C340 280,346 270,344 256 C366 290,350 320,326 336 Z" fill="${GOLD}" stroke="${BONE}" stroke-width="5"/>
  <path d="M300 182 L300 120 M280 140 L320 140" stroke="${BONE}" stroke-width="8"/>
  <path d="M300 620 C160 520,130 400,200 350 C250 315,290 340,300 370 C310 340,350 315,400 350 C470 400,440 520,300 620 Z" fill="${RED}" stroke="${BONE}" stroke-width="7"/>
  <path d="M232 390 C246 370,266 366,278 378" fill="none" stroke="${BONE}" stroke-width="7" opacity=".75"/>
  <path d="M190 450 C250 420,350 420,410 450" fill="none" stroke="${INK}" stroke-width="16"/>
  <path d="M190 450 C250 420,350 420,410 450" fill="none" stroke="${GREEN}" stroke-width="9"/>
  <g stroke="${BONE}" stroke-width="3">${Array.from({ length: 11 }, (_, i) => { const x = 200 + i * 20; const y = 448 - Math.sin((i / 10) * Math.PI) * 24; return `<path d="M${x} ${y} L${x + 6} ${y - 16} M${x + 8} ${y} L${x + 2} ${y + 14}"/>`; }).join('')}</g>
  <path d="M300 500 L300 580" stroke="${INK}" stroke-width="6" opacity=".35"/>
`, { title: 'Sacred Heart' }));

/* ---------- 3. Skull & crossbones ---------- */
const bone = (rot) => `<g transform="rotate(${rot} 300 470)"><rect x="150" y="458" width="300" height="24" rx="12" fill="${BONE}" stroke="${INK}" stroke-width="4"/>${[[150, 452], [150, 488], [450, 452], [450, 488]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="17" fill="${BONE}" stroke="${INK}" stroke-width="4"/>`).join('')}</g>`;
write('skull', frame(`
  ${bone(32)}${bone(-32)}
  <path d="M196 360 C196 220,404 220,404 360 C404 412,384 432,372 452 L372 500 L228 500 L228 452 C216 432,196 412,196 360 Z" fill="${BONE}" stroke="${INK}" stroke-width="6"/>
  <path d="M228 452 L372 452" stroke="${INK}" stroke-width="5"/>
  <g stroke="${INK}" stroke-width="5">${[252, 276, 300, 324, 348].map((x) => `<path d="M${x} 452 L${x} 500"/>`).join('')}</g>
  <path d="M206 330 C210 260,270 236,300 236" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="6"/>
  <ellipse cx="254" cy="372" rx="36" ry="32" fill="${INK}"/>
  <ellipse cx="346" cy="372" rx="36" ry="32" fill="${INK}"/>
  <path d="M254 358 L262 372 L254 386 L246 372 Z M346 358 L354 372 L346 386 L338 372 Z" fill="${RED}"/>
  <path d="M300 404 L314 432 L286 432 Z" fill="${INK}"/>
  <path d="M260 280 C280 300,320 300,340 280" fill="none" stroke="${INK}" stroke-width="3" opacity=".4"/>
  <g transform="translate(300 182)"><path d="M-44 0 C-30 -40,30 -40,44 0 C20 -10,-20 -10,-44 0 Z" fill="${RED}" stroke="${BONE}" stroke-width="4"/></g>
`, { title: 'Grinning Skull' }));

/* ---------- 4. Swallow ---------- */
write('swallow', frame(`
  <g stroke="${BONE}" stroke-width="6">
    <path d="M262 340 C300 236,380 186,486 168 C430 214,412 254,392 292 C360 326,306 346,262 340 Z" fill="#1f3657"/>
    <path d="M300 300 C330 260,370 236,420 222 M318 318 C350 290,380 274,410 264" fill="none" stroke-width="3"/>
    <path d="M196 352 C240 404,320 434,404 444 L480 534 L440 456 L516 474 L424 420 C360 380,282 338,238 312 C222 306,204 320,196 352 Z" fill="#1f3657"/>
    <path d="M206 364 C232 404,272 420,312 416 C276 400,246 380,226 348 Z" fill="${RED}"/>
    <path d="M288 392 C266 464,226 524,158 566 C236 548,300 504,340 420 Z" fill="#1f3657"/>
    <path d="M290 430 C270 480,240 510,210 530" fill="none" stroke-width="3"/>
    <circle cx="226" cy="330" r="34" fill="#1f3657"/>
    <path d="M194 322 L164 334 L196 342 Z" fill="${GOLD}" stroke-width="4"/>
  </g>
  <circle cx="220" cy="324" r="7" fill="${BONE}"/><circle cx="221" cy="325" r="3" fill="${INK}"/>
  <path d="M120 600 C200 560,260 640,340 600 C400 570,440 610,480 590" fill="none" stroke="${GOLD}" stroke-width="4"/>
  <g fill="${GOLD}"><circle cx="130" cy="220" r="5"/><circle cx="470" cy="330" r="4"/><circle cx="160" cy="470" r="3"/></g>
`, { title: 'Swallow' }));

/* ---------- 5. Rose ---------- */
write('rose', frame(`
  <path d="M300 450 C300 520,280 580,250 640" fill="none" stroke="${BONE}" stroke-width="16"/>
  <path d="M300 450 C300 520,280 580,250 640" fill="none" stroke="${GREEN}" stroke-width="9"/>
  <path d="M292 540 L276 530 M282 600 L268 596" stroke="${BONE}" stroke-width="5"/>
  <path d="M290 520 C240 500,190 520,160 560 C220 576,270 560,290 520 Z" fill="${GREEN}" stroke="${BONE}" stroke-width="6"/>
  <path d="M290 520 C240 528,200 546,170 556" fill="none" stroke="${BONE}" stroke-width="3"/>
  <path d="M296 480 C350 450,410 460,446 500 C384 520,330 510,296 480 Z" fill="${GREEN}" stroke="${BONE}" stroke-width="6"/>
  <path d="M296 480 C350 480,400 490,440 500" fill="none" stroke="${BONE}" stroke-width="3"/>
  <path d="M196 340 C186 260,250 220,300 226 C356 220,418 260,406 340 C400 420,348 462,300 462 C250 462,202 420,196 340 Z" fill="${RED}" stroke="${BONE}" stroke-width="7"/>
  <g fill="none" stroke="${BONE}" stroke-width="5">
    <path d="M300 318 C322 308,338 334,316 350 C290 368,262 340,274 314 C290 282,346 288,356 326 C366 370,322 400,290 392 C246 382,232 330,252 294"/>
    <path d="M214 362 C230 420,290 446,340 430"/>
    <path d="M392 300 C400 340,386 380,360 404"/>
    <path d="M236 256 C256 244,280 240,300 242"/>
  </g>
  <path d="M220 300 C226 280,240 266,256 258" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="5"/>
`, { title: 'Tiger Rose' }));

/* ---------- 6. Moth (fine line) ---------- */
const mothHalf = `
  <path d="M300 336 C236 252,138 236,108 290 C86 340,168 392,300 388"/>
  <path d="M300 396 C228 402,168 450,196 502 C226 544,290 470,300 420"/>
  <circle cx="186" cy="310" r="26"/><circle cx="186" cy="310" r="12"/>
  <path d="M150 284 C170 266,214 266,240 300 M128 330 C170 352,230 364,290 368"/>
  <path d="M220 440 C236 460,250 470,270 470"/>
  ${Array.from({ length: 8 }, (_, i) => `<circle cx="${120 + i * 22}" cy="${352 - Math.sin(i / 2) * 8}" r="2" fill="${BONE}"/>`).join('')}`;
write('moth', frame(`
  <g fill="none" stroke="${BONE}" stroke-width="2.4">
    ${mothHalf}
    <g transform="translate(600 0) scale(-1 1)">${mothHalf}</g>
    <ellipse cx="300" cy="392" rx="14" ry="70"/>
    ${[350, 370, 390, 410, 430].map((y) => `<path d="M288 ${y} C296 ${y + 6},304 ${y + 6},312 ${y}"/>`).join('')}
    <circle cx="300" cy="312" r="14"/>
    <path d="M294 300 C280 260,250 240,230 236 M306 300 C320 260,350 240,370 236"/>
    ${[0, 1, 2, 3, 4].map((i) => `<path d="M${286 - i * 12} ${284 - i * 9} l-8 -10 M${314 + i * 12} ${284 - i * 9} l8 -10"/>`).join('')}
    <path d="M330 150 A44 44 0 1 1 270 150 A34 34 0 1 0 330 150 Z" fill="${BONE}" stroke="none" transform="rotate(180 300 150)"/>
  </g>
  <g fill="${BONE}">${[[150, 170], [450, 190], [130, 560], [470, 540], [300, 600]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.5"/>`).join('')}</g>
  <path d="M300 498 L300 590" stroke="${BONE}" stroke-width="2" stroke-dasharray="2 8" fill="none"/>
`, { title: 'Moon Moth' }));

/* ---------- 7. Botanical (fine line) ---------- */
let bot = '';
const stem = (t) => [300 + Math.sin(t * 3.2) * 40, 640 - t * 470];
let d = 'M' + stem(0).join(' ');
for (let t = 0.02; t <= 1.001; t += 0.02) d += ' L' + stem(t).map(r).join(' ');
bot += `<path d="${d}"/>`;
for (let i = 1; i < 12; i++) {
  const t = i / 12.5;
  const [x, y] = stem(t);
  const side = i % 2 ? 1 : -1;
  const len = 70 - t * 30;
  const ang = side === 1 ? -30 : 210;
  const [tx, ty] = polar(x, y, len, ang);
  const [c1x, c1y] = polar(x, y, len * 0.6, ang - 28 * side);
  const [c2x, c2y] = polar(x, y, len * 0.6, ang + 28 * side);
  bot += `<path d="M${r(x)} ${r(y)} Q${c1x} ${c1y} ${tx} ${ty} Q${c2x} ${c2y} ${r(x)} ${r(y)} Z"/><path d="M${r(x)} ${r(y)} L${r((x + tx) / 2 + (tx - x) * 0.3)} ${r((y + ty) / 2 + (ty - y) * 0.3)}" stroke-width="1.4"/>`;
}
const [fx, fy] = stem(1);
for (let k = 0; k < 6; k++) {
  const [px, py] = polar(fx, fy - 20, 26, k * 60);
  bot += `<ellipse cx="${px}" cy="${py}" rx="18" ry="10" transform="rotate(${k * 60} ${px} ${py})"/>`;
}
bot += `<circle cx="${r(fx)}" cy="${r(fy - 20)}" r="8" fill="${GOLD}" stroke="none"/>`;
write('botanical', frame(`<g fill="none" stroke="${BONE}" stroke-width="2.4">${bot}</g>`, { title: 'Wild Stem' }));

/* ---------- 8. All-seeing eye ---------- */
const eyeRays = Array.from({ length: 19 }, (_, i) => {
  const a = -180 + i * 10;
  const [x1, y1] = polar(300, 220, 64, a);
  const [x2, y2] = polar(300, 220, i % 2 ? 100 : 140, a);
  return `<path d="M${x1} ${y1} L${x2} ${y2}"/>`;
}).join('');
write('eye', frame(`
  <g fill="none" stroke="${BONE}" stroke-width="2.6">
    ${eyeRays}
    <path d="M300 170 L512 540 L88 540 Z"/>
    <path d="M300 196 L484 524 L116 524 Z" stroke-width="1.4"/>
    <path d="M168 410 Q300 300 432 410 Q300 520 168 410 Z" stroke-width="3"/>
    <circle cx="300" cy="410" r="52" stroke="${RED}" stroke-width="3"/>
    ${Array.from({ length: 24 }, (_, i) => { const [a, b] = polar(300, 410, 26, i * 15); const [c, e] = polar(300, 410, 50, i * 15); return `<path d="M${a} ${b} L${c} ${e}" stroke="${RED}" stroke-width="1.2"/>`; }).join('')}
    ${[200, 230, 262, 300, 338, 370, 400].map((x, i) => { const y = 410 - Math.sin(((x - 168) / 264) * Math.PI) * 55; return `<path d="M${x} ${r(y)} L${x + (i - 3) * 6} ${r(y - 22)}"/>`; }).join('')}
  </g>
  <circle cx="300" cy="410" r="22" fill="${BONE}"/>
  <circle cx="290" cy="400" r="6" fill="${INK}"/>
  <g fill="${BONE}">${Array.from({ length: 40 }, (_, i) => `<circle cx="${130 + (i % 10) * 38}" cy="${580 + Math.floor(i / 10) * 18}" r="${1.4 + (i % 3) * 0.5}" opacity="${1 - Math.floor(i / 10) * 0.22}"/>`).join('')}</g>
`, { title: 'All-Seeing Eye' }));

/* ---------- 9. Sun & moon ---------- */
const sunRays = Array.from({ length: 18 }, (_, i) => {
  const a = 90 + i * 10;
  const [x1, y1] = polar(300, 380, 120, a);
  const [x2, y2] = polar(300, 380, i % 2 ? 160 : 210, a);
  const [cx, cy] = polar(300, 380, 165, a + 6);
  return i % 2 ? `<path d="M${x1} ${y1} L${x2} ${y2}"/>` : `<path d="M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}"/>`;
}).join('');
write('sun-moon', frame(`
  <g fill="none" stroke="${BONE}" stroke-width="2.6">
    ${sunRays}
    <circle cx="300" cy="380" r="110"/>
    <path d="M300 270 L300 490"/>
    <path d="M300 286 A94 94 0 0 1 300 474 A70 94 0 0 0 300 286 Z" fill="${BONE}" fill-opacity=".9"/>
    <path d="M232 360 q14 -12 28 0 M240 410 q12 12 26 0 M228 336 q20 -14 40 -4"/>
    <circle cx="300" cy="380" r="128" stroke-dasharray="1 9"/>
  </g>
  <g fill="${GOLD}">${[[430, 240], [470, 330], [450, 470], [400, 540], [420, 180]].map(([x, y], i) => { const s = 6 + (i % 2) * 5; return `<path d="M${x} ${y - s} L${x + s / 4} ${y - s / 4} L${x + s} ${y} L${x + s / 4} ${y + s / 4} L${x} ${y + s} L${x - s / 4} ${y + s / 4} L${x - s} ${y} L${x - s / 4} ${y - s / 4} Z"/>`; }).join('')}</g>
`, { title: 'Sun & Moon' }));

/* ---------- 10. Lotus mandala ---------- */
function petalRing(cx, cy, n, r1, r2, w, attrs, offset = 0) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const a = (360 / n) * i + offset;
    const [x1, y1] = polar(cx, cy, r1, a);
    const [x2, y2] = polar(cx, cy, r2, a);
    const [c1x, c1y] = polar(cx, cy, (r1 + r2) / 2, a - w);
    const [c2x, c2y] = polar(cx, cy, (r1 + r2) / 2, a + w);
    s += `<path d="M${x1} ${y1} Q${c1x} ${c1y} ${x2} ${y2} Q${c2x} ${c2y} ${x1} ${y1} Z" ${attrs}/>`;
  }
  return s;
}
const dotRing = (cx, cy, n, rad, size, fill = BONE) =>
  Array.from({ length: n }, (_, i) => { const [x, y] = polar(cx, cy, rad, (360 / n) * i); return `<circle cx="${x}" cy="${y}" r="${size}" fill="${fill}"/>`; }).join('');
write('mandala-1', frame(`
  <g stroke="${BONE}" stroke-width="2.4" fill="none">
    ${petalRing(300, 370, 16, 150, 240, 14, '')}
    ${petalRing(300, 370, 16, 150, 222, 8, 'stroke-width="1.2"')}
    <circle cx="300" cy="370" r="150"/><circle cx="300" cy="370" r="140" stroke-dasharray="2 6"/>
    ${petalRing(300, 370, 12, 60, 140, 18, `fill="${RED}" fill-opacity=".9"`, 15)}
    ${petalRing(300, 370, 12, 60, 130, 18, '')}
    <circle cx="300" cy="370" r="60"/>
    ${petalRing(300, 370, 8, 10, 56, 26, `fill="${BONE}"`)}
  </g>
  ${dotRing(300, 370, 48, 252, 2.5)}${dotRing(300, 370, 32, 268, 1.8)}${dotRing(300, 370, 16, 284, 1.2)}
  <circle cx="300" cy="370" r="10" fill="${GOLD}"/>
`, { title: 'Lotus Mandala' }));

/* ---------- 11. Dotwork sun ---------- */
let dots = '';
for (let ring = 0; ring < 16; ring++) {
  const rad = 40 + ring * 13;
  const n = Math.round((2 * Math.PI * rad) / 12);
  const size = 1 + Math.abs(Math.sin(ring / 2.4)) * 3.4;
  dots += dotRing(300, 370, n, rad, r(size), ring % 5 === 2 ? RED : BONE);
}
const tri = Array.from({ length: 12 }, (_, i) => {
  const a = i * 30;
  const [x1, y1] = polar(300, 370, 250, a - 9);
  const [x2, y2] = polar(300, 370, 250, a + 9);
  const [x3, y3] = polar(300, 370, 300, a);
  return `<path d="M${x1} ${y1} L${x3} ${y3} L${x2} ${y2}" fill="none" stroke="${BONE}" stroke-width="2.4"/>`;
}).join('');
write('mandala-2', frame(`${tri}${dots}<circle cx="300" cy="370" r="24" fill="${GOLD}"/><circle cx="300" cy="370" r="246" fill="none" stroke="${BONE}" stroke-width="2"/>`, { title: 'Dot Sun' }));

/* ---------- 12. Metatron's cube ---------- */
const pts = [[300, 370]];
for (let i = 0; i < 6; i++) pts.push(polar(300, 370, 80, i * 60 - 90));
for (let i = 0; i < 6; i++) pts.push(polar(300, 370, 160, i * 60 - 90));
let lines = '';
for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) lines += `<path d="M${pts[i][0]} ${pts[i][1]} L${pts[j][0]} ${pts[j][1]}"/>`;
write('sacred-geo', frame(`
  <g fill="none" stroke="${BONE}">
    <g stroke-width="1.1" opacity=".7">${lines}</g>
    <g stroke-width="2.6">${pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="40"/>`).join('')}</g>
    <circle cx="300" cy="370" r="210" stroke-width="2.6"/>
    <circle cx="300" cy="370" r="222" stroke-width="1" stroke-dasharray="3 7"/>
    <path d="M${polar(300, 370, 210, -90)} L${polar(300, 370, 210, 30)} L${polar(300, 370, 210, 150)} Z" stroke="${RED}" stroke-width="2.6"/>
    <path d="M${polar(300, 370, 210, 90)} L${polar(300, 370, 210, 210)} L${polar(300, 370, 210, 330)} Z" stroke="${RED}" stroke-width="2.6"/>
  </g>
  ${pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="${GOLD}"/>`).join('')}
`, { title: 'Metatron' }));

/* ---------- 13. Tribal wave band ---------- */
let band = '';
const rows = [140, 230, 320, 410, 500, 590];
rows.forEach((y, idx) => {
  const type = idx % 3;
  if (type === 0) {
    for (let x = 90; x < 510; x += 42) band += `<path d="M${x} ${y + 30} L${x + 21} ${y - 20} L${x + 42} ${y + 30} Z" fill="${idx % 2 ? RED : BONE}" stroke="${INK}" stroke-width="2"/>`;
  } else if (type === 1) {
    let p = `M90 ${y}`;
    for (let x = 90; x < 510; x += 30) p += ` Q${x + 15} ${y - 28} ${x + 30} ${y} Q${x + 45} ${y + 28} ${x + 60} ${y}`;
    band += `<path d="${p}" fill="none" stroke="${BONE}" stroke-width="7"/><path d="${p}" fill="none" stroke="${BONE}" stroke-width="2" transform="translate(0 22)"/>`;
  } else {
    for (let x = 110; x < 500; x += 56) band += `<path d="M${x} ${y} L${x + 24} ${y - 26} L${x + 48} ${y} L${x + 24} ${y + 26} Z" fill="${BONE}"/><path d="M${x + 14} ${y} L${x + 24} ${y - 10} L${x + 34} ${y} L${x + 24} ${y + 10} Z" fill="${RED}"/>`;
  }
  band += `<path d="M80 ${y + 46} L520 ${y + 46}" stroke="${BONE}" stroke-width="3"/>`;
});
write('wave-band', frame(`<rect x="80" y="90" width="440" height="560" rx="18" fill="none" stroke="${BONE}" stroke-width="4"/><clipPath id="c"><rect x="80" y="90" width="440" height="560" rx="18"/></clipPath><g clip-path="url(#c)">${band}</g>`, { title: 'Alon Band' }));

/* ---------- 14. Star compass ---------- */
let star = '';
for (let i = 0; i < 16; i++) {
  const a = i * 22.5 - 90;
  const long = i % 4 === 0 ? 240 : i % 2 === 0 ? 170 : 110;
  const w = i % 4 === 0 ? 34 : i % 2 === 0 ? 26 : 16;
  const [tx, ty] = polar(300, 380, long, a);
  const [lx, ly] = polar(300, 380, w, a - 45);
  const [rx, ry] = polar(300, 380, w, a + 45);
  const order = i % 4 === 0 ? 3 : i % 2 === 0 ? 2 : 1;
  star = (order === 3 ? '' : '') + star;
  const piece = `<path d="M300 380 L${lx} ${ly} L${tx} ${ty} Z" fill="${i % 4 === 0 ? BONE : i % 2 === 0 ? RED : GOLD}" stroke="${INK}" stroke-width="2"/><path d="M300 380 L${rx} ${ry} L${tx} ${ty} Z" fill="${INK}" stroke="${BONE}" stroke-width="2"/>`;
  star = order === 1 ? piece + star : star + piece;
}
const ticks = Array.from({ length: 72 }, (_, i) => { const [a, b] = polar(300, 380, 196, i * 5); const [c, e] = polar(300, 380, i % 2 ? 204 : 212, i * 5); return `<path d="M${a} ${b} L${c} ${e}"/>`; }).join('');
write('compass', frame(`
  <g fill="none" stroke="${BONE}" stroke-width="2"><circle cx="300" cy="380" r="196"/><circle cx="300" cy="380" r="216"/>${ticks}<circle cx="300" cy="380" r="140" stroke-dasharray="2 6"/></g>
  ${star}
  <circle cx="300" cy="380" r="14" fill="${GOLD}" stroke="${INK}" stroke-width="3"/>
  <text x="300" y="118" text-anchor="middle" font-family="Georgia, serif" font-size="30" font-weight="bold" fill="${BONE}">N</text>
`, { title: 'Star Compass' }));

/* ---------- Artist portraits (stylised placeholders) ---------- */
function portrait(name, initials, hue, accent) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="600" height="750">
<defs>
  <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${hue} 30% 18%)"/><stop offset="1" stop-color="#0b0908"/></linearGradient>
  <linearGradient id="rim" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${accent}" stop-opacity="0"/><stop offset="1" stop-color="${accent}" stop-opacity=".9"/></linearGradient>
</defs>
<rect width="600" height="750" fill="url(#g)"/>
<text x="300" y="400" text-anchor="middle" font-family="Georgia, serif" font-size="360" font-style="italic" fill="${BONE}" fill-opacity=".07">${initials}</text>
<g>
  <path d="M120 750 C130 600,200 540,300 530 C400 540,470 600,480 750 Z" fill="#070606"/>
  <path d="M250 520 L250 470 L350 470 L350 520 C330 545,270 545,250 520 Z" fill="#090807"/>
  <ellipse cx="300" cy="370" rx="98" ry="122" fill="#0a0908"/>
  <path d="M206 330 C206 230,300 210,350 236 C400 250,404 310,398 340 C380 290,330 280,300 286 C260 290,226 300,206 330 Z" fill="#050404"/>
  <path d="M392 330 C404 380,396 430,360 470" fill="none" stroke="url(#rim)" stroke-width="6" stroke-linecap="round"/>
  <path d="M470 750 C466 640,430 580,360 552" fill="none" stroke="url(#rim)" stroke-width="5" stroke-linecap="round"/>
  <g fill="none" stroke="${accent}" stroke-opacity=".55" stroke-width="2">
    <path d="M200 600 C230 640,226 690,206 740"/><path d="M220 620 C250 650,250 690,236 740"/>
    <circle cx="190" cy="650" r="14"/>
  </g>
</g>
<text x="300" y="700" text-anchor="middle" font-family="Georgia, serif" font-size="18" letter-spacing="8" fill="${BONE}" fill-opacity=".5">${name.toUpperCase()}</text>
</svg>`;
}
write('artist-paeng', portrait('Paeng', 'PV', 10, RED));
write('artist-kaye', portrait('Kaye', 'KS', 35, GOLD));
write('artist-migs', portrait('Migs', 'MA', 200, '#7fb3d5'));

/* ---------- Sample e-wallet QRs ---------- */
function sampleQr(file, { color, letter, label, bg = '#fff', fg = '#000' }) {
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const N = 29;
  const cell = 10;
  let q = '';
  const finder = (x, y) => `<rect x="${x * cell}" y="${y * cell}" width="${7 * cell}" height="${7 * cell}" fill="${fg}"/><rect x="${(x + 1) * cell}" y="${(y + 1) * cell}" width="${5 * cell}" height="${5 * cell}" fill="${bg}"/><rect x="${(x + 2) * cell}" y="${(y + 2) * cell}" width="${3 * cell}" height="${3 * cell}" fill="${fg}"/>`;
  const inFinder = (x, y) => (x < 8 && y < 8) || (x > N - 9 && y < 8) || (x < 8 && y > N - 9);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (!inFinder(x, y) && rand() > 0.52) q += `<rect x="${x * cell}" y="${y * cell}" width="${cell}" height="${cell}"/>`;
  fs.writeFileSync(path.join(OUT, file), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-30 -30 350 400" width="350" height="400">
<rect x="-30" y="-30" width="350" height="400" rx="18" fill="${bg}"/>
<g fill="${fg}">${q}${finder(0, 0)}${finder(N - 7, 0)}${finder(0, N - 7)}</g>
<rect x="105" y="105" width="80" height="80" rx="14" fill="${color}"/>
<text x="145" y="155" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" font-size="26" fill="${bg === '#fff' ? '#fff' : '#000'}">${letter}</text>
<text x="145" y="330" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" font-size="16" fill="${color}">SAMPLE ${label} QR</text>
<text x="145" y="352" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="#777">Upload your real QR in Admin → Settings</text>
</svg>`);
}
sampleQr('gcash-qr-sample.svg', { color: '#007dfe', letter: 'G', label: 'GCASH' });
sampleQr('maya-qr-sample.svg', { color: '#00b964', letter: 'M', label: 'MAYA' });

console.log('Art generated in', OUT);
