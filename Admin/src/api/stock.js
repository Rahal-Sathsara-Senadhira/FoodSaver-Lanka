// src/api/stock.js
import client from './adapters/client.js'

// GET /stock?page=&q=&category=
export function listStock({ page = 1, q = '', category = '' } = {}) {
  const params = new URLSearchParams()
  params.set('page', page)
  if (q) params.set('q', q)
  if (category) params.set('category', category)
  return client.get(`/stock?${params.toString()}`)
}

// POST /stock/adjust  { itemId, delta, reason }
export function adjustStock({ itemId, delta, reason }) {
  return client.post('/stock/adjust', { itemId, delta, reason })
}
