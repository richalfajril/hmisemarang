'use client'

import { useState } from 'react'
import { useActionState } from 'react'
import { updateSettingsAction } from '../api/actions'
import { initialActionState } from '@/shared/lib/action-state'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Label } from '@/shared/ui/Label'
import { Textarea } from '@/shared/ui/Textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/Tabs'
import { ImageUploader } from '@/shared/ui/image-uploader/ImageUploader'
import { Loader2, Save, AlertCircle, CheckCircle2 } from 'lucide-react'
import { WebsiteSetting } from '@prisma/client'

export function SettingsForm({ initialData }: { initialData: WebsiteSetting | null }) {
  const [state, formAction, isPending] = useActionState(updateSettingsAction, initialActionState)
  const [heroImageUrl, setHeroImageUrl] = useState(initialData?.hero_image_url ?? '')
  const [darkLogoUrl, setDarkLogoUrl] = useState(initialData?.dark_logo_url ?? '')
  const [dashboardLogoUrl, setDashboardLogoUrl] = useState(initialData?.dashboard_logo_url ?? '')
  const [aboutImageUrl, setAboutImageUrl] = useState(initialData?.about_image_url ?? '')
  const [contactImageUrl, setContactImageUrl] = useState(initialData?.contact_image_url ?? '')
  const [faviconUrl, setFaviconUrl] = useState(initialData?.favicon_url ?? '')

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
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="general">Informasi Umum</TabsTrigger>
          <TabsTrigger value="contact">Kontak & Alamat</TabsTrigger>
          <TabsTrigger value="social">Sosial Media</TabsTrigger>
          <TabsTrigger value="visual">Tampilan</TabsTrigger>
        </TabsList>

        <TabsContent value="general" forceMount className="space-y-4 data-[state=inactive]:hidden">
          <div className="space-y-2">
            <Label htmlFor="site_name">Nama Situs Web (Site Name)</Label>
            <Input
              id="site_name"
              name="site_name"
              defaultValue={initialData?.site_name || ''}
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

        <TabsContent value="contact" forceMount className="space-y-4 data-[state=inactive]:hidden">
          <input type="hidden" name="contact_image_url" value={contactImageUrl} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Label htmlFor="contact_phone">Nomor Telepon / WhatsApp</Label>
              <Input
                id="contact_phone"
                name="contact_phone"
                defaultValue={initialData?.contact_phone || ''}
                disabled={isPending}
                placeholder="0852 1007 6423"
                className={state?.fieldErrors?.contact_phone ? 'border-destructive' : ''}
              />
              {state?.fieldErrors?.contact_phone && (
                <p className="text-xs text-destructive">{state.fieldErrors.contact_phone[0]}</p>
              )}
            </div>
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

          <div className="space-y-2">
            <Label htmlFor="maps_embed_url">Tautan Embed Google Maps</Label>
            <Input
              id="maps_embed_url"
              name="maps_embed_url"
              type="url"
              defaultValue={initialData?.maps_embed_url || ''}
              disabled={isPending}
              placeholder="https://www.google.com/maps/embed?pb=..."
              className={state?.fieldErrors?.maps_embed_url ? 'border-destructive' : ''}
            />
            {state?.fieldErrors?.maps_embed_url && (
              <p className="text-xs text-destructive">{state.fieldErrors.maps_embed_url[0]}</p>
            )}
            <p className="text-[0.8rem] text-muted-foreground">
              Google Maps → Bagikan → <strong>Sematkan peta</strong> → salin URL di dalam <code>src=&quot;...&quot;</code>. Kosongkan untuk pakai peta otomatis dari alamat.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <Label>Foto Sekretariat</Label>
              <p className="text-[0.8rem] text-muted-foreground mt-1">
                Tampil di kartu kanan halaman Kontak. Jika kosong, ditampilkan placeholder hijau. Rasio rekomendasi: 4:3.
              </p>
            </div>
            <ImageUploader
              value={contactImageUrl || null}
              onChange={(url) => setContactImageUrl(url)}
              folder="contact-images"
              maxDimension={1280}
              disabled={isPending}
            />
            {state?.fieldErrors?.contact_image_url && (
              <p className="text-xs text-destructive">{state.fieldErrors.contact_image_url[0]}</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="social" forceMount className="space-y-4 data-[state=inactive]:hidden">
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

        <TabsContent value="visual" forceMount className="space-y-8 data-[state=inactive]:hidden">
          <input type="hidden" name="hero_image_url" value={heroImageUrl} />
          <input type="hidden" name="dark_logo_url" value={darkLogoUrl} />
          <input type="hidden" name="dashboard_logo_url" value={dashboardLogoUrl} />
          <input type="hidden" name="about_image_url" value={aboutImageUrl} />
          <input type="hidden" name="favicon_url" value={faviconUrl} />

          <div className="space-y-3">
            <div>
              <Label>Favicon (ikon tab & hasil Google)</Label>
              <p className="text-[0.8rem] text-muted-foreground mt-1">
                Ikon kecil di tab browser & samping nama situs di Google. Rekomendasi: gambar persegi (mis. 512×512px), format PNG/SVG. Kosong = pakai logo bawaan.
              </p>
            </div>
            <ImageUploader
              value={faviconUrl || null}
              onChange={(url) => setFaviconUrl(url)}
              folder="favicon"
              maxDimension={512}
              disabled={isPending}
              shape="circle"
              allowSvg
              noConvert
              className="max-w-[160px]"
            />
            {state?.fieldErrors?.favicon_url && (
              <p className="text-xs text-destructive">{state.fieldErrors.favicon_url[0]}</p>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <Label>Latar Hero (Gambar / Video)</Label>
              <p className="text-[0.8rem] text-muted-foreground mt-1">
                Gambar atau video MP4 yang tampil sebagai latar belakang halaman utama (hero section). Ukuran rekomendasi: 1920×1080px atau lebih besar. Video MP4 tidak dikompres — gunakan file yang sudah ringan.
              </p>
            </div>
            <ImageUploader
              value={heroImageUrl || null}
              onChange={(url) => setHeroImageUrl(url)}
              folder="hero-images"
              disabled={isPending}
              allowVideo
            />
            {state?.fieldErrors?.hero_image_url && (
              <p className="text-xs text-destructive">{state.fieldErrors.hero_image_url[0]}</p>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <Label>Logo Gelap (untuk Navbar Solid)</Label>
              <p className="text-[0.8rem] text-muted-foreground mt-1">
                Logo versi gelap yang digunakan di navbar saat pengguna men-scroll. Jika kosong, logo putih akan ditampilkan dalam kotak hijau.
              </p>
            </div>
            <ImageUploader
              value={darkLogoUrl || null}
              onChange={(url) => setDarkLogoUrl(url)}
              folder="logos"
              maxDimension={512}
              disabled={isPending}
              allowSvg
            />
            {state?.fieldErrors?.dark_logo_url && (
              <p className="text-xs text-destructive">{state.fieldErrors.dark_logo_url[0]}</p>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <Label>Logo Dashboard (Login &amp; Sidebar CMS)</Label>
              <p className="text-[0.8rem] text-muted-foreground mt-1">
                Logo yang tampil di halaman login dan sidebar dashboard CMS. Sebaiknya versi berwarna/gelap agar terbaca di latar terang. Jika kosong, memakai logo bawaan.
              </p>
            </div>
            <ImageUploader
              value={dashboardLogoUrl || null}
              onChange={(url) => setDashboardLogoUrl(url)}
              folder="logos"
              maxDimension={512}
              disabled={isPending}
              allowSvg
            />
            {state?.fieldErrors?.dashboard_logo_url && (
              <p className="text-xs text-destructive">{state.fieldErrors.dashboard_logo_url[0]}</p>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <Label>Gambar Tentang Kami</Label>
              <p className="text-[0.8rem] text-muted-foreground mt-1">
                Gambar yang tampil di section &quot;Tentang HMI Cabang Semarang&quot; pada halaman utama. Jika kosong, placeholder abu-abu akan ditampilkan. Rasio rekomendasi: 4:3.
              </p>
            </div>
            <ImageUploader
              value={aboutImageUrl || null}
              onChange={(url) => setAboutImageUrl(url)}
              folder="about-images"
              maxDimension={1280}
              disabled={isPending}
            />
            {state?.fieldErrors?.about_image_url && (
              <p className="text-xs text-destructive">{state.fieldErrors.about_image_url[0]}</p>
            )}
          </div>
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
