// Browser brand icons with official colors

export const ChromeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#fff"/>
    <circle cx="12" cy="12" r="7" fill="#4285F4"/>
    <path d="M12 5a7 7 0 0 0-6.062 10.5l3.031-5.25a4 4 0 0 1 6.062 0l3.031 5.25A7 7 0 0 0 12 5z" fill="#EA4335"/>
    <path d="M5.938 15.5A7 7 0 0 0 12 19a7 7 0 0 0 6.062-3.5h-6.124a4 4 0 0 1-6.062 0z" fill="#34A853"/>
    <path d="M12 19a7 7 0 0 0 6.062-10.5h-6.124a4 4 0 0 1 0 7z" fill="#FBBC04"/>
    <circle cx="12" cy="12" r="3" fill="#fff"/>
  </svg>
)

export const FirefoxIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="firefox-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF9500"/>
        <stop offset="100%" stopColor="#FF5000"/>
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="10" fill="url(#firefox-gradient)"/>
    <path d="M16 8c-1-2-3-3-5-3-3 0-5 2-5 5 0 2 1 4 3 5l2-3 2 3c2-1 3-3 3-5 0-1 0-1.5-0-2z" fill="#FFD700"/>
    <circle cx="12" cy="13" r="2" fill="#fff"/>
  </svg>
)

export const SafariIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="safari-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0AC8FA"/>
        <stop offset="100%" stopColor="#005FCC"/>
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="10" fill="url(#safari-gradient)"/>
    <circle cx="12" cy="12" r="8" fill="none" stroke="#fff" strokeWidth="0.5"/>
    <path d="M12 4v2M12 18v2M4 12h2M18 12h2" stroke="#fff" strokeWidth="1" strokeLinecap="round"/>
    <path d="M12 12L16 8M12 12L8 16" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 12L8 8M12 12L16 16" stroke="#E60012" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

export const EdgeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0078D7"/>
        <stop offset="100%" stopColor="#00BCF2"/>
      </linearGradient>
    </defs>
    <path d="M3 12c0-5 4-9 9-9 3 0 6 2 7 4-1-3-4-5-7-5-5 0-9 4-9 9 0 5 4 9 9 9 2 0 4-1 6-2-2 2-5 3-8 3-5 0-7-4-7-9z" fill="url(#edge-gradient)"/>
    <path d="M12 21c5 0 9-4 9-9 0-2-1-4-2-6 1 2 2 4 2 6 0 5-4 9-9 9-3 0-5-1-7-3 2 2 4 3 7 3z" fill="#00BCF2"/>
  </svg>
)

export const OperaIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="opera-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF1B2D"/>
        <stop offset="100%" stopColor="#A02422"/>
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="10" fill="url(#opera-gradient)"/>
    <path d="M12 5c-2 0-4 2-4 5s0 7 4 7 4-4 4-7-2-5-4-5z" fill="#fff"/>
  </svg>
)

export const BraveIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#FB542B"/>
    <path d="M12 6l2 3-2 1-2-1 2-3zM7 11l2 5 1-4-3-1zM17 11l-2 5-1-4 3-1zM10 16l2 2 2-2-2-1-2 1z" fill="#fff"/>
  </svg>
)
