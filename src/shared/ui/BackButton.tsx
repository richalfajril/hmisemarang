'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { cn } from '@/shared/lib/utils'

interface BackButtonProps {
  href: string
  label?: string
  variant?: 'outline' | 'ghost' | 'secondary' | 'default'
  className?: string
}

export function BackButton({ 
  href, 
  label, 
  variant = 'outline', 
  className 
}: BackButtonProps) {
  return (
    <Link href={href} className="inline-flex items-center">
      <Button 
        variant={variant} 
        size={label ? 'default' : 'icon'} 
        type="button"
        className={cn(
          'rounded-full shadow-xs shrink-0',
          !label && 'size-9',
          className
        )}
      >
        <ArrowLeft className="h-4 w-4" />
        {label && <span className="ml-2">{label}</span>}
      </Button>
    </Link>
  )
}
