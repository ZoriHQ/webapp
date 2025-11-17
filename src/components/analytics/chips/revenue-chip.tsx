import { DollarSign } from 'lucide-react'
import { AnalyticChip } from './analytic-chip'
import { useRevenueDashboard } from '@/hooks/use-revenue'

interface RevenueChipProps {
  projectId: string
}

export function RevenueChip({ projectId }: RevenueChipProps) {
  const { data, isLoading } = useRevenueDashboard(projectId, 'today')

  const currentRevenue = data?.total_revenue ?? 0
  const previousRevenue = data?.previous_total_revenue ?? 0
  const change = currentRevenue - previousRevenue

  const formatCurrency = (value: number) => `$${Math.abs(value).toFixed(2)}`

  const changeText =
    change === 0
      ? 'no change'
      : `${change > 0 ? '+' : '-'}${formatCurrency(change)} from yesterday`

  return (
    <AnalyticChip
      icon={DollarSign}
      label="revenue today"
      value={formatCurrency(currentRevenue)}
      changeText={changeText}
      colorScheme="green"
      isLoading={isLoading}
    />
  )
}
