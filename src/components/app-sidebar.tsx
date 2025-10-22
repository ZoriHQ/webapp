import * as React from 'react'
import { IconSettings, IconHelp } from '@tabler/icons-react'

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

const secondaryItems = [
  {
    title: 'Settings',
    url: '#',
    icon: IconSettings,
  },
  {
    title: 'Get Help',
    url: '#',
    icon: IconHelp,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { account } = useAuth()

  const userName = (account as any)?.name || account?.email || 'User'
  const userAvatar = (account as any)?.avatar_url || ''

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
            email: account?.email || '',
            avatar: userAvatar,
          }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
