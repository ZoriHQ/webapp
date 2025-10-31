import { useMutation, useQuery } from '@tanstack/react-query'
import type Zoriapi from 'zorihq'
import { useApiClient } from '@/lib/api-client'

export function useProjects() {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Projects.ListProjectsResponse>({
    queryKey: ['projects'],
    queryFn: () => {
      if (!zClient) throw new Error('API client not initialized')
      return zClient.v1.projects.list()
    },
    enabled: !!zClient,
  })
}

export function useProject(projectId: string) {
  const zClient = useApiClient()

  return useQuery<Zoriapi.V1.Projects.Project>({
    queryKey: ['projects', projectId],
    queryFn: () => {
      if (!zClient) throw new Error('API client not initialized')
      return zClient.v1.projects.get(projectId)
    },
    enabled: !!projectId && !!zClient,
  })
}

export function useCreateProject() {
  const zClient = useApiClient()

  return useMutation<
    Zoriapi.V1.Projects.ProjectResponse,
    Error,
    Zoriapi.V1.Projects.ProjectCreateParams
  >({
    mutationFn: (data) => {
      if (!zClient) throw new Error('API client not initialized')
      return zClient.v1.projects.create(data)
    },
  })
}

export function useUpdateProject(projectId: string) {
  const zClient = useApiClient()

  return useMutation<
    Zoriapi.V1.Projects.ProjectResponse,
    Error,
    Zoriapi.V1.Projects.ProjectCreateParams
  >({
    mutationFn: (data) => {
      if (!zClient) throw new Error('API client not initialized')
      return zClient.v1.projects.update(projectId, data)
    },
  })
}

export function useDeleteProject() {
  const zClient = useApiClient()

  return useMutation<
    Zoriapi.V1.Projects.ProjectDeleteResponse,
    Error,
    { projectId: string }
  >({
    mutationFn: ({ projectId }) => {
      if (!zClient) throw new Error('API client not initialized')
      return zClient.v1.projects.delete(projectId)
    },
  })
}
