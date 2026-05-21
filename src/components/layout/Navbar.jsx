import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiShoppingBag, FiMenu, FiX } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { count }           = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]     = useState(false)
  const location            = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => { setOpen(false) }, [location])

  const links = [
    { to: '/',         label: 'الرئيسية' },
    { to: '/products', label: 'المنتجات' },
  ]

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.inner}>
          <Link to="/" className={styles.logo}>لمسة</Link>

          <ul className={styles.links}>
            {links.map(l => (
              <li key={l.to}>
                <Link to={l.to} className={location.pathname === l.to ? styles.active : ''}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className={styles.actions}>
            <Link to="/cart" className={styles.cartBtn} aria-label="السلة">
              <FiShoppingBag size={20} />
              {count > 0 && <span className={styles.badge}>{count}</span>}
            </Link>
            <button className={styles.hamburger} onClick={() => setOpen(o => !o)} aria-label="قائمة">
              {open ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`}>
        <ul>
          {links.map(l => (
            <li key={l.to}><Link to={l.to}>{l.label}</Link></li>
          ))}
          <li><Link to="/cart">السلة {count > 0 && `(${count})`}</Link></li>
        </ul>
      </div>
      {open && <div className={styles.overlay} onClick={() => setOpen(false)} />}
    </>
  )
}
