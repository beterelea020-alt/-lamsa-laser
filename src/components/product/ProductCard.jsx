import { useNavigate } from 'react-router-dom'
import { FiShoppingBag, FiEye } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'
import toast from 'react-hot-toast'
import styles from './ProductCard.module.css'

const EMOJIS = { Frames: '🖼️', Gifts: '🎁', Decor: '✨', Accessories: '💎' }

export default function ProductCard({ product }) {
  const navigate   = useNavigate()
  const { addToCart } = useCart()

  const handleAdd = (e) => {
    e.stopPropagation()
    addToCart(product)
    toast.success(`${product.name} أُضيف للسلة!`)
  }

  return (
    <div className={styles.card} onClick={() => navigate(`/products/${product.id}`)}>
      <div className={styles.imgWrap}>
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} loading="lazy" />
        ) : (
          <span className={styles.emoji}>{EMOJIS[product.category] || '✦'}</span>
        )}
        {product.badge && (
          <span className={`${styles.badge} ${product.badge === 'New' ? styles.badgeNew : styles.badgeSale}`}>
            {product.badge}
          </span>
        )}
        <div className={styles.overlay}>
          <button className={styles.overlayBtn} onClick={handleAdd}>
            <FiShoppingBag size={14} /> أضف للسلة
          </button>
          <button className={styles.overlayIcon} onClick={e => { e.stopPropagation(); navigate(`/products/${product.id}`) }}>
            <FiEye size={15} />
          </button>
        </div>
      </div>

      <div className={styles.body}>
        <span className={styles.cat}>{product.category}</span>
        <h3 className={styles.name}>{product.name}</h3>
        {product.description && (
          <p className={styles.desc}>{product.description}</p>
        )}
        <div className={styles.footer}>
          <span className={styles.price}>
            <small>EGP</small> {product.price?.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}
