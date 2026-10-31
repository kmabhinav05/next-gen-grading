# Performance, 60 FPS Animation & Mobile Responsive Architecture

This document outlines the performance optimizations, mobile-first responsive architecture, and frame budget guidelines implemented across the **Next Gen Grading** platform.

---

## 1. Core Performance Budget & Benchmarks

| Metric | Target | Implemented Status |
| :--- | :--- | :--- |
| **Animation Frame Budget** | **&le; 16.6 ms (60 FPS)** on mid-range mobile | Achieved via GPU compositing (`transform`, `opacity`) |
| **Initial Gzipped Bundle** | **&lt; 200 KB** initial load | Achieved via 18-route `React.lazy` code-splitting |
| **Mobile Breakpoints** | 360px, 390px, 768px, 1024px, 1440px | Fully fluid via Tailwind breakpoints & safe-area insets |
| **iOS Auto-Zoom Dislocation** | **Zero auto-zoom** | `input { font-size: 16px; }` enforced on mobile viewports |
| **Touch Targets** | **&ge; 44 &times; 44 px** | Touch target utility applied to all interactive controls |
| **PWA Installability** | Standalone installable PWA | Implemented via `vite-plugin-pwa` and Service Worker |

---

## 2. Mobile-First Responsive Architecture

### A. Viewport & Dynamic Units
- `index.html` configured with:
  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover">
  ```
- Replaced rigid `vh` units with `100dvh` and `min-h-[100dvh]` across container layouts (`DashboardLayout.jsx`, `ChatbotWidget.jsx`) to eliminate URL toolbar layout jumps on Android Chrome and iOS Safari.
- Integrated CSS environment safe areas:
  ```css
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
  padding-top: max(0.5rem, env(safe-area-inset-top));
  ```

### B. Adaptive Navigation Hierarchy
- **Desktop (&ge; 1024px / lg)**:
  - Fixed horizontal `PillNav` header with split layout and active dot indicators.
  - Quick action profile flyout and dedicated settings navigation.
- **Mobile (&lt; 1024px)**:
  - **Slide-in Left Drawer**: Accessible via topbar hamburger icon with animated GPU backdrop blur.
  - **Bottom Navigation Bar (`BottomNav.jsx`)**: Fixed touch-friendly dock mounting the 4 to 5 most frequent tasks per role:
    - *Student*: Home, Progress, Attendance, Results, Profile
    - *Faculty / Staff*: Home, Marks, Attendance, Reports, Profile
    - *Admin*: Home, Students, Faculty, Reports, Settings
    - *Parent*: Home, Progress, Attendance, Results, Profile
  - Haptic audio feedback on bottom-dock taps with active pill indicators.

### C. Data Tables to Mobile Cards
- High-density data tables (e.g. `UploadMarks.jsx`, `ProgressCard.jsx`, `MyAttendance.jsx`) dynamically adapt:
  - On desktop (`&ge; md`): Full multi-column data grid with sticky table headers.
  - On mobile (`&lt; md`): Transformed into stacked card blocks displaying register numbers, scores, and status tags with zero horizontal page blowout.

### D. Form Inputs & Accessibility
- All inputs on mobile maintain `font-size: 16px` to prevent iOS Safari auto-zooming into form fields.
- Interactive buttons, pills, and toggles observe a minimum physical hit area of `44x44px`.
- Drag-and-drop file uploaders gracefully fall back to native touch file pickers on mobile devices.

---

## 3. 60 FPS Compositing & Rendering Rules

### A. GPU Acceleration & Layer Promotion
- **Permitted Animated Properties**:
  - `transform` (`translate3d`, `scale`, `rotate`)
  - `opacity`
- **Forbidden Animated Properties**:
  - `width`, `height`, `top`, `left`, `margin`, `padding`
  - `box-shadow` blur radius (use opacity of pseudo-elements with pre-computed shadows instead)
- Dedicated utility classes in `index.css`:
  ```css
  .gpu-composited {
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000px;
    will-change: transform, opacity;
  }
  ```

### B. Reduced Motion Compliance
All keyframe animations, bouncing badges, and spring transitions automatically disable when `prefers-reduced-motion` is detected in the operating system:
```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 4. Code Splitting & Caching Strategy

### A. Route Code-Splitting
All 18 application routes in `AppRoutes.jsx` are wrapped in `React.lazy()` with a lightweight `PageLoadingSkeleton` fallback:
- Split bundles load strictly on demand when navigation occurs.
- Initial bundle delivers only the minimal core runtime shell.

### B. Manual Chunk Splitting (`vite.config.js`)
Configured Rollup manual chunks:
- `react-vendor`: `react`, `react-dom`, `react-router-dom`
- `charts`: `chart.js`, `react-chartjs-2`
- `motion`: `framer-motion`
- `icons`: `lucide-react`
- `query`: `@tanstack/react-query`

### C. Service Worker & Offline Caching
Integrated `VitePWA` in `vite.config.js`:
- Pre-caches HTML shell, Google Inter fonts, and compiled JS/CSS.
- Stale-While-Revalidate caching strategy for API requests and academic records.
- Standalone PWA installation support via `manifest.webmanifest`.

---

## 5. Verification & Audit Guide

### Testing 60 FPS in Chrome DevTools:
1. Open DevTools (`Ctrl + Shift + I` / `Cmd + Option + I`).
2. Press `Ctrl + Shift + P`, type **Show Frames per second (FPS) meter**, and hit Enter.
3. Toggle mobile emulation mode (`iPhone 14 Pro` or `Pixel 7`).
4. Interact with the bottom navigation dock, slide-in drawer, and Glass Calendar — observe consistent 60 FPS rendering with green frame markers.

### Testing Print & PDF Layout:
1. Open any student or parent progress card.
2. Trigger `window.print()` or click **Print Card**.
3. Verify that the output formats as a single clean portrait A4 sheet adhering to `@page { size: A4 portrait; margin: 12mm 15mm; }`.
