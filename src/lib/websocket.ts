import { createContext, useContext, useEffect, useRef, useState } from 'react'

const WSContext = createContext(undefined)
export const useWS = () => useContext(WSContext)
