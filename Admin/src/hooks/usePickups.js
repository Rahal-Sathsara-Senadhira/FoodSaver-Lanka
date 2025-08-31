import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from '../api/pickups'

export function usePickupsList(filters) {
  const { page = 1, q = '', status = '' } = filters ?? {}
  return useQuery({
    queryKey: ['pickups', { page, q, status }],
    queryFn: () => api.listPickups({ page, q, status }),
    keepPreviousData: true,
  })
}

export function useAssignPickupDriver(id) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (args) => api.assignDriverToPickup(id, args),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pickups'] }),
  })
}

export function useUpdatePickupStatus(id) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (status) => api.updatePickupStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pickups'] }),
  })
}
