import { useEffect, useState } from 'react'
import { IconCheck, IconCopy } from '@tabler/icons-react'
import {
  SiHtml5,
  SiNextdotjs,
  SiReact,
  SiSvelte,
  SiVuedotjs,
} from 'react-icons/si'
import { ArrowRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import useWebSocket from 'react-use-websocket'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import bash from 'react-syntax-highlighter/dist/cjs/languages/prism/bash'
import jsx from 'react-syntax-highlighter/dist/cjs/languages/prism/jsx'
import markup from 'react-syntax-highlighter/dist/cjs/languages/prism/markup'
import typescript from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { Button } from '@/components/ui/button'
import { GlobeVisualization } from '@/components/overview/globe-visualization'
import { useAuthState } from '@/lib/auth'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

SyntaxHighlighter.registerLanguage('bash', bash)
SyntaxHighlighter.registerLanguage('jsx', jsx)
SyntaxHighlighter.registerLanguage('typescript', typescript)
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

  const nextJsInstall = `pnpm add @zorihq/nextjs`

  const nextJsCode = `// app/providers.tsx
'use client';

import { ZoriProvider } from '@zorihq/nextjs';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ZoriProvider
      config={{
        publishableKey: '${projectToken}',
      }}
      autoTrackPageViews={true}
    >
      {children}
    </ZoriProvider>
  );
}`

  const reactInstall = `pnpm add @zorihq/react`

  const reactCode = `import { ZoriProvider } from '@zorihq/react';

function App() {
  return (
    <ZoriProvider
      config={{
        publishableKey: '${projectToken}',
      }}
      autoTrackPageViews={true}
    >
      <YourApp />
    </ZoriProvider>
  );
}`

  const vueInstall = `pnpm add @zorihq/vue`

  const vueCode = `// main.ts
import { createApp } from 'vue';
import { ZoriPlugin } from '@zorihq/vue';
import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(ZoriPlugin, {
  config: {
    publishableKey: '${projectToken}',
  },
  router,
  autoTrackPageViews: true,
});

app.use(router);
app.mount('#app');`

  const svelteInstall = `pnpm add @zorihq/svelte`

  const svelteCode = `<!-- +layout.svelte or App.svelte -->
<script lang="ts">
  import { initZori } from '@zorihq/svelte';

  initZori({
    publishableKey: '${projectToken}',
  });
</script>

<slot />`

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
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50">
              <IconCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
              <p className="text-sm text-green-700 dark:text-green-300">
                Connected! We received your first event.
              </p>
            </div>
            <Link to="/projects/$projectId/analytics" params={{ projectId }}>
              <Button className="w-full gap-2">
                View Analytics
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
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
          <TabsList className="grid w-full grid-cols-5">
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
            <TabsTrigger value="svelte" className="flex items-center gap-2">
              <SiSvelte className="h-4 w-4" />
              <span className="hidden sm:inline">Svelte</span>
            </TabsTrigger>
            <TabsTrigger value="html" className="flex items-center gap-2">
              <SiHtml5 className="h-4 w-4" />
              <span className="hidden sm:inline">JS</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="nextjs" className="mt-4 space-y-3">
            <div className="rounded-lg border overflow-hidden">
              <div className="flex items-center justify-between bg-muted/50 px-3 py-2 border-b">
                <span className="text-xs text-muted-foreground">
                  1. Install the package
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => handleCopy(nextJsInstall, 'nextjs-install')}
                >
                  {copiedTab === 'nextjs-install' ? (
                    <IconCheck className="h-3.5 w-3.5" />
                  ) : (
                    <IconCopy className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
              <SyntaxHighlighter
                language="bash"
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  padding: '0.75rem 1rem',
                  fontSize: '0.875rem',
                }}
              >
                {nextJsInstall}
              </SyntaxHighlighter>
            </div>
            <div className="rounded-lg border overflow-hidden">
              <div className="flex items-center justify-between bg-muted/50 px-3 py-2 border-b">
                <span className="text-xs text-muted-foreground">
                  2. Add the provider
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => handleCopy(nextJsCode, 'nextjs')}
                >
                  {copiedTab === 'nextjs' ? (
                    <IconCheck className="h-3.5 w-3.5" />
                  ) : (
                    <IconCopy className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
              <SyntaxHighlighter
                language="typescript"
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  padding: '0.75rem 1rem',
                  fontSize: '0.8rem',
                }}
              >
                {nextJsCode}
              </SyntaxHighlighter>
            </div>
          </TabsContent>

          <TabsContent value="react" className="mt-4 space-y-3">
            <div className="rounded-lg border overflow-hidden">
              <div className="flex items-center justify-between bg-muted/50 px-3 py-2 border-b">
                <span className="text-xs text-muted-foreground">
                  1. Install the package
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => handleCopy(reactInstall, 'react-install')}
                >
                  {copiedTab === 'react-install' ? (
                    <IconCheck className="h-3.5 w-3.5" />
                  ) : (
                    <IconCopy className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
              <SyntaxHighlighter
                language="bash"
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  padding: '0.75rem 1rem',
                  fontSize: '0.875rem',
                }}
              >
                {reactInstall}
              </SyntaxHighlighter>
            </div>
            <div className="rounded-lg border overflow-hidden">
              <div className="flex items-center justify-between bg-muted/50 px-3 py-2 border-b">
                <span className="text-xs text-muted-foreground">
                  2. Add the provider
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => handleCopy(reactCode, 'react')}
                >
                  {copiedTab === 'react' ? (
                    <IconCheck className="h-3.5 w-3.5" />
                  ) : (
                    <IconCopy className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
              <SyntaxHighlighter
                language="typescript"
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  padding: '0.75rem 1rem',
                  fontSize: '0.8rem',
                }}
              >
                {reactCode}
              </SyntaxHighlighter>
            </div>
          </TabsContent>

          <TabsContent value="vue" className="mt-4 space-y-3">
            <div className="rounded-lg border overflow-hidden">
              <div className="flex items-center justify-between bg-muted/50 px-3 py-2 border-b">
                <span className="text-xs text-muted-foreground">
                  1. Install the package
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => handleCopy(vueInstall, 'vue-install')}
                >
                  {copiedTab === 'vue-install' ? (
                    <IconCheck className="h-3.5 w-3.5" />
                  ) : (
                    <IconCopy className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
              <SyntaxHighlighter
                language="bash"
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  padding: '0.75rem 1rem',
                  fontSize: '0.875rem',
                }}
              >
                {vueInstall}
              </SyntaxHighlighter>
            </div>
            <div className="rounded-lg border overflow-hidden">
              <div className="flex items-center justify-between bg-muted/50 px-3 py-2 border-b">
                <span className="text-xs text-muted-foreground">
                  2. Add the plugin
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => handleCopy(vueCode, 'vue')}
                >
                  {copiedTab === 'vue' ? (
                    <IconCheck className="h-3.5 w-3.5" />
                  ) : (
                    <IconCopy className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
              <SyntaxHighlighter
                language="typescript"
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  padding: '0.75rem 1rem',
                  fontSize: '0.8rem',
                }}
              >
                {vueCode}
              </SyntaxHighlighter>
            </div>
          </TabsContent>

          <TabsContent value="svelte" className="mt-4 space-y-3">
            <div className="rounded-lg border overflow-hidden">
              <div className="flex items-center justify-between bg-muted/50 px-3 py-2 border-b">
                <span className="text-xs text-muted-foreground">
                  1. Install the package
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => handleCopy(svelteInstall, 'svelte-install')}
                >
                  {copiedTab === 'svelte-install' ? (
                    <IconCheck className="h-3.5 w-3.5" />
                  ) : (
                    <IconCopy className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
              <SyntaxHighlighter
                language="bash"
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  padding: '0.75rem 1rem',
                  fontSize: '0.875rem',
                }}
              >
                {svelteInstall}
              </SyntaxHighlighter>
            </div>
            <div className="rounded-lg border overflow-hidden">
              <div className="flex items-center justify-between bg-muted/50 px-3 py-2 border-b">
                <span className="text-xs text-muted-foreground">
                  2. Initialize in your layout
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => handleCopy(svelteCode, 'svelte')}
                >
                  {copiedTab === 'svelte' ? (
                    <IconCheck className="h-3.5 w-3.5" />
                  ) : (
                    <IconCopy className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
              <SyntaxHighlighter
                language="xml"
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  padding: '0.75rem 1rem',
                  fontSize: '0.8rem',
                }}
              >
                {svelteCode}
              </SyntaxHighlighter>
            </div>
          </TabsContent>

          <TabsContent value="html" className="mt-4">
            <div className="rounded-lg border overflow-hidden">
              <div className="flex items-center justify-between bg-muted/50 px-3 py-2 border-b">
                <span className="text-xs text-muted-foreground">
                  Add to your HTML {'<head>'}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => handleCopy(htmlCode, 'html')}
                >
                  {copiedTab === 'html' ? (
                    <IconCheck className="h-3.5 w-3.5" />
                  ) : (
                    <IconCopy className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
              <SyntaxHighlighter
                language="xml"
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  padding: '0.75rem 1rem',
                  fontSize: '0.875rem',
                }}
              >
                {htmlCode}
              </SyntaxHighlighter>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Right side - Spinning Globe */}
      <div className="lg:sticky lg:top-6">
        <GlobeVisualization highlightPoint={eventLocation} />
      </div>
    </div>
  )
}
