'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/Card'
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/ui/Chart'

interface LeaderboardWidgetProps {
  data: Array<{
    commissariatId: string
    name: string
    publishedCount: number
  }>
}

export function LeaderboardWidget({ data }: LeaderboardWidgetProps) {
  const chartConfig = {
    publishedCount: {
      label: "Publikasi Artikel",
      color: "hsl(var(--primary))",
    },
  }

  const chartData = data.map(d => ({
    name: d.name.replace('Komisariat ', '').substring(0, 15) + (d.name.length > 15 ? '...' : ''),
    fullName: d.name,
    publishedCount: d.publishedCount
  }))

  return (
    <Card className="col-span-1 lg:col-span-4 border shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Top 5 Komisariat Teraktif
        </CardTitle>
        <CardDescription>
          Peringkat berdasarkan jumlah artikel yang berhasil dipublikasikan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
            Belum ada data publikasi.
          </div>
        ) : (
          <div className="h-[300px] w-full">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart
                accessibilityLayer
                data={chartData}
                margin={{
                  top: 20,
                  right: 10,
                  left: -20,
                  bottom: 0,
                }}
              >
                <CartesianGrid vertical={false} opacity={0.3} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  fontSize={12}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  fontSize={12}
                />
                <ChartTooltip
                  cursor={{ fill: 'hsl(var(--muted))' }}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <Bar
                  dataKey="publishedCount"
                  fill="var(--color-publishedCount)"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
