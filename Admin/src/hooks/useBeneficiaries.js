// src/hooks/useBeneficiaries.js
import { useQuery } from '@tanstack/react-query'

/* 
   for now I’ll mock it so your UI works.
   later you can wire it to your real API (`src/api/beneficiaries.js`) 
   just like we did for stock.
*/

// ---- MOCK DATA ----
const MOCK_SHELTERS = [
  { id: 1, ngoName: 'NGO A', shelterName: 'Shelter Alpha', location: { text: 'Colombo' }, capacity: 100, residents: 75, phone: '0771234567', status: 'ACTIVE', createdAt: new Date().toISOString() },
  { id: 2, ngoName: 'NGO B', shelterName: 'Shelter Beta', location: { text: 'Kandy' }, capacity: 80, residents: 60, phone: '0779876543', status: 'ACTIVE', createdAt: new Date().toISOString() },
]

const MOCK_ORDERS = [
  { id: 101, ngoName: 'NGO A', shelterName: 'Shelter Alpha', foodPacks: 50, soupPacks: 20, requestedAt: new Date().toISOString(), status: 'PENDING' },
  { id: 102, ngoName: 'NGO B', shelterName: 'Shelter Beta', foodPacks: 30, soupPacks: 15, requestedAt: new Date().toISOString(), status: 'DELIVERED' },
]

// ---- HOOKS ----
export function useShelters(params) {
  return useQuery({
    queryKey: ['shelters', params],
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 300)) // simulate delay
      let rows = [...MOCK_SHELTERS]

      if (params?.q) {
        rows = rows.filter(r =>
          (r.ngoName + r.shelterName + r.location?.text).toLowerCase().includes(params.q.toLowerCase())
        )
      }
      if (params?.status) {
        rows = rows.filter(r => r.status === params.status)
      }

      return { data: rows, meta: { statuses: [...new Set(MOCK_SHELTERS.map(s => s.status))] } }
    },
  })
}

export function useShelterOrders(params) {
  return useQuery({
    queryKey: ['shelterOrders', params],
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 300)) // simulate delay
      let rows = [...MOCK_ORDERS]

      if (params?.q) {
        rows = rows.filter(r =>
          (r.ngoName + r.shelterName).toLowerCase().includes(params.q.toLowerCase())
        )
      }
      if (params?.status) {
        rows = rows.filter(r => r.status === params.status)
      }

      return { data: rows, meta: { statuses: [...new Set(MOCK_ORDERS.map(o => o.status))] } }
    },
  })
}
