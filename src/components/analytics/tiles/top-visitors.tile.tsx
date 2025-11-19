import { renderChangeIndicator } from './helpers'
import { ErrorTile } from './error.tile'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppContext } from '@/contexts/app.context'
import { useTopUniqueVisitorsTile } from '@/hooks/use-analytics-tiles'

export const UniqueVisitorsTile = () => {
  const { storedValues } = useAppContext()
  const { isLoading, data, isError, error } = useTopUniqueVisitorsTile({
    time_range: storedValues?.timeRange || 'last_7_days',
    project_id: storedValues!.projectId as string,
  })

  const currentCount = data?.count ?? 0
  const previousCount = data?.previous_count ?? 0

  console.log('Error: ', error)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-2xl font-bold text-muted-foreground">
            Loading...
          </div>
        ) : isError ? (
          <>
            <ErrorTile />
            {JSON.stringify(error)}
          </>
        ) : (
          <>
            <div className="text-2xl font-bold">
              {currentCount.toLocaleString()}
            </div>
            {renderChangeIndicator({
              current: currentCount,
              previous: previousCount,
              trendDirection: 'up-good',
              showPercentChange: true,
            })}
          </>
        )}
      </CardContent>
    </Card>
  )
}
