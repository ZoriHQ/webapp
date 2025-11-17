import { Monitor } from 'lucide-react'
import {
  AndroidIcon,
  AppleIcon,
  IOSIcon,
  LinuxIcon,
  WindowsIcon,
} from '../icons/os-icons'
import { ErrorTile } from './error.tile'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppContext } from '@/contexts/app.context'
import { useVisitorsByOSTile } from '@/hooks/use-analytics-tiles'
import { Progress } from '@/components/ui/progress'

const getOsIcon = (osName: string) => {
  const name = osName.toLowerCase()

  if (name.includes('windows')) {
    return <WindowsIcon className="h-6 w-6" />
  }
  if (name.includes('MacOS') || name.includes('mac') || name.includes('os x')) {
    return <AppleIcon className="h-6 w-6" />
  }
  if (
    name.includes('linux') ||
    name.includes('ubuntu') ||
    name.includes('debian')
  ) {
    return <LinuxIcon className="h-6 w-6" />
  }

  if (
    name.includes('ios') ||
    name.includes('iphone') ||
    name.includes('ipad')
  ) {
    return <IOSIcon className="h-6 w-6" />
  }
  if (name.includes('android')) {
    return <AndroidIcon className="h-6 w-6" />
  }

  return <Monitor className="h-6 w-6" />
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

export const VisitorsByOSTile = () => {
  const { storedValues } = useAppContext()
  const { isLoading, data, isError } = useVisitorsByOSTile({
    time_range: storedValues?.timeRange || 'last_7_days',
    project_id: storedValues!.projectId as string,
  })

  const osList = data?.data || []
  const totalVisitors = osList.reduce((sum, os) => sum + (os.count || 0), 0)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Visitors by OS</CardTitle>
      </CardHeader>
      <CardContent>
        {isError && <ErrorTile />}
        {isLoading ? (
          <div className="text-2xl font-bold text-muted-foreground">
            Loading...
          </div>
        ) : (
          <div className="space-y-3">
            {osList.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                No data available
              </div>
            ) : (
              osList.slice(0, 5).map((os, idx) => {
                const count = os.count || 0
                const previousCount = os.previous_count || 0
                const percentage =
                  totalVisitors > 0
                    ? ((count / totalVisitors) * 100).toFixed(1)
                    : '0.0'

                return (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1">
                        <div className="text-muted-foreground">
                          {getOsIcon(os.os_name || 'Unknown')}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {os.os_name || 'Unknown'}
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
                    <Progress value={parseFloat(percentage)} className="h-2" />
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
