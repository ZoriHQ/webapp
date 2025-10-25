import { useState } from 'react'
import type Zoriapi from 'zorihq'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { countryCodeToFlag, getCountryName } from '@/lib/country-utils'
import { getFaviconUrl } from '@/lib/favicon-utils'
import { Globe } from 'lucide-react'

interface TrafficSourcesProps {
  originData?: Array<Zoriapi.V1.Analytics.OriginDataPoint>
  countryData?: Array<Zoriapi.V1.Analytics.CountryDataPoint>
  revenueByOrigin?: Array<Zoriapi.V1.Revenue.OriginAttributionDataPoint>
  isLoading?: boolean
  showRevenue?: boolean
}

export function TrafficSources({
  originData,
  countryData,
  revenueByOrigin,
  isLoading = false,
  showRevenue = false
}: TrafficSourcesProps) {
  const [showAllOrigins, setShowAllOrigins] = useState(false)
  const [showAllCountries, setShowAllCountries] = useState(false)

  // Merge visitor and revenue data by origin
  const mergedOriginData = originData?.map(visitor => {
    const revenueMatch = revenueByOrigin?.find(
      rev => (rev.origin || 'Direct') === (visitor.origin || 'Direct')
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
                <p className="text-sm text-muted-foreground">Loading origin data...</p>
              </div>
            ) : mergedOriginData && mergedOriginData.length > 0 ? (
              <>
                <div className="space-y-3">
                  {(showAllOrigins ? mergedOriginData : mergedOriginData.slice(0, 6)).map((source, idx) => {
                    const isDirect = !source.origin || source.origin === 'Direct'
                    const faviconUrl = isDirect ? '' : getFaviconUrl(source.origin, 32)

                    return (
                      <div key={idx} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {isDirect ? (
                            <Globe className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                          ) : (
                            <img
                              src={faviconUrl}
                              alt=""
                              className="w-5 h-5 rounded flex-shrink-0"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                                const globe = e.currentTarget.nextElementSibling
                                if (globe) {
                                  (globe as HTMLElement).style.display = 'block'
                                }
                              }}
                            />
                          )}
                          <Globe className="w-5 h-5 text-muted-foreground flex-shrink-0 hidden" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {source.origin || 'Direct'}
                            </p>
                            <div className="mt-1 h-2 bg-secondary rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full transition-all"
                                style={{
                                  width: `${source.percentage}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="ml-4 text-right flex-shrink-0">
                          {showRevenue ? (
                            <div className="flex items-center gap-2">
                              <div className="text-right">
                                <p className="text-sm font-bold">
                                  {(source.unique_visitors || 0).toLocaleString()}
                                </p>
                                <p className="text-xs text-muted-foreground">visitors</p>
                              </div>
                              <div className="text-muted-foreground">•</div>
                              <div className="text-right">
                                <p className="text-sm font-bold text-green-600 dark:text-green-400">
                                  ${source.revenue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                </p>
                                <p className="text-xs text-muted-foreground">revenue</p>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm font-bold">
                              {(source.unique_visitors || 0).toLocaleString()}
                            </p>
                          )}
                        </div>
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
                    {showAllOrigins ? 'Show Less' : `Show More (${mergedOriginData.length - 6} more)`}
                  </Button>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-sm text-muted-foreground">No traffic data available</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="country" className="mt-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-sm text-muted-foreground">Loading country data...</p>
              </div>
            ) : countryData && countryData.length > 0 ? (
              <>
                <div className="space-y-3">
                  {(showAllCountries ? countryData : countryData.slice(0, 6)).map((country, idx) => {
                    const countryCode = country.country_code?.toUpperCase() || ''
                    const countryName = getCountryName(countryCode)
                    const flagEmoji = countryCodeToFlag(countryCode)

                    return (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="text-2xl">{flagEmoji}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{countryName}</p>
                            <div className="mt-1 h-2 bg-secondary rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full transition-all"
                                style={{
                                  width: `${country.percentage}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="ml-4 text-right">
                          <p className="text-sm font-bold">
                            {(country.unique_visitors || 0).toLocaleString()}
                          </p>
                        </div>
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
                    {showAllCountries ? 'Show Less' : `Show More (${countryData.length - 6} more)`}
                  </Button>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-sm text-muted-foreground">No country data available</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
