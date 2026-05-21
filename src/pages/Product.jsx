import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { FiArrowRight, FiShoppingBag, FiMinus, FiPlus } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { db } from '../firebase/config'
import { useCart } from '../context/CartContext'
import { PageLoader } from '../components/ui/Loaders'
import toast from 'react-hot-toast'
import styles from './Product.module.css'

const WA = import.meta.env.VITE_WHATSAPP_NUMBER || '201234567890'
const EMOJIS = { Frames: '🖼️', Gifts: '🎁', Decor: '✨', Accessories: '💎' }

export default function Product() {
  const { id }      = useParams()
  const navigate    = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty]         = useState(1)
  const [added, setAdded]     = useState(false)
  const [imgErr, setImgErr]   = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'products', id))
        if (snap.exists()) setProduct({ id: snap.id, ...snap.data() })
        else navigate('/products')
      } catch { navigate('/products') }
      finally { setLoading(false) }
    }
    load()
  }, [id, navigate])

  if (loading) return <PageLoader />
  if (!product) return null

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addToCart(product)
    setAdded(true)
    toast.success(`${qty}× ${product.name} أُضيف للسلة!`)
    setTimeout(() => setAdded(false), 1600)
  }

  const waMsg = encodeURIComponent(
    `مرحباً! أريد طلب:\n\n*${product.name}*\nالكمية: ${qty}\nالسعر: EGP ${(product.price * qty).toLocaleString()}\n\nهل متاح؟`
  )

  return (
    <div className="page-enter">
      <div className={styles.wrap}>
        <div className="container">
          <button className={styles.back} onClick={() => navigate(-1)}>
            <FiArrowRight size={16} /> العودة للمنتجات
          </button>
          <div className={styles.layout}>
            <div className={styles.imgWrap}>
              {product.imageUrl && !imgErr
                ? <img src={product.imageUrl} alt={product.name} className={styles.img} onError={() => setImgErr(true)} />
                : <span className={styles.imgEmoji}>{EMOJIS[product.category] || '✦'}</span>
              }
              {product.badge && (
                <span className={`${styles.badge} ${product.badge === 'New' ? styles.badgeNew : styles.badgeGold}`}>
                  {product.badge}
                </span>
              )}
            </div>

            <div className={styles.info}>
              <span className={styles.cat}>{product.category}</span>
              <h1 className={styles.name}>{product.name}</h1>
              <div className={styles.price}>
                <small>EGP</small> {product.price?.toLocaleString()}
              </div>
              {product.description && <p className={styles.desc}>{product.description}</p>}

              <div className={styles.divider} />

              <div className={styles.qtyRow}>
                <span className={styles.qtyLabel}>الكمية</span>
                <div className={styles.qtyCtrl}>
                  <button className={styles.qtyBtn} onClick={() => setQty(q => Math.max(1, q - 1))}><FiMinus size={14} /></button>
                  <span className={styles.qtyNum}>{qty}</span>
                  <button className={styles.qtyBtn} onClick={() => setQty(q => q + 1)}><FiPlus size={14} /></button>
                </div>
              </div>
              <p className={styles.total}>الإجمالي: <strong>EGP {(product.price * qty).toLocaleString()}</strong></p>

              <div className={styles.ctas}>
                <button className={`btn-primary ${styles.addBtn} ${added ? styles.addedBtn : ''}`} onClick={handleAdd}>
                  {added ? '✓ تمت الإضافة!' : <><FiShoppingBag size={18} /> أضف للسلة</>}
                </button>
                <a href={`https://wa.me/${WA}?text=${waMsg}`} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
                  <FaWhatsapp size={18} /> اطلب عبر واتساب
                </a>
              </div>

              <div className={styles.features}>
                {['مصنوع بدقة عالية', 'نقش مخصص متاح', 'توصيل سريع', 'ضمان الجودة 100%'].map(f => (
                  <div key={f} className={styles.feat}><span>✦</span> {f}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
