import {
  Link,
  Square,
  Send,
  MousePointer,
  ExternalLink,
  Download,
  Star,
  Eye,
  EyeOff,
  LogOut,
} from 'lucide-react'
import type Zoriapi from 'zorihq'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

type ClickType = 'link' | 'button' | 'submit' | 'generic'

interface ClickInfo {
  type: ClickType
  icon: React.ReactNode
  label: string
  bgColor: string
  textColor: string
}

function getClickInfo(
  event: Zoriapi.V1.Analytics.RecentEvent,
): ClickInfo | null {
  const tag = event.click_element_tag?.toLowerCase()
  const type = event.click_element_type?.toLowerCase()

  if (!tag) return null

  // Form submit
  if (type === 'submit') {
    return {
      type: 'submit',
      icon: <Send className="h-3 w-3" />,
      label: 'submit',
      bgColor: 'bg-green-500/10 hover:bg-green-500/20',
      textColor: 'text-green-600 dark:text-green-400',
    }
  }

  // Link click
  if (tag === 'a') {
    return {
      type: 'link',
      icon: <Link className="h-3 w-3" />,
      label: 'link',
      bgColor: 'bg-blue-500/10 hover:bg-blue-500/20',
      textColor: 'text-blue-600 dark:text-blue-400',
    }
  }

  // Button click
  if (tag === 'button' || (tag === 'input' && type === 'button')) {
    return {
      type: 'button',
      icon: <Square className="h-3 w-3" />,
      label: 'button',
      bgColor: 'bg-purple-500/10 hover:bg-purple-500/20',
      textColor: 'text-purple-600 dark:text-purple-400',
    }
  }

  // Generic element click
  return {
    type: 'generic',
    icon: <MousePointer className="h-3 w-3" />,
    label: tag,
    bgColor: 'bg-muted hover:bg-muted/80',
    textColor: 'text-muted-foreground',
  }
}

function truncateText(
  text: string | undefined,
  maxLength: number = 20,
): string {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

function formatSelector(selector: string | undefined): string {
  if (!selector) return ''
  if (selector.length > 50) {
    return selector.substring(0, 50) + '...'
  }
  return selector
}

interface EventBadgeProps {
  event: Zoriapi.V1.Analytics.RecentEvent
}

// Unified event badge that shows event type with click details integrated
export function EventBadge({ event }: EventBadgeProps) {
  const eventName = event.event_name || 'unknown'
  const clickInfo = getClickInfo(event)
  const hasClickData =
    event.click_element_tag ||
    event.click_element_text ||
    event.is_cta_click ||
    event.is_external_link ||
    event.is_download_link

  // Determine badge style based on event type
  const getEventStyle = () => {
    switch (eventName) {
      case 'page_view':
        return {
          icon: <Eye className="h-3 w-3" />,
          label: 'page view',
          bgColor: 'bg-primary/10 hover:bg-primary/20',
          textColor: 'text-primary',
        }
      case 'page_unload':
        return {
          icon: <LogOut className="h-3 w-3" />,
          label: 'page unload',
          bgColor: 'bg-destructive/10 hover:bg-destructive/20',
          textColor: 'text-destructive',
        }
      case 'page_hidden':
        return {
          icon: <EyeOff className="h-3 w-3" />,
          label: 'page hidden',
          bgColor: 'bg-muted hover:bg-muted/80',
          textColor: 'text-muted-foreground',
        }
      case 'click':
        // For click events, use click info if available
        if (clickInfo) {
          return clickInfo
        }
        return {
          icon: <MousePointer className="h-3 w-3" />,
          label: 'click',
          bgColor: 'bg-secondary hover:bg-secondary/80',
          textColor: 'text-secondary-foreground',
        }
      default:
        // Custom events
        return {
          icon: null,
          label: eventName,
          bgColor: 'bg-secondary hover:bg-secondary/80',
          textColor: 'text-secondary-foreground',
        }
    }
  }

  const style = getEventStyle()
  const elementText = event.click_element_text
  const displayText = truncateText(elementText, 12)

  // Build tooltip content for click events
  const hasTooltipContent = hasClickData && eventName === 'click'

  const tooltipContent = hasTooltipContent ? (
    <div className="space-y-2 text-xs">
      <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
        {event.click_element_tag && (
          <>
            <span className="text-muted-foreground">Element</span>
            <span className="font-medium">{event.click_element_tag}</span>
          </>
        )}

        {event.click_element_type && (
          <>
            <span className="text-muted-foreground">Type</span>
            <span className="font-medium">{event.click_element_type}</span>
          </>
        )}

        {event.click_element_text && (
          <>
            <span className="text-muted-foreground">Text</span>
            <span className="font-medium truncate max-w-[200px]">
              {event.click_element_text.substring(0, 80)}
              {event.click_element_text.length > 80 ? '...' : ''}
            </span>
          </>
        )}

        {event.click_element_category && (
          <>
            <span className="text-muted-foreground">Category</span>
            <span>{event.click_element_category}</span>
          </>
        )}

        {event.link_destination && (
          <>
            <span className="text-muted-foreground">Link to</span>
            <span className="text-blue-400 truncate max-w-[200px]">
              {event.link_destination}
            </span>
          </>
        )}

        {event.click_element_selector && (
          <>
            <span className="text-muted-foreground">Selector</span>
            <code className="text-[10px] text-muted-foreground truncate max-w-[200px]">
              {formatSelector(event.click_element_selector)}
            </code>
          </>
        )}

        {event.click_position_x !== undefined &&
          event.click_position_y !== undefined && (
            <>
              <span className="text-muted-foreground">Position</span>
              <span>
                {event.click_position_x}, {event.click_position_y}
                {event.click_screen_width && event.click_screen_height && (
                  <span className="text-muted-foreground ml-1">
                    ({event.click_screen_width}x{event.click_screen_height})
                  </span>
                )}
              </span>
            </>
          )}
      </div>

      {(event.is_cta_click ||
        event.is_external_link ||
        event.is_download_link) && (
        <div className="flex gap-1 pt-1 border-t border-border">
          {event.is_cta_click && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              CTA
            </Badge>
          )}
          {event.is_external_link && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              External
            </Badge>
          )}
          {event.is_download_link && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              Download
            </Badge>
          )}
        </div>
      )}
    </div>
  ) : null

  const badge = (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium transition-colors',
        style.bgColor,
        style.textColor,
        hasTooltipContent && 'cursor-help',
      )}
    >
      {style.icon}
      <span>{style.label}</span>

      {/* Show element text for clicks */}
      {eventName === 'click' && displayText && (
        <>
          <span className="text-muted-foreground/60">·</span>
          <span className="font-normal opacity-80 truncate max-w-[60px]">
            {displayText}
          </span>
        </>
      )}

      {/* Special indicators */}
      {event.is_cta_click && (
        <Star className="h-2.5 w-2.5 text-yellow-500 fill-yellow-500 ml-0.5" />
      )}
      {event.is_external_link && (
        <ExternalLink className="h-2.5 w-2.5 opacity-60 ml-0.5" />
      )}
      {event.is_download_link && (
        <Download className="h-2.5 w-2.5 opacity-60 ml-0.5" />
      )}
    </div>
  )

  if (!hasTooltipContent) {
    return badge
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent className="max-w-[350px]" side="bottom">
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Keep the old export for backwards compatibility but mark as deprecated
export function ClickEventDetails(_props: EventBadgeProps) {
  // This is now handled by EventBadge
  return null
}

export function hasClickEventData(
  event: Zoriapi.V1.Analytics.RecentEvent,
): boolean {
  return !!(
    event.click_element_tag ||
    event.click_element_text ||
    event.is_cta_click ||
    event.is_external_link ||
    event.is_download_link
  )
}
