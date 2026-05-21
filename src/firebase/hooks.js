import { useState, useEffect } from 'react'
import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc,
  deleteDoc, query, orderBy, where, serverTimestamp, onSnapshot
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { db, storage } from './config'

/* ── Products ─────────────────────────────────────────── */
export function useProducts(category = 'all') {
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    let q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
    if (category !== 'all') q = query(q, where('category', '==', category))

    const unsub = onSnapshot(q, snap => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return unsub
  }, [category])

  return { products, loading }
}

export async function getProduct(id) {
  const snap = await getDoc(doc(db, 'products', id))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export async function addProduct(data) {
  return addDoc(collection(db, 'products'), { ...data, createdAt: serverTimestamp() })
}

export async function updateProduct(id, data) {
  return updateDoc(doc(db, 'products', id), data)
}

export async function deleteProduct(id) {
  return deleteDoc(doc(db, 'products', id))
}

/* ── Orders ──────────────────────────────────────────── */
export function useOrders() {
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, snap => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return unsub
  }, [])

  return { orders, loading }
}

export async function createOrder(data) {
  return addDoc(collection(db, 'orders'), {
    ...data,
    status: 'pending',
    createdAt: serverTimestamp(),
  })
}

export async function updateOrderStatus(id, status) {
  return updateDoc(doc(db, 'orders', id), { status })
}

/* ── Image Upload ────────────────────────────────────── */
export async function uploadImage(file, path) {
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

export async function deleteImage(url) {
  try {
    const r = ref(storage, url)
    await deleteObject(r)
  } catch (_) {}
}
