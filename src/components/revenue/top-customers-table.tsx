import { IconUserCheck } from '@tabler/icons-react'
import type Zoriapi from 'zorihq'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { countryCodeToFlag, getCountryName } from '@/lib/country-utils'
import { getTrafficOriginShort } from '@/lib/traffic-origin-utils'

interface TopCustomersTableProps {
  data: Zoriapi.V1.Revenue.TopCustomersResponse | undefined
  isLoading: boolean
  onCustomerClick?: (visitorId: string) => void
}

function formatTimestamp(timestamp: string | undefined) {
  if (!timestamp) return 'N/A'
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function TopCustomersTable({
  data,
  isLoading,
  onCustomerClick,
}: TopCustomersTableProps) {
  const hasCustomers = data?.customers && data.customers.length > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Customers by Revenue</CardTitle>
        <CardDescription>
          Customers ranked by total revenue contribution
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-muted-foreground">
              Loading top customers...
            </p>
          </div>
        ) : hasCustomers ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Total Revenue</TableHead>
                  <TableHead className="text-right">Payments</TableHead>
                  <TableHead className="text-right">Avg Order</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Traffic Source</TableHead>
                  <TableHead>First Payment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.customers!.map((customer, idx) => {
                  const revenue = (customer.total_revenue || 0) / 100
                  const avgOrder = (customer.avg_order_value || 0) / 100
                  const currency = customer.currency || 'USD'
                  const countryCode =
                    customer.location_country_iso?.toUpperCase() || ''
                  const flagEmoji = countryCodeToFlag(countryCode)
                  const countryName = getCountryName(countryCode)
                  const hasIdentity = customer.user_id || customer.external_id

                  return (
                    <TableRow key={idx}>
                      <TableCell>
                        {customer.visitor_id ? (
                          <button
                            onClick={() =>
                              onCustomerClick?.(customer.visitor_id!)
                            }
                            className="hover:text-primary hover:underline cursor-pointer transition-colors text-left"
                          >
                            <div className="flex items-center gap-2">
                              {hasIdentity && (
                                <IconUserCheck className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                              )}
                              <div className="flex flex-col min-w-0">
                                {customer.name ? (
                                  <>
                                    <span className="text-sm font-medium truncate">
                                      {customer.name}
                                    </span>
                                    {customer.email && (
                                      <span className="text-xs text-muted-foreground truncate">
                                        {customer.email}
                                      </span>
                                    )}
                                  </>
                                ) : customer.email ? (
                                  <span className="text-sm font-medium truncate">
                                    {customer.email}
                                  </span>
                                ) : customer.user_id ? (
                                  <span className="text-sm font-medium truncate">
                                    {customer.user_id}
                                  </span>
                                ) : customer.external_id ? (
                                  <span className="text-sm font-medium font-mono truncate">
                                    {customer.external_id}
                                  </span>
                                ) : (
                                  <span className="text-xs font-mono text-muted-foreground truncate">
                                    {customer.visitor_id.substring(0, 12)}...
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          $
                          {revenue.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary">
                          {customer.payment_count || 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        $
                        {avgOrder.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell>
                        {countryCode ? (
                          <div className="flex items-center gap-2">
                            <span>{flagEmoji}</span>
                            <span className="text-xs">{countryName}</span>
                          </div>
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[150px] truncate">
                        {getTrafficOriginShort(customer)}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatTimestamp(customer.first_payment_date)}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No customer data available for this time period
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
