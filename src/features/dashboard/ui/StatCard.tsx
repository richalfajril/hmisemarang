import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/Card'
import { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: ReactNode
  className?: string
  trend?: {
    value: number
    label: string
    positive?: boolean
  }
}

export function StatCard({ title, value, description, icon, className, trend }: StatCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <p className={`text-xs mt-1 ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.positive ? '+' : '-'}{Math.abs(trend.value)}% {trend.label}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
