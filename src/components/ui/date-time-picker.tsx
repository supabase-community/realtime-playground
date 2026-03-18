'use client'

import * as React from 'react'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface DateTimePickerProps {
  value: Date | undefined
  onChange: (date: Date | undefined) => void
  disabled?: boolean
  /** Disables dates after this date in the calendar (defaults to now) */
  maxDate?: Date
}

export function DateTimePicker({ value, onChange, disabled, maxDate }: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false)

  const hours = value ? String(value.getHours()).padStart(2, '0') : ''
  const minutes = value ? String(value.getMinutes()).padStart(2, '0') : ''

  function handleDateSelect(day: Date | undefined) {
    if (!day) {
      onChange(undefined)
      return
    }

    // Preserve existing time when changing date
    const next = new Date(day)
    if (value) {
      next.setHours(value.getHours(), value.getMinutes(), 0, 0)
    } else {
      next.setHours(0, 0, 0, 0)
    }
    onChange(next)
  }

  function handleTimeChange(field: 'hours' | 'minutes', raw: string) {
    const num = Number(raw)
    if (Number.isNaN(num)) return

    const base = value ?? new Date()
    const next = new Date(base)

    if (field === 'hours') {
      next.setHours(Math.min(Math.max(num, 0), 23), next.getMinutes(), 0, 0)
    } else {
      next.setMinutes(Math.min(Math.max(num, 0), 59))
      next.setSeconds(0, 0)
    }
    onChange(next)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            'h-9 w-full justify-start text-left text-xs font-normal',
            !value && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className="size-3.5" />
          {value ? format(value, 'PPP HH:mm') : 'Pick a date & time'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleDateSelect}
          disabled={(date) => date > (maxDate ?? new Date())}
          defaultMonth={value}
          autoFocus
        />
        <div className="border-t p-3">
          <Label className="text-xs font-medium">Time</Label>
          <div className="mt-1.5 flex items-center gap-1.5">
            <Input
              type="number"
              min={0}
              max={23}
              placeholder="HH"
              value={hours}
              onChange={(e) => handleTimeChange('hours', e.target.value)}
              className="h-8 w-16 text-center text-xs tabular-nums"
            />
            <span className="text-muted-foreground text-sm">:</span>
            <Input
              type="number"
              min={0}
              max={59}
              placeholder="MM"
              value={minutes}
              onChange={(e) => handleTimeChange('minutes', e.target.value)}
              className="h-8 w-16 text-center text-xs tabular-nums"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
