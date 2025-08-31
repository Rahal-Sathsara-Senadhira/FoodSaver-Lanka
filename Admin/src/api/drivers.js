import client from './adapters/client'

// List available drivers (optionally search by name/vehicle)
export async function listAvailableDrivers({ q = '' } = {}) {
  const res = await client.get('/drivers/available', { params: { q } })
  // expected shape: { data: Driver[] }
  return res.data
}

