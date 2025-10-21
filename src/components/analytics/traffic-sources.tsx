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

interface TrafficSourcesProps {
  originData?: Array<Zoriapi.V1.Analytics.OriginDataPoint>
  countryData?: Array<Zoriapi.V1.Analytics.CountryDataPoint>
  isLoading?: boolean
}

export function TrafficSources({ originData, countryData, isLoading = false }: TrafficSourcesProps) {
  const [showAllOrigins, setShowAllOrigins] = useState(false)
  const [showAllCountries, setShowAllCountries] = useState(false)

  return (
    <Card>
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
            ) : originData && originData.length > 0 ? (
              <>
                <div className="space-y-3">
                  {(showAllOrigins ? originData : originData.slice(0, 10)).map((source, idx) => (
                    <div key={idx} className="flex items-center justify-between">
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
                      <div className="ml-4 text-right">
                        <p className="text-sm font-bold">
                          {(source.unique_visitors || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {originData.length > 10 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllOrigins(!showAllOrigins)}
                    className="w-full mt-3"
                  >
                    {showAllOrigins ? 'Show Less' : `Show More (${originData.length - 10} more)`}
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
                  {(showAllCountries ? countryData : countryData.slice(0, 10)).map((country, idx) => {
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
                {countryData.length > 10 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllCountries(!showAllCountries)}
                    className="w-full mt-3"
                  >
                    {showAllCountries ? 'Show Less' : `Show More (${countryData.length - 10} more)`}
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
