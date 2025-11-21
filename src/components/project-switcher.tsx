import { useEffect, useMemo } from 'react'
import { IconChevronDown, IconPlus } from '@tabler/icons-react'
import {
  useLocation,
  useNavigate,
  useParams,
  useRouterState,
} from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useProjects } from '@/hooks/use-projects'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useAppContext } from '@/contexts/app.context'

export function ProjectSwitcher() {
  const { setStoredValues, storedValues } = useAppContext()
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams({ strict: false })
  const projectId = (params as { projectId?: string }).projectId
  const queryClient = useQueryClient()

  const { data: projectsData, isLoading } = useProjects()
  const projects = projectsData?.projects || []

  useEffect(() => {
    if (projectId) {
      setStoredValues((prevValues) => ({
        timeRange: prevValues!.timeRange,
        projectId: projectId,
      }))
    }
  }, [projectId])

  const currentProject = useMemo(() => {
    if (!projectId || !projects.length) return null
    return projects.find((p) => p.id === projectId) || projects[0]
  }, [projectId, projects])

  const handleProjectSwitch = (newProjectId: string) => {
    if (newProjectId) {
      queryClient.invalidateQueries()

      navigate({
        to: `/projects/$projectId`,
        params: { projectId: newProjectId },
      })
    }
  }

  const handleCreateNew = () => {
    navigate({ to: '/projects/new' })
  }

  // Auto-select first project if none selected
  // But don't redirect if user is on specific pages like /projects/new or team settings
  useEffect(() => {
    const isOnProjectCreationPage = location.pathname === '/projects/new'
    const isOnProjectsListPage = location.pathname === '/projects'
    const isOnTeamPage = location.pathname.startsWith('/team')

    if (
      !projectId &&
      projects.length > 0 &&
      !isLoading &&
      !isOnProjectCreationPage &&
      !isOnProjectsListPage &&
      !isOnTeamPage
    ) {
      const firstProjectId = projects[0]?.id
      if (firstProjectId) {
        handleProjectSwitch(firstProjectId)
      }
    }
  }, [projectId, projects, isLoading, location.pathname])

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="animate-pulse">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-muted">
              <span className="text-xs font-semibold">...</span>
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Loading...</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="text-xs font-semibold">
                  {currentProject?.name?.slice(0, 2).toUpperCase() || 'NA'}
                </span>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {currentProject?.name || 'No Project'}
                </span>
                <span className="text-muted-foreground truncate text-xs">
                  {projects.length}{' '}
                  {projects.length === 1 ? 'project' : 'projects'}
                </span>
              </div>
              <IconChevronDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side="bottom"
            align="start"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Projects
            </DropdownMenuLabel>
            {projects.map((project) => (
              <DropdownMenuItem
                key={project.id}
                onClick={() => project.id && handleProjectSwitch(project.id)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm bg-primary text-primary-foreground">
                  <span className="text-xs font-semibold">
                    {(project.name || 'NA').slice(0, 2).toUpperCase()}
                  </span>
                </div>
                {project.name || 'Unnamed Project'}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleCreateNew} className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <IconPlus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                Create project
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
