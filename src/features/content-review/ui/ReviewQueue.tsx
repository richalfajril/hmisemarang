'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/Tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { Badge } from '@/shared/ui/Badge'
import { Article, Agenda, Commissariat } from '@prisma/client'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import Link from 'next/link'
import { FileText, CalendarRange, UserCheck, ArrowRight } from 'lucide-react'

type PendingArticle = Article & { commissariat: Commissariat }
type PendingAgenda = Agenda & { commissariat: Commissariat | null }
type PendingVerification = { id: string; created_at: Date; commissariat?: { name: string } | null }

interface ReviewQueueProps {
  articles: Array<PendingArticle>
  agendas: Array<PendingAgenda>
  verifications: Array<PendingVerification>
}

export function ReviewQueue({ articles, agendas, verifications = [] }: ReviewQueueProps) {
  return (
    <Tabs defaultValue="articles" className="w-full">
      <TabsList className="grid w-full grid-cols-3 max-w-xl">
        <TabsTrigger value="articles" className="flex gap-2">
          <FileText className="h-4 w-4" />
          Artikel ({articles.length})
        </TabsTrigger>
        <TabsTrigger value="agendas" className="flex gap-2">
          <CalendarRange className="h-4 w-4" />
          Agenda ({agendas.length})
        </TabsTrigger>
        <TabsTrigger value="kader" className="flex gap-2">
          <UserCheck className="h-4 w-4" />
          Kader ({verifications.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="articles" className="mt-6 space-y-4">
        {articles.length === 0 ? (
          <div className="text-center py-12 bg-muted/20 border rounded-lg border-dashed">
            <p className="text-muted-foreground">Tidak ada artikel yang menunggu persetujuan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.map((article) => (
              <Card key={article.id} className="flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary">SUBMITTED</Badge>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(article.submitted_at || article.updated_at), 'dd MMM, HH:mm', { locale: id })}
                    </span>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
                  <CardDescription>{article.commissariat.name}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto pt-4 flex justify-end">
                  <Link href={`/dashboard/review-center/ARTICLE/${article.id}`} prefetch>
                    <Button size="sm">
                      Tinjau
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="agendas" className="mt-6 space-y-4">
        {agendas.length === 0 ? (
          <div className="text-center py-12 bg-muted/20 border rounded-lg border-dashed">
            <p className="text-muted-foreground">Tidak ada agenda yang menunggu persetujuan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agendas.map((agenda) => (
              <Card key={agenda.id} className="flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary">SUBMITTED</Badge>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(agenda.submitted_at || agenda.updated_at), 'dd MMM, HH:mm', { locale: id })}
                    </span>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{agenda.title}</CardTitle>
                  <CardDescription>{agenda.commissariat?.name || 'Cabang'}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto pt-4 flex justify-end">
                  <Link href={`/dashboard/review-center/AGENDA/${agenda.id}`} prefetch>
                    <Button size="sm">
                      Tinjau
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="kader" className="mt-6 space-y-4">
        {verifications.length === 0 ? (
          <div className="text-center py-12 bg-muted/20 border rounded-lg border-dashed">
            <p className="text-muted-foreground">Tidak ada berkas kader yang menunggu persetujuan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {verifications.map((v) => (
              <Card key={v.id} className="flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary">PENDING</Badge>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(v.created_at), 'dd MMM, HH:mm', { locale: id })}
                    </span>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">Pangkalan Data Kader</CardTitle>
                  <CardDescription>{v.commissariat?.name || 'Komisariat'}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto pt-4 flex justify-end">
                  <Link href={`/dashboard/review-center/CADRE_VERIFICATION/${v.id}`} prefetch>
                    <Button size="sm">
                      Tinjau
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}
