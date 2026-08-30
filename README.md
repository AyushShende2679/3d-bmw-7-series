# BMW 7 Series — Cinematic 3D Scrollytelling Experience

[![Live Demo](https://img.shields.io/badge/Live_Demo-Cloudflare_Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://3d-bmw-7-series.ayushshende2679.workers.dev/)
[![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

An Awwwards-level interactive digital brand experience for the flagship **BMW 7 Series**, powered by full-bleed HTML5 Canvas 2D image sequence rendering, 240-frame 3D anatomical deconstruction, real-time Web Audio API TwinPower Turbo V8 sound synthesis, interactive component telemetry hotspots, and a bespoke luxury vehicle configurator.

🌐 **Live Experience**: [https://3d-bmw-7-series.ayushshende2679.workers.dev/](https://3d-bmw-7-series.ayushshende2679.workers.dev/)

---

## ✨ Features

- **🎞️ Full-Bleed 240-Frame Canvas Scrollytelling**:
  - Edge-to-edge high-DPI canvas rendering (`cover` scaling) with zero letterboxing or background seams.
  - Silky smooth Linear Interpolation (`lerp`) with `requestAnimationFrame` for stutter-free scroll-linked animation.
  - Progressive preloader with precision Bavarian diagnostics and status updates.

- **📖 6-Stage Narrative Storytelling**:
  - **Stage 01 // Silhouette Hero (0–15%)**: Monolithic side profile, laserlights, and flagship specs (536 HP / 4.1s 0–60).
  - **Stage 02 // Exterior Deconstruction (15–35%)**: Body panels float open in 3D space, revealing active air flaps and Carbon Core monocoque.
  - **Stage 03 // V8 Powertrain Anatomy (35–55%)**: Isometric exploded view of the 4.4L TwinPower Turbo V8, twin twin-scroll turbos, and xDrive.
  - **Stage 04 // Chassis & Intelligence (55–72%)**: Adaptive 2-axle air suspension, integral active 4-wheel steering, and Curved Display cockpit.
  - **Stage 05 // Executive Cabin (72–87%)**: Merino leather seating, Bowers & Wilkins 4D Diamond sound, and ambient lighting.
  - **Stage 06 // Hero Convergence (87–100%)**: Final vehicle hero composition with conversion CTAs and specs explorer.

- **🔊 BMW M Sound Acoustic Lab (Web Audio API)**:
  - Interactive engine sound synthesizer generating authentic starter crank, idle purr, tachometer-linked throttle revs (0–8,000 RPM), turbo spool, and exhaust overrun crackles without external audio files.

- **🎨 Selective Exterior Paint Customizer**:
  - Real-time metallic paint shader for Black Sapphire Metallic, Tanzanite Blue II, Isle of Man Green, Frozen Pure Grey, Aventurin Red, and Mineral White that tints the car body while keeping the studio background pitch black.

- **🎯 Interactive 3D Component Hotspots**:
  - Clickable pulse markers pinned to the Engine, Transmission, Executive Seats, Air Suspension, Carbon Core, and Active Aerodynamics with animated telemetry modal cards.

- **🛠️ "Build Yours" Luxury Configurator**:
  - Interactive model selection (760i / 740i / i7 M70), wheels, Merino leather upholstery, M Sport packages, and real-time MSRP calculator with digital reference code export.

- **📊 Technical Telemetry Dossier**:
  - Full engineering spec matrix covering Powertrain, Chassis Dynamics, Dimensions, Aerodynamics (Cd 0.24), and Digital Cockpit.

---

## 🚀 Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite 6](https://vitejs.dev/)
- **Deployment**: [Cloudflare Workers / Pages](https://workers.cloudflare.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom Glassmorphism / Metallic Gradients
- **Canvas Engine**: HTML5 Canvas 2D with High-DPI Retina Scaling & Lerp Easing
- **Audio Engine**: Web Audio API (OscillatorNode, WaveShaper, BiquadFilterNode)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Typography**: Google Fonts (Space Grotesk, Inter, JetBrains Mono)

---

## 📁 Project Structure

```
3d-bmw-7-series/
├── public/
│   └── frames/                    # 240 high-resolution sequence frames (ezgif-frame-001.jpg .. 240.jpg)
├── src/
│   ├── components/
│   │   ├── Navbar.jsx             # Frosted glass top navigation bar with quick CTAs
│   │   ├── ScrollyCanvas.jsx      # Sticky 2D canvas with lerp animation & DPR scaling
│   │   ├── StoryOverlays.jsx      # 6-beat editorial typography & floating metric cards
│   │   ├── HotspotsOverlay.jsx    # Interactive 3D component telemetry markers
│   │   ├── EngineSoundModal.jsx   # Web Audio V8 TwinPower engine sound simulator
│   │   ├── ColorCustomizer.jsx    # Real-time paint finish selector
│   │   ├── SpecsSection.jsx       # Interactive technical engineering matrix
│   │   ├── ConfiguratorModal.jsx  # "Build Yours" bespoke customizer modal
│   │   ├── Preloader.jsx          # Bavarian precision loading screen
│   │   └── TelemetryHud.jsx       # Real-time frame index & subsystem monitor
│   ├── utils/
│   │   ├── audioSynthesizer.js    # Web Audio API engine sound & UI haptics
│   │   └── sequenceLoader.js      # Image preloading, caching & selective paint shader
│   ├── App.jsx                    # Core page orchestrator
│   ├── index.css                  # Custom styling, typography, glassmorphism & gradients
│   └── main.jsx                   # Application entry point
├── index.html                     # HTML5 entry with meta tags & typography
├── package.json                   # Project dependencies & scripts
├── tailwind.config.js             # Custom BMW dark luxury color tokens
├── postcss.config.js              # PostCSS plugins
├── wrangler.json                  # Cloudflare deployment config
└── vite.config.js                 # Vite bundler configuration
```

---

## 🛠️ Getting Started & Installation

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (version 18+ recommended) installed.

### 1. Clone the repository
```bash
git clone https://github.com/AyushShende2679/3d-bmw-7-series.git
cd 3d-bmw-7-series
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```
Open `http://localhost:5173/` in your browser to view the application.

### 4. Build for production
```bash
npm run build
```
The optimized production bundle will be generated in the `dist/` directory.

### 5. Deploy to Cloudflare
```bash
npx wrangler deploy
```

---

## 📜 License

Created for educational, portfolio, and automotive brand design demonstration purposes. BMW and the BMW logo are registered trademarks of Bayerische Motoren Werke AG.
