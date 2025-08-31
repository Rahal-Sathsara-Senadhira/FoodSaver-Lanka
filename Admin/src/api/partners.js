// src/api/partners.js
import client from './adapters/client.js'

// ------- NGOs -------
export function listNGOs({ page = 1, q = '', status = '' } = {}) {
  const p = new URLSearchParams({ page })
  if (q) p.set('q', q)
  if (status) p.set('status', status)
  return client.get(`/partners/ngos?${p.toString()}`)
}

export function approveNGO(id) {
  return client.post(`/partners/ngos/${id}/approve`)
}
export function rejectNGO(id) {
  return client.post(`/partners/ngos/${id}/reject`)
}

// ------- Donors -------
export function listDonors({ page = 1, q = '', status = '' } = {}) {
  const p = new URLSearchParams({ page })
  if (q) p.set('q', q)
  if (status) p.set('status', status)
  return client.get(`/partners/donors?${p.toString()}`)
}

export function approveDonor(id) {
  return client.post(`/partners/donors/${id}/approve`)
}
export function rejectDonor(id) {
  return client.post(`/partners/donors/${id}/reject`)
}
