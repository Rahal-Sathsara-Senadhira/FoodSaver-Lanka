// src/hooks/usePartners.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  listNGOs, listDonors,
  approveNGO, rejectNGO,
  approveDonor, rejectDonor
} from '../api/partners.js'

// Flip when backend is ready
const USE_MOCK = true

// ---- Mock data ----
let MOCK_NGOS = [
  { id: 1, name: 'Helping Hands', address: 'Colombo 03', contactName: 'Amila Perera', phone: '077-123-4567', email: 'contact@helpinghands.lk', status: 'PENDING', createdAt: new Date().toISOString() },
  { id: 2, name: 'KindCare NGO', address: 'Wellawatte', contactName: 'Nadee Silva', phone: '077-777-8888', email: 'hello@kindcare.lk', status: 'APPROVED', createdAt: new Date().toISOString() },
]

let MOCK_DONORS = [
  { id: 101, name: 'ABC Bakery', address: 'Galle Rd, Colombo 04', contactName: 'Ruwan', phone: '077-333-4444', email: 'abc@bakery.lk', status: 'PENDING', createdAt: new Date().toISOString() },
  { id: 102, name: 'Fresh Farm', address: 'Colombo 07', contactName: 'Dilki', phone: '077-222-1111', email: 'orders@freshfarm.lk', status: 'REJECTED', createdAt: new Date().toISOString() },
  { id: 103, name: 'Hotel Riviera', address: 'Bambalapitiya', contactName: 'Sameera', phone: '077-555-1111', email: 'riviera@hotel.lk', status: 'APPROVED', createdAt: new Date().toISOString() },
]
// -------------------

function filterRows(rows, { q = '', status = '' } = {}) {
  let list = [...rows]
  if (q) {
    const t = q.toLowerCase()
    list = list.filter(r =>
      `${r.name} ${r.address} ${r.contactName} ${r.email}`.toLowerCase().includes(t)
    )
  }
  if (status) list = list.filter(r => r.status === status)
  const statuses = [...new Set(rows.map(r => r.status))]
  return { data: list, meta: { statuses } }
}

// NGOs
export function useNGOs(params) {
  if (USE_MOCK) {
    return useQuery({
      queryKey: ['ngos', params],
      queryFn: async () => {
        await new Promise(r => setTimeout(r, 150))
        return filterRows(MOCK_NGOS, params || {})
      },
    })
  }
  return useQuery({
    queryKey: ['ngos', params],
    queryFn: () => listNGOs(params).then(r => r.data),
  })
}

// Donors
export function useDonors(params) {
  if (USE_MOCK) {
    return useQuery({
      queryKey: ['donors', params],
      queryFn: async () => {
        await new Promise(r => setTimeout(r, 150))
        return filterRows(MOCK_DONORS, params || {})
      },
    })
  }
  return useQuery({
    queryKey: ['donors', params],
    queryFn: () => listDonors(params).then(r => r.data),
  })
}

export function useApprovePartner(type) {
  const qc = useQueryClient()
  if (USE_MOCK) {
    return useMutation({
      mutationFn: async (id) => {
        if (type === 'NGO') {
          MOCK_NGOS = MOCK_NGOS.map(x => x.id === id ? { ...x, status: 'APPROVED' } : x)
        } else {
          MOCK_DONORS = MOCK_DONORS.map(x => x.id === id ? { ...x, status: 'APPROVED' } : x)
        }
        return { ok: true }
      },
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['ngos'] })
        qc.invalidateQueries({ queryKey: ['donors'] })
      },
    })
  }
  return useMutation({
    mutationFn: (id) => (type === 'NGO' ? approveNGO(id) : approveDonor(id)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ngos'] })
      qc.invalidateQueries({ queryKey: ['donors'] })
    },
  })
}

export function useRejectPartner(type) {
  const qc = useQueryClient()
  if (USE_MOCK) {
    return useMutation({
      mutationFn: async (id) => {
        if (type === 'NGO') {
          MOCK_NGOS = MOCK_NGOS.map(x => x.id === id ? { ...x, status: 'REJECTED' } : x)
        } else {
          MOCK_DONORS = MOCK_DONORS.map(x => x.id === id ? { ...x, status: 'REJECTED' } : x)
        }
        return { ok: true }
      },
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['ngos'] })
        qc.invalidateQueries({ queryKey: ['donors'] })
      },
    })
  }
  return useMutation({
    mutationFn: (id) => (type === 'NGO' ? rejectNGO(id) : rejectDonor(id)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ngos'] })
      qc.invalidateQueries({ queryKey: ['donors'] })
    },
  })
}
