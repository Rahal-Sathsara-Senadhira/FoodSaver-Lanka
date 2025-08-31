// src/hooks/useStock.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { listStock, adjustStock } from '../api/stock.js'

// Toggle this flag when backend is ready
const USE_MOCK = true   // ← set to false when your backend is running

// ---------------- MOCK DATA ----------------
const MOCK = [
  {
    id: 1,
    name: 'Food Containers',
    category: 'Fried Rice',
    type: 'FOOD',
    packs: 42,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Soup Containers',
    category: 'Dhal Soup',
    type: 'SOUP',
    packs: 18,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'Food Containers',
    category: 'Pasta',
    type: 'FOOD',
    packs: 12,
    updatedAt: new Date().toISOString(),
  },
]
// -------------------------------------------

export function useStock(params) {
  const qc = useQueryClient()

  if (USE_MOCK) {
    return useQuery({
      queryKey: ['stock', params],
      queryFn: async () => {
        await new Promise(r => setTimeout(r, 250)) // simulate network
        const q = (params?.q || '').toLowerCase()
        const cat = params?.category || ''
        let rows = [...MOCK]
        if (q) {
          rows = rows.filter(r =>
            (`${r.name} ${r.category} ${r.type}`).toLowerCase().includes(q)
          )
        }
        if (cat) rows = rows.filter(r => r.category === cat)
        return {
          data: rows,
          meta: { categories: [...new Set(MOCK.map(m => m.category))] },
        }
      },
    })
  }

  // Real API
  return useQuery({
    queryKey: ['stock', params],
    queryFn: () => listStock(params).then(res => res.data),
  })
}

export function useAdjustStock() {
  const qc = useQueryClient()

  if (USE_MOCK) {
    return useMutation({
      mutationFn: async ({ itemId, delta }) => {
        const item = MOCK.find(m => m.id === itemId)
        if (item) {
          item.packs = Math.max(0, item.packs + Number(delta))
          item.updatedAt = new Date().toISOString()
        }
        return { ok: true }
      },
      onSuccess: () => qc.invalidateQueries({ queryKey: ['stock'] }),
    })
  }

  // Real API
  return useMutation({
    mutationFn: adjustStock,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['stock'] }),
  })
}
