import { formatPages, renderChangeIndicator } from './helpers'
import { ErrorTile } from './error.tile'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppContext } from '@/contexts/app.context'
import { usePagesPerSessionTile } from '@/hooks/use-analytics-tiles'

export const PagesPerSessionTile = () => {
  const { storedValues } = useAppContext()
  const { isLoading, data, isError } = usePagesPerSessionTile({
    time_range: storedValues?.timeRange || 'last_7_days',
    project_id: storedValues!.projectId as string,
  })

  const currentPages = data?.avg_pages ?? 0
  const previousPages = data?.previous_avg_pages ?? 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Avg Pages per Session
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isError && <ErrorTile />}
        {isLoading ? (
          <div className="text-2xl font-bold text-muted-foreground">
            Loading...
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">
              {formatPages(currentPages)}
            </div>
            {renderChangeIndicator({
              current: currentPages,
              previous: previousPages,
              trendDirection: 'up-good',
              formatter: (val) => val.toFixed(1),
            })}
          </>
        )}
      </CardContent>
    </Card>
  )
}
