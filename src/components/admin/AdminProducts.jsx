import { useState } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiUpload, FiX, FiCheck } from 'react-icons/fi'
import { useProducts, addProduct, updateProduct, deleteProduct, uploadImage, deleteImage } from '../../firebase/hooks'
import toast from 'react-hot-toast'
import styles from './AdminProducts.module.css'

const CATEGORIES = ['Frames', 'Gifts', 'Decor', 'Accessories']
const BADGES     = ['', 'New', 'Sale', 'Popular']
const EMPTY_FORM = { name: '', price: '', category: 'Frames', description: '', badge: '', imageUrl: '' }

export default function AdminProducts() {
  const { products, loading } = useProducts()
  const [modal,   setModal]   = useState(false)
  const [editing, setEditing] = useState(null)
  const [form,    setForm]    = useState(EMPTY_FORM)
  const [imgFile, setImgFile] = useState(null)
  const [imgPrev, setImgPrev] = useState('')
  const [saving,  setSaving]  = useState(false)
  const [deleting, setDeleting] = useState(null)

  const openAdd = () => {
    setEditing(null); setForm(EMPTY_FORM)
    setImgFile(null); setImgPrev('')
    setModal(true)
  }
  const openEdit = p => {
    setEditing(p); setForm({ name: p.name, price: p.price, category: p.category, description: p.description || '', badge: p.badge || '', imageUrl: p.imageUrl || '' })
    setImgFile(null); setImgPrev(p.imageUrl || '')
    setModal(true)
  }
  const closeModal = () => { setModal(false); setEditing(null) }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleImg = e => {
    const file = e.target.files[0]
    if (!file) return
    setImgFile(file)
    setImgPrev(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.price || !form.category) {
      toast.error('Name, price, and category are required'); return
    }
    setSaving(true)
    try {
      let imageUrl = form.imageUrl
      if (imgFile) {
        const path = `products/${Date.now()}_${imgFile.name}`
        imageUrl = await uploadImage(imgFile, path)
        if (editing?.imageUrl) await deleteImage(editing.imageUrl)
      }
      const data = { ...form, price: parseFloat(form.price), imageUrl }
      if (editing) await updateProduct(editing.id, data)
      else         await addProduct(data)
      toast.success(editing ? 'Product updated!' : 'Product added!')
      closeModal()
    } catch (e) {
      toast.error('Error saving product')
    } finally { setSaving(false) }
  }

  const handleDelete = async (p) => {
    if (!window.confirm(`Delete "${p.name}"?`)) return
    setDeleting(p.id)
    try {
      await deleteProduct(p.id)
      if (p.imageUrl) await deleteImage(p.imageUrl)
      toast.success('Deleted')
    } catch { toast.error('Error deleting') }
    finally { setDeleting(null) }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.topBar}>
        <h2 className={styles.heading}>Products</h2>
        <button className="btn-primary" onClick={openAdd}>
          <FiPlus size={16} /> Add Product
        </button>
      </div>

      {loading ? (
        <p className={styles.empty}>Loading…</p>
      ) : products.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No products yet.</p>
          <button className="btn-primary" onClick={openAdd}><FiPlus /> Add First Product</button>
        </div>
      ) : (
        <div className={styles.grid}>
          {products.map(p => (
            <div key={p.id} className={styles.card}>
              <div className={styles.cardImg}>
                {p.imageUrl
                  ? <img src={p.imageUrl} alt={p.name} />
                  : <span className={styles.cardEmoji}>📦</span>
                }
                {p.badge && <span className={styles.badge}>{p.badge}</span>}
              </div>
              <div className={styles.cardBody}>
                <span className={styles.cat}>{p.category}</span>
                <h3 className={styles.name}>{p.name}</h3>
                <div className={styles.price}>EGP {p.price?.toLocaleString()}</div>
              </div>
              <div className={styles.cardActions}>
                <button className={styles.editBtn} onClick={() => openEdit(p)}><FiEdit2 size={14} /></button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(p)}
                  disabled={deleting === p.id}
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className={styles.backdrop} onClick={closeModal}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHead}>
              <h3>{editing ? 'Edit Product' : 'Add Product'}</h3>
              <button className={styles.closeBtn} onClick={closeModal}><FiX /></button>
            </div>

            <div className={styles.modalBody}>
              {/* Image */}
              <label className={styles.imgUpload}>
                {imgPrev
                  ? <img src={imgPrev} alt="Preview" className={styles.imgPreview} />
                  : <div className={styles.imgPlaceholder}><FiUpload size={24} /><span>Upload Image</span></div>
                }
                <input type="file" accept="image/*" onChange={handleImg} style={{ display: 'none' }} />
              </label>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Product Name *</label>
                  <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Rose Frame" />
                </div>
                <div className={styles.formGroup}>
                  <label>Price (EGP) *</label>
                  <input type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0" min="0" />
                </div>
                <div className={styles.formGroup}>
                  <label>Category *</label>
                  <select value={form.category} onChange={e => set('category', e.target.value)}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Badge</label>
                  <select value={form.badge} onChange={e => set('badge', e.target.value)}>
                    {BADGES.map(b => <option key={b} value={b}>{b || 'None'}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                  <label>Description</label>
                  <textarea
                    value={form.description}
                    onChange={e => set('description', e.target.value)}
                    placeholder="Short description…"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className={styles.modalFoot}>
              <button className="btn-outline" onClick={closeModal}>Cancel</button>
              <button className="btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : <><FiCheck size={15} /> {editing ? 'Update' : 'Add Product'}</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
