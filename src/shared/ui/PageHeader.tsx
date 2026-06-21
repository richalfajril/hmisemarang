import { ReactNode } from 'react'
import { BackButton } from './BackButton'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface PageHeaderProps {
  title: ReactNode
  description?: string
  backHref?: string
  backLabel?: string
  icon?: LucideIcon
  children?: ReactNode // Action slot
  className?: string
}

export function PageHeader({
  title,
  description,
  backHref,
  backLabel,
  icon: Icon,
  children,
  className
}: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-border/60', className)}>
      <div className="flex items-start gap-4">
        {backHref && <BackButton href={backHref} label={backLabel} />}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3">
            {Icon && <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground shrink-0" />}
            <span>{title}</span>
          </h1>
          {description && (
            <p className="text-sm sm:text-base text-muted-foreground max-w-3xl">
              {description}
            </p>
          )}
        </div>
      </div>
      {children && (
        <div className="flex items-center gap-3 sm:ml-auto">
          {children}
        </div>
      )}
    </div>
  )
}
