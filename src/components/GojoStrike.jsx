import GojoFigure from './intro/GojoFigure'

/**
 * Gojo stepping in from the edge of the screen to fire Hollow Purple during a
 * page transition. `dir` 1 fires left → right (he stands at the left); -1 mirrors him.
 */
export default function GojoStrike({ dir, fired, leaving, tipRef }) {
  return (
    <div
      aria-hidden
      className={`gojo-strike ${dir < 0 ? 'gojo-strike--rtl' : ''} ${fired ? 'is-fired' : ''} ${leaving ? 'is-leaving' : ''}`}
    >
      <div className="gojo-strike__cam">
        <div className="gojo-strike__kick">
          <GojoFigure hand="fire" handDelay={-5000} eyes blast={fired} wind={1.4} tipRef={tipRef} />
        </div>
      </div>
    </div>
  )
}
