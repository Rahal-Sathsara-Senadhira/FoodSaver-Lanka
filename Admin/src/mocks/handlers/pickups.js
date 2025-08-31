import { http, HttpResponse } from 'msw'
import { DONATION_STATUS } from '../../lib/enums'

// mock in-memory store (separate from donations for now)
let __nextId = 103
const pickups = [
  {
    id: 101,
    ref: 'PU-101',
    donorId: 10,
    donorName: 'ABC Bakery',
    location: 'Colombo 03',
    pickupAt: '2025-09-01T15:30:00Z',
    status: DONATION_STATUS.SCHEDULED_PICKUP,
    assignedDriverId: null,
  },
  {
    id: 102,
    ref: 'PU-102',
    donorId: 11,
    donorName: 'Fresh Farm',
    location: 'Dehiwala',
    pickupAt: '2025-09-02T14:00:00Z',
    status: DONATION_STATUS.DRAFT, // admin can schedule from here
    assignedDriverId: null,
  },
]

export const pickupHandlers = [
  // GET /pickups
  http.get('*/pickups', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') || 1)
    const q = (url.searchParams.get('q') || '').toLowerCase()
    const status = url.searchParams.get('status') || ''

    let data = pickups.filter(p =>
      (!status || p.status === status) &&
      (!q || `${p.donorName} ${p.ref} ${p.location}`.toLowerCase().includes(q))
    )
    const total = data.length
    const pageSize = 10
    const paged = data.slice((page - 1) * pageSize, page * pageSize)

    return HttpResponse.json({ data: paged, page, total })
  }),

  // PATCH /pickups/:id  (update status or pickupAt)
  http.patch('*/pickups/:id', async ({ params, request }) => {
    const id = Number(params.id)
    const patch = await request.json()
    const idx = pickups.findIndex(p => p.id === id)
    if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    pickups[idx] = { ...pickups[idx], ...patch }
    return HttpResponse.json(pickups[idx])
  }),

  // POST /pickups/:id/assign-driver
  http.post('*/pickups/:id/assign-driver', async ({ params, request }) => {
    const id = Number(params.id)
    const body = await request.json()
    const idx = pickups.findIndex(p => p.id === id)
    if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    pickups[idx] = {
      ...pickups[idx],
      assignedDriverId: Number(body.driverId) || null,
      status: DONATION_STATUS.SCHEDULED_PICKUP,
      pickupAt: body.scheduledAt || pickups[idx].pickupAt,
    }
    return HttpResponse.json({
      assignmentId: `PUA-${Date.now()}`,
      driverId: body.driverId,
      scheduledAt: body.scheduledAt || null,
    })
  }),
]
