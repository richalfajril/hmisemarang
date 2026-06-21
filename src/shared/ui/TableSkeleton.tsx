import { Skeleton } from '@/shared/ui/Skeleton'
import { Card, CardContent, CardHeader } from '@/shared/ui/Card'

export function TableSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-[250px]" />
          <Skeleton className="h-4 w-[350px]" />
        </div>
        <Skeleton className="h-10 w-[120px]" />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <Skeleton className="h-9 w-[200px]" />
          <Skeleton className="h-9 w-[100px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between space-x-4 border-b pb-4">
              <Skeleton className="h-6 w-[20%]" />
              <Skeleton className="h-6 w-[20%]" />
              <Skeleton className="h-6 w-[20%]" />
              <Skeleton className="h-6 w-[20%]" />
              <Skeleton className="h-6 w-[10%]" />
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between space-x-4 py-2">
                <Skeleton className="h-10 w-[20%]" />
                <Skeleton className="h-4 w-[20%]" />
                <Skeleton className="h-4 w-[20%]" />
                <Skeleton className="h-6 w-[20%] rounded-full" />
                <Skeleton className="h-8 w-[8%]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
