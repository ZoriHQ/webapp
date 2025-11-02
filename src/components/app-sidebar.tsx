import * as React from 'react'
import { IconHelp, IconSettings } from '@tabler/icons-react'
import { useParams } from '@tanstack/react-router'
import { useClerk } from '@clerk/clerk-react'

import { NavMain } from '@/components/nav-main'
import { NavSecondary } from '@/components/nav-secondary'
import { NavUser } from '@/components/nav-user'
import { ProjectSwitcher } from '@/components/project-switcher'
import { getAuthMode, useAuthState } from '@/lib/auth'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, isLoading } = useAuthState()
  const params = useParams({ strict: false })
  const projectId = (params as { projectId?: string }).projectId
  const authMode = getAuthMode()
  const clerk = useClerk()

  const userName = user?.name || user?.email || 'User'
  const userEmail = user?.email || ''
  const userAvatar = user?.avatar || ''

  // Don't render NavUser if still loading or no user
  const showNavUser = !isLoading && user

  const handleManageAccount = () => {
    if (authMode === 'clerk' && clerk) {
      clerk.openUserProfile()
    }
  }

  const handleManageOrganization = () => {
    if (authMode === 'clerk' && clerk) {
      clerk.openOrganizationProfile()
    }
  }

  const secondaryItems = [
    {
      title: 'Settings',
      url: projectId ? `/projects/${projectId}/settings` : '#',
      icon: IconSettings,
    },
    {
      title: 'Get Help',
      url: 'https://discord.gg/bNfsVNjw',
      icon: IconHelp,
      external: true,
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
        {showNavUser && (
          <NavUser
            user={{
              name: userName,
              email: userEmail,
              avatar: userAvatar,
            }}
            onManageAccount={
              authMode === 'clerk' ? handleManageAccount : undefined
            }
            onManageOrganization={
              authMode === 'clerk' ? handleManageOrganization : undefined
            }
          />
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
