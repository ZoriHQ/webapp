import { IconCalendar } from '@tabler/icons-react'
import type { TimeRange } from '@/hooks/use-analytics'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAppContext } from '@/contexts/app.context'
import { useProject } from '@/hooks/use-projects'

export function ProjectHeader() {
  const { storedValues, setStoredValues } = useAppContext()
  const { data, isLoading } = useProject(storedValues!.projectId!)

  const handleTimeRangeChange = (timeRangeValue: TimeRange) => {
    setStoredValues((prevValues) => ({
      ...prevValues,
      timeRange: timeRangeValue,
    }))
  }

  if (isLoading) {
    return <></>
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {data?.name || 'Project Analytics'}
          </h1>
          <p className="text-muted-foreground">
            Real-time analytics and insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <IconCalendar className="w-4 h-4 text-muted-foreground" />
          <Select
            value={storedValues?.timeRange}
            onValueChange={(value) => handleTimeRangeChange(value as TimeRange)}
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
