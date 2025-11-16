import { createContext, useContext, useEffect, useState } from 'react'
import type { TimeRange } from '@/hooks/use-analytics'

type AppContextValues = {
  projectId?: string | null | undefined
  timeRange: TimeRange
}

type AppContextType = {
  storedValues: AppContextValues | null
  setStoredValues: React.Dispatch<React.SetStateAction<AppContextValues | null>>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppContextProvider = ({
  children,
  values,
}: {
  children: React.ReactNode
  values: AppContextValues | null
}) => {
  const [storedValues, setStoredValues] = useState<AppContextValues | null>({
    timeRange: 'last_7_days',
  })

  useEffect(() => {
    if (!values) {
      console.debug(
        'AppContextProvider: No values provided. Trying to load from localStorage',
      )

      const localStorageValues = localStorage.getItem('appContext')
      if (localStorageValues) {
        try {
          const parsedValues = JSON.parse(localStorageValues)
          if (parsedValues.projectId && parsedValues.timeRange) {
            console.debug('AppContextProvider: Loaded values from localStorage')
            setStoredValues(parsedValues)
          }
        } catch (error) {
          console.error('AppContextProvider: Error parsing localStorage values')
        }
      } else {
        setStoredValues({
          timeRange: 'last_7_days',
        })
      }
    } else {
      setStoredValues(values)
    }
  }, [values])

  useEffect(() => {
    if (storedValues) {
      localStorage.setItem('appContext', JSON.stringify(storedValues))
    }
  }, [storedValues])

  return (
    <AppContext.Provider value={{ storedValues, setStoredValues }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider')
  }
  return context
}
