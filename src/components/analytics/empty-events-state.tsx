import { useState } from 'react'
import {
  IconActivity,
  IconCheck,
  IconCode,
  IconCopy,
  IconRocket,
} from '@tabler/icons-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface EmptyEventsStateProps {
  projectId: string
  projectName?: string
}

export function EmptyEventsState({
  projectId,
  projectName,
}: EmptyEventsStateProps) {
  const [copied, setCopied] = useState(false)

  const trackingScript = `<!-- Zori Analytics -->
<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://cdn.zori.so/track.js';
    script.dataset.projectId = '${projectId}';
    script.async = true;
    document.head.appendChild(script);
  })();
</script>`

  const handleCopy = () => {
    navigator.clipboard.writeText(trackingScript)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] px-4">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        {/* Icon */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <IconActivity className="w-10 h-10 text-primary" />
          </div>
          <div className="absolute -right-2 -top-2 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center animate-pulse">
            <IconRocket className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
        </div>

        {/* Title and description */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Waiting for Your First Event</h2>
          <p className="text-muted-foreground">
            {projectName ? `${projectName} is` : 'Your project is'} set up! Add
            the tracking script to your website to start collecting analytics
            data.
          </p>
        </div>

        {/* Installation Card */}
        <Card className="p-6 text-left bg-muted/30">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <IconCode className="w-5 h-5" />
            Installation Instructions
          </h3>
          <ol className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <div className="flex-1">
                <p className="font-medium text-sm mb-2">
                  Copy the tracking script
                </p>
                <div className="relative">
                  <pre className="bg-background border rounded-lg p-4 text-xs overflow-x-auto">
                    <code>{trackingScript}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <>
                        <IconCheck className="w-4 h-4 mr-1" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <IconCopy className="w-4 h-4 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <div>
                <p className="font-medium text-sm">
                  Add it to your website's HTML
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Paste the script in the {'<head>'} section of your website,
                  just before the closing {'</head>'} tag
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <div>
                <p className="font-medium text-sm">Visit your website</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Navigate to your website and the analytics data will start
                  flowing in within seconds
                </p>
              </div>
            </li>
          </ol>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Card className="p-4 text-left">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                <IconActivity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Real-time Data</h3>
                <p className="text-xs text-muted-foreground">
                  See events appear instantly as visitors interact with your
                  site
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 text-left">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                <IconRocket className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">
                  Lightweight Script
                </h3>
                <p className="text-xs text-muted-foreground">
                  Minimal impact on your site's performance
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 text-left">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                <IconCode className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Easy Setup</h3>
                <p className="text-xs text-muted-foreground">
                  Just one script tag - no complex configuration needed
                </p>
              </div>
            </div>
          </Card>
        </div>

        <p className="text-xs text-muted-foreground pt-4">
          This page will automatically update once we receive your first event
        </p>
      </div>
    </div>
  )
}
