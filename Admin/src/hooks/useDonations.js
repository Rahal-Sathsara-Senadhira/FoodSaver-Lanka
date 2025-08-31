import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from '../api/donations'

export function useDonationsList(filters) {
  const { page = 1, q = '', status = '' } = filters ?? {}
  return useQuery({
    queryKey: ['donations', { page, q, status }],
    queryFn: () => api.listDonations({ page, q, status }),
    keepPreviousData: true,
  })
}

export function useCreateDonation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.createDonation,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['donations'] }),
  })
}

export function useAssignDonationDriver(id) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (args) => api.assignDriverToDonation(id, args),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['donations'] }),
  })
}
