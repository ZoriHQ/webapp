import { useState } from 'react'
import type Zoriapi from 'zorihq'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface TrafficByOriginProps {
  data: Array<Zoriapi.V1.Analytics.OriginDataPoint> | undefined
  isLoading: boolean
}

export function TrafficByOrigin({ data, isLoading }: TrafficByOriginProps) {
  const [showAll, setShowAll] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Traffic by Origin</CardTitle>
        <CardDescription>Where your visitors are coming from</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-muted-foreground">
              Loading origin data...
            </p>
          </div>
        ) : data && data.length > 0 ? (
          <>
            <div className="space-y-3">
              {(showAll ? data : data.slice(0, 10)).map((source, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {source.origin || 'Direct'}
                    </p>
                    <div className="mt-1 h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{
                          width: `${source.percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="text-sm font-bold">
                      {(source.unique_visitors || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {data.length > 10 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAll(!showAll)}
                className="w-full mt-3"
              >
                {showAll ? 'Show Less' : `Show More (${data.length - 10} more)`}
              </Button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No traffic data available
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
