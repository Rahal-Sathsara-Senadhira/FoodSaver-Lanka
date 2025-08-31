import { http, HttpResponse } from 'msw'
import { DONATION_STATUS } from '../../lib/enums'

let _id = 3
const donations = [
  {
    id: 1, donorId: 10, donorName: 'ABC Bakery',
    packsFood: 3, packsSoup: 1,
    pickupAt: '2025-09-01T15:30:00Z',
    status: DONATION_STATUS.SCHEDULED_PICKUP,
    createdAt: '2025-08-31T07:00:00Z'
  },
  {
    id: 2, donorId: 11, donorName: 'Fresh Farm',
    packsFood: 0, packsSoup: 2,
    pickupAt: '2025-09-02T14:00:00Z',
    status: DONATION_STATUS.DRAFT,
    createdAt: '2025-08-31T08:00:00Z'
  },
]

export const donationHandlers = [
  // match any origin
  http.get('*/donations', ({ request }) => {
    const url = new URL(request.url)
    const q = (url.searchParams.get('q') || '').toLowerCase()
    const status = url.searchParams.get('status') || ''
    const page = Number(url.searchParams.get('page') || 1)

    let data = donations.filter(d =>
      (!status || d.status === status) &&
      (!q || `${d.donorName}`.toLowerCase().includes(q))
    )

    const total = data.length
    const pageSize = 10
    const paged = data.slice((page - 1) * pageSize, page * pageSize)
    return HttpResponse.json({ data: paged, page, total })
  }),

  http.post('*/donations', async ({ request }) => {
    const body = await request.json()
    const now = new Date().toISOString()
    const newItem = {
      id: _id++,
      donorId: Number(body.donorId),
      donorName: 'Approved Donor', // in real API this comes from server
      packsFood: Number(body.packsFood || 0),
      packsSoup: Number(body.packsSoup || 0),
      pickupAt: body.pickupAt,
      status: DONATION_STATUS.SCHEDULED_PICKUP,
      notes: body.notes ?? '',
      createdAt: now,
    }
    // simple guard: must have at least one kind
    if ((newItem.packsFood || 0) + (newItem.packsSoup || 0) === 0) {
      return HttpResponse.json({ message: 'No packs specified' }, { status: 400 })
    }
    donations.unshift(newItem)
    return HttpResponse.json(newItem, { status: 201 })
  }),

  http.patch('*/donations/:id', async ({ params, request }) => {
    const id = Number(params.id)
    const patch = await request.json()
    const idx = donations.findIndex(d => d.id === id)
    if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    donations[idx] = { ...donations[idx], ...patch }
    return HttpResponse.json(donations[idx])
  }),

  http.post('*/donations/:id/assign-driver', async ({ params, request }) => {
    const id = Number(params.id)
    const body = await request.json()
    const idx = donations.findIndex(d => d.id === id)
    if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    donations[idx] = { ...donations[idx], assignedDriverId: Number(body.driverId) || null, status: DONATION_STATUS.SCHEDULED_PICKUP }
    return HttpResponse.json({ assignmentId: `A-${Date.now()}`, driverId: body.driverId, scheduledAt: body.scheduledAt || null })
  }),
]
