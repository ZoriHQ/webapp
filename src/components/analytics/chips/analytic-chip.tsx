import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface AnalyticChipProps {
  icon: LucideIcon
  label: string
  value: string | number
  changeText?: string
  colorScheme: 'green' | 'blue' | 'purple' | 'yellow'
  isLoading?: boolean
  className?: string
}

const colorClasses = {
  green: {
    bg: 'bg-green-50 dark:bg-green-950/30',
    border: 'border-green-200 dark:border-green-900/50',
    icon: 'text-green-600 dark:text-green-500',
    value: 'text-green-700 dark:text-green-300',
    label: 'text-green-600 dark:text-green-400',
  },
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-200 dark:border-blue-900/50',
    icon: 'text-blue-600 dark:text-blue-500',
    value: 'text-blue-700 dark:text-blue-300',
    label: 'text-blue-600 dark:text-blue-400',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    border: 'border-purple-200 dark:border-purple-900/50',
    icon: 'text-purple-600 dark:text-purple-500',
    value: 'text-purple-700 dark:text-purple-300',
    label: 'text-purple-600 dark:text-purple-400',
  },
  yellow: {
    bg: 'bg-yellow-50 dark:bg-yellow-950/30',
    border: 'border-yellow-200 dark:border-yellow-900/50',
    icon: 'text-yellow-600 dark:text-yellow-500',
    value: 'text-yellow-700 dark:text-yellow-300',
    label: 'text-yellow-600 dark:text-yellow-400',
  },
}

export function AnalyticChip({
  icon: Icon,
  label,
  value,
  changeText,
  colorScheme,
  isLoading = false,
  className = '',
}: AnalyticChipProps) {
  const colors = colorClasses[colorScheme]

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${colors.bg} ${colors.border} ${className}`}
    >
      <Icon className={`h-3.5 w-3.5 ${colors.icon}`} />
      {isLoading ? (
        <div className="flex items-center gap-1.5">
          <div className="h-1 w-1 rounded-full bg-current opacity-60 animate-pulse" />
          <div className="h-1 w-1 rounded-full bg-current opacity-60 animate-pulse [animation-delay:0.2s]" />
          <div className="h-1 w-1 rounded-full bg-current opacity-60 animate-pulse [animation-delay:0.4s]" />
        </div>
      ) : (
        <>
          <span className={`text-xs font-semibold ${colors.value}`}>
            {value}
          </span>
          <span className={`text-xs ${colors.label}`}>
            {label}
            {changeText && (
              <span className="ml-1 opacity-80">/ {changeText}</span>
            )}
          </span>
        </>
      )}
    </div>
  )
}
