import { Users } from 'lucide-react'
import { useUniqueSessionsTile } from '@/hooks/use-analytics-tiles'
import { AnalyticChip } from './analytic-chip'

interface VisitorsChipProps {
  projectId: string
}

export function VisitorsChip({ projectId }: VisitorsChipProps) {
  const { data, isLoading } = useUniqueSessionsTile({
    project_id: projectId,
    time_range: 'today',
  })

  const currentCount = data?.count ?? 0
  const previousCount = data?.previous_count ?? 0
  const change = currentCount - previousCount

  const changeText =
    change === 0
      ? 'no change'
      : `${change > 0 ? '+' : ''}${change} from yesterday`

  return (
    <AnalyticChip
      icon={Users}
      label="visits today"
      value={currentCount.toLocaleString()}
      changeText={changeText}
      colorScheme="blue"
      isLoading={isLoading}
    />
  )
}
