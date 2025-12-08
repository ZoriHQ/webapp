import { Globe, Monitor, Smartphone, Tablet } from 'lucide-react'
import {
  ChromeIcon,
  EdgeIcon,
  FirefoxIcon,
  OperaIcon,
  SafariIcon,
} from '@/components/analytics/icons/browser-icons'
import {
  AndroidIcon,
  AppleIcon,
  IOSIcon,
  LinuxIcon,
  WindowsIcon,
} from '@/components/analytics/icons/os-icons'

const ICON_SIZE = 'h-4 w-4'

export function getBrowserIcon(browserName: string | undefined) {
  if (!browserName) return null

  const name = browserName.toLowerCase()

  if (name.includes('chrome') || name.includes('chromium')) {
    return <ChromeIcon className={ICON_SIZE} />
  }
  if (name.includes('firefox')) {
    return <FirefoxIcon className={ICON_SIZE} />
  }
  if (name.includes('safari')) {
    return <SafariIcon className={ICON_SIZE} />
  }
  if (name.includes('edge')) {
    return <EdgeIcon className={ICON_SIZE} />
  }
  if (name.includes('opera')) {
    return <OperaIcon className={ICON_SIZE} />
  }
  if (name.includes('brave')) {
    return <ChromeIcon className={ICON_SIZE} />
  }

  return <Globe className={`${ICON_SIZE} text-muted-foreground`} />
}

export function getOsIcon(osName: string | undefined) {
  if (!osName) return null

  const name = osName.toLowerCase()

  if (name.includes('windows')) {
    return <WindowsIcon className={ICON_SIZE} />
  }
  if (name.includes('mac') || name.includes('macos') || name.includes('os x')) {
    return <AppleIcon className={ICON_SIZE} />
  }
  if (
    name.includes('ios') ||
    name.includes('iphone') ||
    name.includes('ipad')
  ) {
    return <IOSIcon className={ICON_SIZE} />
  }
  if (name.includes('android')) {
    return <AndroidIcon className={ICON_SIZE} />
  }
  if (
    name.includes('linux') ||
    name.includes('ubuntu') ||
    name.includes('debian')
  ) {
    return <LinuxIcon className={ICON_SIZE} />
  }

  return null
}

export function getDeviceIcon(deviceType: string | undefined) {
  if (!deviceType)
    return <Monitor className={`${ICON_SIZE} text-muted-foreground`} />

  const type = deviceType.toLowerCase()

  if (type.includes('mobile') || type.includes('phone')) {
    return <Smartphone className={`${ICON_SIZE} text-muted-foreground`} />
  }
  if (type.includes('tablet')) {
    return <Tablet className={`${ICON_SIZE} text-muted-foreground`} />
  }

  return <Monitor className={`${ICON_SIZE} text-muted-foreground`} />
}

export function getPlatformDisplay(
  browserName: string | undefined,
  osName: string | undefined,
  deviceType: string | undefined,
) {
  const browserIcon = getBrowserIcon(browserName)
  const osIcon = getOsIcon(osName)
  const deviceIcon = !osIcon ? getDeviceIcon(deviceType) : null

  const tooltipParts: Array<string> = []
  if (browserName) tooltipParts.push(browserName)
  if (osName) tooltipParts.push(`on ${osName}`)
  else if (deviceType) tooltipParts.push(`on ${deviceType}`)

  return {
    browserIcon,
    osIcon: osIcon || deviceIcon,
    tooltip: tooltipParts.join(' ') || 'Unknown platform',
  }
}
