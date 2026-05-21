import { useEffect, useState } from 'react'
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc,
  doc, serverTimestamp, orderBy, query
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { uploadImage } from '../utils/uploadImage'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

// ── Guard ──
function Guard({ children }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  useEffect(() => { if (!user) navigate('/login') }, [user])
  return user ? children : null
}

// ── Admin Shell ──
export default function Admin() {
  return (
    <Guard>
      <div style={s.shell}>
        <aside style={s.sidebar}>
          <p style={s.sideTitle}>لوحة التحكم</p>
          <NavLink to="/admin" end style={({ isActive }) => ({ ...s.sideLink, ...(isActive ? s.sideLinkActive : {}) })}>📦 المنتجات</NavLink>
          <NavLink to="/admin/orders" style={({ isActive }) => ({ ...s.sideLink, ...(isActive ? s.sideLinkActive : {}) })}>🧾 الطلبات</NavLink>
        </aside>
        <main style={s.main}>
          <Routes>
            <Route index element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
          </Routes>
        </main>
      </div>
    </Guard>
  )
}

// ── Products Manager ──
function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', category: '', price: '', stock: '', description: '' })
  const [imgFile, setImgFile] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const openNew = () => { setEditing(null); setForm({ name: '', category: '', price: '', stock: '', description: '' }); setImgFile(null); setShowForm(true) }
  const openEdit = (p) => { setEditing(p); setForm({ name: p.name, category: p.category || '', price: p.price, stock: p.stock || '', description: p.description || '' }); setImgFile(null); setShowForm(true) }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name || !form.price) { toast.error('اسم المنتج والسعر مطلوبان'); return }
    setSaving(true)
    try {
      let images = editing?.images || []
      if (imgFile) {
        const url = await uploadImage(imgFile)
        images = [url, ...images.slice(0, 3)]
      }
      const data = { name: form.name, category: form.category, price: Number(form.price), stock: Number(form.stock) || 0, description: form.description, images }
      if (editing) {
        await updateDoc(doc(db, 'products', editing.id), data)
        toast.success('تم التحديث ✅')
      } else {
        await addDoc(collection(db, 'products'), { ...data, createdAt: serverTimestamp() })
        toast.success('تمت الإضافة ✅')
      }
      setShowForm(false)
      load()
    } catch (err) {
      toast.error('حدث خطأ')
    }
    setSaving(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('هل أنتِ متأكدة من الحذف؟')) return
    await deleteDoc(doc(db, 'products', id))
    toast.success('تم الحذف')
    load()
  }

  return (
    <div>
      <div style={s.topBar}>
        <h2 style={s.pageTitle}>المنتجات</h2>
        <button onClick={openNew} className="btn btn-primary">+ إضافة منتج</button>
      </div>

      {showForm && (
        <div style={s.formCard}>
          <h3 style={{ marginBottom: '1.2rem' }}>{editing ? 'تعديل منتج' : 'منتج جديد'}</h3>
          <form onSubmit={handleSave}>
            <div style={s.formGrid}>
              <div className="form-group">
                <label>اسم المنتج *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>الفئة</label>
                <input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="مثال: إكسسوارات" />
              </div>
              <div className="form-group">
                <label>السعر (ج.م) *</label>
                <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required min="0" />
              </div>
              <div className="form-group">
                <label>المخزون</label>
                <input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} min="0" />
              </div>
            </div>
            <div className="form-group">
              <label>الوصف</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} />
            </div>
            <div className="form-group">
              <label>صورة المنتج</label>
              <input type="file" accept="image/*" onChange={e => setImgFile(e.target.files[0])} />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '.5rem' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'جارٍ الحفظ...' : 'حفظ'}</button>
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>إلغاء</button>
            </div>
          </form>
        </div>
      )}

      {loading ? <div className="spinner" /> : (
        <div style={s.table}>
          <div style={s.tableHead}>
            <span>المنتج</span><span>الفئة</span><span>السعر</span><span>المخزون</span><span>إجراءات</span>
          </div>
          {products.map(p => (
            <div key={p.id} style={s.tableRow}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                {p.images?.[0] && <img src={p.images[0]} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px' }} alt="" />}
                <strong>{p.name}</strong>
              </span>
              <span>{p.category || '—'}</span>
              <span>{p.price?.toLocaleString('ar-EG')} ج.م</span>
              <span style={{ color: p.stock === 0 ? '#c0392b' : '#2d8a4e' }}>{p.stock || 0}</span>
              <span style={{ display: 'flex', gap: '.5rem' }}>
                <button onClick={() => openEdit(p)} style={s.editBtn}>✏️</button>
                <button onClick={() => handleDelete(p.id)} style={s.delBtn}>🗑</button>
              </span>
            </div>
          ))}
          {products.length === 0 && <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-light)' }}>لا توجد منتجات بعد</p>}
        </div>
      )}
    </div>
  )
}

// ── Orders Manager ──
function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    }
    load()
  }, [])

  const statusLabel = { pending: '⏳ معلق', confirmed: '✅ مؤكد', shipped: '🚚 شُحن', done: '🎉 تم' }
  const statusColors = { pending: '#856404', confirmed: '#155724', shipped: '#0c5460', done: '#6f42c1' }

  const changeStatus = async (id, status) => {
    await updateDoc(doc(db, 'orders', id), { status })
    setOrders(o => o.map(x => x.id === id ? { ...x, status } : x))
    toast.success('تم التحديث')
  }

  return (
    <div>
      <h2 style={s.pageTitle}>الطلبات</h2>
      {loading ? <div className="spinner" /> : (
        orders.length === 0
          ? <p style={{ color: 'var(--text-light)', padding: '3rem', textAlign: 'center' }}>لا توجد طلبات بعد</p>
          : orders.map(o => (
            <div key={o.id} className="card" style={s.orderCard}>
              <div style={s.orderTop}>
                <div>
                  <strong>#{o.id.slice(0, 6).toUpperCase()}</strong>
                  <span style={{ marginRight: '.8rem', fontSize: '.85rem', color: 'var(--text-light)' }}>
                    {o.createdAt?.toDate?.().toLocaleDateString('ar-EG') || '—'}
                  </span>
                </div>
                <select
                  value={o.status}
                  onChange={e => changeStatus(o.id, e.target.value)}
                  style={{ ...s.statusSelect, color: statusColors[o.status] }}
                >
                  {Object.entries(statusLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <p style={s.orderInfo}><strong>العميل:</strong> {o.name} | <strong>الهاتف:</strong> {o.phone}</p>
              <p style={s.orderInfo}><strong>العنوان:</strong> {o.address}، {o.city}</p>
              <div style={s.orderItems}>
                {o.items?.map((i, idx) => <span key={idx} style={s.orderItem}>{i.name} ×{i.qty}</span>)}
              </div>
              <p style={s.orderTotal}>الإجمالي: <strong>{o.total?.toLocaleString('ar-EG')} ج.م</strong></p>
            </div>
          ))
      )}
    </div>
  )
}

const s = {
  shell: { display: 'flex', minHeight: '80vh' },
  sidebar: { width: '200px', background: 'var(--bg2)', borderLeft: '1px solid var(--border)', padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '.5rem', flexShrink: 0 },
  sideTitle: { fontWeight: 800, color: 'var(--text-light)', fontSize: '.8rem', marginBottom: '.5rem', textTransform: 'uppercase', letterSpacing: '.08em' },
  sideLink: { padding: '.6rem .8rem', borderRadius: '8px', color: 'var(--text)', fontSize: '.95rem', display: 'block' },
  sideLinkActive: { background: 'var(--pink)', color: 'var(--pink-deep)', fontWeight: 700 },
  main: { flex: 1, padding: '2rem 1.5rem' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  pageTitle: { fontWeight: 800, fontSize: '1.3rem' },
  formCard: { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem', marginBottom: '2rem' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' },
  table: { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' },
  tableHead: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', padding: '.7rem 1rem', background: 'var(--pink)', fontWeight: 700, fontSize: '.85rem', color: 'var(--pink-deep)' },
  tableRow: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', padding: '.8rem 1rem', borderTop: '1px solid var(--border)', alignItems: 'center', fontSize: '.9rem' },
  editBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' },
  delBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' },
  orderCard: { padding: '1.2rem', marginBottom: '1rem' },
  orderTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.6rem' },
  statusSelect: { padding: '.3rem .6rem', border: '1.5px solid var(--border)', borderRadius: '8px', fontFamily: 'var(--font-ar)', fontWeight: 700 },
  orderInfo: { fontSize: '.9rem', color: 'var(--text-light)', marginBottom: '.3rem' },
  orderItems: { display: 'flex', gap: '.5rem', flexWrap: 'wrap', margin: '.5rem 0' },
  orderItem: { background: 'var(--pink)', borderRadius: '50px', padding: '.2rem .7rem', fontSize: '.82rem', color: 'var(--pink-deep)' },
  orderTotal: { fontWeight: 600, color: 'var(--text)', marginTop: '.4rem' },
}