import { useState } from 'react'
import { TrafficSourceCountryTile } from './traffic-source.country.tile'
import { TrafficSourceRefererTile } from './traffic-source.referer.tile'
import { TrafficSourceUtmTile } from './traffic-source.utm.tile'
import { useAppContext } from '@/contexts/app.context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type TabType = 'country' | 'referer' | 'utm'

const tabs: Array<{ value: TabType; label: string }> = [
  { value: 'country', label: 'Country' },
  { value: 'referer', label: 'Referrer' },
  { value: 'utm', label: 'UTM' },
]

export function TrafficSourcesJoinedTile() {
  const [activeTab, setActiveTab] = useState<TabType>('country')
  const { storedValues } = useAppContext()

  const params = {
    project_id: storedValues!.projectId as string,
    time_range: storedValues?.timeRange || 'last_7_days',
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Traffic Sources</CardTitle>
        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                'text-sm px-3 py-1 rounded transition-colors',
                activeTab === tab.value
                  ? 'text-primary font-medium underline underline-offset-4'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {activeTab === 'country' && (
          <TrafficSourceCountryTile params={params} />
        )}
        {activeTab === 'referer' && (
          <TrafficSourceRefererTile params={params} />
        )}
        {activeTab === 'utm' && <TrafficSourceUtmTile params={params} />}
      </CardContent>
    </Card>
  )
}
