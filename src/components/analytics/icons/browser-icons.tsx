// Browser brand icons using PNG images
import chromeIcon from './chrome.png'
import firefoxIcon from './firefox.png'
import safariIcon from './safari.png'
import edgeIcon from './edge.png'
import operaIcon from './opera.png'

export const ChromeIcon = ({ className }: { className?: string }) => (
  <img src={chromeIcon} alt="Chrome" className={className} />
)

export const FirefoxIcon = ({ className }: { className?: string }) => (
  <img src={firefoxIcon} alt="Firefox" className={className} />
)

export const SafariIcon = ({ className }: { className?: string }) => (
  <img src={safariIcon} alt="Safari" className={className} />
)

export const EdgeIcon = ({ className }: { className?: string }) => (
  <img src={edgeIcon} alt="Edge" className={className} />
)

export const OperaIcon = ({ className }: { className?: string }) => (
  <img src={operaIcon} alt="Opera" className={className} />
)

export const BraveIcon = ({ className }: { className?: string }) => (
  <img src={chromeIcon} alt="Brave" className={className} />
)
