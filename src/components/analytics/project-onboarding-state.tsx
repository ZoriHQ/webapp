import { useEffect, useState } from 'react'
import { IconCheck, IconCopy } from '@tabler/icons-react'
import useWebSocket from 'react-use-websocket'
import { Button } from '@/components/ui/button'
import { GlobeVisualization } from '@/components/overview/globe-visualization'
import { useAuth } from '@/lib/use-auth'

interface ProjectOnboardingStateProps {
  projectId: string
  projectToken?: string
}

interface EventData {
  event_name: string
  location_latitude: number
  location_longitude: number
  location_country_iso: string
  location_city: string
  [key: string]: any
}

const wsURL = import.meta.env.VITE_API_BASE_URL.replace('https://', 'wss://')

export function ProjectOnboardingState({
  projectId,
  projectToken,
}: ProjectOnboardingStateProps) {
  const [copied, setCopied] = useState(false)
  const [firstEventReceived, setFirstEventReceived] = useState(false)
  const [eventLocation, setEventLocation] = useState<{
    lat: number
    lng: number
  } | null>(null)
  const { accessToken } = useAuth()
  const socketUrl = `${wsURL}/events/stream?id=${projectId}&token=${accessToken}`

  const { lastMessage } = useWebSocket(socketUrl, {
    onOpen: () => console.log('opened'),
    onMessage: (event) => {
      console.log('message', event.data)
      try {
        const data: EventData = JSON.parse(event.data)
        if (data.event_name && !firstEventReceived) {
          setFirstEventReceived(true)
          // Set location if available
          if (
            data.location_latitude !== undefined &&
            data.location_longitude !== undefined
          ) {
            setEventLocation({
              lat: data.location_latitude,
              lng: data.location_longitude,
            })
          }
        }
      } catch (error) {
        console.error('Failed to parse event data:', error)
      }
    },
    shouldReconnect: (closeEvent) => true,
  })

  useEffect(() => {
    console.log('Last message: ', lastMessage)
  }, [lastMessage])

  const trackingScript = `<!-- Zori Analytics -->
<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://cdn.zori.so/track.js';
    script.dataset.projectId = '${projectToken || projectId}';
    script.async = true;
    document.head.appendChild(script);
  })();
</script>`

  const handleCopy = () => {
    navigator.clipboard.writeText(trackingScript)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.3fr] gap-8 items-start min-h-[600px]">
      {/* Left side - Setup Instructions */}
      <div className="space-y-6 pt-8 pl-4 max-w-xl">
        {/* Title */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">
            Connect Zori to Your Website
          </h1>
          <p className="text-muted-foreground text-lg">
            Add this script to the {'<head>'} of your website
          </p>
        </div>

        {/* Code Block */}
        <div className="relative">
          <pre className="bg-muted/50 border border-border rounded-lg p-4 overflow-x-auto">
            <code className="text-sm">
              <span className="text-muted-foreground">
                {'<!-- Zori Analytics -->'}
              </span>
              {'\n'}
              <span className="text-blue-600 dark:text-blue-400">
                {'<script>'}
              </span>
              {'\n  '}
              <span className="text-purple-600 dark:text-purple-400">
                {'(function()'}
              </span>{' '}
              <span className="text-yellow-600 dark:text-yellow-400">
                {'{'}
              </span>
              {'\n    '}
              <span className="text-pink-600 dark:text-pink-400">var</span>
              {' script = '}
              <span className="text-foreground">document</span>
              {'.'}
              <span className="text-green-600 dark:text-green-400">
                createElement
              </span>
              {'('}
              <span className="text-orange-600 dark:text-orange-400">
                {"'script'"}
              </span>
              {');'}
              {'\n    '}
              {'script.src = '}
              <span className="text-orange-600 dark:text-orange-400">
                {"'https://cdn.zori.so/track.js'"}
              </span>
              {';'}
              {'\n    '}
              {'script.dataset.projectId = '}
              <span className="text-orange-600 dark:text-orange-400">{`'${projectToken || projectId}'`}</span>
              {';'}
              {'\n    '}
              {'script.async = '}
              <span className="text-blue-600 dark:text-blue-400">true</span>
              {';'}
              {'\n    '}
              <span className="text-foreground">document</span>
              {'.head.'}
              <span className="text-green-600 dark:text-green-400">
                appendChild
              </span>
              {'(script);'}
              {'\n  '}
              <span className="text-yellow-600 dark:text-yellow-400">
                {'}'}
              </span>
              <span className="text-purple-600 dark:text-purple-400">
                {')'}
              </span>
              {'();'}
              {'\n'}
              <span className="text-blue-600 dark:text-blue-400">
                {'</script>'}
              </span>
            </code>
          </pre>
          <Button
            size="sm"
            variant="secondary"
            className="absolute top-3 right-3"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <IconCheck className="w-4 h-4 mr-1" />
                Copied
              </>
            ) : (
              <>
                <IconCopy className="w-4 h-4 mr-1" />
                Copy
              </>
            )}
          </Button>
        </div>

        {/* Status indicator */}
        {firstEventReceived ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50">
              <IconCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
              <p className="text-sm text-green-700 dark:text-green-300">
                Connected! We received your first event.
              </p>
            </div>
            <Button size="lg" className="w-full">
              Get Started
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Waiting for your first event...
            </p>
          </div>
        )}
      </div>

      {/* Right side - Spinning Globe */}
      <div className="lg:sticky lg:top-6">
        <GlobeVisualization
          countryData={[]}
          isLoading={false}
          highlightPoint={eventLocation}
        />
      </div>
    </div>
  )
}
