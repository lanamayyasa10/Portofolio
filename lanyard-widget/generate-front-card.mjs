import fs from 'fs'
import path from 'path'

const publicDir = path.resolve('./public')
const photoPath = path.join(publicDir, 'lan.png')
const outputPath = path.join(publicDir, 'lana-front.svg')

const photoBase64 = fs.readFileSync(photoPath).toString('base64')
const photoData = `data:image/png;base64,${photoBase64}`

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1440" viewBox="0 0 1024 1440">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#260b15"/>
      <stop offset="55%" stop-color="#150a0e"/>
      <stop offset="100%" stop-color="#0b080a"/>
    </linearGradient>

    <linearGradient id="wine" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#b83b60"/>
      <stop offset="100%" stop-color="#6c1835"/>
    </linearGradient>

    <linearGradient id="overlay" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#12070c" stop-opacity="0"/>
      <stop offset="100%" stop-color="#12070c" stop-opacity=".68"/>
    </linearGradient>

    <clipPath id="photoClip">
      <rect x="108" y="170" width="808" height="940" rx="36"/>
    </clipPath>
  </defs>

  <!-- background -->
  <rect width="1024" height="1440" rx="48" fill="url(#bg)"/>

  <!-- subtle top accent -->
  <path d="M710 0 C880 95 1024 180 1024 360 L1024 0 Z"
        fill="#6c1835" opacity=".14"/>

  <!-- outer border -->
  <rect x="26" y="26" width="972" height="1388" rx="38"
        fill="none" stroke="#542034" stroke-width="2"/>

  <!-- top text -->
  <circle cx="92" cy="104" r="5" fill="#d16a89"/>
  <text x="112" y="111"
        fill="#d8b0bd"
        font-family="Arial, sans-serif"
        font-size="23"
        letter-spacing="5">
    FRONT PROFILE
  </text>

  <text x="932" y="111"
        text-anchor="end"
        fill="#8e6573"
        font-family="Arial, sans-serif"
        font-size="22"
        letter-spacing="3">
    2026
  </text>

  <!-- main frame -->
  <rect x="96" y="158" width="832" height="964" rx="42"
        fill="#2b1019"/>

  <!-- photo -->
  <image
    href="${photoData}"
    x="108"
    y="170"
    width="808"
    height="940"
    preserveAspectRatio="xMidYMid slice"
    clip-path="url(#photoClip)"
  />

  <!-- overlay for elegant look -->
  <rect x="108" y="170" width="808" height="940" rx="36"
        fill="url(#overlay)"/>

  <!-- photo frame border -->
  <rect x="108" y="170" width="808" height="940" rx="36"
        fill="none" stroke="#9c3a59" stroke-width="2.4"/>

  <!-- inner highlight line -->
  <rect x="126" y="188" width="772" height="904" rx="28"
        fill="none" stroke="#6a2139" stroke-width="1.2" opacity=".75"/>

  <!-- bottom name block -->
  <text x="140" y="965"
        fill="#ffffff"
        font-family="Arial, sans-serif"
        font-size="78"
        font-weight="700"
        letter-spacing="-2">
    LANA
  </text>

  <text x="140" y="1034"
        fill="#de7d9d"
        font-family="Arial, sans-serif"
        font-size="48"
        font-weight="500"
        letter-spacing="1">
    MAYYASA
  </text>

  <path d="M140 1072 H330"
        stroke="url(#wine)"
        stroke-width="4"
        stroke-linecap="round"/>

  <!-- footer -->
  <text x="108" y="1218"
        fill="#c58c9f"
        font-family="Arial, sans-serif"
        font-size="20"
        letter-spacing="4">
    FULL-STACK DEVELOPER
  </text>

  <text x="108" y="1262"
        fill="#c58c9f"
        font-family="Arial, sans-serif"
        font-size="20"
        letter-spacing="4">
    UI / UX DESIGNER
  </text>

  <text x="916" y="1262"
        text-anchor="end"
        fill="#8f6f7d"
        font-family="Arial, sans-serif"
        font-size="20"
        letter-spacing="4">
    PERSONAL PORTFOLIO
  </text>

  <path d="M108 1310 H916" stroke="#4c202f" stroke-width="2"/>

  <text x="108" y="1360"
        fill="#a77b8b"
        font-family="Arial, sans-serif"
        font-size="22"
        letter-spacing="4">
    DESIGN • CODE • CREATE
  </text>

  <circle cx="916" cy="1352" r="5" fill="#a83b5c"/>
</svg>
`

fs.writeFileSync(outputPath, svg, 'utf8')
console.log('lana-front.svg berhasil dibuat.')