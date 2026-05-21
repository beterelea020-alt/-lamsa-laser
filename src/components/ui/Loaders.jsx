// PageLoader.jsx
export function PageLoader() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', flexDirection: 'column', gap: '1rem'
    }}>
      <div style={{
        width: 44, height: 44,
        border: '3px solid var(--border)',
        borderTopColor: 'var(--pink-dark)',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite'
      }} />
      <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>جاري التحميل…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// ProductSkeleton.jsx
export function ProductSkeleton({ count = 4 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{
          background: 'white',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          overflow: 'hidden',
          animation: `shimmer 1.5s ease-in-out ${i * 0.1}s infinite alternate`
        }}>
          <div style={{ aspectRatio: '1/1', background: 'var(--bg3)' }} />
          <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ height: 10, width: '40%', background: 'var(--bg3)', borderRadius: 4 }} />
            <div style={{ height: 14, width: '75%', background: 'var(--bg3)', borderRadius: 4 }} />
            <div style={{ height: 10, width: '90%', background: 'var(--bg3)', borderRadius: 4 }} />
            <div style={{ height: 10, width: '60%', background: 'var(--bg3)', borderRadius: 4 }} />
            <div style={{ height: 18, width: '45%', background: 'var(--bg3)', borderRadius: 4, marginTop: 8 }} />
          </div>
          <style>{`@keyframes shimmer { from { opacity: 0.6; } to { opacity: 1; } }`}</style>
        </div>
      ))}
    </>
  )
}
