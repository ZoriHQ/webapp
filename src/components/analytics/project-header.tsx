import { IconCalendar } from '@tabler/icons-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { TimeRange } from '@/hooks/use-analytics'

interface ProjectHeaderProps {
  projectName?: string
  timeRange: TimeRange
  onTimeRangeChange: (timeRange: TimeRange) => void
}

export function ProjectHeader({
  projectName,
  timeRange,
  onTimeRangeChange,
}: ProjectHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {projectName || 'Project Analytics'}
          </h1>
          <p className="text-muted-foreground">
            Real-time analytics and insights
            {projectName && ` for ${projectName}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <IconCalendar className="w-4 h-4 text-muted-foreground" />
          <Select
            value={timeRange}
            onValueChange={(value) => onTimeRangeChange(value as TimeRange)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last_hour">Last Hour</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="last_7_days">Last 7 Days</SelectItem>
              <SelectItem value="last_30_days">Last 30 Days</SelectItem>
              <SelectItem value="last_90_days">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
