// Available metrics that can be displayed
export type MetricType =
  | 'uniqueVisitors'
  | 'totalSessions'
  | 'bounceRate'
  | 'avgSessionDuration'
  | 'avgPagesPerSession'
  | 'dau'
  | 'wau'
  | 'mau'
  | 'churnRate'
  | 'returnRate'
  | 'avgTimeBetweenVisits'

export interface MetricConfig {
  id: MetricType
  label: string
  description: string
  defaultEnabled: boolean
  priority: number // Lower number = higher priority
}

// All available metrics with their configurations
export const AVAILABLE_METRICS: Array<MetricConfig> = [
  {
    id: 'uniqueVisitors',
    label: 'Unique Visitors',
    description: 'Total unique visitors in the selected period',
    defaultEnabled: true,
    priority: 1,
  },
  {
    id: 'totalSessions',
    label: 'Total Sessions',
    description: 'Total number of sessions tracked',
    defaultEnabled: true,
    priority: 2,
  },
  {
    id: 'bounceRate',
    label: 'Bounce Rate',
    description: 'Percentage of single-page sessions',
    defaultEnabled: true,
    priority: 3,
  },
  {
    id: 'avgSessionDuration',
    label: 'Avg Session Duration',
    description: 'Average time users spend on your site',
    defaultEnabled: true,
    priority: 4,
  },
  {
    id: 'avgPagesPerSession',
    label: 'Pages per Session',
    description: 'Average number of pages viewed per session',
    defaultEnabled: false,
    priority: 5,
  },
  {
    id: 'dau',
    label: 'Daily Active Users',
    description: 'Unique users active today',
    defaultEnabled: false,
    priority: 6,
  },
  {
    id: 'wau',
    label: 'Weekly Active Users',
    description: 'Unique users active this week',
    defaultEnabled: false,
    priority: 7,
  },
  {
    id: 'mau',
    label: 'Monthly Active Users',
    description: 'Unique users active this month',
    defaultEnabled: false,
    priority: 8,
  },
  {
    id: 'churnRate',
    label: 'Churn Rate',
    description: 'Percentage of users who stopped visiting',
    defaultEnabled: false,
    priority: 9,
  },
  {
    id: 'returnRate',
    label: 'Return Rate',
    description: 'Percentage of users who return',
    defaultEnabled: false,
    priority: 10,
  },
  {
    id: 'avgTimeBetweenVisits',
    label: 'Avg Time Between Visits',
    description: 'Average interval between user visits',
    defaultEnabled: false,
    priority: 11,
  },
]

const STORAGE_KEY = 'zori-metrics-preferences'

// Get default enabled metrics
export function getDefaultMetrics(): Array<MetricType> {
  return AVAILABLE_METRICS.filter((m) => m.defaultEnabled)
    .sort((a, b) => a.priority - b.priority)
    .map((m) => m.id)
}

// Load metrics preferences from localStorage
export function loadMetricsPreferences(): Array<MetricType> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as Array<MetricType>
      // Validate that all stored metrics are valid
      const validMetrics = parsed.filter((id) =>
        AVAILABLE_METRICS.some((m) => m.id === id),
      )
      return validMetrics.length > 0 ? validMetrics : getDefaultMetrics()
    }
  } catch (error) {
    console.error('Failed to load metrics preferences:', error)
  }
  return getDefaultMetrics()
}

// Save metrics preferences to localStorage
export function saveMetricsPreferences(metrics: Array<MetricType>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(metrics))
  } catch (error) {
    console.error('Failed to save metrics preferences:', error)
  }
}

// Reset to default metrics
export function resetMetricsPreferences(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to reset metrics preferences:', error)
  }
}
