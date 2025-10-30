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
    color: '#3b82f6', // blue-500
  },
  revenue: {
    label: 'Revenue',
    color: '#16a34a', // green-600
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
  const mergedOriginData = originData
    ?.map((visitor) => {
      const revenueMatch = revenueByOrigin?.find(
        (rev) => (rev.origin || 'Direct') === (visitor.origin || 'Direct'),
      )
      return {
        ...visitor,
        revenue: revenueMatch ? (revenueMatch.total_revenue || 0) / 100 : 0,
        payingCustomers: revenueMatch?.paying_customers || 0,
      }
    })
    .sort((a, b) => {
      // Sort by revenue efficiency (revenue per visitor) - highest first
      const aVisitors = a.unique_visitors || 0
      const bVisitors = b.unique_visitors || 0
      const aRevenue = a.revenue || 0
      const bRevenue = b.revenue || 0

      const aEfficiency = aVisitors > 0 ? aRevenue / aVisitors : 0
      const bEfficiency = bVisitors > 0 ? bRevenue / bVisitors : 0

      // Primary sort: by efficiency (descending)
      if (bEfficiency !== aEfficiency) {
        return bEfficiency - aEfficiency
      }

      // Tiebreaker: by total revenue (descending)
      return bRevenue - aRevenue
    })

  // Calculate max total value for normalization
  const maxOriginValue =
    mergedOriginData?.reduce((max, source) => {
      const visitors = source.unique_visitors || 0
      const revenue = showRevenue ? source.revenue || 0 : 0
      const total = visitors + revenue
      return Math.max(max, total)
    }, 0) || 1 // Avoid division by zero

  // Calculate max value for country data normalization
  const maxCountryValue =
    countryData?.reduce((max, country) => {
      const visitors = country.unique_visitors || 0
      return Math.max(max, visitors)
    }, 0) || 1 // Avoid division by zero

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
                            <XAxis
                              type="number"
                              hide
                              domain={[0, maxOriginValue]}
                            />
                            <YAxis type="category" dataKey="name" hide />
                            <ChartTooltip
                              content={
                                <ChartTooltipContent
                                  formatter={(value, name) => {
                                    if (name === 'visitors') {
                                      return (
                                        <div className="flex items-center justify-between w-full gap-3">
                                          <span className="text-muted-foreground flex items-center gap-1.5">
                                            <span>👥</span>
                                            Visitors
                                          </span>
                                          <span className="font-mono font-medium tabular-nums">
                                            {Number(value).toLocaleString()}
                                          </span>
                                        </div>
                                      )
                                    }
                                    if (name === 'revenue') {
                                      return (
                                        <div className="flex items-center justify-between w-full gap-3">
                                          <span className="text-muted-foreground flex items-center gap-1.5">
                                            <span>💰</span>
                                            Revenue
                                          </span>
                                          <span className="font-mono font-medium tabular-nums text-green-600 dark:text-green-400">
                                            ${Number(value).toLocaleString()}
                                          </span>
                                        </div>
                                      )
                                    }
                                    return null
                                  }}
                                />
                              }
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
                            <XAxis
                              type="number"
                              hide
                              domain={[0, maxCountryValue]}
                            />
                            <YAxis type="category" dataKey="name" hide />
                            <ChartTooltip
                              content={
                                <ChartTooltipContent
                                  formatter={(value, name) => {
                                    if (name === 'visitors') {
                                      return (
                                        <div className="flex items-center justify-between w-full gap-3">
                                          <span className="text-muted-foreground flex items-center gap-1.5">
                                            <span>👥</span>
                                            Visitors
                                          </span>
                                          <span className="font-mono font-medium tabular-nums">
                                            {Number(value).toLocaleString()}
                                          </span>
                                        </div>
                                      )
                                    }
                                    return null
                                  }}
                                />
                              }
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
