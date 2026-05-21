import { useLocation, Link } from 'react-router-dom'
import { FaWhatsapp } from 'react-icons/fa'
import { FiShoppingBag, FiHome } from 'react-icons/fi'
import styles from './OrderSuccess.module.css'

const WA = import.meta.env.VITE_WHATSAPP_NUMBER || '201234567890'

export default function OrderSuccess() {
  const { state } = useLocation()
  const orderId = state?.orderId || 'N/A'
  const name = state?.customerName || 'العميل'

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.icon}>✓</div>
        <h1 className={styles.title}>تم استقبال الطلب!</h1>
        <p className={styles.sub}>شكراً <strong>{name}</strong>! طلبك وصل لنا بنجاح.</p>
        <div className={styles.orderId}>رقم الطلب: <strong>#{orderId}</strong></div>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={`${styles.stepDot} ${styles.stepActive}`}>✓</div>
            <span>تم استقبال الطلب</span>
          </div>
          <div className={styles.step}>
            <div className={styles.stepDot}>2</div>
            <span>تأكيد واتساب</span>
          </div>
          <div className={styles.step}>
            <div className={styles.stepDot}>3</div>
            <span>الصنع والتوصيل</span>
          </div>
        </div>
        <p className={styles.waMsg}>سنؤكد طلبك على واتساب في الحال. إن لم تفتح التطبيق:</p>
        <a href={`https://wa.me/${WA}`} target="_blank" rel="noopener noreferrer" 
          className={styles.waBtn}>
          <FaWhatsapp size={18} /> افتح واتساب
        </a>
        <div className={styles.actions}>
          <Link to="/products" className="btn-outline" style={{ fontSize: '0.82rem', padding: '8px 18px' }}>
            <FiShoppingBag size={14} /> متابعة التسوق
          </Link>
          <Link to="/" className="btn-outline" style={{ fontSize: '0.82rem', padding: '8px 18px' }}>
            <FiHome size={14} /> الرئيسية
          </Link>
        </div>
      </div>
    </div>
  )
}
