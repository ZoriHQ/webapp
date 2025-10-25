import {
  IconHome,
  IconChartBar,
  IconCalendarEvent,
  IconTarget,
  IconBrain,
  IconCurrencyDollar,
} from '@tabler/icons-react'
import { useNavigate, useParams, useLocation } from '@tanstack/react-router'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

export function NavMain() {
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams({ strict: false })
  const projectId = (params as { projectId?: string })?.projectId

  const insightsItems = [
    {
      title: 'Overview',
      icon: IconHome,
      url: projectId ? `/projects/${projectId}` : '#',
      matchPath: `/projects/${projectId}`,
    },
    {
      title: 'Analytics',
      icon: IconChartBar,
      url: projectId ? `/projects/${projectId}/analytics` : '#',
      matchPath: `/projects/${projectId}/analytics`,
    },
    {
      title: 'Revenue',
      icon: IconCurrencyDollar,
      url: projectId ? `/projects/${projectId}/revenue` : '#',
      matchPath: `/projects/${projectId}/revenue`,
    },
    {
      title: 'Events',
      icon: IconCalendarEvent,
      url: projectId ? `/projects/${projectId}/events` : '#',
      matchPath: `/projects/${projectId}/events`,
    },
    {
      title: 'Goals',
      icon: IconTarget,
      url: projectId ? `/projects/${projectId}/goals` : '#',
      matchPath: `/projects/${projectId}/goals`,
    },
    {
      title: 'LLM Traces',
      icon: IconBrain,
      url: projectId ? `/projects/${projectId}/llm-traces` : '#',
      matchPath: `/projects/${projectId}/llm-traces`,
    },
  ]

  const handleNavigation = (url: string) => {
    if (url !== '#') {
      navigate({ to: url as any })
    }
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Insights</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {insightsItems.map((item) => {
            const isActive = location.pathname === item.matchPath
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  onClick={() => handleNavigation(item.url)}
                  disabled={item.url === '#'}
                  isActive={isActive}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
