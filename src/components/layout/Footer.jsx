import { Link } from 'react-router-dom'
import { FaWhatsapp, FaInstagram, FaTiktok } from 'react-icons/fa'
import styles from './Footer.module.css'

const WA = import.meta.env.VITE_WHATSAPP_NUMBER || '201234567890'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.logo}>لمسة Laser</div>
          <p className={styles.tagline}>هدايا مصنوعة بدقة — لأناس يستحقون التميّز</p>
          <div className={styles.socials}>
            <a href={`https://wa.me/${WA}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <FaWhatsapp size={18} />
            </a>
            <a href="#" aria-label="Instagram"><FaInstagram size={18} /></a>
            <a href="#" aria-label="TikTok"><FaTiktok size={18} /></a>
          </div>
        </div>

        <div className={styles.col}>
          <h4>روابط</h4>
          <ul>
            <li><Link to="/">الرئيسية</Link></li>
            <li><Link to="/products">المنتجات</Link></li>
            <li><Link to="/cart">السلة</Link></li>
          </ul>
        </div>

        <div className={styles.col}>
          <h4>تواصل</h4>
          <ul>
            <li>
              <a href={`https://wa.me/${WA}`} target="_blank" rel="noopener noreferrer">
                واتساب
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} لمسة Laser — جميع الحقوق محفوظة</p>
        <p>صُنع بـ ❤ في مصر</p>
      </div>
    </footer>
  )
}
