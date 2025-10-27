import { StackClientApp } from '@stackframe/react'

export const stackClientApp = new StackClientApp({
  projectId: import.meta.env.VITE_STACKFRAME_PROJECT_ID,
  publishableClientKey: import.meta.env.VITE_STACKFRAME_PUBLISHABLE_CLIENT_KEY,
  tokenStore: 'cookie',
  urls: {
    signIn: '/login',
    signUp: '/register',
    afterSignIn: '/projects',
    afterSignUp: '/projects',
    afterSignOut: '/login',
    home: '/projects',
    accountSettings: '/account',
  },
})
