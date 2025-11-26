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
import { BarList } from '@/components/ui/bar-list'

const getBrowserIcon = (browserName: string) => {
  const name = browserName.toLowerCase()

  if (name.includes('chrome') || name.includes('chromium')) {
    return <ChromeIcon className="h-5 w-5" />
  }
  if (name.includes('firefox')) {
    return <FirefoxIcon className="h-5 w-5" />
  }
  if (name.includes('safari')) {
    return <SafariIcon className="h-5 w-5" />
  }
  if (name.includes('edge')) {
    return <EdgeIcon className="h-5 w-5" />
  }
  if (name.includes('opera')) {
    return <OperaIcon className="h-5 w-5" />
  }
  if (name.includes('brave')) {
    return <BraveIcon className="h-5 w-5" />
  }
  return <Globe className="h-5 w-5" />
}

export const VisitorsByBrowserTile = () => {
  const { storedValues } = useAppContext()
  const { isLoading, data, isError } = useVisitorsByBrowserTile({
    time_range: storedValues?.timeRange || 'last_7_days',
    project_id: storedValues!.projectId as string,
  })

  const browsers = data?.data || []

  const barListData = browsers.slice(0, 5).map((browser) => ({
    name: browser.browser_name || 'Unknown',
    value: browser.count || 0,
    icon: getBrowserIcon(browser.browser_name || 'Unknown'),
  }))

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
        ) : browsers.length === 0 ? (
          <div className="text-sm text-muted-foreground">No data available</div>
        ) : (
          <BarList
            data={barListData}
            valueFormatter={(value) => value.toLocaleString()}
            sortOrder="none"
            color="bg-blue-500"
          />
        )}
      </CardContent>
    </Card>
  )
}
