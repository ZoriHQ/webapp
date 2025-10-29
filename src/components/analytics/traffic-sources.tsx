import { useState } from 'react'
import { Bar, BarChart, XAxis, YAxis } from 'recharts'
import { Globe } from 'lucide-react'
import type Zoriapi from 'zorihq'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { countryCodeToFlag, getCountryName } from '@/lib/country-utils'
import { getFaviconUrl } from '@/lib/favicon-utils'

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  // eslint-disable-next-line
  type ChartConfig,
} from '@/components/ui/chart'

interface TrafficSourcesProps {
  originData?: Array<Zoriapi.V1.Analytics.OriginDataPoint>
  countryData?: Array<Zoriapi.V1.Analytics.CountryDataPoint>
  revenueByOrigin?: Array<Zoriapi.V1.Revenue.OriginAttributionDataPoint>
  isLoading?: boolean
  showRevenue?: boolean
}

const chartConfig = {
  visitors: {
    label: 'Visitors',
    color: 'hsl(var(--primary))',
  },
  revenue: {
    label: 'Revenue',
    color: '#10b981',
  },
} satisfies ChartConfig

export function TrafficSources({
  originData,
  countryData,
  revenueByOrigin,
  isLoading = false,
  showRevenue = false,
}: TrafficSourcesProps) {
  const [showAllOrigins, setShowAllOrigins] = useState(false)
  const [showAllCountries, setShowAllCountries] = useState(false)

  // Merge visitor and revenue data by origin
  const mergedOriginData = originData?.map((visitor) => {
    const revenueMatch = revenueByOrigin?.find(
      (rev) => (rev.origin || 'Direct') === (visitor.origin || 'Direct'),
    )
    return {
      ...visitor,
      revenue: revenueMatch ? (revenueMatch.total_revenue || 0) / 100 : 0,
      payingCustomers: revenueMatch?.paying_customers || 0,
    }
  })

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Traffic Sources</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="origin" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="origin">By Origin</TabsTrigger>
            <TabsTrigger value="country">By Country</TabsTrigger>
          </TabsList>

          <TabsContent value="origin" className="mt-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-sm text-muted-foreground">
                  Loading origin data...
                </p>
              </div>
            ) : mergedOriginData && mergedOriginData.length > 0 ? (
              <>
                <div className="space-y-4">
                  {(showAllOrigins
                    ? mergedOriginData
                    : mergedOriginData.slice(0, 6)
                  ).map((source, idx) => {
                    const isDirect =
                      !source.origin || source.origin === 'Direct'
                    const faviconUrl = isDirect
                      ? ''
                      : getFaviconUrl(source.origin || '', 32)

                    return (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="flex items-center gap-3 w-48 flex-shrink-0">
                          {isDirect ? (
                            <Globe className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                          ) : (
                            <>
                              <img
                                src={faviconUrl}
                                alt=""
                                className="w-5 h-5 rounded flex-shrink-0"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                  const globe =
                                    e.currentTarget.nextElementSibling
                                  if (globe) {
                                    ;(globe as HTMLElement).style.display =
                                      'block'
                                  }
                                }}
                              />
                              <Globe className="w-5 h-5 text-muted-foreground flex-shrink-0 hidden" />
                            </>
                          )}
                          <p className="text-sm font-medium truncate">
                            {source.origin || 'Direct'}
                          </p>
                        </div>

                        <ChartContainer
                          config={chartConfig}
                          className="h-10 w-full flex-1"
                        >
                          <BarChart
                            layout="vertical"
                            data={[
                              {
                                name: source.origin || 'Direct',
                                visitors: source.unique_visitors || 0,
                                revenue: showRevenue ? source.revenue || 0 : 0,
                              },
                            ]}
                            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                          >
                            <XAxis type="number" hide />
                            <YAxis type="category" dataKey="name" hide />
                            <ChartTooltip
                              content={<ChartTooltipContent />}
                              cursor={false}
                            />
                            <Bar
                              dataKey="visitors"
                              stackId="a"
                              fill="var(--color-visitors)"
                              radius={[4, 0, 0, 4]}
                            />
                            {showRevenue && (
                              <Bar
                                dataKey="revenue"
                                stackId="a"
                                fill="var(--color-revenue)"
                                radius={[0, 4, 4, 0]}
                              />
                            )}
                          </BarChart>
                        </ChartContainer>
                      </div>
                    )
                  })}
                </div>
                {mergedOriginData.length > 6 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllOrigins(!showAllOrigins)}
                    className="w-full mt-3"
                  >
                    {showAllOrigins
                      ? 'Show Less'
                      : `Show More (${mergedOriginData.length - 6} more)`}
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
          </TabsContent>

          <TabsContent value="country" className="mt-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-sm text-muted-foreground">
                  Loading country data...
                </p>
              </div>
            ) : countryData && countryData.length > 0 ? (
              <>
                <div className="space-y-4">
                  {(showAllCountries
                    ? countryData
                    : countryData.slice(0, 6)
                  ).map((country, idx) => {
                    const countryCode =
                      country.country_code?.toUpperCase() || ''
                    const countryName = getCountryName(countryCode)
                    const flagEmoji = countryCodeToFlag(countryCode)

                    return (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="flex items-center gap-3 w-48 flex-shrink-0">
                          <div className="text-2xl">{flagEmoji}</div>
                          <p className="text-sm font-medium truncate">
                            {countryName}
                          </p>
                        </div>

                        <ChartContainer
                          config={chartConfig}
                          className="h-10 w-full flex-1"
                        >
                          <BarChart
                            layout="vertical"
                            data={[
                              {
                                name: countryName,
                                visitors: country.unique_visitors || 0,
                              },
                            ]}
                            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                          >
                            <XAxis type="number" hide />
                            <YAxis type="category" dataKey="name" hide />
                            <ChartTooltip
                              content={<ChartTooltipContent />}
                              cursor={false}
                            />
                            <Bar
                              dataKey="visitors"
                              fill="var(--color-visitors)"
                              radius={4}
                            />
                          </BarChart>
                        </ChartContainer>
                      </div>
                    )
                  })}
                </div>
                {countryData.length > 6 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllCountries(!showAllCountries)}
                    className="w-full mt-3"
                  >
                    {showAllCountries
                      ? 'Show Less'
                      : `Show More (${countryData.length - 6} more)`}
                  </Button>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No country data available
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
