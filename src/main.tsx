import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppRouter } from './router'
import type { Container } from 'react-dom/client'
import { AuthProviderComponent } from '@/lib/auth'
import { ThemeProvider } from '@/components/theme-provider'
import {
  handleUnauthorized,
  isUnauthorizedError,
} from '@/lib/auth/unauthorized-handler'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: (failureCount, error) => {
        // Don't retry on 401 errors
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

function RootApp() {
  return (
    <AuthProviderComponent>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <RouterProvider router={router} />
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProviderComponent>
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
