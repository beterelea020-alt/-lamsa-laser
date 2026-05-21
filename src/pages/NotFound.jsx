import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '70vh', gap: '1rem', padding: '2rem', textAlign: 'center'
    }}>
      <div style={{ fontSize: '5rem', color: 'var(--pink)' }}>✦</div>
      <h3 style={{ fontFamily: 'var(--font-disp)', fontSize: '2rem', color: 'var(--dark)' }}>
        الصفحة غير موجودة
      </h3>
      <p style={{ color: 'var(--muted)' }}>الصفحة التي تبحث عنها غير موجودة.</p>
      <Link to="/" className="btn-primary">العودة للرئيسية</Link>
    </div>
  )
}
