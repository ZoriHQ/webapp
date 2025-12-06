import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ZoriProvider } from '@zorihq/react'
import { createAppRouter } from './router'
import type { Container } from 'react-dom/client'
import { AuthProviderComponent } from '@/lib/auth'
import { ThemeProvider } from '@/components/theme-provider'
import { getAuthMode } from '@/lib/auth/types'
import { isUnauthorizedError } from '@/lib/auth/unauthorized-handler'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: (failureCount, error) => {
        if (isUnauthorizedError(error)) {
          return false
        }

        if (error instanceof Error) {
          const message = error.message
          if (
            message.includes('401') ||
            message.includes('403') ||
            message.includes('404')
          ) {
            return false
          }
        }
        return failureCount < 3
      },
    },
  },
})

const router = createAppRouter(queryClient)

const isCloudMode = getAuthMode() === 'clerk'
const zoriPublishableKey = import.meta.env.VITE_ZORI_PUBLISHABLE_KEY

function RootApp() {
  const appContent = (
    <AuthProviderComponent>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <RouterProvider router={router} />
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProviderComponent>
  )

  if (isCloudMode && zoriPublishableKey) {
    return (
      <ZoriProvider
        config={{
          publishableKey: zoriPublishableKey,
          baseUrl: 'https://ingestion.zorihq.com/ingest',
        }}
        autoTrackPageViews={true}
      >
        {appContent}
      </ZoriProvider>
    )
  }

  return appContent
}

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

async function initApp() {
  await router.load()

  ReactDOM.createRoot(rootElement as Container).render(
    <React.StrictMode>
      <RootApp />
    </React.StrictMode>,
  )
}

// Start the app
initApp().catch(console.error)
