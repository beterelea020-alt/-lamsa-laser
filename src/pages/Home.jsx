import { Link, useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiStar } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { useProducts } from '../firebase/hooks'
import { ProductSkeleton } from '../components/ui/Loaders'
import ProductCard from '../components/product/ProductCard'
import styles from './Home.module.css'

const WA = import.meta.env.VITE_WHATSAPP_NUMBER || '201234567890'

const CATEGORIES = [
  { name: 'Frames',      emoji: '🖼️', gradient: 'linear-gradient(135deg,#fbe8f0,#fdf4e0)' },
  { name: 'Gifts',       emoji: '🎁', gradient: 'linear-gradient(135deg,#fdf4e0,#fbe8f0)' },
  { name: 'Decor',       emoji: '✨', gradient: 'linear-gradient(135deg,#e8f0fb,#fbe8f0)' },
  { name: 'Accessories', emoji: '💎', gradient: 'linear-gradient(135deg,#e8f5e9,#fdf4e0)' },
]

const TESTIMONIALS = [
  { name: 'سارة أحمد',  stars: 5, text: 'جودة خيالية والإطار طلع أجمل من اللي توقعته! هطلب تاني بالتأكيد.' },
  { name: 'نور حسن',    stars: 5, text: 'هدية مثالية لأختي في فرحها، كل الناس سألوا عنها. أنيقة جداً!' },
  { name: 'مها كريم',   stars: 5, text: 'توصيل سريع وحرفية مذهلة، النقش كان مثالياً تماماً.' },
]

const MARQUEE = ['مصنوع بالحب', 'دقة ليزر عالية', 'طلبات مخصصة', 'توصيل سريع', 'جودة فائقة', 'هدايا مميزة', 'صُنع لأجلك']

export default function Home() {
  const { products, loading } = useProducts()
  const navigate = useNavigate()
  const featured = products.slice(0, 8)

  return (
    <div className="page-enter">

      {/* ── Hero ────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.blob1} />
        <div className={styles.blob2} />
        <div className={styles.blob3} />
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroText}>
            <div className={styles.eyebrow}>✦ فن الليزر المصنوع يدوياً</div>
            <h1 className={styles.headline}>
              هدايا تحكي<br /><em>قصتك</em>
            </h1>
            <p className={styles.heroSub}>
              إطارات وإكسسوارات وهدايا مميزة مصنوعة بدقة الليزر — أناقة لا تُنسى.
            </p>
            <div className={styles.heroCtas}>
              <Link to="/products" className="btn-primary">
                تسوّق الآن <FiArrowLeft size={16} />
              </Link>
              <a href={`https://wa.me/${WA}?text=مرحباً! أريد طلباً مخصصاً.`}
                target="_blank" rel="noopener noreferrer"
                className="btn-outline">
                <FaWhatsapp size={16} /> طلب مخصص
              </a>
            </div>
            <div className={styles.heroStats}>
              <div><div className={styles.statN}>+500</div><div className={styles.statL}>عميل سعيد</div></div>
              <div><div className={styles.statN}>+1K</div><div className={styles.statL}>طلب منجز</div></div>
              <div><div className={styles.statN}>100%</div><div className={styles.statL}>صناعة يدوية</div></div>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.heroCard}>
              <span className={styles.heroGlyph}>✦</span>
              <span className={styles.heroLabel}>لمسة Laser</span>
              <div className={styles.dot1} /><div className={styles.dot2} />
            </div>
            <div className={styles.floatingBadge}>
              <span style={{ fontSize: '1.4rem' }}>🌟</span>
              <div>
                <strong>الأعلى تقييماً</strong>
                <div style={{ display: 'flex', gap: 2, marginTop: 2 }}>
                  {Array.from({ length: 5 }).map((_, i) =>
                    <FiStar key={i} size={10} fill="var(--gold)" stroke="var(--gold)" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Marquee ─────────────────────────── */}
      <div className={styles.marqueeWrap}>
        <div className={styles.marqueeTrack}>
          {[...MARQUEE, ...MARQUEE].map((item, i) => (
            <span key={i} className={styles.marqueeItem}>{item} <span>✦</span></span>
          ))}
        </div>
      </div>

      {/* ── Categories ──────────────────────── */}
      <section className={styles.section} style={{ background: 'white', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className={styles.secHead}>
            <div>
              <p className="section-sub">تصفّح حسب</p>
              <h2 className="section-title">الفئات</h2>
            </div>
            <Link to="/products" className="btn-outline" style={{ fontSize: '0.82rem', padding: '8px 18px' }}>
              كل المنتجات <FiArrowLeft size={14} />
            </Link>
          </div>
          <div className={styles.catsGrid}>
            {CATEGORIES.map(cat => (
              <div key={cat.name} className={styles.catCard}
                style={{ background: cat.gradient }}
                onClick={() => navigate(`/products?cat=${cat.name}`)}>
                <div className={styles.catEmoji}>{cat.emoji}</div>
                <div className={styles.catFoot}>
                  <div className={styles.catName}>{cat.name}</div>
                  <div className={styles.catCount}>{products.filter(p => p.category === cat.name).length} منتج</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ───────────────── */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.secHead}>
            <div>
              <p className="section-sub">مختار خصيصاً لك</p>
              <h2 className="section-title">المنتجات المميزة</h2>
            </div>
            <Link to="/products" className="btn-outline" style={{ fontSize: '0.82rem', padding: '8px 18px' }}>
              شاهد الكل <FiArrowLeft size={14} />
            </Link>
          </div>
          <div className={styles.productsGrid}>
            {loading
              ? <ProductSkeleton count={8} />
              : featured.length
                ? featured.map(p => <ProductCard key={p.id} product={p} />)
                : (
                  <div className={styles.emptyProducts}>
                    <p>المنتجات قريباً! تواصل معنا لطلب مخصص.</p>
                    <a href={`https://wa.me/${WA}`} className="btn-gold" target="_blank" rel="noopener noreferrer">
                      <FaWhatsapp /> اطلب على واتساب
                    </a>
                  </div>
                )
            }
          </div>
        </div>
      </section>

      {/* ── Banner CTA ──────────────────────── */}
      <section className={styles.banner}>
        <div className="container">
          <div className={styles.bannerInner}>
            <div>
              <p className="section-sub" style={{ color: 'var(--gold-light)' }}>طلبات مخصصة</p>
              <h2 style={{ color: 'white', fontSize: 'clamp(1.8rem,4vw,2.8rem)', margin: '8px 0 14px' }}>
                عندك فكرة مميزة؟
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', maxWidth: 460, lineHeight: 1.8 }}>
                نصنع قطع ليزر مخصصة للأفراح والأعياد والهدايا المؤسسية. راسلنا وابتكرنا شيئاً لا يُنسى.
              </p>
            </div>
            <a href={`https://wa.me/${WA}?text=مرحباً! أريد طلباً مخصصاً بالليزر.`}
              target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
              <FaWhatsapp size={20} /> ابدأ طلبك المخصص
            </a>
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────── */}
      <section className={styles.section} style={{ background: 'white' }}>
        <div className="container">
          <div className={styles.secHead} style={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <p className="section-sub">آراء العملاء</p>
            <h2 className="section-title">يحبوننا كتير 💗</h2>
          </div>
          <div className={styles.testiGrid}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className={styles.testiCard}>
                <div className={styles.stars}>
                  {Array.from({ length: t.stars }).map((_, j) =>
                    <FiStar key={j} size={13} fill="var(--gold)" stroke="var(--gold)" />
                  )}
                </div>
                <p className={styles.testiText}>"{t.text}"</p>
                <div className={styles.testiName}>— {t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
