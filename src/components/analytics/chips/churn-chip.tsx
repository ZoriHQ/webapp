import { Activity } from 'lucide-react'
import { useChurnRate } from '@/hooks/use-analytics'
import { AnalyticChip } from './analytic-chip'

interface ChurnChipProps {
  projectId: string
}

export function ChurnChip({ projectId }: ChurnChipProps) {
  const { data, isLoading } = useChurnRate({
    project_id: projectId,
    time_range: 'today',
  })

  const currentRate = data?.rate ?? 0
  const previousRate = data?.previous_rate ?? 0
  const change = currentRate - previousRate

  const formatRate = (value: number) => `${(value * 100).toFixed(1)}%`

  const changeText =
    change === 0
      ? 'no change'
      : `${change > 0 ? '+' : ''}${formatRate(change)} from yesterday`

  return (
    <AnalyticChip
      icon={Activity}
      label="churn rate"
      value={formatRate(currentRate)}
      changeText={changeText}
      colorScheme="purple"
      isLoading={isLoading}
    />
  )
}
