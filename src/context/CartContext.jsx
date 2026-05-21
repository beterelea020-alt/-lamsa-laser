import { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext(null)
export const useCart = () => useContext(CartContext)

function reducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const exists = state.find(i => i.id === action.item.id)
      if (exists) return state.map(i => i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i)
      return [...state, { ...action.item, qty: 1 }]
    }
    case 'REMOVE':
      return state.filter(i => i.id !== action.id)
    case 'UPDATE_QTY':
      return state.map(i => i.id === action.id ? { ...i, qty: action.qty } : i)
    case 'CLEAR':
      return []
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(reducer, [], () => {
    try { return JSON.parse(localStorage.getItem('lamsa_cart')) || [] } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('lamsa_cart', JSON.stringify(cart))
  }, [cart])

  const addToCart    = item  => dispatch({ type: 'ADD', item })
  const removeFromCart = id  => dispatch({ type: 'REMOVE', id })
  const updateQty    = (id, qty) => dispatch({ type: 'UPDATE_QTY', id, qty })
  const clearCart    = ()   => dispatch({ type: 'CLEAR' })

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const count = cart.reduce((s, i) => s + i.qty, 0)

  return (
    <CartContext.Provider value={{
      cart, total, count,
      items: cart, totalPrice: total, totalItems: count,
      addToCart, removeFromCart, updateQty, clearCart,
      remove: removeFromCart,
      increment: (id) => { const item = cart.find(i => i.id === id); if (item) updateQty(id, item.qty + 1) },
      decrement: (id) => { const item = cart.find(i => i.id === id); if (item) updateQty(id, Math.max(1, item.qty - 1)) },
      clear: clearCart,
      add: addToCart,
    }}>
      {children}
    </CartContext.Provider>
  )
}
