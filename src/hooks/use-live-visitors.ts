import { useEffect, useState } from 'react'
import useWebSocket from 'react-use-websocket'
import { useAuthState } from '@/lib/auth'

interface LiveVisitorCount {
  project_id: string
  count: number
}

const wsURL = import.meta.env.VITE_API_BASE_URL.replace('https://', 'wss://')

export function useLiveVisitors(projectId: string) {
  const { getToken } = useAuthState()
  const [socketUrl, setSocketUrl] = useState<string | null>(null)
  const [liveCount, setLiveCount] = useState<number>(0)

  useEffect(() => {
    const getAsyncToken = async () => {
      const token = await getToken()
      setSocketUrl(`${wsURL}/live/visitors?id=${projectId}&token=${token}`)
    }
    getAsyncToken()
  }, [getToken, projectId])

  const { readyState } = useWebSocket(
    socketUrl,
    {
      onMessage: (event) => {
        try {
          const data = JSON.parse(event.data) as LiveVisitorCount
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (data.count != null) {
            setLiveCount(data.count)
          }
        } catch (error) {
          console.error('Failed to parse live visitor data:', error)
        }
      },
      shouldReconnect: () => true,
      reconnectAttempts: 10,
      reconnectInterval: 3000,
    },
    !!socketUrl,
  )

  const isConnected = readyState === WebSocket.OPEN

  return {
    liveCount,
    isConnected,
  }
}
