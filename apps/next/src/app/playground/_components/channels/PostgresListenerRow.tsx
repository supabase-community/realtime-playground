'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  createPostgresListenerDefaults,
  POSTGRES_FILTER_OPERATORS,
  type PostgresListenerValues,
  postgresListenerSchema,
} from '@realtime-playground/realtime-core'
import { REALTIME_POSTGRES_CHANGES_LISTEN_EVENT } from '@supabase/supabase-js'
import { Plus, X } from 'lucide-react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type Props = {
  onAdd: (values: PostgresListenerValues) => void
}

// Hint the expected value shape per operator (the builder parses it at build time).
const VALUE_PLACEHOLDER: Partial<Record<(typeof POSTGRES_FILTER_OPERATORS)[number], string>> = {
  in: 'a, b, c',
  is: 'null | true | false | unknown',
  like: '%foo%',
  ilike: '%foo%',
  match: '^foo',
  imatch: '^foo',
}

export function PostgresListenerRow({ onAdd }: Props) {
  const form = useForm<PostgresListenerValues>({
    resolver: zodResolver(postgresListenerSchema),
    defaultValues: createPostgresListenerDefaults(),
  })

  const filters = useFieldArray({ control: form.control, name: 'filters' })

  const handleSubmit = form.handleSubmit((values) => {
    onAdd(values)
    form.reset(createPostgresListenerDefaults())
  })

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <Button type="submit" size="sm" variant="secondary" className="h-7 shrink-0 text-xs">
          Add Postgres Listener
        </Button>
        <Input className="h-7 w-20 text-xs" placeholder="schema" {...form.register('schema')} />
        <Input className="h-7 w-20 text-xs" placeholder="table (*)" {...form.register('table')} />
        <Controller
          control={form.control}
          name="event"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="h-7 w-24 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(REALTIME_POSTGRES_CHANGES_LISTEN_EVENT).map((value) => (
                  <SelectItem key={value} value={value} className="text-xs">
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {filters.fields.map((fieldItem, index) => (
        <div key={fieldItem.id} className="flex flex-wrap items-center gap-2 pl-2">
          <Input
            className="h-7 w-24 text-xs"
            placeholder="column"
            {...form.register(`filters.${index}.column`)}
          />
          <Controller
            control={form.control}
            name={`filters.${index}.negate`}
            render={({ field }) => (
              <label
                htmlFor={`filter-negate-${fieldItem.id}`}
                className="flex h-7 shrink-0 items-center gap-1 text-xs text-muted-foreground"
              >
                <Checkbox
                  id={`filter-negate-${fieldItem.id}`}
                  checked={field.value}
                  onCheckedChange={(v) => field.onChange(v === true)}
                />
                not
              </label>
            )}
          />
          <Controller
            control={form.control}
            name={`filters.${index}.operator`}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-7 w-24 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {POSTGRES_FILTER_OPERATORS.map((op) => (
                    <SelectItem key={op} value={op} className="text-xs">
                      {op}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <Controller
            control={form.control}
            name={`filters.${index}.operator`}
            render={({ field: opField }) => (
              <Input
                className="h-7 w-40 text-xs"
                placeholder={VALUE_PLACEHOLDER[opField.value] ?? 'value'}
                {...form.register(`filters.${index}.value`)}
              />
            )}
          />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-7 w-7 shrink-0"
            onClick={() => filters.remove(index)}
            aria-label="Remove filter"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}

      <div className="flex flex-wrap items-center gap-2 pl-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-7 shrink-0 text-xs"
          onClick={() => filters.append({ column: '', operator: 'eq', value: '', negate: false })}
        >
          <Plus className="mr-1 h-3.5 w-3.5" />
          Add filter
        </Button>
        <Controller
          control={form.control}
          name="select"
          render={({ field }) => (
            <Input
              className="h-7 w-52 text-xs"
              placeholder="select columns (comma separated)"
              value={field.value.join(', ')}
              onChange={(e) =>
                field.onChange(
                  e.target.value
                    .split(',')
                    .map((c) => c.trim())
                    .filter((c) => c !== ''),
                )
              }
            />
          )}
        />
      </div>
    </form>
  )
}
