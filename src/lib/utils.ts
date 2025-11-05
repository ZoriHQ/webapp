import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ClassValue } from 'clsx'

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}

function extractMessage(str: string): string {
  const messageIndex = str.indexOf('message=')

  if (messageIndex === -1) {
    return str
  }

  const messageStart = messageIndex + 'message='.length
  let message = str.substring(messageStart)

  const commaIndex = message.indexOf(',')
  if (commaIndex !== -1) {
    message = message.substring(0, commaIndex)
  }

  return message.trim()
}

export function formatApiError(err: any): string {
  if (typeof err === 'object') {
    if (err.message) {
      const messageParts = err.message.includes('code=')
        ? err.message.split(',')
        : [err.message]

      if (messageParts.length === 2) {
        const [, message] = messageParts
        return `${message.replace('message=', '')}`
      }

      return err.message
    }
    return JSON.stringify(err)
  }
  try {
    const parsedErr = JSON.parse(err)
    if (parsedErr.error) {
      return extractMessage(parsedErr.error)
    }
  } catch (error) {
    console.error('Error parsing JSON:', error)
  }

  return String(err)
}

export function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}

export function formatFullDate(timestamp: string) {
  return new Date(timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Format currency with symbol (e.g., "$1,234.56")
 * Defaults to USD if no currency provided
 */
export function formatCurrency(
  amount: number | undefined,
  currency: string | undefined = 'USD',
): string {
  if (amount === undefined) return 'N/A'

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch (error) {
    // Fallback if currency code is invalid
    return `${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`
  }
}

/**
 * Format duration in seconds to human-readable format
 * Examples: "5m", "2h 30m", "3d 5h"
 */
export function formatDuration(seconds: number | undefined): string {
  if (seconds === undefined) return 'N/A'
  if (seconds === 0) return '0s'

  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  const parts: Array<string> = []

  if (days > 0) parts.push(`${days}d`)
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  if (secs > 0 && days === 0 && hours === 0) parts.push(`${secs}s`)

  return parts.slice(0, 2).join(' ') || '0s'
}

/**
 * Format a compact number (e.g., 1.2K, 3.4M)
 */
export function formatCompactNumber(num: number | undefined): string {
  if (num === undefined) return 'N/A'
  if (num === 0) return '0'

  const absNum = Math.abs(num)

  if (absNum >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  } else if (absNum >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  } else {
    return num.toLocaleString()
  }
}

/**
 * Simple hash function to convert string to number
 */
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash)
}

/**
 * Generate avatar data (color, background) based on a string
 */
export function generateAvatarFromHash(input: string): {
  backgroundColor: string
  textColor: string
  initials: string
} {
  const hash = hashString(input)

  // Predefined color palette with good contrast
  const colors = [
    { bg: '#EF4444', text: '#FFFFFF' }, // red
    { bg: '#F97316', text: '#FFFFFF' }, // orange
    { bg: '#F59E0B', text: '#FFFFFF' }, // amber
    { bg: '#10B981', text: '#FFFFFF' }, // emerald
    { bg: '#14B8A6', text: '#FFFFFF' }, // teal
    { bg: '#06B6D4', text: '#FFFFFF' }, // cyan
    { bg: '#3B82F6', text: '#FFFFFF' }, // blue
    { bg: '#6366F1', text: '#FFFFFF' }, // indigo
    { bg: '#8B5CF6', text: '#FFFFFF' }, // violet
    { bg: '#A855F7', text: '#FFFFFF' }, // purple
    { bg: '#EC4899', text: '#FFFFFF' }, // pink
    { bg: '#F43F5E', text: '#FFFFFF' }, // rose
  ]

  const colorIndex = hash % colors.length
  const selectedColor = colors[colorIndex]

  // Generate initials from input
  let initials = 'U'
  if (input.includes('@')) {
    // Email: use first letter before @
    initials = input.charAt(0).toUpperCase()
  } else if (input.includes(' ')) {
    // Name: use first letter of first two words
    const parts = input.split(' ').filter((p) => p.length > 0)
    initials =
      parts.length >= 2
        ? (parts[0][0] + parts[1][0]).toUpperCase()
        : parts[0][0].toUpperCase()
  } else if (input.length > 0) {
    // Single word or ID: use first letter
    initials = input.charAt(0).toUpperCase()
  }

  return {
    backgroundColor: selectedColor.bg,
    textColor: selectedColor.text,
    initials,
  }
}
