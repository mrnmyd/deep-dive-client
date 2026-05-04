import { useState, type ReactNode } from 'react'
import { Dialog as DialogPrimitive } from 'radix-ui'
import { Menu, Sidebar, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type DrawerProps = {
  side: 'left' | 'right'
  trigger: ReactNode
  title: string
  children: (close: () => void) => ReactNode
}

function MobileDrawer({ side, trigger, title, children }: DrawerProps) {
  const [open, setOpen] = useState(false)
  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
        <DialogPrimitive.Content
          className={cn(
            'fixed inset-y-0 z-50 flex w-[85vw] max-w-sm flex-col border bg-background shadow-xl',
            side === 'left' ? 'left-0 border-r' : 'right-0 border-l'
          )}
        >
          <div className="flex items-center justify-between border-b px-4 py-3">
            <DialogPrimitive.Title className="text-sm font-semibold">{title}</DialogPrimitive.Title>
            <DialogPrimitive.Close asChild>
              <Button variant="ghost" size="icon" aria-label="Close">
                <X className="h-4 w-4" />
              </Button>
            </DialogPrimitive.Close>
          </div>
          <div className="flex-1 overflow-y-auto">{children(() => setOpen(false))}</div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

export function MobileTreeButton({ render }: { render: (close: () => void) => ReactNode }) {
  return (
    <MobileDrawer
      side="left"
      title="Syllabus"
      trigger={
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open syllabus">
          <Menu className="h-4 w-4" />
        </Button>
      }
    >
      {render}
    </MobileDrawer>
  )
}

export function MobileRailButton({ render }: { render: (close: () => void) => ReactNode }) {
  return (
    <MobileDrawer
      side="right"
      title="Session"
      trigger={
        <Button variant="ghost" size="icon" className="xl:hidden" aria-label="Open session panel">
          <Sidebar className="h-4 w-4" />
        </Button>
      }
    >
      {render}
    </MobileDrawer>
  )
}
