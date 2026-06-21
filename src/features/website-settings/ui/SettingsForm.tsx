'use client'

import { useActionState } from 'react'
import { updateSettingsAction } from '../api/update-settings'
import { initialActionState } from '@/shared/lib/action-state'
import { Button } from '@/shared/ui/ui/Button'
import { Input } from '@/shared/ui/ui/Input'
import { Label } from '@/shared/ui/ui/Label'
import { Textarea } from '@/shared/ui/ui/Textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/ui/Tabs'
import { Loader2, Save, AlertCircle, CheckCircle2 } from 'lucide-react'
import { WebsiteSetting } from '@prisma/client'

export function SettingsForm({ initialData }: { initialData: WebsiteSetting | null }) {
  const [state, formAction, isPending] = useActionState(updateSettingsAction, initialActionState)

  return (
    <form action={formAction} className="space-y-6">
      {state?.success && state.message && (
        <div className="flex items-center gap-2 rounded-md bg-green-50/50 p-4 border border-green-200 text-sm text-green-800 dark:bg-green-950/20 dark:border-green-900/50 dark:text-green-400 animate-in fade-in zoom-in-95">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <p>{state.message}</p>
        </div>
      )}

      {!state?.success && state?.message && (
        <div className="flex items-center gap-2 rounded-md bg-destructive/15 p-4 text-sm text-destructive animate-in slide-in-from-top-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p>{state.message}</p>
        </div>
      )}

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="general">Informasi Umum</TabsTrigger>
          <TabsTrigger value="contact">Kontak & Alamat</TabsTrigger>
          <TabsTrigger value="social">Sosial Media</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site_name">Nama Situs Web (Site Name)</Label>
            <Input
              id="site_name"
              name="site_name"
              defaultValue={initialData?.site_name || ''}
              required
              disabled={isPending}
              placeholder="HMI Cabang Semarang"
              className={state?.fieldErrors?.site_name ? 'border-destructive' : ''}
            />
            {state?.fieldErrors?.site_name && (
              <p className="text-xs text-destructive">{state.fieldErrors.site_name[0]}</p>
            )}
            <p className="text-[0.8rem] text-muted-foreground">Tampil di tab peramban dan sebagai teks substitusi apabila logo belum diunggah.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seo_description">Deskripsi Penelusuran (Meta Description SEO)</Label>
            <Textarea
              id="seo_description"
              name="seo_description"
              defaultValue={initialData?.seo_description || ''}
              disabled={isPending}
              placeholder="Himpunan Mahasiswa Islam Cabang Semarang adalah organisasi mahasiswa tertua..."
              rows={4}
              className={state?.fieldErrors?.seo_description ? 'border-destructive' : ''}
            />
            {state?.fieldErrors?.seo_description && (
              <p className="text-xs text-destructive">{state.fieldErrors.seo_description[0]}</p>
            )}
            <p className="text-[0.8rem] text-muted-foreground">Potongan teks yang muncul di hasil pencarian Google. Maksimal 255 karakter.</p>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contact_email">Alamat Email Resmi</Label>
              <Input
                id="contact_email"
                name="contact_email"
                type="email"
                defaultValue={initialData?.contact_email || ''}
                disabled={isPending}
                placeholder="sekretariat@hmisemarang.com"
                className={state?.fieldErrors?.contact_email ? 'border-destructive' : ''}
              />
              {state?.fieldErrors?.contact_email && (
                <p className="text-xs text-destructive">{state.fieldErrors.contact_email[0]}</p>
              )}
            </div>

          <div className="space-y-2">
            <Label htmlFor="address">Alamat Sekretariat Cabang</Label>
            <Textarea
              id="address"
              name="address"
              defaultValue={initialData?.address || ''}
              disabled={isPending}
              placeholder="Jl. Prof. Sudarto No. 123, Tembalang, Kota Semarang..."
              rows={3}
              className={state?.fieldErrors?.address ? 'border-destructive' : ''}
            />
            {state?.fieldErrors?.address && (
              <p className="text-xs text-destructive">{state.fieldErrors.address[0]}</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="instagram_url">Tautan Instagram</Label>
              <Input
                id="instagram_url"
                name="instagram_url"
                type="url"
                defaultValue={initialData?.instagram_url || ''}
                disabled={isPending}
                placeholder="https://instagram.com/hmicabangsemarang"
                className={state?.fieldErrors?.instagram_url ? 'border-destructive' : ''}
              />
              {state?.fieldErrors?.instagram_url && (
                <p className="text-xs text-destructive">{state.fieldErrors.instagram_url[0]}</p>
              )}
            </div>
          </div>
          <p className="text-[0.8rem] text-muted-foreground pt-2">Kosongkan tautan untuk menyembunyikan ikon sosial media bersangkutan di bagian footer situs publik.</p>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end pt-6 border-t mt-8">
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Simpan Pengaturan
        </Button>
      </div>
    </form>
  )
}
