/**
 * API endpoints for authentication
 * Used by OSS mode for JWT-based authentication
 * Uses zorihq SDK v0.11.0+ auth endpoint
 */

import Zoriapi from 'zorihq'
import type { LoginResponse as SDKLoginResponse } from 'zorihq/resources/v1/auth'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:1323'

export interface LoginResponse {
  token: string
  user: {
    id: string
    email: string
    name: string
    avatar?: string
  }
}

export async function loginWithCredentials(
  username: string,
  password: string,
): Promise<LoginResponse> {
  const client = new Zoriapi({
    baseURL: API_BASE_URL,
    apiKey: '__empty__oss__',
  })

  try {
    const response: SDKLoginResponse = await client.v1.auth.login({
      username,
      password,
    })

    if (!response.token) {
      throw new Error('No token received from server')
    }

    return {
      token: response.token,
      user: {
        id: response.org_id || 'oss-user',
        email: username,
        name: username,
        avatar: undefined,
      },
    }
  } catch (error) {
    if (error && typeof error === 'object' && 'status' in error) {
      const statusCode = (error as { status: number }).status
      if (statusCode === 401) {
        throw new Error('Invalid username or password')
      }
    }
    throw new Error('Login failed. Please try again.')
  }
}
