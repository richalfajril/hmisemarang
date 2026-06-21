'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUnreadNotificationsAction, markAsReadAction, markAllAsReadAction } from '../api/actions'
import { Bell, CheckCheck } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/ui/popover'
import { ScrollArea } from '@/shared/ui/scroll-area'
import { formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const router = useRouter()

  const { data, isLoading } = useQuery({
    queryKey: ['unread-notifications'],
    queryFn: async () => {
      const res = await getUnreadNotificationsAction()
      return res.success ? res.data : []
    },
    // Refetch periodically to simulate real-time
    refetchInterval: 30000, 
  })

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => markAsReadAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unread-notifications'] })
    }
  })

  const markAllAsReadMutation = useMutation({
    mutationFn: () => markAllAsReadAction(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unread-notifications'] })
    }
  })

  const notifications = data || []
  const unreadCount = notifications.length

  const handleNotificationClick = (id: string, link_url: string | null) => {
    markAsReadMutation.mutate(id)
    setOpen(false)
    if (link_url) {
      router.push(link_url)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-destructive border-2 border-background" />
          )}
          <span className="sr-only">Toggle notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="text-sm font-semibold">Notifikasi</h4>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-auto p-0 text-xs text-muted-foreground hover:text-primary"
              onClick={() => markAllAsReadMutation.mutate()}
              disabled={markAllAsReadMutation.isPending}
            >
              <CheckCheck className="h-3 w-3 mr-1" /> Tandai terbaca
            </Button>
          )}
        </div>
        
        <ScrollArea className="h-80">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">Memuat...</div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center">
              <Bell className="h-8 w-8 mb-2 opacity-20" />
              <p className="text-sm text-muted-foreground">Tidak ada notifikasi baru.</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notif) => (
                <button
                  key={notif.id}
                  className="flex flex-col items-start p-4 text-left border-b hover:bg-muted/50 transition-colors"
                  onClick={() => handleNotificationClick(notif.id, notif.link_url)}
                >
                  <div className="flex items-center gap-2 mb-1 w-full">
                    <span className="font-semibold text-sm line-clamp-1">{notif.title}</span>
                    <span className="w-2 h-2 rounded-full bg-blue-500 ml-auto shrink-0" />
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{notif.message}</p>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: id })}
                  </span>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
        
        <div className="p-2 border-t">
          <Button variant="ghost" size="sm" className="w-full text-xs">
            <Link href="/dashboard/notifications" onClick={() => setOpen(false)} className="flex h-full w-full items-center justify-center">
              Lihat Semua Notifikasi
            </Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
