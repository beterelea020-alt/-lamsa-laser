import { useProducts, useOrders } from '../../firebase/hooks'
import styles from './AdminDashboard.module.css'

const STATUS_COLORS = {
  pending:    { bg: '#fef3c7', color: '#92400e' },
  confirmed:  { bg: '#d1fae5', color: '#065f46' },
  delivered:  { bg: '#dbeafe', color: '#1e40af' },
  cancelled:  { bg: '#fee2e2', color: '#991b1b' },
}

export default function AdminDashboard() {
  const { products } = useProducts()
  const { orders }   = useOrders()

  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((s, o) => s + (o.total || 0), 0)

  const pending = orders.filter(o => o.status === 'pending').length
  const recent  = orders.slice(0, 5)

  const stats = [
    { label: 'Total Products', value: products.length,       icon: '📦' },
    { label: 'Total Orders',   value: orders.length,         icon: '🛍️' },
    { label: 'Pending',        value: pending,               icon: '⏳' },
    { label: 'Revenue (EGP)',  value: totalRevenue.toLocaleString(), icon: '💰' },
  ]

  return (
    <div className={styles.wrap}>
      <h2 className={styles.heading}>Dashboard</h2>

      <div className={styles.statsGrid}>
        {stats.map(s => (
          <div key={s.label} className={styles.statCard}>
            <div className={styles.statIcon}>{s.icon}</div>
            <div className={styles.statVal}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className={styles.section}>
        <h3 className={styles.subHeading}>Recent Orders</h3>
        {recent.length === 0 ? (
          <p className={styles.empty}>No orders yet.</p>
        ) : (
          <div className={styles.table}>
            <div className={styles.tableHead}>
              <span>Order ID</span>
              <span>Customer</span>
              <span>Total</span>
              <span>Status</span>
              <span>Date</span>
            </div>
            {recent.map(o => (
              <div key={o.id} className={styles.tableRow}>
                <span className={styles.orderId}>#{o.id.slice(-6).toUpperCase()}</span>
                <span>{o.customer?.name || '—'}</span>
                <span>EGP {o.total?.toLocaleString()}</span>
                <span>
                  <span
                    className={styles.statusBadge}
                    style={STATUS_COLORS[o.status] || STATUS_COLORS.pending}
                  >
                    {o.status}
                  </span>
                </span>
                <span className={styles.date}>
                  {o.createdAt?.toDate?.().toLocaleDateString('ar-EG') || '—'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
