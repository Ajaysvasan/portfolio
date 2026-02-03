export default function Footer() {
  return (
    <footer className="py-8 border-t border-jjk-border bg-jjk-surface/50">
      <div className="max-w-6xl mx-auto px-6 text-center text-sm text-jjk-muted">
        <p>© <span id="year">{new Date().getFullYear()}</span> Ajay S Vasan. Chennai, India.</p>
      </div>
    </footer>
  )
}
