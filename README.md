# Ajay S Vasan — Portfolio

React + Tailwind portfolio themed on Gojo Satoru's Infinite Void (無量空処) and Hollow Purple (虚式「茈」).

## Stack

- **React** (Vite)
- **Tailwind CSS**
- Canvas + SVG animation (no animation libraries or images): the intro, the void background and the Hollow Purple page transition are all drawn live

## Setup

```bash
npm install
npm run dev
```

Build: `npm run build`  
Preview build: `npm run preview`

## Customize

- **Profile image:** Put your photo at `public/images/profile.jpg`. It appears in the hero; if missing, a placeholder is shown.
- **Pages:** Registered in `src/routes.js` (hash routes like `#/projects`). Each nav change fires Hollow Purple across the screen (`src/components/HollowPurpleSweep.jsx`).
- **Intro:** `src/components/intro/DomainExpansionIntro.jsx` holds the shot list and timings. Skip with the button or `Esc`; it's skipped automatically for `prefers-reduced-motion`.
- **Sound:** all effects are synthesized in `src/lib/sfx.js` (Web Audio, no audio files). Browsers need a click before audio can play, so the intro opens on an "Enter the domain" screen; the nav has a mute toggle and the choice is remembered.
- **Recordings (optional):** put audio files in `public/audio/` and set their paths in `CLIP_FILES` at the top of `src/lib/sfx.js` — e.g. Gojo's "Ryōiki Tenkai" / "Muryōkūsho" lines, an Infinite Void sound, Hollow Purple charge/launch. They play at the right moments in place of the synthesized versions. Only publish audio you have the rights to.
- **Page transitions:** moving forward through the pages Gojo fires Hollow Purple from the left; moving back he fires from the right.
