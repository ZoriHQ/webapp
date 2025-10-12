import { useMutation } from '@tanstack/react-query'
import Zoriapi from 'zorihq'
import { auth } from '@/lib/auth'

export interface RegisterData {
  email: string
  password: string
  first_name: string
  last_name: string
  organization_name: string
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:1323'

export function useRegister() {
  const zori = new Zoriapi({
    baseURL: API_BASE_URL,
    apiKey: '__empty__',
  })

  return useMutation({
    mutationKey: ['register'],
    mutationFn: async (data: RegisterData) => {
      const response = await zori.v1.auth.registerAccount(data)
      auth.setAuthData(response)
      return response
    },
    onError: (error) => {
      // Clear any existing auth data on registration error
      auth.clearAuthData()
      console.error('Registration failed:', error)
    },
  })
}
