import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ChartAreaInteractive } from '@/components/chart-area-interactive'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export const Route = createFileRoute('/_protected/projects/$projectId')({
  component: ProjectDetailPage,
})

// Mock data for traffic by origin
const trafficByOrigin = {
  reddit: [
    { source: 'r/programming', visitors: 1245, percentage: 45 },
    { source: 'r/webdev', visitors: 892, percentage: 32 },
    { source: 'r/javascript', visitors: 634, percentage: 23 },
  ],
  google: [
    { source: 'Organic Search', visitors: 2341, percentage: 67 },
    { source: 'Google Ads', visitors: 892, percentage: 25 },
    { source: 'Google Images', visitors: 278, percentage: 8 },
  ],
  twitter: [
    { source: 'Direct Links', visitors: 1567, percentage: 72 },
    { source: 'Profile Bio', visitors: 423, percentage: 19 },
    { source: 'Retweets', visitors: 195, percentage: 9 },
  ],
  direct: [
    { source: 'Direct Traffic', visitors: 3245, percentage: 100 },
  ],
}

// Mock data for countries
const countriesData = [
  { country: 'United States', code: 'US', visitors: 4523, percentage: 42 },
  { country: 'United Kingdom', code: 'UK', visitors: 2156, percentage: 20 },
  { country: 'Germany', code: 'DE', visitors: 1432, percentage: 13 },
  { country: 'Canada', code: 'CA', visitors: 987, percentage: 9 },
  { country: 'France', code: 'FR', visitors: 765, percentage: 7 },
  { country: 'Australia', code: 'AU', visitors: 543, percentage: 5 },
  { country: 'Netherlands', code: 'NL', visitors: 432, percentage: 4 },
]

// Mock data for event stream
const eventsData = [
  {
    id: 'evt_001',
    visitorId: 'vis_8a7f3e92',
    event: 'page_view',
    path: '/blog/getting-started',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    country: 'US',
    browser: 'Chrome',
    device: 'Desktop',
  },
  {
    id: 'evt_002',
    visitorId: 'vis_9b2c1d43',
    event: 'page_view',
    path: '/',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    country: 'UK',
    browser: 'Safari',
    device: 'Mobile',
  },
  {
    id: 'evt_003',
    visitorId: 'vis_3f8e5a21',
    event: 'button_click',
    path: '/pricing',
    timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    country: 'DE',
    browser: 'Firefox',
    device: 'Desktop',
  },
  {
    id: 'evt_004',
    visitorId: 'vis_8a7f3e92',
    event: 'page_view',
    path: '/docs/api',
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    country: 'US',
    browser: 'Chrome',
    device: 'Desktop',
  },
  {
    id: 'evt_005',
    visitorId: 'vis_7c4d2b89',
    event: 'page_view',
    path: '/features',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    country: 'CA',
    browser: 'Edge',
    device: 'Tablet',
  },
  {
    id: 'evt_006',
    visitorId: 'vis_5e9a1f67',
    event: 'page_view',
    path: '/blog/analytics-guide',
    timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    country: 'FR',
    browser: 'Chrome',
    device: 'Mobile',
  },
  {
    id: 'evt_007',
    visitorId: 'vis_9b2c1d43',
    event: 'button_click',
    path: '/',
    timestamp: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
    country: 'UK',
    browser: 'Safari',
    device: 'Mobile',
  },
  {
    id: 'evt_008',
    visitorId: 'vis_2a8f6e34',
    event: 'page_view',
    path: '/contact',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    country: 'AU',
    browser: 'Chrome',
    device: 'Desktop',
  },
]

function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}

function ProjectDetailPage() {
  const { projectId } = Route.useParams()
  const [selectedOrigin, setSelectedOrigin] = useState<keyof typeof trafficByOrigin>('google')

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Project Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Project Analytics</h1>
        <p className="text-muted-foreground">
          Real-time analytics and insights for project {projectId}
        </p>
      </div>

      {/* Main Chart */}
      <div className="mb-8">
        <ChartAreaInteractive />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Traffic by Origin */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic by Origin</CardTitle>
            <CardDescription>Where your visitors are coming from</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedOrigin} onValueChange={(v) => setSelectedOrigin(v as keyof typeof trafficByOrigin)}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="google">Google</TabsTrigger>
                <TabsTrigger value="reddit">Reddit</TabsTrigger>
                <TabsTrigger value="twitter">Twitter</TabsTrigger>
                <TabsTrigger value="direct">Direct</TabsTrigger>
              </TabsList>
              {Object.entries(trafficByOrigin).map(([origin, sources]) => (
                <TabsContent key={origin} value={origin} className="mt-4">
                  <div className="space-y-3">
                    {sources.map((source, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{source.source}</p>
                          <div className="mt-1 h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${source.percentage}%` }}
                            />
                          </div>
                        </div>
                        <div className="ml-4 text-right">
                          <p className="text-sm font-bold">{source.visitors.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">{source.percentage}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Traffic by Country */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic by Country</CardTitle>
            <CardDescription>Geographic distribution of visitors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {countriesData.map((country, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">{country.code}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{country.country}</p>
                      <div className="mt-1 h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${country.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="text-sm font-bold">{country.visitors.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{country.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Event Stream */}
      <Card>
        <CardHeader>
          <CardTitle>Live Event Stream</CardTitle>
          <CardDescription>Real-time visitor activity on your site</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Visitor</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Path</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Browser</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {eventsData.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-mono text-xs">{event.visitorId}</TableCell>
                    <TableCell>
                      <Badge variant={event.event === 'page_view' ? 'default' : 'secondary'}>
                        {event.event}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{event.path}</TableCell>
                    <TableCell>{event.country}</TableCell>
                    <TableCell>{event.device}</TableCell>
                    <TableCell>{event.browser}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatTimestamp(event.timestamp)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
