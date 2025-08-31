import { useQuery } from '@tanstack/react-query'
import { listApprovedDonors } from '../api/donors'

export function useApprovedDonors(q = '') {
  return useQuery({
    queryKey: ['donors-approved', q],
    queryFn: () => listApprovedDonors({ q }),
    staleTime: 5 * 60 * 1000, // 5 min
  })
}
