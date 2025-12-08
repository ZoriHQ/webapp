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
import { BarList } from '@/components/ui/bar-list'

const getOsIcon = (osName: string) => {
  const name = osName.toLowerCase()

  if (name.includes('windows')) {
    return <WindowsIcon className="h-5 w-5" />
  }
  if (name.includes('macos') || name.includes('mac') || name.includes('os x')) {
    return <AppleIcon className="h-5 w-5" />
  }
  if (
    name.includes('linux') ||
    name.includes('ubuntu') ||
    name.includes('debian')
  ) {
    return <LinuxIcon className="h-5 w-5" />
  }

  if (
    name.includes('ios') ||
    name.includes('iphone') ||
    name.includes('ipad')
  ) {
    return <IOSIcon className="h-5 w-5" />
  }
  if (name.includes('android')) {
    return <AndroidIcon className="h-5 w-5" />
  }

  return <Monitor className="h-5 w-5" />
}

export const VisitorsByOSTile = () => {
  const { storedValues } = useAppContext()
  const { isLoading, data, isError } = useVisitorsByOSTile({
    time_range: storedValues?.timeRange || 'last_7_days',
    project_id: storedValues!.projectId as string,
  })

  const osList = data?.data || []

  const barListData = osList.slice(0, 5).map((os) => ({
    name: os.os_name || 'Unknown',
    value: os.count || 0,
    icon: getOsIcon(os.os_name || 'Unknown'),
  }))

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
        ) : osList.length === 0 ? (
          <div className="text-sm text-muted-foreground">No data available</div>
        ) : (
          <BarList
            data={barListData}
            valueFormatter={(value) => value.toLocaleString()}
            sortOrder="none"
            color="bg-orange-500"
          />
        )}
      </CardContent>
    </Card>
  )
}
