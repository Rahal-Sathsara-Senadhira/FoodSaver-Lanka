// src/hooks/useVolunteers.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { listDrivers, updateDriverAvailability } from '../api/volunteers.js'

const USE_MOCK = true

// --------- MOCK DATA ----------
let MOCK_DRIVERS = [
  {
    id: 201, firstName: 'Ishan', lastName: 'Perera',
    phone: '077-111-2222', email: 'ishan@vols.lk', nic: '901234567V',
    vehicleType: 'Bike', vehicleNo: 'WP-BIK-1234',
    status: 'AVAILABLE',  // AVAILABLE | BUSY | OFFLINE
    lastActiveAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    nextShift: { start: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), end: null },
  },
  {
    id: 202, firstName: 'Suresh', lastName: 'Jayasekara',
    phone: '077-333-4444', email: 'suresh@vols.lk', nic: '911234567V',
    vehicleType: 'Car', vehicleNo: 'WP-CAR-4567',
    status: 'BUSY',
    lastActiveAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    nextShift: { start: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), end: null },
  },
  {
    id: 204, firstName: 'Nimali', lastName: 'Fernando',
    phone: '077-777-8888', email: 'nimali@vols.lk', nic: '932345678V',
    vehicleType: 'Tuk', vehicleNo: 'WP-TUK-1111',
    status: 'OFFLINE',
    lastActiveAt: null,
    nextShift: { start: null, end: null },
  },
]

function filterDrivers(list, { q = '', status = '', vehicle = '' } = {}) {
  let rows = [...list]
  if (q) {
    const t = q.toLowerCase()
    rows = rows.filter(d =>
      `${d.firstName} ${d.lastName} ${d.phone} ${d.vehicleNo}`.toLowerCase().includes(t)
    )
  }
  if (status) rows = rows.filter(d => d.status === status)
  if (vehicle) rows = rows.filter(d => d.vehicleType === vehicle)
  return {
    data: rows,
    meta: {
      statuses: ['AVAILABLE', 'BUSY', 'OFFLINE'],
      vehicles: [...new Set(list.map(d => d.vehicleType))],
    },
  }
}

export function useDrivers(params) {
  if (USE_MOCK) {
    return useQuery({
      queryKey: ['drivers', params],
      queryFn: async () => {
        await new Promise(r => setTimeout(r, 150))
        return filterDrivers(MOCK_DRIVERS, params || {})
      },
    })
  }
  return useQuery({
    queryKey: ['drivers', params],
    queryFn: () => listDrivers(params).then(r => r.data),
  })
}

export function useUpdateAvailability() {
  const qc = useQueryClient()
  if (USE_MOCK) {
    return useMutation({
      mutationFn: async ({ id, status }) => {
        MOCK_DRIVERS = MOCK_DRIVERS.map(d => (d.id === id ? { ...d, status } : d))
        return { ok: true }
      },
      onSuccess: () => qc.invalidateQueries({ queryKey: ['drivers'] }),
    })
  }
  return useMutation({
    mutationFn: ({ id, status }) => updateDriverAvailability(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['drivers'] }),
  })
}
