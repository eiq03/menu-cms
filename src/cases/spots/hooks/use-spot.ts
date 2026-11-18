import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { SpotService } from '../services/spot.service'
import type { CreateSpotDTO, UpdateSpotDTO } from '../dtos/spot.dto'


export function useSpots() {
  return useQuery({
    queryKey: ['spots'],
    queryFn: SpotService.listAll,
  })
}

export function useSpot(id: string) {
  return useQuery({
    queryKey: ['spot', id],
    queryFn: () => SpotService.findOne(id),
    enabled: !!id,
  })
}

export function useCreateSpot() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (spot: CreateSpotDTO) => SpotService.create(spot),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spots'] })
    },
  })
}

export function useUpdateSpot() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, spot }: { id: string, spot: UpdateSpotDTO }) => SpotService.update(id, spot),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['spots'] })
      queryClient.invalidateQueries({ queryKey: ['spot', id] })
    },
  })
}

export function useDeleteSpot() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => SpotService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spots'] })
    },
  })
}
