import { useState } from 'react'
import { IconCopy, IconCheck } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface InstallationExamplesProps {
  projectToken: string
}

export function InstallationExamples({
  projectToken,
}: InstallationExamplesProps) {
  const [copiedTab, setCopiedTab] = useState<string | null>(null)

  const handleCopy = (text: string, tabId: string) => {
    navigator.clipboard.writeText(text)
    setCopiedTab(tabId)
    setTimeout(() => setCopiedTab(null), 2000)
  }

  const nextJsAppRouterCode = `// app/layout.tsx
import Script from 'next/script'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Initialize ZoriHQ queue */}
        <script
          dangerouslySetInnerHTML={{
            __html: \`window.ZoriHQ = window.ZoriHQ || [];\`,
          }}
        />
        {/* Load ZoriHQ script asynchronously */}
        <Script
          src="https://cdn.zorihq.com/script.min.js"
          data-key="${projectToken}"
          strategy="afterInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}

// Track custom events anywhere in your app
'use client'

export function TrackingExample() {
  const trackButtonClick = () => {
    if (window.ZoriHQ) {
      window.ZoriHQ.push(['track', 'button_clicked', {
        button_name: 'Get Started',
        page: 'homepage'
      }])
    }
  }

  const identifyUser = () => {
    if (window.ZoriHQ) {
      window.ZoriHQ.push(['identify', {
        app_id: 'user_123',
        email: 'user@example.com',
        fullname: 'John Doe'
      }])
    }
  }

  return <button onClick={trackButtonClick}>Get Started</button>
}

// TypeScript declarations (add to globals.d.ts)
declare global {
  interface Window {
    ZoriHQ: Array<[string, string, any?]> & {
      track?: (event: string, properties?: any) => void
      identify?: (properties: any) => void
      setConsent?: (consent: { analytics?: boolean; marketing?: boolean }) => void
      optOut?: () => void
    }
  }
}
`

  const nextJsPagesRouterCode = `// pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Initialize ZoriHQ queue */}
        <script
          dangerouslySetInnerHTML={{
            __html: \`window.ZoriHQ = window.ZoriHQ || [];\`,
          }}
        />
        {/* Load ZoriHQ script */}
        <Script
          src="https://cdn.zorihq.com/script.min.js"
          data-key="${projectToken}"
          strategy="afterInteractive"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

// Track page views (add to pages/_app.tsx)
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (window.ZoriHQ) {
        window.ZoriHQ.push(['track', 'page_view', { url }])
      }
    }

    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return <Component {...pageProps} />
}
`

  const reactCode = `// public/index.html or src/index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>My React App</title>

    <!-- Initialize ZoriHQ queue -->
    <script>
      window.ZoriHQ = window.ZoriHQ || [];
    </script>

    <!-- Load ZoriHQ script asynchronously -->
    <script
      async
      src="https://cdn.zorihq.com/script.min.js"
      data-key="${projectToken}">
    </script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>

// --- OR create a custom React hook ---

// src/hooks/useZori.ts
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

declare global {
  interface Window {
    ZoriHQ: Array<[string, string, any?]> & {
      track?: (event: string, properties?: any) => void
      identify?: (properties: any) => void
    }
  }
}

export function useZori() {
  const location = useLocation()

  // Track page views on route change
  useEffect(() => {
    if (window.ZoriHQ) {
      window.ZoriHQ.push(['track', 'page_view', {
        url: location.pathname + location.search
      }])
    }
  }, [location])

  const track = (event: string, properties?: any) => {
    if (window.ZoriHQ) {
      window.ZoriHQ.push(['track', event, properties])
    }
  }

  const identify = (properties: { app_id: string; email?: string; fullname?: string }) => {
    if (window.ZoriHQ) {
      window.ZoriHQ.push(['identify', properties])
    }
  }

  return { track, identify }
}

// Usage in your components
import { useZori } from './hooks/useZori'

export function MyComponent() {
  const { track, identify } = useZori()

  const handleClick = () => {
    track('button_clicked', {
      button_name: 'Subscribe',
      page: 'pricing'
    })
  }

  useEffect(() => {
    // Identify user when logged in
    identify({
      app_id: 'user_123',
      email: 'user@example.com',
      fullname: 'John Doe'
    })
  }, [])

  return <button onClick={handleClick}>Subscribe Now</button>
}
`

  const vanillaJsCode = `<!-- Basic Installation -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My Website</title>

  <!-- Initialize ZoriHQ queue -->
  <script>
    window.ZoriHQ = window.ZoriHQ || [];
  </script>

  <!-- Load ZoriHQ script asynchronously -->
  <script
    async
    src="https://cdn.zorihq.com/script.min.js"
    data-key="${projectToken}">
  </script>

  <!-- Track immediately (before script loads) -->
  <script>
    // These events will be queued and processed when script loads
    window.ZoriHQ.push(['track', 'page_view']);
  </script>
</head>
<body>
  <h1>My Website</h1>
  <button id="cta-button">Get Started</button>

  <script>
    // Track button clicks
    document.getElementById('cta-button').addEventListener('click', function() {
      window.ZoriHQ.push(['track', 'button_clicked', {
        button_name: 'Get Started',
        page: 'homepage'
      }]);
    });

    // Identify user when they log in
    function onUserLogin(userId, email, name) {
      window.ZoriHQ.push(['identify', {
        app_id: userId,
        email: email,
        fullname: name
      }]);
    }

    // Track custom events with properties
    function trackPurchase(productId, amount) {
      window.ZoriHQ.push(['track', 'purchase_completed', {
        product_id: productId,
        amount: amount,
        currency: 'USD'
      }]);
    }

    // Consent management (GDPR)
    function handleConsent(accepted) {
      if (accepted) {
        window.ZoriHQ.push(['setConsent', {
          analytics: true,
          marketing: true
        }]);
      } else {
        window.ZoriHQ.push(['optOut']);
      }
    }

    // Track form submissions
    document.getElementById('signup-form')?.addEventListener('submit', function(e) {
      e.preventDefault();
      window.ZoriHQ.push(['track', 'form_submitted', {
        form_name: 'signup',
        page: 'homepage'
      }]);
      // ... handle form submission
    });
  </script>
</body>
</html>
`

  const examples = [
    {
      id: 'nextjs-app',
      label: 'Next.js (App Router)',
      code: nextJsAppRouterCode,
      description: 'For Next.js 13+ with App Router',
    },
    {
      id: 'nextjs-pages',
      label: 'Next.js (Pages)',
      code: nextJsPagesRouterCode,
      description: 'For Next.js with Pages Router',
    },
    {
      id: 'react',
      label: 'React (Vite/CRA)',
      code: reactCode,
      description: 'For React with Vite, Create React App, or other bundlers',
    },
    {
      id: 'vanilla',
      label: 'Vanilla JS',
      code: vanillaJsCode,
      description: 'For plain HTML/JavaScript websites',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Installation Examples</CardTitle>
        <CardDescription>
          Choose your framework and copy the installation code
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="nextjs-app" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            {examples.map((example) => (
              <TabsTrigger key={example.id} value={example.id}>
                {example.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {examples.map((example) => (
            <TabsContent key={example.id} value={example.id} className="mt-4">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {example.description}
                </p>

                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2 z-10"
                    onClick={() => handleCopy(example.code, example.id)}
                  >
                    {copiedTab === example.id ? (
                      <>
                        <IconCheck className="mr-2 h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <IconCopy className="mr-2 h-4 w-4" />
                        Copy Code
                      </>
                    )}
                  </Button>

                  <div className="rounded-lg border bg-muted/50 p-4 pr-24 overflow-x-auto">
                    <pre className="text-sm">
                      <code>{example.code}</code>
                    </pre>
                  </div>
                </div>

                <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-4">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Key Features
                  </h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                    <li>Asynchronous loading for optimal performance</li>
                    <li>Event queue ensures no events are lost</li>
                    <li>Automatic page view tracking</li>
                    <li>User identification and custom events</li>
                    <li>GDPR-compliant consent management</li>
                    <li>Works with TypeScript</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
