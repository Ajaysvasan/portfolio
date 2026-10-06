// Page registry. Navigation is hash based (#/projects) so back/forward and
// refresh work, and every change plays the Hollow Purple transition.
export const ROUTES = [
  { id: 'home', label: 'Home', kanji: '始' },
  { id: 'experience', label: 'Experience', kanji: '経験', tagline: "Where I've been" },
  { id: 'projects', label: 'Projects', kanji: '作品', tagline: "What I've built" },
  { id: 'skills', label: 'Skills', kanji: '術式', tagline: 'What I use' },
  { id: 'education', label: 'Education', kanji: '学歴', tagline: 'Where I learned' },
  { id: 'achievements', label: 'Achievements', kanji: '功績', tagline: 'Wins' },
  { id: 'contact', label: 'Contact', kanji: '連絡', tagline: 'Reach out' },
]

export const routeHref = (id) => (id === 'home' ? '#/' : `#/${id}`)

/** Accepts both `#/projects` and legacy `#projects` anchors. */
export function routeFromHash(hash) {
  const id = hash.replace(/^#\/?/, '').split(/[/?]/)[0]
  return ROUTES.some((r) => r.id === id) ? id : 'home'
}
