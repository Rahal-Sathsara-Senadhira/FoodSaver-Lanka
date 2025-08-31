import client from './client'

// List pickups (scheduled/picked/received)
export async function listPickups({ page = 1, q = '', status = '' } = {}) {
  const res = await client.get('/pickups', { params: { page, q, status } })
  return res.data // { data, page, total }
}

// Assign a driver to a pickup
export async function assignDriverToPickup(id, { driverId, scheduledAt }) {
  const res = await client.post(`/pickups/${id}/assign-driver`, { driverId, scheduledAt })
  return res.data // { assignmentId, driverId, scheduledAt }
}

// Update pickup status: SCHEDULED -> PICKED_UP -> RECEIVED_WAREHOUSE (or CANCELLED)
export async function updatePickupStatus(id, status) {
  const res = await client.patch(`/pickups/${id}`, { status })
  return res.data
}
