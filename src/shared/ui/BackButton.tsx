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
  variant = 'outline', 
  className 
}: BackButtonProps) {
  return (
    <Link href={href} prefetch className="inline-flex items-center">
      <Button 
        variant={variant} 
        size="icon"
        type="button"
        className={cn(
          'shadow-xs shrink-0',
          className
        )}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
    </Link>
  )
}
