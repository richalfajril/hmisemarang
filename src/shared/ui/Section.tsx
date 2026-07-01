import { cn } from '@/shared/lib/utils'

type Props = {
  className?: string
  /** Render the subtle Islamic diamond pattern overlay. Default true. */
  pattern?: boolean
  children: React.ReactNode
}

export function Section({ className, pattern = true, children }: Props) {
  return (
    <section className={cn('relative overflow-hidden py-14', className)}>
      {pattern && (
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full text-white opacity-[0.06]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="section-geo"
              x="0"
              y="0"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M30 3 L57 30 L30 57 L3 30 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              <path
                d="M30 15 L45 30 L30 45 L15 30 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
              <circle cx="0" cy="0" r="1.5" fill="currentColor" />
              <circle cx="60" cy="0" r="1.5" fill="currentColor" />
              <circle cx="0" cy="60" r="1.5" fill="currentColor" />
              <circle cx="60" cy="60" r="1.5" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#section-geo)" />
        </svg>
      )}
      <div className="relative z-10">{children}</div>
    </section>
  )
}
