'use client'

import { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import { useParams, Link } from '@tanstack/react-router'

import { ChevronDownIcon, SettingsIcon } from 'lucide-react'
import { Button } from './ui/button'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from './ui/navigation-menu'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import type { HTMLAttributes, SVGAttributes } from 'react'
import { cn } from '@/lib/utils'
import { CommandPalette } from './command-palette'
import { CommandPaletteTrigger } from './command-palette-trigger'
import { RevenueStatusIndicator } from './revenue-status-indicator'

// Hamburger icon component
const HamburgerIcon = ({ className, ...props }: SVGAttributes<SVGElement>) => (
  <svg
    className={cn('pointer-events-none', className)}
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4 12L20 12"
      className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
    />
    <path
      d="M4 12H20"
      className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
    />
    <path
      d="M4 12H20"
      className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
    />
  </svg>
)

// Settings Menu Component
const SettingsMenu = ({
  onItemClick,
}: {
  onItemClick?: (item: string) => void
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon" className="h-9 w-9">
        <SettingsIcon className="h-4 w-4" />
        <span className="sr-only">Settings</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-56">
      <DropdownMenuLabel>Settings</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => onItemClick?.('preferences')}>
        Preferences
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onItemClick?.('billing')}>
        Billing
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onItemClick?.('team')}>
        Team Settings
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onItemClick?.('integrations')}>
        Integrations
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => onItemClick?.('api-keys')}>
        API Keys
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
)

// User Menu Component
const UserMenu = ({
  userName = 'John Doe',
  userEmail = 'john@example.com',
  userAvatar,
  onItemClick,
}: {
  userName?: string
  userEmail?: string
  userAvatar?: string
  onItemClick?: (item: string) => void
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="ghost"
        className="h-9 px-2 py-0 hover:bg-accent hover:text-accent-foreground"
      >
        <Avatar className="h-7 w-7">
          <AvatarImage src={userAvatar} alt={userName} />
          <AvatarFallback className="text-xs">
            {userName
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </AvatarFallback>
        </Avatar>
        <ChevronDownIcon className="h-3 w-3 ml-1" />
        <span className="sr-only">User menu</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-56">
      <DropdownMenuLabel>
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium leading-none">{userName}</p>
          <p className="text-xs leading-none text-muted-foreground">
            {userEmail}
          </p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => onItemClick?.('profile')}>
        Profile
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onItemClick?.('account')}>
        Account
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onItemClick?.('support')}>
        Support
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => onItemClick?.('logout')}>
        Log out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
)

// Types
export interface NavbarNavItem {
  href?: string
  label: string
}

export interface NavbarAccountType {
  value: string
  label: string
}

export interface NavbarProject {
  value: string
  label: string
}

export interface NavbarProps extends HTMLAttributes<HTMLElement> {
  navigationLinks?: Array<NavbarNavItem>
  accountTypes?: Array<NavbarAccountType>
  defaultAccountType?: string
  projects?: Array<NavbarProject>
  defaultProject?: string
  userName?: string
  userEmail?: string
  userAvatar?: string
  onNavItemClick?: (href: string) => void
  onAccountTypeChange?: (accountType: string) => void
  onProjectChange?: (project: string) => void
  onSettingsItemClick?: (item: string) => void
  onUserItemClick?: (item: string) => void
}

// Default navigation links
const defaultNavigationLinks: Array<NavbarNavItem> = [
  { href: '/projects', label: 'Projects' },
  { href: '#', label: 'Docs' },
  { href: '#', label: 'API reference' },
]

// Default account types
const defaultAccountTypes: Array<NavbarAccountType> = [
  { value: 'personal', label: 'Personal' },
  { value: 'team', label: 'Team' },
  { value: 'business', label: 'Business' },
]

// Default projects
const defaultProjects: Array<NavbarProject> = [
  { value: '1', label: 'Main project' },
  { value: '2', label: 'Origin project' },
]

export const Navbar = forwardRef<HTMLElement, NavbarProps>(
  (
    {
      navigationLinks = defaultNavigationLinks,
      accountTypes = defaultAccountTypes,
      defaultAccountType = 'personal',
      projects = defaultProjects,
      defaultProject = '1',
      userName = 'John Doe',
      userEmail = 'john@example.com',
      userAvatar,
      onNavItemClick,
      onAccountTypeChange,
      onProjectChange,
      onSettingsItemClick,
      onUserItemClick,
      ...props
    },
    ref,
  ) => {
    const [isMobile, setIsMobile] = useState(false)
    const [commandOpen, setCommandOpen] = useState(false)
    const containerRef = useRef<HTMLElement>(null)
    const params = useParams({ strict: false })
    const projectId = (params as { projectId?: string })?.projectId

    // Keyboard shortcut for command palette
    useEffect(() => {
      const down = (e: KeyboardEvent) => {
        if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
          e.preventDefault()
          setCommandOpen(true)
        }
      }
      document.addEventListener('keydown', down)
      return () => document.removeEventListener('keydown', down)
    }, [])

    useEffect(() => {
      const checkWidth = () => {
        if (containerRef.current) {
          const width = containerRef.current.offsetWidth
          setIsMobile(width < 768) // 768px is md breakpoint
        }
      }

      checkWidth()

      const resizeObserver = new ResizeObserver(checkWidth)
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current)
      }

      return () => {
        resizeObserver.disconnect()
      }
    }, [])

    // Combine refs
    const combinedRef = useCallback(
      (node: HTMLElement | null) => {
        containerRef.current = node
        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          ref.current = node
        }
      },
      [ref],
    )

    return (
      <header
        ref={combinedRef}
        className={cn(
          'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6 [&_*]:no-underline',
        )}
        {...props}
      >
        <div className="container mx-auto flex h-16 max-w-screen-2xl items-center gap-4">
          {/* Left side - Brand Name */}
          <div className="flex items-center gap-2 min-w-0">
            <Link to="/projects" className="hover:opacity-80 transition-opacity">
              <h1 className="text-lg font-bold">Zori</h1>
            </Link>
          </div>

          {/* Center - Search */}
          <div className="flex-1 flex justify-center max-w-2xl mx-auto">
            <div className="w-full max-w-md">
              <CommandPaletteTrigger
                onClick={() => setCommandOpen(true)}
                isMobile={isMobile}
              />
            </div>
          </div>

          {/* Right side - Docs + Revenue + Settings + User */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Docs Link - Desktop only */}
            {!isMobile && (
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        window.open('https://docs.zori.so', '_blank')
                      }}
                      className="text-muted-foreground hover:text-primary py-1.5 font-medium transition-colors cursor-pointer group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-3 text-sm focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                    >
                      Docs
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            )}

            {/* Revenue Status Indicator - Only on project pages */}
            {projectId && <RevenueStatusIndicator projectId={projectId} />}

            {/* Settings */}
            <div className="hidden sm:flex">
              <SettingsMenu onItemClick={onSettingsItemClick} />
            </div>

            {/* User menu */}
            <UserMenu
              userName={userName}
              userEmail={userEmail}
              userAvatar={userAvatar}
              onItemClick={onUserItemClick}
            />
          </div>
        </div>
        <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
      </header>
    )
  },
)

Navbar.displayName = 'Navbar'

export { HamburgerIcon, SettingsMenu, UserMenu }
