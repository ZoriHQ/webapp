// OS brand icons with official colors

export const WindowsIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 3h8v8H3z" fill="#F25022"/>
    <path d="M13 3h8v8h-8z" fill="#7FBA00"/>
    <path d="M3 13h8v8H3z" fill="#00A4EF"/>
    <path d="M13 13h8v8h-8z" fill="#FFB900"/>
  </svg>
)

export const AppleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.09l-.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
          fill="currentColor"
          className="fill-black dark:fill-white"/>
  </svg>
)

export const LinuxIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2c-1.5 0-2.5 1-3 2-.3.5-.5 1.2-.5 2 0 .5.1 1 .3 1.5.2.5.5 1 .7 1.5-.5.3-1 .7-1.3 1.2-.4.5-.7 1.2-.7 2 0 1 .5 1.8 1.2 2.3.7.5 1.5.7 2.3.7s1.6-.2 2.3-.7c.7-.5 1.2-1.3 1.2-2.3 0-.8-.3-1.5-.7-2-.3-.5-.8-.9-1.3-1.2.2-.5.5-1 .7-1.5.2-.5.3-1 .3-1.5 0-.8-.2-1.5-.5-2-.5-1-1.5-2-3-2zm-3 14c-.5.5-1 1-1 2 0 .5.2 1 .5 1.5.3.5.8.8 1.3 1 .5.2 1.1.3 1.7.3s1.2-.1 1.7-.3c.5-.2 1-.5 1.3-1 .3-.5.5-1 .5-1.5 0-1-.5-1.5-1-2-.5-.5-1.2-.8-2-.8s-1.5.3-2 .8z"
          fill="#FCC624"/>
    <path d="M10 10.5c0 .3.2.5.5.5s.5-.2.5-.5-.2-.5-.5-.5-.5.2-.5.5zm3 0c0 .3.2.5.5.5s.5-.2.5-.5-.2-.5-.5-.5-.5.2-.5.5z"
          fill="#000"/>
  </svg>
)

export const AndroidIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 1.23 12.95 1 12 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 3.26 6 5.01 6 7h12c0-1.99-.97-3.75-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z"
          fill="#3DDC84"/>
  </svg>
)

export const IOSIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="4" width="14" height="16" rx="2" fill="currentColor" className="fill-black dark:fill-white"/>
    <rect x="6" y="5" width="12" height="13" fill="#fff" className="dark:fill-gray-900"/>
    <circle cx="12" cy="19" r="0.8" fill="currentColor" className="fill-black dark:fill-white"/>
  </svg>
)
