import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { toast } from 'sonner'
import { AppShortcuts } from '@/features/preptracker/components/reader/AppShortcuts'
import { OnboardingModal } from '@/features/preptracker/components/reader/OnboardingModal'
import { ErrorBoundary } from '@/features/preptracker/components/shared/ErrorBoundary'

export function RootLayout() {
  useEffect(() => {
    let warned = false
    const handler = (event: Event) => {
      if (warned) return
      warned = true
      const detail = (event as CustomEvent<{ key?: string; error?: unknown }>).detail
      const message =
        detail?.error instanceof Error ? detail.error.message : 'Browser storage write failed.'
      toast.warning('Progress will not persist', {
        description: `${message} (key: ${detail?.key ?? 'unknown'})`,
        duration: Infinity,
      })
    }
    window.addEventListener('preptracker-storage-error', handler)
    return () => window.removeEventListener('preptracker-storage-error', handler)
  }, [])

  return (
    <ErrorBoundary>
      <AppShortcuts />
      <OnboardingModal />
      <Outlet />
    </ErrorBoundary>
  )
}
