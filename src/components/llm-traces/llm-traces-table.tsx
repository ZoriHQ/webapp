import { formatDistanceToNow } from 'date-fns'
import type { Zoriapi } from 'zorihq'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

interface LlmTracesTableProps {
  data: Zoriapi.V1.Analytics.LlmTracesListResponse | undefined
  isLoading: boolean
}

export function LlmTracesTable({ data, isLoading }: LlmTracesTableProps) {
  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return '$0.00'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 4,
      maximumFractionDigits: 6,
    }).format(value)
  }

  const formatNumber = (value: number | undefined) => {
    if (value === undefined) return '0'
    return new Intl.NumberFormat('en-US').format(value)
  }

  const formatLatency = (ms: number | undefined) => {
    if (!ms) return '-'
    if (ms > 1000) return `${(ms / 1000).toFixed(2)}s`
    return `${ms.toFixed(0)}ms`
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Traces</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const traces = data?.traces || []

  if (traces.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Traces</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No traces found for the selected period
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Traces</CardTitle>
          <span className="text-sm text-muted-foreground">
            {data?.total || 0} total traces
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Model</TableHead>
              <TableHead className="text-right">Tokens</TableHead>
              <TableHead className="text-right">Cost</TableHead>
              <TableHead className="text-right">Latency</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {traces.map((trace) => (
              <TableRow key={trace.trace_id}>
                <TableCell className="font-medium">
                  {trace.name || '-'}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {trace.models?.slice(0, 2).map((model) => (
                      <Badge
                        key={model}
                        variant="secondary"
                        className="text-xs"
                      >
                        {model.split('/').pop() || model}
                      </Badge>
                    ))}
                    {trace.models && trace.models.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{trace.models.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {formatNumber(trace.total_tokens)}
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {formatCurrency(trace.total_cost)}
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {formatLatency(trace.avg_latency_ms)}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {trace.user_id || '-'}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {trace.timestamp
                    ? formatDistanceToNow(new Date(trace.timestamp), {
                        addSuffix: true,
                      })
                    : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
