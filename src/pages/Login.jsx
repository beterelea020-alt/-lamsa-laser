import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import styles from './Login.module.css'

export default function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  if (user) { navigate('/admin'); return null }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) { toast.error('ملء جميع الحقول مطلوب'); return }
    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success('أهلاً وسهلاً!')
      navigate('/admin')
    } catch (err) {
      const msg = err.code === 'auth/invalid-credential'
        ? 'بيانات دخول غير صحيحة'
        : 'فشل تسجيل الدخول'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.logo}>✦ Lamsa <span>Laser</span></div>
        <h1 className={styles.title}>لوحة التحكم</h1>
        <p className={styles.sub}>تسجيل الدخول للمسؤولين</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>البريد الإلكتروني</label>
            <div className={styles.inputWrap}>
              <FiMail size={15} className={styles.icon} />
              <input type="email" placeholder="admin@lamsa.com" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                autoComplete="email" className={styles.input} />
            </div>
          </div>
          <div className={styles.field}>
            <label>كلمة المرور</label>
            <div className={styles.inputWrap}>
              <FiLock size={15} className={styles.icon} />
              <input type={showPw ? 'text' : 'password'} placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                autoComplete="current-password" className={styles.input} />
              <button type="button" className={styles.eyeBtn} onClick={() => setShowPw(s => !s)}>
                {showPw ? <FiEyeOff size={15} /> : <FiEye size={15} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'جاري الدخول...' : 'دخول'}
          </button>
        </form>
      </div>
    </div>
  )
}
