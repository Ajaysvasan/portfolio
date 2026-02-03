# Ajay S Vasan — Portfolio

React + Tailwind + Spline portfolio inspired by [Reflect](https://reflect.app).

## Stack

- **React** (Vite)
- **Tailwind CSS**
- **Spline** — 3D hero background ([spline.design](https://spline.design))

## Setup

```bash
npm install
npm run dev
```

Build: `npm run build`  
Preview build: `npm run preview`

## Customize

- **Profile image:** Put your photo at `public/images/profile.jpg`. It appears in the hero; if missing, a placeholder is shown.
- **Spline scene:** Edit `src/components/SplineHero.jsx` and set `SPLINE_SCENE` to your scene URL from Spline (Export → Code → React). If the default scene fails to load, the hero still works.
