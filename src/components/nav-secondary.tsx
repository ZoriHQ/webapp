'use client'

import * as React from 'react'
import { useNavigate } from '@tanstack/react-router'
import type { Icon } from '@tabler/icons-react'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

export function NavSecondary({
  items,
  ...props
}: {
  items: Array<{
    title: string
    url: string
    external?: boolean
    icon: Icon
  }>
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const navigate = useNavigate()

  const handleNavigation = (item: { url: string; external?: boolean }) => {
    if (item.url !== '#' && !item.external) {
      navigate({ to: item.url as any })
    }

    if (item.external) {
      window.open(item.url, '_blank')
    }
  }

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                onClick={() => handleNavigation(item)}
                disabled={item.url === '#'}
              >
                <item.icon />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
