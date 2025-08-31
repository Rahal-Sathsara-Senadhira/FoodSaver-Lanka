import client from './client'

export async function listApprovedDonors({ q = '' } = {}) {
  const res = await client.get('/donors', { params: { approved: true, q } })
  // Expecting shape: { data: [{ id, name }], total }
  return res.data
}
