import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaWhatsapp } from 'react-icons/fa'
import { useCart } from '../context/CartContext'
import { createOrder } from '../firebase/hooks'
import toast from 'react-hot-toast'
import styles from './Checkout.module.css'

const WA = import.meta.env.VITE_WHATSAPP_NUMBER || '201234567890'

export default function Checkout() {
  const { cart, total, clearCart } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', city: '', address: '', notes: '' })
  const [errors, setErrors] = useState({})

  if (!cart.length) { navigate('/cart'); return null }

  const validate = () => {
    const e = {}
    if (!form.name.trim())    e.name    = 'الاسم مطلوب'
    if (!form.phone.trim())   e.phone   = 'رقم الهاتف مطلوب'
    if (!form.city.trim())    e.city    = 'المدينة مطلوبة'
    if (!form.address.trim()) e.address = 'العنوان مطلوب'
    setErrors(e)
    return Object.keys(e).length === 0
  }
  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })) }

  const buildMsg = (orderId) => {
    const items = cart.map(i => `• ${i.name} × ${i.qty} — EGP ${(i.price * i.qty).toLocaleString()}`).join('\n')
    return encodeURIComponent(
      `🛍️ *طلب جديد — لمسة Laser*\n` +
      `رقم الطلب: #${orderId}\n\n` +
      `👤 *بيانات العميل*\nالاسم: ${form.name}\nالهاتف: ${form.phone}\nالمدينة: ${form.city}\nالعنوان: ${form.address}\n` +
      (form.notes ? `ملاحظات: ${form.notes}\n` : '') +
      `\n📦 *المنتجات*\n${items}\n\n💰 *الإجمالي: EGP ${total.toLocaleString()}*\n\nيرجى تأكيد الطلب. شكراً! ✨`
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const ref = await createOrder({
        customer: form,
        items: cart.map(({ id, name, price, qty, category }) => ({ id, name, price, qty, category })),
        total,
      })
      const orderId = ref.id.slice(-6).toUpperCase()
      clearCart()
      window.open(`https://wa.me/${WA}?text=${buildMsg(orderId)}`, '_blank')
      navigate('/order-success', { state: { orderId, customerName: form.name } })
    } catch {
      toast.error('حدث خطأ، يرجى المحاولة مجدداً.')
    } finally { setLoading(false) }
  }

  return (
    <div className="page-enter">
      <div className={styles.header}>
        <div className="container">
          <p className="section-sub">تقريباً وصلت</p>
          <h1 className="section-title">إتمام الطلب</h1>
        </div>
      </div>
      <div className={styles.body}>
        <div className="container">
          <form onSubmit={handleSubmit}>
            <div className={styles.layout}>
              <div className={styles.formSection}>
                <div className={styles.formCard}>
                  <h3 className={styles.formTitle}>بيانات التوصيل</h3>
                  <div className={styles.formGrid}>
                    <div className={styles.field}>
                      <label>الاسم الكامل *</label>
                      <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="اسمك الكامل" className={errors.name ? styles.inputErr : ''} />
                      {errors.name && <span className={styles.errMsg}>{errors.name}</span>}
                    </div>
                    <div className={styles.field}>
                      <label>رقم الهاتف *</label>
                      <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="01xxxxxxxxx" type="tel" className={errors.phone ? styles.inputErr : ''} />
                      {errors.phone && <span className={styles.errMsg}>{errors.phone}</span>}
                    </div>
                    <div className={styles.field}>
                      <label>المدينة *</label>
                      <input value={form.city} onChange={e => set('city', e.target.value)} placeholder="القاهرة، الإسكندرية…" className={errors.city ? styles.inputErr : ''} />
                      {errors.city && <span className={styles.errMsg}>{errors.city}</span>}
                    </div>
                    <div className={styles.field} style={{ gridColumn: '1/-1' }}>
                      <label>العنوان التفصيلي *</label>
                      <input value={form.address} onChange={e => set('address', e.target.value)} placeholder="الشارع، المبنى، الشقة…" className={errors.address ? styles.inputErr : ''} />
                      {errors.address && <span className={styles.errMsg}>{errors.address}</span>}
                    </div>
                    <div className={styles.field} style={{ gridColumn: '1/-1' }}>
                      <label>ملاحظات (اختياري)</label>
                      <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="نقش مخصص، تغليف خاص، رسالة هدية…" rows={3} />
                    </div>
                  </div>
                </div>
                <div className={styles.waNote}>
                  <FaWhatsapp size={24} color="#25d366" />
                  <div>
                    <strong>الطلب عبر واتساب</strong>
                    <p>بعد الإرسال، سيُحوَّل طلبك مباشرةً لواتساب للتأكيد.</p>
                  </div>
                </div>
              </div>

              <div className={styles.summary}>
                <h3 className={styles.summaryTitle}>ملخص الطلب</h3>
                <div className={styles.summaryItems}>
                  {cart.map(item => (
                    <div key={item.id} className={styles.summaryItem}>
                      <div>
                        <div className={styles.summaryItemName}>{item.name}</div>
                        <div className={styles.summaryItemQty}>× {item.qty}</div>
                      </div>
                      <span>EGP {(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div style={{ height: 1, background: 'var(--border)', margin: '1rem 0' }} />
                <div className={styles.summaryTotal}>
                  <span>الإجمالي</span>
                  <span>EGP {total.toLocaleString()}</span>
                </div>
                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading
                    ? <span>جاري الإرسال…</span>
                    : <><FaWhatsapp size={18} /> تأكيد الطلب على واتساب</>
                  }
                </button>
                <p className={styles.note}>بتأكيد الطلب، توافق على التواصل عبر واتساب للتأكيد.</p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
