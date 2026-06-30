// src/components/ui/switch.tsx
'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

const Switch = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<'input'>
>(({ className, ...props }, ref) => (
  <label className={cn('inline-flex cursor-pointer items-center', className)}>
    <input
      type="checkbox"
      ref={ref}
      className="sr-only peer"
      {...props}
    />
    <span
      className={cn(
        'inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 border-transparent bg-input transition-colors',
        'peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background',
        'disabled:cursor-not-allowed disabled:opacity-50 peer-checked:bg-primary'
      )}
    >
      <span
        className={cn(
          'pointer-events-none block h-5 w-5 translate-x-0 rounded-full bg-background shadow-lg ring-0 transition-transform',
          'peer-checked:translate-x-5'
        )}
      />
    </span>
  </label>
))
Switch.displayName = 'Switch'

export { Switch }