import { LOGO_PATHS } from './logo-paths';

const BONE = '#efe5d3';
const INK = '#0b0908';
const RED = '#c8322b';
const GOLD = '#d9a441';
const SKIN = '#c98f65';
const DENIM = '#2a3a55';
const CYAN = '#36c9d6';
const CYAN_DARK = '#1b8f9c';

function Wheel({ cx, cy }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r="31" fill={INK} stroke={BONE} strokeWidth="6" />
      <g className="wheel-spin">
        <circle cx={cx} cy={cy} r="17" fill="none" stroke={BONE} strokeOpacity=".35" strokeWidth="2" />
        {[0, 60, 120].map((a) => (
          <rect key={a} x={cx - 16} y={cy - 2} width="32" height="4" rx="2" fill={BONE} fillOpacity=".55" transform={`rotate(${a} ${cx} ${cy})`} />
        ))}
        <circle cx={cx} cy={cy} r="8" fill={RED} />
      </g>
    </g>
  );
}

/** Cartoon retro scooter with a tattoo artist + ink kit, used for the Home Service section. */
export default function ScooterArt() {
  return (
    <svg className="scooter" viewBox="0 0 420 250" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* ground shadow */}
      <ellipse cx="215" cy="226" rx="150" ry="7" fill="#000" opacity=".35" />

      {/* speed lines + exhaust */}
      <g stroke={BONE} strokeOpacity=".45" strokeWidth="4" className="speed-lines">
        <path d="M8 120h34" /><path d="M0 145h44" /><path d="M14 170h28" />
      </g>
      <g fill={BONE} className="puffs">
        <circle cx="62" cy="196" r="7" />
        <circle cx="62" cy="196" r="5" />
        <circle cx="62" cy="196" r="6" />
      </g>

      {/* ink kit box on rear rack */}
      <rect x="62" y="98" width="20" height="10" rx="3" fill={INK} stroke={BONE} strokeWidth="3" />
      <g className="kit">
        <rect x="52" y="58" width="56" height="44" rx="9" fill={RED} stroke={BONE} strokeWidth="4" />
        <rect x="52" y="58" width="56" height="12" rx="6" fill="#a8261f" />
        <svg x="68" y="72" width="24" height="26" viewBox="0 0 2739 3033" fill={BONE} dangerouslySetInnerHTML={{ __html: LOGO_PATHS }} />
      </g>

      {/* wheels */}
      <Wheel cx={110} cy={192} />
      <Wheel cx={318} cy={192} />

      {/* rear body / side panel */}
      <path d="M66 170 C60 138 84 116 126 116 L214 116 C232 116 240 130 235 148 L226 178 L96 182 C80 182 70 178 66 170 Z" fill={CYAN} stroke={INK} strokeWidth="3" />
      <path d="M78 156 C110 150 180 150 228 152" stroke={BONE} strokeWidth="9" />
      <text x="104" y="141" fontFamily="Georgia, serif" fontSize="15" fontWeight="bold" letterSpacing="2" fill={INK}>MUGNA</text>
      {/* rear light */}
      <path d="M66 140 q-6 8 0 16" stroke={RED} strokeWidth="6" />

      {/* floorboard */}
      <path d="M200 176 L276 176 L272 188 L206 188 Z" fill="#1a1513" stroke={BONE} strokeWidth="3" />

      {/* seat */}
      <path d="M100 116 C100 103 112 98 128 98 L198 98 C212 98 218 106 214 116 Z" fill="#1a1513" stroke={BONE} strokeWidth="3" />
      <path d="M112 107 H204" stroke={BONE} strokeOpacity=".35" strokeWidth="2" strokeDasharray="4 5" />

      {/* front leg-shield / apron */}
      <path d="M262 182 L280 184 C306 150 306 108 290 72 L270 70 C278 110 272 148 250 176 Z" fill={CYAN} stroke={INK} strokeWidth="3" />
      <path d="M284 88 C292 116 290 146 274 172" stroke={BONE} strokeWidth="6" />

      {/* front fender */}
      <path d="M280 182 C286 152 344 150 352 182 L340 182 C334 166 296 166 292 182 Z" fill={CYAN_DARK} stroke={BONE} strokeWidth="3" />
      {/* fork */}
      <path d="M300 112 L318 190" stroke="#1a1513" strokeWidth="7" />

      {/* rider: leg (behind arm) */}
      <path d="M150 104 L214 112" stroke={DENIM} strokeWidth="24" />
      <path d="M214 112 L230 164" stroke={DENIM} strokeWidth="19" />
      <path d="M222 170 h24 a8 8 0 0 1 0 0" stroke={INK} strokeWidth="13" />

      {/* rider: torso */}
      <path d="M156 100 L188 58" stroke={BONE} strokeWidth="38" />
      <path d="M156 100 L188 58" stroke="#1a1513" strokeWidth="32" />
      <text x="160" y="90" fontFamily="Georgia, serif" fontSize="9" fill={RED} transform="rotate(-53 168 84)">INK</text>

      {/* handlebar cowl + headlight */}
      <path d="M262 62 C266 46 300 44 306 58 C304 68 270 70 262 62 Z" fill={CYAN} stroke={INK} strokeWidth="3" />
      <circle cx="304" cy="60" r="11" fill={GOLD} stroke={INK} strokeWidth="3" />
      <circle cx="306" cy="58" r="4" fill="#fff6dd" />
      <path d="M268 50 L250 44" stroke="#1a1513" strokeWidth="7" />
      {/* headlight beam */}
      <path className="beam" d="M314 54 L410 30 L410 90 L314 66 Z" fill={GOLD} opacity=".12" />

      {/* rider: arm with sleeve tattoo */}
      <path d="M190 62 L222 82 L250 46" stroke={SKIN} strokeWidth="14" />
      <path d="M198 67 l6 4 M208 73 l6 4 M226 76 l5 -7 M234 66 l5 -7" stroke={INK} strokeWidth="3" />
      <circle cx="250" cy="46" r="8" fill={SKIN} stroke={INK} strokeWidth="2" />

      {/* rider: head + helmet */}
      <circle cx="198" cy="36" r="19" fill={SKIN} />
      <path d="M178 36 C176 12 220 6 220 32 L216 34 L182 38 Z" fill={RED} stroke={BONE} strokeWidth="3" />
      <path d="M190 14 C200 10 210 12 216 20" stroke={BONE} strokeWidth="4" />
      <path d="M204 30 L222 31 L220 40 L206 40 Z" fill={INK} />
      <path d="M200 46 q6 4 12 0" stroke={INK} strokeWidth="2.5" />
      <circle cx="190" cy="40" r="3" fill="#e0715f" opacity=".6" />
    </svg>
  );
}
