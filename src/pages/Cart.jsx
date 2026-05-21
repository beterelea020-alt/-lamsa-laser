import { Link, useNavigate } from 'react-router-dom'
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowLeft } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import styles from './Cart.module.css'

const EMOJIS = { Frames: '🖼️', Gifts: '🎁', Decor: '✨', Accessories: '💎' }

export default function Cart() {
  const { cart, total, count, removeFromCart, updateQty, clearCart } = useCart()
  const navigate = useNavigate()

  if (!cart.length) return (
    <div className={styles.empty}>
      <div className={styles.emptyIcon}><FiShoppingBag size={48} /></div>
      <h3>سلتك فارغة</h3>
      <p>اكتشفي مجموعتنا المميزة وأضيفي ما يعجبك.</p>
      <Link to="/products" className="btn-primary">تسوّقي الآن <FiArrowLeft size={16} /></Link>
    </div>
  )

  return (
    <div className="page-enter">
      <div className={styles.header}>
        <div className="container">
          <p className="section-sub">اختياراتك</p>
          <h1 className="section-title">سلة التسوق</h1>
          <p className={styles.headerSub}>{count} منتج</p>
        </div>
      </div>

      <div className={styles.body}>
        <div className="container">
          <div className={styles.layout}>
            <div className={styles.items}>
              {cart.map(item => (
                <div key={item.id} className={styles.item}>
                  <div className={styles.itemImg} onClick={() => navigate(`/products/${item.id}`)}>
                    {item.imageUrl
                      ? <img src={item.imageUrl} alt={item.name} />
                      : <span>{EMOJIS[item.category] || '✦'}</span>
                    }
                  </div>
                  <div className={styles.itemMeta}>
                    <div className={styles.itemCat}>{item.category}</div>
                    <div className={styles.itemName}>{item.name}</div>
                    <div className={styles.itemPriceMobile}>EGP {item.price?.toLocaleString()}</div>
                  </div>
                  <div className={styles.itemPrice}>EGP {item.price?.toLocaleString()}</div>
                  <div className={styles.qtyCtrl}>
                    <button onClick={() => item.qty > 1 ? updateQty(item.id, item.qty - 1) : removeFromCart(item.id)}>
                      <FiMinus size={12} />
                    </button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)}><FiPlus size={12} /></button>
                  </div>
                  <div className={styles.itemTotal}>EGP {(item.price * item.qty).toLocaleString()}</div>
                  <button className={styles.removeBtn} onClick={() => removeFromCart(item.id)} aria-label="حذف">
                    <FiTrash2 size={15} />
                  </button>
                </div>
              ))}
              <div className={styles.cartActions}>
                <button className="btn-outline" style={{ fontSize: '0.82rem' }} onClick={clearCart}>
                  <FiTrash2 size={13} /> مسح السلة
                </button>
                <Link to="/products" className="btn-outline" style={{ fontSize: '0.82rem' }}>
                  متابعة التسوق
                </Link>
              </div>
            </div>

            <div className={styles.summary}>
              <h3 className={styles.summaryTitle}>ملخص الطلب</h3>
              <div className={styles.summaryRows}>
                {cart.map(item => (
                  <div key={item.id} className={styles.summaryRow}>
                    <span>{item.name} × {item.qty}</span>
                    <span>EGP {(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className={styles.summaryDivider} />
              <div className={styles.summaryTotal}>
                <span>الإجمالي</span>
                <span>EGP {total.toLocaleString()}</span>
              </div>
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1.25rem' }}
                onClick={() => navigate('/checkout')}>
                المتابعة للدفع <FiArrowLeft size={16} />
              </button>
              <p className={styles.summaryNote}>✦ استشارة مجانية على الطلبات المخصصة. رسوم التوصيل تُحسب بشكل منفصل.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
