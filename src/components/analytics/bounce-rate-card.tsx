import type Zoriapi from 'zorihq'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface BounceRateCardProps {
  data: Zoriapi.V1.Analytics.BounceRateResponse | undefined
  isLoading: boolean
}

export function BounceRateCard({ data, isLoading }: BounceRateCardProps) {
  const hasPageData = data?.by_page && data.by_page.length > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bounce Rate by Page</CardTitle>
        <CardDescription>
          Pages with highest bounce rates
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-muted-foreground">Loading bounce rate data...</p>
          </div>
        ) : hasPageData ? (
          <div className="space-y-4">
            {/* Overall bounce rate */}
            {data?.overall_bounce_rate !== undefined && (
              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  Overall Bounce Rate
                </div>
                <div className="text-3xl font-bold">
                  {data.overall_bounce_rate.toFixed(1)}%
                </div>
              </div>
            )}

            {/* Per-page breakdown */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Page</TableHead>
                    <TableHead className="text-right">Sessions</TableHead>
                    <TableHead className="text-right">Bounce Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.by_page!.map((page, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-mono text-xs max-w-[300px] truncate">
                        {page.page || '/'}
                      </TableCell>
                      <TableCell className="text-right">
                        {page.sessions?.toLocaleString() || 0}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={
                            (page.bounce_rate ?? 0) > 70
                              ? 'text-red-600 dark:text-red-400 font-semibold'
                              : (page.bounce_rate ?? 0) > 50
                                ? 'text-yellow-600 dark:text-yellow-400 font-semibold'
                                : 'text-green-600 dark:text-green-400 font-semibold'
                          }
                        >
                          {page.bounce_rate?.toFixed(1) || 0}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No bounce rate data available for this time period
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
