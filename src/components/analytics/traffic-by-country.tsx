import { useState } from 'react'
import type Zoriapi from 'zorihq'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { countryCodeToFlag, getCountryName } from '@/lib/country-utils'

interface TrafficByCountryProps {
  data: Array<Zoriapi.V1.Analytics.CountryDataPoint> | undefined
  isLoading: boolean
}

export function TrafficByCountry({ data, isLoading }: TrafficByCountryProps) {
  const [showAll, setShowAll] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Traffic by Country</CardTitle>
        <CardDescription>
          Geographic distribution of unique visitors
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-muted-foreground">
              Loading country data...
            </p>
          </div>
        ) : data && data.length > 0 ? (
          <>
            <div className="space-y-3">
              {(showAll ? data : data.slice(0, 10)).map((country, idx) => {
                const countryCode = country.country_code?.toUpperCase() || ''
                const countryName = getCountryName(countryCode)
                const flagEmoji = countryCodeToFlag(countryCode)

                return (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="text-2xl">{flagEmoji}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {countryName}
                        </p>
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
            {data.length > 10 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAll(!showAll)}
                className="w-full mt-3"
              >
                {showAll ? 'Show Less' : `Show More (${data.length - 10} more)`}
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
      </CardContent>
    </Card>
  )
}
