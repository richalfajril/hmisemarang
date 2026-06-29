'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Input } from './Input'

/**
 * Input kata kunci berbasis chip. Ketik lalu Enter/koma → jadi chip.
 * Nilai dikirim lewat hidden input (gabung koma) agar kompatibel dgn form action.
 */
export function TagInput({
  name,
  defaultValue = [],
  placeholder,
  disabled,
}: {
  name: string
  defaultValue?: string[]
  placeholder?: string
  disabled?: boolean
}) {
  const [tags, setTags] = useState<string[]>(defaultValue)
  const [draft, setDraft] = useState('')

  const add = (raw: string) => {
    const v = raw.trim()
    setDraft('')
    if (!v) return
    setTags((prev) =>
      prev.some((t) => t.toLowerCase() === v.toLowerCase()) ? prev : [...prev, v]
    )
  }
  const remove = (i: number) => setTags((prev) => prev.filter((_, idx) => idx !== i))

  return (
    <div>
      <input type="hidden" name={name} value={tags.join(', ')} />
      <Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            add(draft)
          } else if (e.key === 'Backspace' && !draft && tags.length) {
            remove(tags.length - 1)
          }
        }}
        onBlur={() => add(draft)}
        placeholder={placeholder}
        disabled={disabled}
        className="bg-background"
      />
      {tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((t, i) => (
            <span
              key={`${t}-${i}`}
              className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-primary"
            >
              {t}
              <button
                type="button"
                onClick={() => remove(i)}
                disabled={disabled}
                aria-label={`Hapus ${t}`}
                className="rounded-full transition-colors hover:text-emerald-900"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
