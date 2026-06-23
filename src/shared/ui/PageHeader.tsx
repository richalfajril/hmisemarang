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
  icon: Icon,
  children,
  className
}: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-border/60', className)}>
      <div className="flex items-start gap-4">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-3">
            {backHref ? (
              <BackButton href={backHref} className="h-8 w-8" />
            ) : Icon ? (
              <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground shrink-0" />
            ) : null}
            <span>{title}</span>
          </h1>
          {description && (
            <p className="text-sm text-muted-foreground max-w-3xl">
              {description}
            </p>
          )}
        </div>
      </div>
      {children && (
        <div className={cn(
          "fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t shadow-[0_-10px_40px_rgba(0,0,0,0.1)]",
          "sm:static sm:z-auto sm:p-0 sm:bg-transparent sm:backdrop-blur-none sm:border-none sm:shadow-none sm:ml-auto"
        )}>
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 sm:gap-2 [&_button]:w-full sm:[&_button]:w-auto [&_a]:w-full sm:[&_a]:w-auto">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}
