import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { syllabus } from '@/features/deepdive/data/syllabus'
import { useSettings } from '@/features/deepdive/hooks/useDeepDive'

const STEPS = ['Name', 'Daily goal', 'Focus paper'] as const

export function OnboardingModal() {
  const { settings, updateSettings } = useSettings()
  const open = !settings.userName
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [goal, setGoal] = useState(180)
  const [paperId, setPaperId] = useState(settings.currentPaper || syllabus[0]?.id || '')

  const finish = () => {
    updateSettings({
      userName: name.trim() || 'Friend',
      dailyGoalMins: goal || 180,
      currentPaper: paperId,
    })
  }

  const next = () => {
    if (step >= STEPS.length - 1) {
      finish()
      return
    }
    setStep((value) => value + 1)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        /* gated by userName */
      }}
    >
      <DialogContent showClose={false} className="max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to DeepDive</DialogTitle>
          <DialogDescription>
            Three quick steps. You can change everything later in Settings.
          </DialogDescription>
        </DialogHeader>

        <ol className="flex items-center gap-2">
          {STEPS.map((label, index) => (
            <li
              key={label}
              className={`flex h-1.5 flex-1 rounded-full ${index <= step ? 'bg-primary' : 'bg-muted'}`}
              aria-label={label}
            />
          ))}
        </ol>

        {step === 0 && (
          <div className="space-y-2">
            <label className="block text-sm font-medium">What should we call you?</label>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              autoFocus
            />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-2">
            <label className="block text-sm font-medium">Daily study goal (minutes)</label>
            <Input
              type="number"
              min={15}
              step={15}
              value={goal}
              onChange={(event) => setGoal(Number(event.target.value) || 180)}
            />
            <p className="text-xs text-muted-foreground">
              Default 180 minutes (3 hours). Change anytime.
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-2">
            <label className="block text-sm font-medium">Which paper is your current focus?</label>
            <select
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
              value={paperId}
              onChange={(event) => setPaperId(event.target.value)}
            >
              {syllabus.map((paper) => (
                <option key={paper.id} value={paper.id}>
                  {paper.title}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            disabled={step === 0}
            onClick={() => setStep((value) => Math.max(0, value - 1))}
          >
            Back
          </Button>
          <Button onClick={next} disabled={step === 0 && !name.trim()}>
            {step === STEPS.length - 1 ? 'Start studying' : 'Next'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
