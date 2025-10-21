import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type Zoriapi from 'zorihq'
import { useApiClient } from '@/lib/api-client'

export function usePaymentProviders(projectId?: string) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.PaymentProviders.ListPaymentProvidersResponse>({
    queryKey: ['paymentProviders', projectId],
    queryFn: () =>
      zClient.v1.paymentProviders.list(
        projectId ? { project_id: projectId } : undefined,
      ),
    enabled: !!projectId,
  })
}

export function usePaymentProvider(id: string) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.PaymentProviders.PaymentProviderResponse>({
    queryKey: ['paymentProviders', id],
    queryFn: () => zClient.v1.paymentProviders.get(id),
    enabled: !!id,
  })
}

export function useCreatePaymentProvider() {
  const zClient = useApiClient()
  const queryClient = useQueryClient()

  return useMutation<
    Zoriapi.V1.PaymentProviders.PaymentProviderResponse,
    Error,
    Zoriapi.V1.PaymentProviders.PaymentProviderCreateParams
  >({
    mutationFn: (data) => zClient.v1.paymentProviders.create(data),
    onSuccess: () => {
      // Invalidate all payment provider queries to refetch
      queryClient.invalidateQueries({ queryKey: ['paymentProviders'] })
    },
  })
}

export function useUpdatePaymentProvider(id: string) {
  const zClient = useApiClient()
  const queryClient = useQueryClient()

  return useMutation<
    Zoriapi.V1.PaymentProviders.PaymentProviderResponse,
    Error,
    Zoriapi.V1.PaymentProviders.PaymentProviderUpdateParams
  >({
    mutationFn: (data) => zClient.v1.paymentProviders.update(id, data),
    onSuccess: () => {
      // Invalidate all payment provider queries to refetch
      queryClient.invalidateQueries({ queryKey: ['paymentProviders'] })
    },
  })
}

export function useDeletePaymentProvider() {
  const zClient = useApiClient()
  const queryClient = useQueryClient()

  return useMutation<
    Zoriapi.V1.PaymentProviders.PaymentProviderDeleteResponse,
    Error,
    { id: string }
  >({
    mutationFn: ({ id }) => zClient.v1.paymentProviders.delete(id),
    onSuccess: () => {
      // Invalidate all payment provider queries to refetch
      queryClient.invalidateQueries({ queryKey: ['paymentProviders'] })
    },
  })
}
