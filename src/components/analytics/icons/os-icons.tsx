// OS brand icons using PNG images
import windowsIcon from './windows.png'
import appleIcon from './apple.png'
import linuxIcon from './linux.png'

export const WindowsIcon = ({ className }: { className?: string }) => (
  <img src={windowsIcon} alt="Windows" className={className} />
)

export const AppleIcon = ({ className }: { className?: string }) => (
  <img src={appleIcon} alt="macOS" className={className} />
)

export const LinuxIcon = ({ className }: { className?: string }) => (
  <img src={linuxIcon} alt="Linux" className={className} />
)

export const AndroidIcon = ({ className }: { className?: string }) => (
  <img src={linuxIcon} alt="Android" className={className} />
)

export const IOSIcon = ({ className }: { className?: string }) => (
  <img src={appleIcon} alt="iOS" className={className} />
)
