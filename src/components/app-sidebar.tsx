import * as React from 'react'
import { IconHelp, IconSettings } from '@tabler/icons-react'
import { useParams } from '@tanstack/react-router'

import { NavMain } from '@/components/nav-main'
import { NavSecondary } from '@/components/nav-secondary'
import { NavUser } from '@/components/nav-user'
import { ProjectSwitcher } from '@/components/project-switcher'
import { useAuth } from '@/lib/use-auth'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { account } = useAuth()
  const params = useParams({ strict: false })
  const projectId = (params as { projectId?: string }).projectId

  const userName =
    (account as any)?.displayName || (account as any)?.primaryEmail || 'User'
  const userAvatar = (account as any)?.profileImageUrl || ''

  const secondaryItems = [
    {
      title: 'Settings',
      url: projectId ? `/projects/${projectId}/settings` : '#',
      icon: IconSettings,
    },
    {
      title: 'Get Help',
      url: '#',
      icon: IconHelp,
    },
  ]

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <ProjectSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavSecondary items={secondaryItems} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: userName,
            email: (account as any)?.primaryEmail || '',
            avatar: userAvatar,
          }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
