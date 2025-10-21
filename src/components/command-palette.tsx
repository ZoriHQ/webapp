import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  IconFolder,
  IconPlus,
  IconSettings,
  IconFileText,
  IconApi,
  IconSearch,
} from '@tabler/icons-react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { useProjects } from '@/hooks/use-projects'

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate()
  const { data: projectsData, isLoading } = useProjects()
  const [recentProjects, setRecentProjects] = useState<Array<string>>([])

  useEffect(() => {
    const recent = localStorage.getItem('recent-projects')
    if (recent) {
      try {
        setRecentProjects(JSON.parse(recent))
      } catch {
        // Ignore parse errors
      }
    }
  }, [])

  const handleSelectProject = (projectId: string) => {
    navigate({ to: '/projects/$projectId', params: { projectId } })

    const updated = [
      projectId,
      ...recentProjects.filter((id) => id !== projectId),
    ].slice(0, 5)
    setRecentProjects(updated)
    localStorage.setItem('recent-projects', JSON.stringify(updated))

    // Close dialog
    onOpenChange(false)
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'new-project':
        navigate({ to: '/projects' })
        break
      case 'settings':
        console.log('Navigate to settings')
        break
      case 'docs':
        window.open('https://docs.zori.so', '_blank')
        break
      case 'api':
        window.open('https://docs.zori.so/api', '_blank')
        break
    }
    onOpenChange(false)
  }

  const projects = projectsData?.projects || []
  const recentProjectsData = projects.filter((p) =>
    recentProjects.includes(p.id || ''),
  )

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search projects, settings..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {recentProjectsData.length > 0 && (
          <>
            <CommandGroup heading="Recent Projects">
              {recentProjectsData.map((project) => (
                <CommandItem
                  key={project.id}
                  onSelect={() => handleSelectProject(project.id || '')}
                  className="cursor-pointer"
                >
                  <IconFolder className="mr-2 h-4 w-4" />
                  <span>{project.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        <CommandGroup heading="All Projects">
          {isLoading ? (
            <CommandItem disabled>
              <IconSearch className="mr-2 h-4 w-4 animate-spin" />
              <span>Loading projects...</span>
            </CommandItem>
          ) : (
            projects.map((project) => (
              <CommandItem
                key={project.id}
                onSelect={() => handleSelectProject(project.id || '')}
                className="cursor-pointer"
              >
                <IconFolder className="mr-2 h-4 w-4" />
                <span>{project.name}</span>
                {project.domain && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    {project.domain}
                  </span>
                )}
              </CommandItem>
            ))
          )}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick Actions">
          <CommandItem
            onSelect={() => handleQuickAction('new-project')}
            className="cursor-pointer"
          >
            <IconPlus className="mr-2 h-4 w-4" />
            <span>Create new project</span>
          </CommandItem>
          <CommandItem
            onSelect={() => handleQuickAction('settings')}
            className="cursor-pointer"
          >
            <IconSettings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Resources">
          <CommandItem
            onSelect={() => handleQuickAction('docs')}
            className="cursor-pointer"
          >
            <IconFileText className="mr-2 h-4 w-4" />
            <span>Documentation</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
