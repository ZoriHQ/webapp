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
