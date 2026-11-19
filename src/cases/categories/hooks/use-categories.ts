import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CategoryService } from '../services/category.service'
import type { CreateCategoryDTO, UpdateCategoryDTO } from '../dtos/category.dto'


export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: CategoryService.listAll,
  })
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: ['categories', id],
    queryFn: () => CategoryService.findOne(id),
    enabled: !!id,
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (category: CreateCategoryDTO) => CategoryService.create(category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, category }: { id: string, category: UpdateCategoryDTO }) => CategoryService.update(id, category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      // a lista de produtos mostra o nome da categoria
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => CategoryService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}
