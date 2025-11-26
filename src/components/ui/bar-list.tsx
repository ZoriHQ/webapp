// Tremor BarList [v1.0.0]
// Based on https://www.tremor.so/docs/visualizations/bar-list

import * as React from 'react'
import { cn } from '@/lib/utils'

type Bar<T> = T & {
  key?: string
  href?: string
  value: number
  name: string
  icon?: React.ReactNode
}

// Color mapping from Tailwind class names to RGBA values
const colorMap: Record<string, { light: string; dark: string }> = {
  'bg-blue-500': {
    light: 'rgba(59, 130, 246, 0.25)',
    dark: 'rgba(59, 130, 246, 0.35)',
  },
  'bg-emerald-500': {
    light: 'rgba(16, 185, 129, 0.25)',
    dark: 'rgba(16, 185, 129, 0.35)',
  },
  'bg-violet-500': {
    light: 'rgba(139, 92, 246, 0.25)',
    dark: 'rgba(139, 92, 246, 0.35)',
  },
  'bg-amber-500': {
    light: 'rgba(245, 158, 11, 0.25)',
    dark: 'rgba(245, 158, 11, 0.35)',
  },
  'bg-rose-500': {
    light: 'rgba(244, 63, 94, 0.25)',
    dark: 'rgba(244, 63, 94, 0.35)',
  },
  'bg-cyan-500': {
    light: 'rgba(6, 182, 212, 0.25)',
    dark: 'rgba(6, 182, 212, 0.35)',
  },
  'bg-gray-500': {
    light: 'rgba(107, 114, 128, 0.25)',
    dark: 'rgba(107, 114, 128, 0.35)',
  },
}

const getBarColor = (color: string, isDark: boolean): string => {
  const colorEntry = color in colorMap ? colorMap[color] : null
  if (colorEntry !== null) {
    return isDark ? colorEntry.dark : colorEntry.light
  }
  // Default blue if color not found
  return isDark ? 'rgba(59, 130, 246, 0.35)' : 'rgba(59, 130, 246, 0.25)'
}

interface BarListProps<T = unknown>
  extends React.HTMLAttributes<HTMLDivElement> {
  data: Array<Bar<T>>
  valueFormatter?: (value: number) => string
  showAnimation?: boolean
  onValueChange?: (payload: Bar<T>) => void
  sortOrder?: 'ascending' | 'descending' | 'none'
  color?: string
}

function BarListInner<T>(
  {
    data = [],
    valueFormatter = (value) => value.toString(),
    showAnimation = false,
    onValueChange,
    sortOrder = 'none',
    color = 'bg-blue-500',
    className,
    ...props
  }: BarListProps<T>,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const Component = onValueChange ? 'button' : 'div'
  const [isDark, setIsDark] = React.useState(false)

  React.useEffect(() => {
    // Check for dark mode
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    checkDarkMode()

    // Watch for theme changes
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
    return () => observer.disconnect()
  }, [])

  const sortedData = React.useMemo(() => {
    if (sortOrder === 'none') {
      return data
    }
    return [...data].sort((a, b) => {
      return sortOrder === 'ascending' ? a.value - b.value : b.value - a.value
    })
  }, [data, sortOrder])

  const widths = React.useMemo(() => {
    const maxValue = Math.max(...sortedData.map((item) => item.value), 0)
    return sortedData.map((item) =>
      item.value === 0 ? 0 : Math.max((item.value / maxValue) * 100, 2),
    )
  }, [sortedData])

  const rowHeight = 'h-9'
  const barColor = getBarColor(color, isDark)

  return (
    <div
      ref={forwardedRef}
      className={cn('flex justify-between space-x-6', className)}
      aria-sort={sortOrder}
      {...props}
    >
      <div className="relative w-full space-y-2">
        {sortedData.map((item, index) => (
          <Component
            key={item.key ?? item.name}
            onClick={() => {
              onValueChange?.(item)
            }}
            className={cn(
              'group relative flex w-full items-center rounded',
              rowHeight,
              onValueChange
                ? 'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                : '',
            )}
          >
            {/* Background bar - using inline styles for Tailwind v4 compatibility */}
            <div
              className="absolute inset-y-0 left-0 rounded"
              style={{
                width: `${widths[index]}%`,
                backgroundColor: barColor,
                transition: showAnimation ? 'width 0.8s ease-in-out' : 'none',
              }}
            />
            {/* Content */}
            <div className="relative z-10 flex items-center gap-2 px-2 truncate">
              {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
              <span className="text-sm font-medium truncate text-foreground">
                {item.name}
              </span>
            </div>
          </Component>
        ))}
      </div>
      <div className="min-w-min space-y-2 text-right">
        {sortedData.map((item) => (
          <div
            key={item.key ?? item.name}
            className={cn('flex items-center justify-end', rowHeight)}
          >
            <span className="text-sm font-medium tabular-nums text-foreground">
              {valueFormatter(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

BarListInner.displayName = 'BarList'

const BarList = React.forwardRef(BarListInner) as <T>(
  p: BarListProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> },
) => ReturnType<typeof BarListInner>

export { BarList, type BarListProps, type Bar }
