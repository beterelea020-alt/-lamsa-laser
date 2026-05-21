// Products.jsx
import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiSearch, FiX } from 'react-icons/fi'
import { useProducts } from '../firebase/hooks'
import { ProductSkeleton } from '../components/ui/Loaders'
import ProductCard from '../components/product/ProductCard'
import styles from './Products.module.css'

const CATEGORIES = ['All', 'Frames', 'Gifts', 'Decor', 'Accessories']
const SORTS = [
  { value: 'newest',    label: 'الأحدث أولاً' },
  { value: 'price-asc', label: 'الأقل سعراً' },
  { value: 'price-desc',label: 'الأعلى سعراً' },
  { value: 'name',      label: 'الاسم أ-ي' },
]

export default function Products() {
  const { products, loading } = useProducts()
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [sort, setSort]     = useState('newest')
  const catParam = searchParams.get('cat') || 'All'

  const setCategory = cat => {
    if (cat === 'All') searchParams.delete('cat')
    else searchParams.set('cat', cat)
    setSearchParams(searchParams)
  }

  const filtered = useMemo(() => {
    let list = [...products]
    if (catParam !== 'All') list = list.filter(p => p.category === catParam)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q))
    }
    if (sort === 'price-asc')  list.sort((a,b) => a.price - b.price)
    if (sort === 'price-desc') list.sort((a,b) => b.price - a.price)
    if (sort === 'name')       list.sort((a,b) => a.name.localeCompare(b.name))
    return list
  }, [products, catParam, search, sort])

  return (
    <div className="page-enter">
      <div className={styles.pageHeader}>
        <div className="container">
          <p className="section-sub">مجموعتنا</p>
          <h1 className="section-title">كل المنتجات</h1>
          <p className={styles.headerSub}>{products.length} قطعة فريدة مصنوعة بحب</p>
        </div>
      </div>
      <div className={styles.body}>
        <div className="container">
          <div className={styles.filterBar}>
            <div className={styles.chips}>
              {CATEGORIES.map(cat => (
                <button key={cat}
                  className={`${styles.chip} ${catParam === cat ? styles.chipActive : ''}`}
                  onClick={() => setCategory(cat)}>
                  {cat}
                  {cat !== 'All' && (
                    <span className={styles.chipCount}>{products.filter(p => p.category === cat).length}</span>
                  )}
                </button>
              ))}
            </div>
            <div className={styles.controls}>
              <div className={styles.searchWrap}>
                <FiSearch size={15} className={styles.searchIcon} />
                <input className={styles.searchInput} placeholder="ابحث عن منتج…" value={search} onChange={e => setSearch(e.target.value)} />
                {search && <button className={styles.clearBtn} onClick={() => setSearch('')}><FiX size={14} /></button>}
              </div>
              <select className={styles.sortSelect} value={sort} onChange={e => setSort(e.target.value)}>
                {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>
          {!loading && <p className={styles.resultCount}>{filtered.length} منتج{catParam !== 'All' ? ` في "${catParam}"` : ''}{search ? ` لـ "${search}"` : ''}</p>}
          <div className={styles.grid}>
            {loading ? <ProductSkeleton count={8} />
              : filtered.length
                ? filtered.map(p => <ProductCard key={p.id} product={p} />)
                : (
                  <div className={styles.empty}>
                    <div style={{ fontSize: '3rem' }}>🔍</div>
                    <h3>لا توجد منتجات</h3>
                    <p>جرّب كلمة بحث مختلفة أو فئة أخرى.</p>
                    <button className="btn-outline" onClick={() => { setSearch(''); setCategory('All') }}>مسح الفلاتر</button>
                  </div>
                )
            }
          </div>
        </div>
      </div>
    </div>
  )
}
