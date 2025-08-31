import { useQuery } from '@tanstack/react-query'
import { listAvailableDrivers } from '../api/drivers'

export function useAvailableDrivers(q = '') {
  return useQuery({
    queryKey: ['drivers-available', q],
    queryFn: () => listAvailableDrivers({ q }),
    staleTime: 60_000, // 1 minute cache
  })
}
