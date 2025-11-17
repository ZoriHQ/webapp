import { Globe } from 'lucide-react'
import {
  BraveIcon,
  ChromeIcon,
  EdgeIcon,
  FirefoxIcon,
  OperaIcon,
  SafariIcon,
} from '../icons/browser-icons'
import { ErrorTile } from './error.tile'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppContext } from '@/contexts/app.context'
import { useVisitorsByBrowserTile } from '@/hooks/use-analytics-tiles'

const getBrowserIcon = (browserName: string) => {
  const name = browserName.toLowerCase()

  if (name.includes('chrome') || name.includes('chromium')) {
    return <ChromeIcon className="h-6 w-6" />
  }
  if (name.includes('firefox')) {
    return <FirefoxIcon className="h-6 w-6" />
  }
  if (name.includes('safari')) {
    return <SafariIcon className="h-6 w-6" />
  }
  if (name.includes('edge')) {
    return <EdgeIcon className="h-6 w-6" />
  }
  if (name.includes('opera')) {
    return <OperaIcon className="h-6 w-6" />
  }
  if (name.includes('brave')) {
    return <BraveIcon className="h-6 w-6" />
  }
  return <Globe className="h-6 w-6" />
}

const formatChange = (current: number, previous: number): string => {
  if (!previous) return 'N/A'
  const change = ((current - previous) / previous) * 100
  return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`
}

const getChangeColor = (current: number, previous: number): string => {
  if (!previous) return 'text-muted-foreground'
  const change = current - previous
  return change > 0
    ? 'text-green-600'
    : change < 0
      ? 'text-red-600'
      : 'text-muted-foreground'
}

export const VisitorsByBrowserTile = () => {
  const { storedValues } = useAppContext()
  const { isLoading, data, isError } = useVisitorsByBrowserTile({
    time_range: storedValues?.timeRange || 'last_7_days',
    project_id: storedValues!.projectId as string,
  })

  const browsers = data?.data || []
  const totalVisitors = browsers.reduce((sum, b) => sum + (b.count || 0), 0)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Visitors by Browser
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isError && <ErrorTile />}
        {isLoading ? (
          <div className="text-2xl font-bold text-muted-foreground">
            Loading...
          </div>
        ) : (
          <div className="space-y-3">
            {browsers.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                No data available
              </div>
            ) : (
              browsers.slice(0, 5).map((browser, idx) => {
                const count = browser.count || 0
                const previousCount = browser.previous_count || 0
                const percentage =
                  totalVisitors > 0
                    ? ((count / totalVisitors) * 100).toFixed(1)
                    : '0.0'

                return (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      <div className="text-muted-foreground">
                        {getBrowserIcon(browser.browser_name || 'Unknown')}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {browser.browser_name || 'Unknown'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {percentage}% of total
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold">
                        {count.toLocaleString()}
                      </span>
                      <span
                        className={`text-xs ${getChangeColor(count, previousCount)}`}
                      >
                        {formatChange(count, previousCount)}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
