// src/api/volunteers.js
import client from './adapters/client.js'

// GET /volunteers/drivers?page=&q=&status=&vehicle=
export function listDrivers(params = {}) {
  const p = new URLSearchParams()
  if (params.page) p.set('page', params.page)
  if (params.q) p.set('q', params.q)
  if (params.status) p.set('status', params.status)
  if (params.vehicle) p.set('vehicle', params.vehicle)
  return client.get(`/volunteers/drivers?${p.toString()}`)
}

// PATCH /volunteers/drivers/:id/availability { status }
export function updateDriverAvailability(id, status) {
  return client.patch(`/volunteers/drivers/${id}/availability`, { status })
}

// Optional future endpoints:
// export function listDriverShifts(id) { return client.get(`/volunteers/drivers/${id}/shifts`) }
// export function assignShift(id, payload) { return client.post(`/volunteers/drivers/${id}/shifts`, payload) }
