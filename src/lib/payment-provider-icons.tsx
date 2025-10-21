import {
  IconBrandStripe,
  IconBrandPaypal,
  IconCreditCard,
  IconLemon,
  IconSquare,
  IconPlug,
} from '@tabler/icons-react'

export type ProviderType =
  | 'stripe'
  | 'paddle'
  | 'paypal'
  | 'lemon_squeezy'
  | 'square'

export function getProviderIcon(
  providerType?: string,
  className?: string,
) {
  const iconClass = className || 'h-5 w-5'

  switch (providerType) {
    case 'stripe':
      return <IconBrandStripe className={iconClass} />
    case 'paypal':
      return <IconBrandPaypal className={iconClass} />
    case 'paddle':
      return <IconCreditCard className={iconClass} />
    case 'lemon_squeezy':
      return <IconLemon className={iconClass} />
    case 'square':
      return <IconSquare className={iconClass} />
    default:
      return <IconPlug className={iconClass} />
  }
}

export function getProviderName(providerType?: string): string {
  switch (providerType) {
    case 'stripe':
      return 'Stripe'
    case 'paddle':
      return 'Paddle'
    case 'paypal':
      return 'PayPal'
    case 'lemon_squeezy':
      return 'Lemon Squeezy'
    case 'square':
      return 'Square'
    default:
      return 'Unknown Provider'
  }
}

export function getProviderColor(providerType?: string): string {
  switch (providerType) {
    case 'stripe':
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
    case 'paypal':
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
    case 'paddle':
      return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
    case 'lemon_squeezy':
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
    case 'square':
      return 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400'
    default:
      return 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400'
  }
}

export const PROVIDER_TYPES: Array<{
  value: ProviderType
  label: string
  description: string
}> = [
  {
    value: 'stripe',
    label: 'Stripe',
    description: 'Accept payments and manage subscriptions',
  },
  {
    value: 'paddle',
    label: 'Paddle',
    description: 'Complete payments infrastructure for SaaS',
  },
  {
    value: 'paypal',
    label: 'PayPal',
    description: 'Global payment processing platform',
  },
  {
    value: 'lemon_squeezy',
    label: 'Lemon Squeezy',
    description: 'Payments platform for digital products',
  },
  {
    value: 'square',
    label: 'Square',
    description: 'Payment processing for businesses',
  },
]
