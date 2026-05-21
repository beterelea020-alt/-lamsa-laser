import { useState } from 'react'
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import { FiGrid, FiPackage, FiShoppingCart, FiLogOut, FiMenu, FiX } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import AdminDashboard from '../components/admin/AdminDashboard'
import AdminProducts from '../components/admin/AdminProducts'
import AdminOrders from '../components/admin/AdminOrders'
import styles from './Admin.module.css'

export default function Admin() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sideOpen, setSideOpen] = useState(false)

  if (!user) { navigate('/login'); return null }

  const handleLogout = async () => { await logout(); navigate('/') }

  const nav = [
    { to: '/admin',          icon: <FiGrid />,         label: 'لوحة التحكم', end: true },
    { to: '/admin/products', icon: <FiPackage />,      label: 'المنتجات' },
    { to: '/admin/orders',   icon: <FiShoppingCart />, label: 'الطلبات' },
  ]

  return (
    <div className={styles.layout}>
      <aside className={`${styles.sidebar} ${sideOpen ? styles.sideOpen : ''}`}>
        <div className={styles.sideHead}>
          <div className={styles.sideLogo}>✦ <span>Lamsa Admin</span></div>
          <button className={styles.sideClose} onClick={() => setSideOpen(false)}><FiX /></button>
        </div>
        <nav className={styles.sideNav}>
          {nav.map(n => (
            <NavLink key={n.to} to={n.to} end={n.end}
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navActive : ''}`}
              onClick={() => setSideOpen(false)}>
              {n.icon} {n.label}
            </NavLink>
          ))}
        </nav>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <FiLogOut /> تسجيل الخروج
        </button>
      </aside>
      {sideOpen && <div className={styles.overlay} onClick={() => setSideOpen(false)} />}
      <div className={styles.main}>
        <header className={styles.topBar}>
          <button className={styles.menuBtn} onClick={() => setSideOpen(true)}><FiMenu size={20} /></button>
          <h2 className={styles.topTitle}>Lamsa Laser — لوحة التحكم</h2>
        </header>
        <div className={styles.content}>
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}
