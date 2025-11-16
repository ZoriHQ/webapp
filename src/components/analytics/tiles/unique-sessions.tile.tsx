import { renderChangeIndicator } from './helpers'
import { ErrorTile } from './error.tile'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppContext } from '@/contexts/app.context'
import { useUniqueSessionsTile } from '@/hooks/use-analytics-tiles'

export const UniqueSessionsTile = () => {
  const { storedValues } = useAppContext()
  const { isLoading, data, isError } = useUniqueSessionsTile({
    time_range: storedValues?.timeRange || 'last_7_days',
    project_id: storedValues!.projectId as string,
  })

  const currentCount = data?.count ?? 0
  const previousCount = data?.previous_count ?? 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Unique Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        {isError ? (
          <ErrorTile />
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
