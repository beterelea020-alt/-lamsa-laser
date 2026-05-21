import { useState } from 'react'
import { FiChevronDown, FiChevronUp, FiExternalLink } from 'react-icons/fi'
import { useOrders, updateOrderStatus } from '../../firebase/hooks'
import toast from 'react-hot-toast'
import styles from './AdminOrders.module.css'

const WA = import.meta.env.VITE_WHATSAPP_NUMBER || '201234567890'
const STATUSES = ['pending', 'confirmed', 'delivered', 'cancelled']

const STATUS_STYLE = {
  pending:   { bg: '#fef3c7', color: '#92400e' },
  confirmed: { bg: '#d1fae5', color: '#065f46' },
  delivered: { bg: '#dbeafe', color: '#1e40af' },
  cancelled: { bg: '#fee2e2', color: '#991b1b' },
}

export default function AdminOrders() {
  const { orders, loading } = useOrders()
  const [expanded, setExpanded] = useState(null)
  const [updating, setUpdating] = useState(null)

  const toggleExpand = id => setExpanded(e => e === id ? null : id)

  const handleStatus = async (id, status) => {
    setUpdating(id)
    try {
      await updateOrderStatus(id, status)
      toast.success(`Status → ${status}`)
    } catch { toast.error('Update failed') }
    finally { setUpdating(null) }
  }

  if (loading) return <p style={{ color: 'var(--muted)' }}>Loading orders…</p>

  return (
    <div className={styles.wrap}>
      <h2 className={styles.heading}>Orders ({orders.length})</h2>

      {orders.length === 0 ? (
        <div className={styles.empty}>No orders yet.</div>
      ) : (
        <div className={styles.list}>
          {orders.map(o => {
            const isOpen = expanded === o.id
            const statusStyle = STATUS_STYLE[o.status] || STATUS_STYLE.pending
            return (
              <div key={o.id} className={`${styles.order} ${isOpen ? styles.orderOpen : ''}`}>
                <div className={styles.orderHead} onClick={() => toggleExpand(o.id)}>
                  <div className={styles.orderMeta}>
                    <span className={styles.orderId}>#{o.id.slice(-6).toUpperCase()}</span>
                    <span className={styles.orderName}>{o.customer?.name}</span>
                    <span className={styles.orderCity}>{o.customer?.city}</span>
                  </div>
                  <div className={styles.orderRight}>
                    <span className={styles.orderTotal}>EGP {o.total?.toLocaleString()}</span>
                    <span className={styles.statusBadge} style={statusStyle}>{o.status}</span>
                    <span className={styles.date}>
                      {o.createdAt?.toDate?.().toLocaleDateString('ar-EG') || '—'}
                    </span>
                    {isOpen ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                  </div>
                </div>

                {isOpen && (
                  <div className={styles.orderBody}>
                    <div className={styles.cols}>
                      {/* Customer */}
                      <div className={styles.col}>
                        <h4>Customer</h4>
                        <p><strong>Name:</strong> {o.customer?.name}</p>
                        <p><strong>Phone:</strong> {o.customer?.phone}</p>
                        <p><strong>City:</strong> {o.customer?.city}</p>
                        <p><strong>Address:</strong> {o.customer?.address}</p>
                        {o.customer?.notes && <p><strong>Notes:</strong> {o.customer.notes}</p>}
                        <a
                          href={`https://wa.me/${o.customer?.phone?.replace(/\D/g, '')}`}
                          target="_blank" rel="noopener noreferrer"
                          className={styles.waLink}
                        >
                          <FiExternalLink size={12} /> WhatsApp Customer
                        </a>
                      </div>

                      {/* Items */}
                      <div className={styles.col}>
                        <h4>Items</h4>
                        {o.items?.map((item, i) => (
                          <div key={i} className={styles.itemRow}>
                            <span>{item.name} × {item.qty}</span>
                            <span>EGP {(item.price * item.qty).toLocaleString()}</span>
                          </div>
                        ))}
                        <div className={styles.totalRow}>
                          <strong>Total</strong>
                          <strong>EGP {o.total?.toLocaleString()}</strong>
                        </div>
                      </div>

                      {/* Status */}
                      <div className={styles.col}>
                        <h4>Update Status</h4>
                        <div className={styles.statusBtns}>
                          {STATUSES.map(s => (
                            <button
                              key={s}
                              className={`${styles.statusBtn} ${o.status === s ? styles.statusBtnActive : ''}`}
                              onClick={() => handleStatus(o.id, s)}
                              disabled={updating === o.id}
                              style={o.status === s ? statusStyle : {}}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
