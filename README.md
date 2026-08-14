<div align="center">

<!-- Logo Banner -->
<img src="https://raw.githubusercontent.com/hansamal-200/CONNECT-MSG/refs/heads/main/2d0bce1f-5755-450a-800f-cfe6e7142da8.png" alt="PontaSockets Banner" width="720" style="border-radius: 12px;" />

<br><br>

<!-- Welcome Text -->
<h2>
  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Hand%20gestures/Waving%20Hand.png" alt="Waving Hand" width="35" style="vertical-align: middle; margin-right: 8px;" />
  Selamat Datang di Baileys PontaLabs
</h2>

<br>

<!-- Badges -->
<a href="https://www.npmjs.com/package/@hansamal/baileys">
  <img src="https://img.shields.io/npm/v/@hansamal/baileys?style=flat-square&amp;color=cb3837&amp;label=npm&amp;logo=npm" alt="NPM Version" />
</a>
<a href="https://nodejs.org">
  <img src="https://img.shields.io/badge/node-%3E%3D18.x-339933?style=flat-square&amp;logo=node.js&amp;logoColor=white" alt="Node.js" />
</a>
<a href="./LICENSE">
  <img src="https://img.shields.io/badge/license-Non--Commercial-orange?style=flat-square" alt="License" />
</a>
<a href="https://github.com/WhiskeySockets/Baileys">
  <img src="https://img.shields.io/badge/fork-whiskeysockets%2Fbaileys-blue?style=flat-square&amp;logo=github" alt="Fork" />
</a>

<br><br>

<p><em>Extended from <code>@whiskeysockets/baileys</code> — packed with exclusive patches, AI-rich messages, and advanced WhatsApp features.</em></p>

</div>

---

## 📑 Table of Contents

- [Why This Fork?](#-why-this-fork)
- [Features](#-features)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Documentation](#-documentation)
  - [Connecting](#-connecting)
  - [Events](#-events)
  - [Sending Messages](#-sending-messages)
  - [Rich Messages](#-rich-messages)
  - [Newsletter](#-newsletter)
  - [Groups](#-groups)
  - [Privacy](#-privacy)
  - [Advanced](#-advanced)
- [Contributing](#-contributing)
- [License](#-license)
- [Disclaimer](#-disclaimer)

---

<details>
<summary><h2>📥 Installation</h2></summary>

```bash
# npm
npm install @hansamal/baileys

# yarn
yarn add @hansamal/baileys
```

</details>

---

<details>
<summary><h2>🚀 Quick Start</h2></summary>

```js
import makeWASocket, { useMultiFileAuthState } from '@hansamal/baileys'

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState('./sessions')

  const sock = makeWASocket({
    printQRInTerminal: true,
    auth: state
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('messages.upsert', ({ messages }) => {
    console.log('New message:', messages[0].message)
  })
}

start()
```

</details>

---

## 📖 Documentation

### 🔌 Connecting

<details>
<summary><b>🔗 QR Code</b></summary>

```js
const sock = makeWASocket({
  printQRInTerminal: true,
  auth: state
})
```
</details>

<details>
<summary><b>🔢 Pairing Code</b></summary>

```js
const sock = makeWASocket({
  printQRInTerminal: false,
  auth: state
})

if (!sock.authState.creds.registered) {
  const number = '62xxxx'
  const code = await sock.requestPairingCode(number)
  // Or custom 8-digit code:
  const customCode = await sock.requestPairingCode(number, 'PontaLabs')
  console.log(code)
}
```
</details>

---

### 📡 Events

<details>
<summary><b>📌 Basic Message Listener</b></summary>

```js
sock.ev.on('messages.upsert', ({ messages }) => {
  const msg = messages[0]
  console.log('From:', msg.key.remoteJid)
  console.log('Content:', msg.message)
})
```
</details>

<details>
<summary><b>🗳️ Decrypt Poll Votes</b></summary>

```js
sock.ev.on('messages.update', (m) => {
  if (m.pollUpdates) {
    console.log('Poll vote received:', m.pollUpdates)
  }
})
```
</details>

---

### 📨 Sending Messages

```js
sock.sendMessage(jid, content, options?)
  // jid     — Recipient JID (user or group)
  // content — Message payload object
  // options — Optional: { quoted, ephemeral, ... }
```

#### Standard Messages

<details>
<summary><b>📝 Text</b></summary>

```js
await sock.sendMessage(jid, { text: 'Hello!' })
await sock.sendMessage(jid, { text: 'Reply!' }, { quoted: message })
```
</details>

<details>
<summary><b>🖼️ Image</b></summary>

```js
// From file
await sock.sendMessage(jid, {
  image: fs.readFileSync('image.jpg'),
  caption: 'Caption here'
})

// From URL
await sock.sendMessage(jid, {
  image: { url: 'https://example.com/image.jpg' },
  caption: 'Downloaded image'
})
```
</details>

<details>
<summary><b>🎥 Video</b></summary>

```js
await sock.sendMessage(jid, {
  video: fs.readFileSync('video.mp4'),
  caption: 'Funny clip!'
})

// View Once
await sock.sendMessage(jid, {
  video: fs.readFileSync('secret.mp4'),
  viewOnce: true
})
```
</details>

<details>
<summary><b>🎵 Audio / PTT</b></summary>

```js
// Regular audio
await sock.sendMessage(jid, { audio: fs.readFileSync('audio.mp3'), ptt: false })

// Push-to-talk
await sock.sendMessage(jid, {
  audio: fs.readFileSync('voice.ogg'),
  ptt: true,
  waveform: [0, 1, 0, 1, 0]
})
```
</details>

<details>
<summary><b>👤 Contact</b></summary>

```js
const vcard = [
  'BEGIN:VCARD', 'VERSION:3.0', 'FN:Jeff Singh', 'ORG:Ashoka Uni',
  'TEL;type=CELL;type=VOICE;waid=911234567890:+91 12345 67890',
  'END:VCARD'
].join('\n')

await sock.sendMessage(jid, {
  contacts: { displayName: 'Jeff Singh', contacts: [{ vcard }] }
})
```
</details>

<details>
<summary><b>📍 Location</b></summary>

```js
await sock.sendMessage(jid, {
  location: {
    degreesLatitude: 37.422,
    degreesLongitude: -122.084,
    name: 'Google HQ'
  }
})
```
</details>

<details>
<summary><b>💥 React</b></summary>

```js
await sock.sendMessage(jid, { react: { text: '👍', key: message.key } })
// Remove reaction
await sock.sendMessage(jid, { react: { text: '', key: message.key } })
```
</details>

<details>
<summary><b>📊 Poll</b></summary>

```js
await sock.sendMessage(jid, {
  poll: {
    name: 'Favorite color?',
    values: ['Red', 'Blue', 'Green'],
    selectableCount: 1
  }
})
```
</details>

<details>
<summary><b>📸 Album</b></summary>

```js
await sock.sendAlbumMessage(jid, [
  { image: { url: 'https://example.com/1.jpg' }, caption: 'First' },
  { video: { url: 'https://example.com/clip.mp4' }, caption: 'Second' }
], { quoted: message, delay: 3000 })
```
</details>

<details>
<summary><b>👨‍💻 Interactive (Native Flow & Carousel)</b></summary>

```js
// Native Flow
await sock.sendMessage(jid, {
  text: 'Choose an option:',
  title: 'Title',
  footer: '© PontaLabs Baileys',
  interactive: [{
    name: 'quick_reply',
    buttonParamsJson: JSON.stringify({ display_text: 'Quick Reply', id: '123' })
  }]
})

// Carousel
await sock.sendMessage(jid, {
  text: 'Check out our collection!',
  title: 'Catalog',
  footer: '© PontaLabs Baileys',
  cards: [{
    image: { url: 'https://example.com/image.jpg' },
    title: 'Product Name',
    body: 'Product description',
    footer: '© PontaLabs',
    buttons: [{
      name: 'quick_reply',
      buttonParamsJson: JSON.stringify({ display_text: 'Select', id: '1' })
    }]
  }]
})
```
</details>

<details>
<summary><b>🔩 Raw / Legacy Buttons</b></summary>

> Varian tombol raw/proto WhatsApp mentah — lebih fleksibel, tapi kamu yang susun strukturnya sendiri.

#### `buttonsMessage`

Kirim objek `buttonsMessage` proto WhatsApp mentah — thumbnail lokasi di dalamnya otomatis diproses kalau berupa Buffer/URL/path.

```js
await sock.sendMessage(jid, {
  buttonsMessage: {
    contentText: 'Pilih salah satu:',
    footerText: '© PontaCT',
    buttons: [
      { buttonId: 'a', buttonText: { displayText: 'Opsi A' }, type: 1 },
      { buttonId: 'b', buttonText: { displayText: 'Opsi B' }, type: 1 }
    ]
  }
}, { quoted: message })
```

#### `templateButtons`

```js
await sock.sendMessage(jid, {
  text: 'Butuh bantuan?',
  footer: '© PontaCT',
  templateButtons: [
    { index: 1, urlButton: { displayText: 'Kunjungi Website', url: 'https://example.com' } },
    { index: 2, callButton: { displayText: 'Telepon', phoneNumber: '+6281234567890' } }
  ]
}, { quoted: message })
```

#### `interactiveButtons`

```js
await sock.sendMessage(jid, {
  title: 'Menu Utama',
  subtitle: 'Silakan pilih',
  text: 'Ada yang bisa dibantu?',
  footer: '© PontaCT',
  interactiveButtons: [
    { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: 'Mulai', id: 'start' }) }
  ]
}, { quoted: message })
```

</details>

<details>
<summary><b>📌 Pin & Keep</b></summary>

```js
// Pin — 24h = 86400 · 7d = 604800 · 30d = 2592000
await sock.sendMessage(jid, { pin: { type: 1, time: 86400, key: message.key } })

// Keep
await sock.sendMessage(jid, { keep: { key: message.key, type: 1 } })
```
</details>

---

### 📍 Location + Buttons

> Location message with native list menu (`single_select`) and extra buttons — all in one `buttonsMessage`.

<details>
<summary><b>Location + List Menu</b></summary>

```js
await sock.sendMessage(jid, {
  buttonLocation: {
    latitude: -6.2088,
    longitude: 106.8456,
    name: 'Kantor Pusat PontaCT',
    address: 'Jl. Sudirman No. 1, Jakarta Pusat',
    text: 'Temukan kami di sini:',
    footer: '© PontaCT',
    thumbnail: 'https://example.com/map-preview.jpg',
    listButtonText: 'Pilih Layanan',
    listSectionTitle: 'Layanan Tersedia',
    listMenu: [
      { title: 'Customer Service', description: 'Lantai 1, Senin–Jumat 08.00–17.00', id: 'cs' },
      { title: 'Kasir & Pembayaran', description: 'Lantai 2, buka setiap hari', id: 'kasir' },
      { title: 'Gudang & Pengiriman', description: 'Gedung B, pintu belakang', id: 'gudang' }
    ]
  }
})
```
</details>

<details>
<summary><b>Location + Extra Buttons</b></summary>

```js
await sock.sendMessage(jid, {
  buttonLocation: {
    latitude: -6.2088,
    longitude: 106.8456,
    name: 'Toko PontaCT',
    address: 'Jl. Kebon Sirih No. 10, Jakarta',
    text: 'Kunjungi toko kami!',
    footer: '© PontaCT',
    thumbnail: 'https://example.com/store.jpg',
    extraButtons: [
      { id: 'call', displayText: '📞 Hubungi Kami' },
      { id: 'whatsapp', displayText: '💬 WhatsApp' },
      { id: 'maps', displayText: '🗺️ Buka di Maps' }
    ]
  }
})
```
</details>

<details>
<summary><b>Location + List Menu + Extra Buttons</b></summary>

```js
await sock.sendMessage(jid, {
  buttonLocation: {
    latitude: -6.2088,
    longitude: 106.8456,
    name: 'Plaza PontaCT',
    address: 'Jl. MH Thamrin No. 5, Jakarta',
    text: 'Selamat datang di pusat layanan kami.',
    footer: 'Buka setiap hari 09.00–21.00',
    thumbnail: 'https://example.com/plaza.jpg',
    listButtonText: 'Pilih Tujuan',
    listSectionTitle: 'Area Tersedia',
    listMenu: [
      { title: 'Food Court', description: 'Lt. 1 — lebih dari 30 tenant', id: 'food' },
      { title: 'Cinema', description: 'Lt. 4 — 8 studio', id: 'cinema' },
      { title: 'Customer Care', description: 'Lt. 2 — sebelah eskalator', id: 'care' }
    ],
    extraButtons: [
      { id: 'navigate', displayText: '🧭 Navigasi' },
      { id: 'promo', displayText: '🎁 Promo Hari Ini' }
    ]
  }
})
```
</details>

<details>
<summary><b>📋 Fields Reference</b></summary>

| Field | Type | Required | Default | Description |
|:---|:---|:---:|:---|:---|
| `latitude` | `number` | — | `0` | Latitude coordinate |
| `longitude` | `number` | — | `0` | Longitude coordinate |
| `name` | `string` | — | `'Location'` | Place name |
| `address` | `string` | — | `''` | Text address |
| `text` | `string` | — | `''` | Message body text |
| `footer` | `string` | — | `''` | Footer text |
| `thumbnail` | `Buffer / URL / path` | ✅ | — | Map preview image |
| `listButtonText` | `string` | — | `'Pilih Menu'` | List button label |
| `listSectionTitle` | `string` | — | `'Pilihan'` | List section title |
| `listMenu` | `array` | — | — | Menu rows |
| `extraButtons` | `array` | — | — | Extra buttons |

</details>

---

### 📦 Order Status

> Interactive order tracking card using native `order_status` flow button.

<details>
<summary><b>Basic Order Status</b></summary>

```js
await sock.sendMessage(jid, {
  orderStatus: {
    image: 'https://example.com/order-banner.jpg',
    title: 'Status Pesanan',
    text: 'Pesanan kamu sedang diproses oleh penjual.',
    referenceId: 'ORD-20250629-001',
    status: 'PROCESSING',
    currency: 'IDR'
  }
})
```
</details>

<details>
<summary><b>Full Order Status with Total & Tax</b></summary>

```js
await sock.sendMessage(jid, {
  orderStatus: {
    image: 'https://example.com/order.jpg',
    title: 'Update Pesanan #ORD-2025-001',
    text: 'Pesananmu sedang dalam perjalanan! 🚚',
    footer: 'Estimasi tiba: 2–3 hari kerja',
    referenceId: 'ORD-2025-001',
    status: 'SHIPPED',
    subtotalValue: 15000000,
    subtotalOffset: 100,
    taxValue: 1500000,
    taxOffset: 100,
    currency: 'IDR'
  }
})
```
</details>

<details>
<summary><b>Local Image File</b></summary>

```js
const fs = require('fs')
await sock.sendMessage(jid, {
  orderStatus: {
    image: fs.readFileSync('./assets/order-confirm.jpg'),
    title: 'Pesanan Dikonfirmasi ✅',
    text: 'Terima kasih telah berbelanja!',
    referenceId: 'ORD-LOCAL-001',
    status: 'PROCESSING',
    currency: 'IDR'
  }
})
```
</details>

<details>
<summary><b>📋 Fields Reference</b></summary>

| Field | Type | Required | Default | Description |
|:---|:---|:---:|:---|:---|
| `image` | `Buffer / URL / path` | ✅ | — | Header card image |
| `title` | `string` | — | `'Order Status'` | Header title |
| `text` | `string` | — | `'Silakan cek status pesanan Anda.'` | Body text |
| `footer` | `string` | — | `'Powered by PontaCT'` | Footer text |
| `referenceId` | `string` | — | `'PT-001'` | Order reference ID |
| `status` | `string` | — | `'PROCESSING'` | Order status |
| `subtotalValue` | `number` | — | `0` | Subtotal value (in offset units) |
| `subtotalOffset` | `number` | — | `100` | Value divider |
| `taxValue` | `number` | — | `0` | Tax value |
| `taxOffset` | `number` | — | `100` | Tax divider |
| `currency` | `string` | — | `'IDR'` | Currency code |

> **Status values:** `PROCESSING` · `SHIPPED` · `DELIVERED` · `CANCELLED` · `REFUNDED`

</details>

---

### 🤖 Rich Messages

> All rich messages are sent via standard `sendMessage` and rendered as AI bot messages in WhatsApp. Use the appropriate key instead of `text`, `image`, `video`, etc.

**Quick jump:** [Rich Text](#rich-text) · [Code](#rich-code-block) · [Table](#rich-table) · [Images](#rich-images) · [Video](#rich-video) · [Suggestions](#rich-suggestions) · [LaTeX](#rich-latex) · [Product](#rich-product) · [Post](#rich-post) · [Reels](#rich-reels) · [Sources](#rich-sources) · [Tip & Footer](#rich-tip--footer) · [Mixed](#rich-mixed) · [Response](#rich-response)

---

#### 📝 Rich Text

> AI bot-styled markdown text rendered in `richResponseMessage`.

<details>
<summary><b>Simple Text</b></summary>

```js
await sock.sendMessage(jid, { richText: 'Halo! Ini pesan dari bot.' }, { quoted: message })
```
</details>

<details>
<summary><b>Markdown (bold, italic, inline code)</b></summary>

```js
await sock.sendMessage(jid, {
  richText: '*Hasil eksekusi:*\nStatus: `success`\nWaktu: _120ms_'
}, { quoted: message })
```
</details>

<details>
<summary><b>Multiple Paragraphs (Array)</b></summary>

```js
await sock.sendMessage(jid, {
  richText: ['Baris pertama.', 'Baris kedua.', 'Baris ketiga.']
}, { quoted: message })
```
</details>

---

#### 💻 Rich Code Block

> Syntax-highlighted code. Use `code` for single block, `codes` for multiple.

<details>
<summary><b>Single Block</b></summary>

```js
await sock.sendMessage(jid, {
  code: 'console.log("Hello World")',
  language: 'javascript'
}, { quoted: message })
```
</details>

<details>
<summary><b>Multiple Blocks</b></summary>

```js
await sock.sendMessage(jid, {
  codes: [
    { code: 'SELECT * FROM users WHERE id = 1;', language: 'sql' },
    { code: '{ "id": 1, "name": "Ponta", "role": "admin" }', language: 'json' }
  ]
}, { quoted: message })
```
</details>

<details>
<summary><b>Supported Languages</b></summary>

| Language | Key |
|:---|:---|
| JavaScript | `javascript` · `js` |
| TypeScript | `typescript` · `ts` |
| Python | `python` · `py` |
| Bash / Shell | `bash` · `sh` · `zsh` |
| Go | `go` · `golang` |
| Rust | `rust` · `rs` |
| C / C++ | `c` · `h` · `cpp` · `c++` |
| C# | `csharp` · `cs` |
| CSS / HTML | `css` · `html` |
| PowerShell / CMD | `powershell` · `ps1` · `cmd` · `bat` |
| SQL / JSON | `sql` · `json` |

</details>

---

#### 📊 Rich Table

> Structured table with `title`, `headers`, and `rows`.
>
> ⚠️ Shorthand `{ title?, headers?, rows }` ini hanya berlaku untuk key `table` top-level dan di dalam `items`. Kalau dipakai di dalam `richResponse`, isi `table` harus sudah berupa array baris jadi — lihat [Rich Response](#-rich-response--richresponse).

<details>
<summary><b>Simple Table</b></summary>

```js
await sock.sendMessage(jid, {
  table: {
    title: 'Daftar User',
    headers: ['Name', 'Role', 'Status'],
    rows: [
      ['Ponta', 'Admin', 'Active'],
      ['Yue', 'Member', 'Idle'],
      ['Frieren', 'Guest', 'Offline']
    ]
  }
}, { quoted: message })
```
</details>

<details>
<summary><b>Table without Title</b></summary>

```js
await sock.sendMessage(jid, {
  table: {
    headers: ['Command', 'Description'],
    rows: [
      ['.ping', 'Cek latency bot'],
      ['.info', 'Info bot'],
      ['.help', 'List semua command']
    ]
  }
}, { quoted: message })
```
</details>

<details>
<summary><b>Data Only (no header)</b></summary>

```js
await sock.sendMessage(jid, {
  table: {
    rows: [
      ['RAM', '512 MB'],
      ['CPU', '4 Core'],
      ['Uptime', '99.9%']
    ]
  }
}, { quoted: message })
```
</details>

---

#### 🖼️ Rich Images

> AI image grid. Single URL = single image, multiple URLs = carousel.

<details>
<summary><b>Single Image</b></summary>

```js
await sock.sendMessage(jid, { richImages: 'https://example.com/photo.jpg' }, { quoted: message })
```
</details>

<details>
<summary><b>Multiple Images (Grid)</b></summary>

```js
await sock.sendMessage(jid, {
  richImages: [
    'https://example.com/photo1.jpg',
    'https://example.com/photo2.jpg',
    'https://example.com/photo3.jpg'
  ]
}, { quoted: message })
```
</details>

<details>
<summary><b>Inside items / richResponse</b></summary>

```js
// items
await sock.sendMessage(jid, {
  items: [
    { text: 'Hasil foto hari ini:' },
    { images: ['https://example.com/1.jpg', 'https://example.com/2.jpg'] }
  ]
}, { quoted: message })

// richResponse
await sock.sendMessage(jid, {
  richResponse: [
    { text: 'Lihat gambarnya:' },
    { images: 'https://example.com/banner.jpg' }
  ]
}, { quoted: message })
```
</details>

---

#### 🎥 Rich Video

> Video embed as AI animated media (`GenAIImaginePrimitive` with `imagine_type: ANIMATE`).

<details>
<summary><b>Shorthand URL</b></summary>

```js
await sock.sendMessage(jid, { richVideo: 'https://example.com/clip.mp4' }, { quoted: message })
```
</details>

<details>
<summary><b>Full Options</b></summary>

```js
await sock.sendMessage(jid, {
  richVideo: {
    url: 'https://example.com/clip.mp4',
    mimeType: 'video/mp4',        // default: 'video/mp4'
    duration: 15,                   // seconds, default: 10
    fallbackText: 'Preview video' // default: '[ VIDEO - PontaCT ]'
  }
}, { quoted: message })
```
</details>

<details>
<summary><b>Inside items / richResponse</b></summary>

```js
// items
await sock.sendMessage(jid, {
  items: [
    { text: 'Cek videonya:' },
    { videoUrl: 'https://example.com/clip.mp4', duration: 20 }
  ]
}, { quoted: message })

// richResponse
await sock.sendMessage(jid, {
  richResponse: [
    { text: 'Tutorial:' },
    { video: { url: 'https://example.com/tutorial.mp4', duration: 30 } }
  ]
}, { quoted: message })
```
</details>

---

#### 💡 Rich Suggestions

> Follow-up prompt pills — like native AI chat buttons.

<details>
<summary><b>Shorthand</b></summary>

```js
await sock.sendMessage(jid, {
  richSuggestions: ['Coba lagi', 'Lihat detail', 'Batalkan']
}, { quoted: message })
```
</details>

<details>
<summary><b>Inside items / richResponse</b></summary>

```js
// items
await sock.sendMessage(jid, {
  items: [
    { text: 'Mau lanjut ke mana?' },
    { suggestions: ['Halaman utama', 'Bantuan', 'Hubungi admin'] }
  ]
}, { quoted: message })

// richResponse
await sock.sendMessage(jid, {
  richResponse: [
    { text: 'Hasil pencarian ditemukan.' },
    { suggestions: ['Tampilkan semua', 'Filter ulang', 'Export'] }
  ]
}, { quoted: message })
```
</details>

---

#### 🔣 Rich LaTeX

> Math formula rendering as `GenAILatexItem` inline entity. `url` points to a rendered formula image (PNG/JPG from external LaTeX renderer).

<details>
<summary><b>Shorthand URL</b></summary>

```js
await sock.sendMessage(jid, {
  richLatex: 'https://latex.codecogs.com/png.latex?E%3Dmc%5E2'
}, { quoted: message })
```
</details>

<details>
<summary><b>Full Options</b></summary>

```js
await sock.sendMessage(jid, {
  richLatex: {
    url: 'https://latex.codecogs.com/png.latex?E%3Dmc%5E2',
    text: 'E = mc²',     // label & fallback
    width: 120,            // default: 100
    height: 60,            // default: 100
    font_height: 83.33,    // default: 83.33
    padding: 15            // default: 15
  }
}, { quoted: message })
```
</details>

<details>
<summary><b>Inside items / richResponse</b></summary>

```js
// items
await sock.sendMessage(jid, {
  items: [
    { text: 'Rumus energi kinetik:' },
    {
      latexUrl: 'https://latex.codecogs.com/png.latex?E_k%3D%5Cfrac%7B1%7D%7B2%7Dmv%5E2',
      latexText: 'Ek = ½mv²',
      latexWidth: 150,
      latexHeight: 60
    }
  ]
}, { quoted: message })

// richResponse
await sock.sendMessage(jid, {
  richResponse: [
    { text: 'Solusi integral:' },
    { latex: { url: 'https://latex.codecogs.com/png.latex?%5Cint%20x%5E2%20dx', text: '∫x² dx = x³/3 + C' } }
  ]
}, { quoted: message })
```
</details>

---

#### 🛍️ Rich Product

> Product card(s) as `GenAIProductItemCardPrimitive`. Object = single card, Array = horizontal scroll carousel.

<details>
<summary><b>Single Product</b></summary>

```js
await sock.sendMessage(jid, {
  richProduct: {
    title: 'Sepatu Adidas Samba',
    price_display_string: 'Rp 1.200.000',
    description: 'Sepatu casual ikonik, tersedia berbagai ukuran.',
    retailer_id: 'adidas_store',
    thumbnail: { url: 'https://example.com/adidas.jpg', mime_type: 'image/jpeg', width: 300, height: 300 }
  }
}, { quoted: message })
```
</details>

<details>
<summary><b>Product Carousel</b></summary>

```js
await sock.sendMessage(jid, {
  richProduct: [
    {
      title: 'Sepatu A',
      price_display_string: 'Rp 500.000',
      thumbnail: { url: 'https://example.com/a.jpg', mime_type: 'image/jpeg', width: 300, height: 300 }
    },
    {
      title: 'Sepatu B',
      price_display_string: 'Rp 750.000',
      thumbnail: { url: 'https://example.com/b.jpg', mime_type: 'image/jpeg', width: 300, height: 300 }
    }
  ]
}, { quoted: message })
```
</details>

<details>
<summary><b>Inside items / richResponse</b></summary>

```js
// items
await sock.sendMessage(jid, {
  items: [
    { text: 'Rekomendasi produk hari ini:' },
    { product: { title: 'Produk X', price_display_string: 'Rp 99.000' } }
  ]
}, { quoted: message })

// richResponse
await sock.sendMessage(jid, {
  richResponse: [
    { text: 'Pilih produkmu:' },
    { product: [{ title: 'A' }, { title: 'B' }] }
  ]
}, { quoted: message })
```
</details>

---

#### 📰 Rich Post

> Post card(s) as `GenAIPostPrimitive`. Object = single post, Array = carousel.

<details>
<summary><b>Single Post</b></summary>

```js
await sock.sendMessage(jid, {
  richPost: {
    title: 'Caption post ini',
    author_display_name: '@pontalabs',
    author_profile_image: 'https://example.com/avatar.jpg',
    media_url: 'https://example.com/post.jpg',
    timestamp: Math.floor(Date.now() / 1000)
  }
}, { quoted: message })
```
</details>

<details>
<summary><b>Post Carousel</b></summary>

```js
await sock.sendMessage(jid, {
  richPost: [
    { title: 'Post 1', author_display_name: '@user1', media_url: 'https://example.com/1.jpg' },
    { title: 'Post 2', author_display_name: '@user2', media_url: 'https://example.com/2.jpg' }
  ]
}, { quoted: message })
```
</details>

---

#### 🎬 Rich Reels

> Reels carousel as `GenAIReelPrimitive` with `contentItemsMetadata`. Auto-injects `richResponseSourcesMetadata` with `provider: 'PontaCT'`.

<details>
<summary><b>Single Reel</b></summary>

```js
await sock.sendMessage(jid, {
  richReels: {
    title: '@creator_name',
    profileIconUrl: 'https://example.com/avatar.jpg',
    thumbnailUrl: 'https://example.com/thumb.jpg',
    videoUrl: 'https://example.com/reel.mp4',
    reels_title: 'Judul reel ini',
    likes_count: 12400,
    shares_count: 340,
    view_count: 89000,
    reel_source: 'IG',
    is_verified: true
  }
}, { quoted: message })
```
</details>

<details>
<summary><b>Reels Carousel</b></summary>

```js
await sock.sendMessage(jid, {
  richReels: [
    {
      title: '@creator1',
      profileIconUrl: 'https://example.com/av1.jpg',
      thumbnailUrl: 'https://example.com/th1.jpg',
      videoUrl: 'https://example.com/r1.mp4',
      likes_count: 5000,
      reel_source: 'IG'
    },
    {
      title: '@creator2',
      profileIconUrl: 'https://example.com/av2.jpg',
      thumbnailUrl: 'https://example.com/th2.jpg',
      videoUrl: 'https://example.com/r2.mp4',
      likes_count: 8200,
      reel_source: 'TT'
    }
  ]
}, { quoted: message })
```
</details>

<details>
<summary><b>📋 Fields Reference</b></summary>

| Field | Type | Default | Description |
|:---|:---|:---:|:---|
| `title` | `string` | — | Username / creator name |
| `profileIconUrl` | `string` | — | Avatar URL |
| `thumbnailUrl` | `string` | — | Thumbnail cover URL |
| `videoUrl` | `string` | — | Video source URL |
| `reels_title` | `string` | `''` | Reel title |
| `likes_count` | `number` | `0` | Like count |
| `shares_count` | `number` | `0` | Share count |
| `view_count` | `number` | `0` | View count |
| `reel_source` | `string` | `'IG'` | Source platform |
| `is_verified` | `boolean` | `false` | Verified badge |

</details>

---

#### 🔍 Rich Sources

> Search result source list as `GenAISearchResultPrimitive`. Accepts full objects **or** shorthand `[faviconUrl, sourceUrl, displayName]`.

<details>
<summary><b>Shorthand Array</b></summary>

```js
await sock.sendMessage(jid, {
  richSources: [
    ['https://wikipedia.org/favicon.ico', 'https://wikipedia.org/wiki/Node.js', 'Wikipedia'],
    ['https://nodejs.org/favicon.ico', 'https://nodejs.org/en/docs', 'Node.js Docs'],
    ['https://github.com/favicon.ico', 'https://github.com/nodejs/node', 'GitHub']
  ]
}, { quoted: message })
```
</details>

<details>
<summary><b>Full Object</b></summary>

```js
await sock.sendMessage(jid, {
  richSources: [
    {
      source_type: 'THIRD_PARTY',
      source_display_name: 'Wikipedia',
      source_subtitle: 'wikipedia.org',
      source_url: 'https://wikipedia.org/wiki/Node.js',
      favicon: { url: 'https://wikipedia.org/favicon.ico', mime_type: 'image/jpeg', width: 16, height: 16 }
    }
  ]
}, { quoted: message })
```
</details>

<details>
<summary><b>Mixed Format</b></summary>

```js
await sock.sendMessage(jid, {
  richSources: [
    ['https://wikipedia.org/fav.ico', 'https://wikipedia.org', 'Wikipedia'],
    { source_type: 'THIRD_PARTY', source_display_name: 'Docs', source_url: 'https://docs.example.com' }
  ]
}, { quoted: message })
```
</details>

---

#### 📌 Rich Tip & Footer

> `richTip` — small metadata text above/center of message.  
> `richFooter` — metadata text below message (disclaimer / branding).

<details>
<summary><b>Rich Tip</b></summary>

```js
await sock.sendMessage(jid, {
  richTip: 'Dihasilkan oleh AI · pontalabs v0.3.4'
}, { quoted: message })
```
</details>

<details>
<summary><b>Rich Footer</b></summary>

```js
await sock.sendMessage(jid, {
  richFooter: '© 2025 PontaCT · Data bersumber dari layanan publik'
}, { quoted: message })
```
</details>

<details>
<summary><b>Inside items / richResponse</b></summary>

```js
// items
await sock.sendMessage(jid, {
  items: [
    { text: 'Hasil pencarian:' },
    { sources: [['https://fav.ico', 'https://example.com', 'Example']] },
    { tip: 'AI-generated content' },
    { footer: '© PontaCT Baileys' }
  ]
}, { quoted: message })

// richResponse
await sock.sendMessage(jid, {
  richResponse: [
    { text: 'Summary di sini.' },
    { footer: '© PontaCT · pontalabs' }
  ]
}, { quoted: message })
```
</details>

---

#### 🔀 Rich Mixed — `items`

> Combine all rich types in any order. Array order = display order.

**Valid keys in `items`:**

| Key | Type |
|:---|:---|
| `{ text }` | Rich text |
| `{ code, language }` | Code block |
| `{ table }` | Table |
| `{ images }` | Image grid |
| `{ videoUrl, mimeType?, duration? }` | Video embed |
| `{ suggestions }` | Suggestion pills |
| `{ latexUrl, latexText?, latexWidth?, latexHeight? }` | LaTeX formula |
| `{ product }` | Product card(s) |
| `{ post }` | Post card(s) |
| `{ reels }` | Reels carousel |
| `{ sources }` | Search sources |
| `{ tip }` | Tip metadata |
| `{ footer }` | Footer metadata |

<details>
<summary><b>Text + Code + Table</b></summary>

```js
await sock.sendMessage(jid, {
  items: [
    { text: 'Query yang dijalankan:' },
    { code: 'SELECT id, name, score FROM users ORDER BY score DESC LIMIT 3', language: 'sql' },
    { text: 'Hasil:' },
    {
      table: {
        headers: ['id', 'name', 'score'],
        rows: [
          ['1', 'Ponta', '98'],
          ['2', 'Yue', '87'],
          ['3', 'Frieren', '75']
        ]
      }
    }
  ]
}, { quoted: message })
```
</details>

<details>
<summary><b>Text + Images + Video + Suggestions</b></summary>

```js
await sock.sendMessage(jid, {
  items: [
    { text: '*Konten hari ini*' },
    { images: ['https://example.com/1.jpg', 'https://example.com/2.jpg'] },
    { videoUrl: 'https://example.com/preview.mp4', duration: 15 },
    { suggestions: ['Lihat selengkapnya', 'Bagikan', 'Simpan'] }
  ]
}, { quoted: message })
```
</details>

<details>
<summary><b>Full Mixed (all types)</b></summary>

```js
await sock.sendMessage(jid, {
  items: [
    { text: '*Laporan Harian Bot*' },
    { table: { headers: ['Metric', 'Value'], rows: [['Uptime', '99.9%'], ['Messages', '1.2K']] } },
    { code: 'SELECT COUNT(*) FROM messages WHERE date = CURDATE()', language: 'sql' },
    { text: 'Formula uptime:' },
    {
      latexUrl: 'https://latex.codecogs.com/png.latex?U%3D%5Cfrac%7Bt_u%7D%7Bt_t%7D%5Ctimes100',
      latexText: 'U = (tu/tt) × 100'
    },
    { sources: [['https://example.com/fav.ico', 'https://example.com', 'Dashboard']] },
    { suggestions: ['Refresh', 'Export PDF'] },
    { footer: 'Auto-generated · PontaCT' }
  ]
}, { quoted: message })
```
</details>

---

#### 🔗 Rich Response — `richResponse`

> Full array mode supporting all types including inline citations via `inlineEntities`.

**Valid keys in `richResponse`:**

| Key | Type |
|:---|:---|
| `{ text, inlineEntities? }` | Text + optional citation/hyperlink |
| `{ code, language }` | Code block |
| `{ table, title? }` | Table — ⚠️ format beda dari `items`/top-level: `table` di sini harus array baris siap-pakai `[{ items: [...], isHeading }]`, **bukan** `{ headers, rows }` |
| `{ images }` | Image grid |
| `{ video }` | Video embed |
| `{ suggestions }` | Suggestion pills |
| `{ latex }` | LaTeX formula |
| `{ product }` | Product card(s) |
| `{ post }` | Post card(s) |
| `{ reels }` | Reels carousel |
| `{ sources }` | Search sources |
| `{ tip }` | Tip metadata |
| `{ footer }` | Footer metadata |

<details>
<summary><b>Inline Citation</b></summary>

```js
await sock.sendMessage(jid, {
  richResponse: [
    {
      text: 'Node.js {{SS_0}}¹{{/SS_0}} adalah runtime JavaScript. Dibuat oleh Ryan Dahl {{SS_1}}²{{/SS_1}} pada 2009.',
      inlineEntities: [
        {
          key: 'SS_0',
          metadata: {
            reference_id: 1,
            reference_url: 'https://nodejs.org',
            reference_title: 'Node.js Official',
            reference_display_name: 'nodejs.org',
            sources: [{
              source_type: 'THIRD_PARTY',
              source_display_name: 'nodejs.org',
              source_subtitle: 'nodejs.org',
              source_url: 'https://nodejs.org'
            }],
            __typename: 'GenAISearchCitationItem'
          }
        },
        {
          key: 'SS_1',
          metadata: {
            reference_id: 2,
            reference_url: 'https://wikipedia.org/wiki/Ryan_Dahl',
            reference_title: 'Ryan Dahl - Wikipedia',
            reference_display_name: 'Wikipedia',
            sources: [{
              source_type: 'THIRD_PARTY',
              source_display_name: 'Wikipedia',
              source_subtitle: 'wikipedia.org',
              source_url: 'https://wikipedia.org/wiki/Ryan_Dahl'
            }],
            __typename: 'GenAISearchCitationItem'
          }
        }
      ]
    }
  ]
}, { quoted: message })
```
</details>

<details>
<summary><b>Full Response — all types at once</b></summary>

```js
await sock.sendMessage(jid, {
  richResponse: [
    { text: '*Hasil Pencarian:* Node.js {{SS_0}}¹{{/SS_0}}', inlineEntities: [/* ... */] },
    { images: ['https://example.com/nodejs.png'] },
    { text: 'Cara install:' },
    { code: 'npm install node', language: 'bash' },
    {
      table: [
        { items: ['Version', 'LTS', 'Release'], isHeading: true },
        { items: ['22.x', 'Yes', '2024'], isHeading: false },
        { items: ['21.x', 'No', '2023'], isHeading: false }
      ]
    },
    { sources: [['https://nodejs.org/fav.ico', 'https://nodejs.org', 'Node.js']] },
    { suggestions: ['Lihat changelog', 'Download', 'Docs'] },
    { footer: 'PontaCT · pontalabs' }
  ]
}, { quoted: message })
```
</details>

---

#### ⚙️ Rich Options

<details>
<summary><b><code>aiForwarded</code> — toggle label "Diteruskan dari bot AI"</b></summary>

> Default `false`. Set `true` kalau mau pesan diberi tag forwarded-from-AI-bot di `contextInfo`. Bisa dipakai bareng key rich manapun (`richText`, `items`, `richResponse`, dll).

```js
await sock.sendMessage(jid, {
  richText: 'Pesan dengan label AI bot',
  aiForwarded: true
}, { quoted: message })
```
</details>

---

## 📣 Newsletter

<details>
<summary><b>📋 Get Newsletter Metadata</b></summary>

```js
// By invite code
const newsletter = await sock.newsletterMetadata('invite', '0029Vaf0HPMLdQeZsp3XRp2T')

// By JID
const newsletter = await sock.newsletterMetadata('jid', '120363282083849178@newsletter')
```
</details>

<details>
<summary><b>👆 Follow / Unfollow / Mute / Unmute</b></summary>

```js
const nlJid = '120363282083849178@newsletter'

await sock.newsletterFollow(nlJid)
await sock.newsletterUnfollow(nlJid)
await sock.newsletterMute(nlJid)
await sock.newsletterUnmute(nlJid)
```
</details>

<details>
<summary><b>📣 Create Newsletter</b></summary>

```js
const newsletter = await sock.newsletterCreate(
  'Newsletter Name',
  'Description here',
  { url: 'https://example.com/image.jpg' }
)
```
</details>

<details>
<summary><b>🌟 React to Newsletter Post</b></summary>

```js
await sock.newsletterReactMessage(
  '120363282083849178@newsletter',
  '12',   // server message ID
  '🦖'    // emoji
)
```
</details>

---

## 👥 Groups

<details>
<summary><b>🔄 Create Group</b></summary>

```js
const group = await sock.groupCreate('Group Title', [
  '1234567890@s.whatsapp.net',
  '0987654321@s.whatsapp.net'
])

console.log('Group JID:', group.id)
```
</details>

<details>
<summary><b>⚙️ Group Settings</b></summary>

```js
const jid = '123456789@g.us'

await sock.groupSettingUpdate(jid, 'announcement')      // admin-only messages
await sock.groupSettingUpdate(jid, 'not_announcement')  // all members can send
await sock.groupSettingUpdate(jid, 'locked')            // admin-only edit info
await sock.groupSettingUpdate(jid, 'unlocked')          // all members can edit info
```
</details>

<details>
<summary><b>💯 Add / Remove / Promote / Demote</b></summary>

```js
const participants = ['1234567890@s.whatsapp.net']

await sock.groupParticipantsUpdate(jid, participants, 'add')
await sock.groupParticipantsUpdate(jid, participants, 'remove')
await sock.groupParticipantsUpdate(jid, participants, 'promote')
await sock.groupParticipantsUpdate(jid, participants, 'demote')
```
</details>

<details>
<summary><b>🔗 Invite Link</b></summary>

```js
const code = await sock.groupInviteCode(jid)
console.log('Link: https://chat.whatsapp.com/' + code)

// Revoke & generate new link
const newCode = await sock.groupRevokeInvite(jid)
```
</details>

<details>
<summary><b>📋 Group Metadata</b></summary>

```js
const metadata = await sock.groupMetadata(jid)
console.log('Name:', metadata.subject)
console.log('Participants:', metadata.participants.length)
```
</details>

<details>
<summary><b>📢 Group Status</b></summary>

> Send group status (`groupStatusMessageV2`) with audience control and styling. `message` can be a `string` or a prepared WAMessage object.

```js
// Text Status
await sock.sendMessage(jid, {
  groupStatus: {
    message: 'Selamat datang di grup PontaCT! 🎉',
    audienceType: 0  // 0 = all members
  }
})

// Styled Text Status
await sock.sendMessage(jid, {
  groupStatus: {
    message: 'Bot aktif kembali! ✅',
    audienceType: 0,
    backgroundArgb: 0xFF1A1A2E,
    textArgb: 0xFFFFFFFF,
    font: 4
  }
})

// Media Status
const { imageMessage } = await prepareWAMessageMedia(
  { image: { url: 'https://example.com/banner.jpg' } },
  { upload: sock.waUploadToServer }
)

await sock.sendMessage(jid, {
  groupStatus: { message: { imageMessage }, audienceType: 0 }
})
```

<details>
<summary><b>📋 Fields Reference</b></summary>

| Field | Type | Required | Default | Description |
|:---|:---|:---:|:---|:---|
| `message` | `string / object` | ✅ | — | Status content (string or WAMessage) |
| `audienceType` | `number` | — | `0` | Target audience (0 = all) |
| `backgroundArgb` | `number` | — | — | Background ARGB color (text only) |
| `textArgb` | `number` | — | — | Text ARGB color (text only) |
| `font` | `number` | — | — | Font style 0–9 (text only) |

</details>

</details>

---

## 🔒 Privacy

<details>
<summary><b>🖼️ Profile Picture</b></summary>

```js
await sock.updateProfilePicture(jid, { url: 'https://example.com/image.jpg' })
await sock.removeProfilePicture(jid)
```
</details>

<details>
<summary><b>🚫 Block / Unblock</b></summary>

```js
await sock.updateBlockStatus(jid, 'block')
await sock.updateBlockStatus(jid, 'unblock')
```
</details>

<details>
<summary><b>👁️ Privacy Settings</b></summary>

```js
await sock.updateLastSeenPrivacy('all')         // 'all' | 'contacts' | 'none'
await sock.updateOnlinePrivacy('all')           // 'all' | 'match_last_seen'
await sock.updateProfilePicturePrivacy('all')   // 'all' | 'contacts' | 'none'
await sock.updateReadReceiptsPrivacy('all')     // 'all' | 'none'
await sock.updateGroupsAddPrivacy('all')        // 'all' | 'contacts'
await sock.updateDefaultDisappearingMode(86400) // 0 = disable
```
</details>

---

## ⚙️ Advanced

<details>
<summary><b>🔧 Debug Logging</b></summary>

```js
const sock = makeWASocket({
  logger: { level: 'debug' }, // 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace'
  auth: state
})
```
</details>

<details>
<summary><b>📡 Raw WebSocket Events</b></summary>

```js
sock.ws.on('CB:presence', (json) => {
  console.log('Presence update:', json)
})

sock.ws.on('CB:edge_routing', (node) => {
  console.log('Edge routing:', node)
})
```
</details>

<details>
<summary><b>📅 Event RSVP Utilities</b></summary>

> Dua fungsi util untuk memproses respons RSVP (`GOING` / `NOT_GOING` / `MAYBE`) pada pesan event kalender secara lokal, tanpa perlu ambil ulang dari server.

```js
const { updateMessageWithEventResponse, getAggregateResponsesInEventMessage } = require('@hansamal/baileys')

// terapkan RSVP baru ke object event message yang sudah kamu simpan
updateMessageWithEventResponse(eventMsg, {
  eventResponseMessageKey: update.key,
  response: { response: 1 } // 1 = GOING
})

// rekap semua RSVP jadi { GOING: [...], NOT_GOING: [...], MAYBE: [...] }
const summary = getAggregateResponsesInEventMessage(eventMsg, sock.user.lid)
```
</details>

---

## ⚡ Contact

| Platform | Link |
|:---|:---|
| 💬 Telegram | [@pontact](https://t.me/pontact) |
| 📢 Channel | [WhatsApp Channel](#) |
| 🌐 REST API | [api.codeteam.web.id](https://api.codeteam.web.id) |

---

## 🤝 Contributing

1. **Fork** repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: add something awesome"`
4. Push to your branch: `git push origin feat/your-feature`
5. Open a **Pull Request**

---

## 📜 License

This project is licensed for **personal and non-commercial use only**.

| | |
|:---:|:---|
| ✅ | Personal use and modification allowed |
| ✅ | Redistribution with attribution allowed |
| ❌ | Commercial use strictly prohibited |
| ❌ | Resale or rebranding prohibited |

---

## ⚠️ Disclaimer

> This project is **not affiliated with WhatsApp or Meta** in any way.  
> Use at your own risk and refer to WhatsApp's [Terms of Service](https://www.whatsapp.com/legal/terms-of-service) for compliance.

---

<div align="center">

[📦 NPM](https://www.npmjs.com/package/@hansamal/baileys) · [📖 Baileys Wiki](https://github.com/WhiskeySockets/Baileys/wiki) · [⭐ Star this repo](#)

<br>

Made with ♥ by **PontaCT**

</div>
