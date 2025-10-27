import React from 'react'
// eslint-disable-next-line
import ReactDOM, { type Container } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { StackProvider, StackTheme } from '@stackframe/react'
import { createAppRouter } from './router'
import { stackClientApp } from './lib/stack-client'
import { ThemeProvider } from '@/components/theme-provider'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: (failureCount, error) => {
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

function RootApp() {
  return (
    <StackProvider app={stackClientApp}>
      <StackTheme>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <RouterProvider router={router} />
          </ThemeProvider>
          {import.meta.env.DEV && <ReactQueryDevtools />}
        </QueryClientProvider>
      </StackTheme>
    </StackProvider>
  )
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
