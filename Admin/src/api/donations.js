import client from './adapters/client'
import { toDonationUI, fromDonationCreate } from './adapters/donations'

export async function listDonations({ page = 1, q = '', status = '' } = {}) {
  const res = await client.get('/donations', { params: { page, q, status } })
  return {
    data: res.data.data.map(toDonationUI),
    page: res.data.page,
    total: res.data.total,
  }
}

export async function createDonation(payload) {
  const res = await client.post('/donations', fromDonationCreate(payload))
  return toDonationUI(res.data)
}

export async function updateDonation(id, patch) {
  const res = await client.patch(`/donations/${id}`, patch)
  return toDonationUI(res.data)
}

export async function assignDriverToDonation(id, { driverId, scheduledAt }) {
  const res = await client.post(`/donations/${id}/assign-driver`, { driverId, scheduledAt })
  return res.data
}
