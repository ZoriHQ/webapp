import { useEffect, useState } from 'react'
import { IconCheck, IconCopy } from '@tabler/icons-react'
import { SiHtml5, SiNextdotjs, SiReact, SiVuedotjs } from 'react-icons/si'
import useWebSocket from 'react-use-websocket'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import jsx from 'react-syntax-highlighter/dist/cjs/languages/prism/jsx'
import markup from 'react-syntax-highlighter/dist/cjs/languages/prism/markup'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { Button } from '@/components/ui/button'
import { GlobeVisualization } from '@/components/overview/globe-visualization'
import { useAuthState } from '@/lib/auth'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

SyntaxHighlighter.registerLanguage('jsx', jsx)
SyntaxHighlighter.registerLanguage('xml', markup)

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
  const [firstEventReceived, setFirstEventReceived] = useState(false)
  const [eventLocation, setEventLocation] = useState<{
    lat: number
    lng: number
  } | null>(null)
  const { getToken } = useAuthState()
  const [socketUrl, setSocketUrl] = useState<string>(
    `${wsURL}/events/stream?id=${projectId}&token=`,
  )

  useEffect(() => {
    const getAsyncToken = async () => {
      const token = await getToken()
      setSocketUrl(`${wsURL}/events/stream?id=${projectId}&token=${token}`)
    }
    getAsyncToken()
  }, [getToken])

  const { lastMessage } = useWebSocket(socketUrl, {
    onOpen: () => console.log('opened'),
    onMessage: (event) => {
      console.log('message', event.data)
      try {
        const data: EventData = JSON.parse(event.data)
        if (data.event_name && !firstEventReceived) {
          setFirstEventReceived(true)
          if (
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            data.location_latitude !== undefined &&
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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

  const [copiedTab, setCopiedTab] = useState<string | null>(null)

  const handleCopy = (text: string, tabId: string) => {
    navigator.clipboard.writeText(text)
    setCopiedTab(tabId)
    setTimeout(() => setCopiedTab(null), 2000)
  }

  const nextJsCode = `<Script
  src="https://cdn.zorihq.com/script.min.js"
  data-key="${projectToken}"
  strategy="afterInteractive"
/>`

  const reactCode = `<script>
  window.ZoriHQ = window.ZoriHQ || [];
</script>
<script
  async
  src="https://cdn.zorihq.com/script.min.js"
  data-key="${projectToken}">
</script>`

  const vueCode = `<script>
  window.ZoriHQ = window.ZoriHQ || [];
</script>
<script
  async
  src="https://cdn.zorihq.com/script.min.js"
  data-key="${projectToken}">
</script>`

  const htmlCode = `<script>
  window.ZoriHQ = window.ZoriHQ || [];
</script>
<script
  async
  src="https://cdn.zorihq.com/script.min.js"
  data-key="${projectToken}">
</script>`

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.3fr] gap-8 items-start min-h-[600px]">
      {/* Left side - Setup Instructions */}
      <div className="space-y-6 pt-8 pl-4 max-w-xl">
        {/* Title */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">
            Connect ZoriHQ to Your Website
          </h1>
          <p className="text-muted-foreground text-lg">
            Add the tracking script to start collecting analytics data
          </p>
        </div>

        {/* Status indicator */}
        {firstEventReceived ? (
          <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50">
            <IconCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
            <p className="text-sm text-green-700 dark:text-green-300">
              Connected! We received your first event.
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Waiting for your first event...
            </p>
          </div>
        )}

        {/* Installation Tabs */}
        <Tabs defaultValue="nextjs" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="nextjs" className="flex items-center gap-2">
              <SiNextdotjs className="h-4 w-4" />
              <span className="hidden sm:inline">Next.js</span>
            </TabsTrigger>
            <TabsTrigger value="react" className="flex items-center gap-2">
              <SiReact className="h-4 w-4" />
              <span className="hidden sm:inline">React</span>
            </TabsTrigger>
            <TabsTrigger value="vue" className="flex items-center gap-2">
              <SiVuedotjs className="h-4 w-4" />
              <span className="hidden sm:inline">Vue</span>
            </TabsTrigger>
            <TabsTrigger value="html" className="flex items-center gap-2">
              <SiHtml5 className="h-4 w-4" />
              <span className="hidden sm:inline">HTML</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="nextjs" className="mt-4">
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-2 z-10"
                onClick={() => handleCopy(nextJsCode, 'nextjs')}
              >
                {copiedTab === 'nextjs' ? (
                  <>
                    <IconCheck className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <IconCopy className="mr-2 h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>

              <div className="rounded-lg border overflow-hidden">
                <SyntaxHighlighter
                  language="jsx"
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    padding: '1rem',
                    fontSize: '0.875rem',
                  }}
                >
                  {nextJsCode}
                </SyntaxHighlighter>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="react" className="mt-4">
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-2 z-10"
                onClick={() => handleCopy(reactCode, 'react')}
              >
                {copiedTab === 'react' ? (
                  <>
                    <IconCheck className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <IconCopy className="mr-2 h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>

              <div className="rounded-lg border overflow-hidden">
                <SyntaxHighlighter
                  language="xml"
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    padding: '1rem',
                    fontSize: '0.875rem',
                  }}
                >
                  {reactCode}
                </SyntaxHighlighter>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="vue" className="mt-4">
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-2 z-10"
                onClick={() => handleCopy(vueCode, 'vue')}
              >
                {copiedTab === 'vue' ? (
                  <>
                    <IconCheck className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <IconCopy className="mr-2 h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>

              <div className="rounded-lg border overflow-hidden">
                <SyntaxHighlighter
                  language="xml"
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    padding: '1rem',
                    fontSize: '0.875rem',
                  }}
                >
                  {vueCode}
                </SyntaxHighlighter>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="html" className="mt-4">
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-2 z-10"
                onClick={() => handleCopy(htmlCode, 'html')}
              >
                {copiedTab === 'html' ? (
                  <>
                    <IconCheck className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <IconCopy className="mr-2 h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>

              <div className="rounded-lg border overflow-hidden">
                <SyntaxHighlighter
                  language="xml"
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    padding: '1rem',
                    fontSize: '0.875rem',
                  }}
                >
                  {htmlCode}
                </SyntaxHighlighter>
              </div>
            </div>
          </TabsContent>
        </Tabs>
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
