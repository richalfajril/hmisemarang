import Link from 'next/link'
import { ArrowRight, Target, Compass, Sparkles, BookOpen, HeartHandshake, UserCheck, Lightbulb, Rocket, Globe, GraduationCap, MoreHorizontal } from 'lucide-react'
import { PageHero } from '@/shared/ui/PageHero'
import { FadeIn } from '@/shared/ui/FadeIn'
import { SectionHeaderCenter } from '@/shared/ui/SectionHeader'

export const metadata = {
  title: 'Profil',
  description:
    'Profil HMI Cabang Semarang (HMI Semarang) — sejarah, visi, misi, dan nilai dasar perjuangan Himpunan Mahasiswa Islam Cabang Semarang.',
}

const VALUES = [
  { word: 'Yakin', desc: 'Keyakinan pada kebenaran sebagai landasan gerak dan perjuangan.', icon: Sparkles },
  { word: 'Usaha', desc: 'Kerja keras dan ikhtiar sungguh-sungguh dalam setiap amanah.', icon: Target },
  { word: 'Sampai', desc: 'Konsistensi menuntaskan cita-cita hingga tujuan tercapai.', icon: Compass },
]

const MISI = [
  { icon: Sparkles, text: 'Membina pribadi muslim untuk mencapai akhlaqul karimah.' },
  { icon: UserCheck, text: 'Membina pribadi muslim yang mandiri.' },
  { icon: Lightbulb, text: 'Mengembangkan potensi kreatif, keilmuan, sosial dan budaya.' },
  { icon: Rocket, text: 'Mempelopori pengembangan ilmu pengetahuan dan teknologi bagi kemaslahatan masa depan umat manusia.' },
  { icon: BookOpen, text: 'Memajukan kehidupan umat dalam mengamalkan Dienul Islam dalam kehidupan pribadi, bermasyarakat, berbangsa dan bernegara.' },
  { icon: Globe, text: 'Memperkuat Ukhuwah Islamiyah sesama umat Islam sedunia.' },
  { icon: GraduationCap, text: 'Berperan aktif dalam dunia kemahasiswaan, perguruan tinggi dan kepemudaan untuk menopang pembangunan nasional.' },
  { icon: HeartHandshake, text: 'Ikut terlibat aktif dalam penyelesaian persoalan sosial kemasyarakatan dan kebangsaan.' },
  { icon: MoreHorizontal, text: 'Usaha-usaha lain yang tidak bertentangan dengan huruf (a) s.d. (e) dan sesuai dengan azas, fungsi, dan peran organisasi serta berguna untuk mencapai tujuan organisasi.' },
]

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      <PageHero
        breadcrumb={[{ label: 'Beranda', href: '/' }, { label: 'Profil' }]}
        eyebrow="Profil"
        heading="Tentang HMI Cabang Semarang"
        subheading="Kepengurusan cabang Himpunan Mahasiswa Islam yang menaungi komisariat di berbagai perguruan tinggi Kota Semarang."
      />

      {/* Sejarah / Intro */}
      <section className="mx-auto max-w-3xl px-5 py-14">
        <FadeIn>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Sekilas HMI Cabang Semarang</h2>
          <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              Himpunan Mahasiswa Islam (HMI) Cabang Semarang merupakan bagian dari HMI — organisasi
              mahasiswa Islam tertua di Indonesia yang berdiri sejak 5 Februari 1947. Cabang Semarang
              menaungi komisariat-komisariat HMI yang tersebar di berbagai perguruan tinggi di Kota
              Semarang dan sekitarnya.
            </p>
            <p>
              Berkomitmen membina kader yang berlandaskan keislaman, keindonesiaan, dan
              intelektualitas, HMI Cabang Semarang menjadi ruang kaderisasi, gagasan, dan pengabdian
              bagi mahasiswa Islam untuk berkontribusi nyata demi terwujudnya masyarakat adil dan
              makmur yang diridai Allah SWT.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* Visi & Misi */}
      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-5xl px-5">
          <FadeIn>
            <SectionHeaderCenter eyebrow="Arah Gerak" heading="Visi & Misi" />
          </FadeIn>

          <FadeIn delay={150} className="mt-10 rounded-3xl border bg-card p-8 text-center shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Visi</p>
            <p className="mt-3 text-lg font-semibold leading-relaxed text-foreground sm:text-xl">
              &ldquo;Terbinanya insan akademis, pencipta, pengabdi yang bernafaskan Islam dan
              bertanggung jawab atas terwujudnya masyarakat adil makmur yang diridhoi Allah
              Subhanahu wata&rsquo;ala.&rdquo;
            </p>
          </FadeIn>

          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {MISI.map((m, i) => (
              <FadeIn key={m.text} delay={300 + i * 120} className="rounded-3xl border bg-card p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-primary">
                  <m.icon className="h-5 w-5" />
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{m.text}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Nilai Dasar — Yakin Usaha Sampai */}
      <section className="mx-auto max-w-5xl px-5 py-16">
        <FadeIn>
          <SectionHeaderCenter
            eyebrow="Nilai Dasar"
            heading="Yakin · Usaha · Sampai"
            subheading="Semboyan yang menjiwai setiap langkah kader HMI."
          />
        </FadeIn>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {VALUES.map((v, i) => (
            <FadeIn key={v.word} delay={150 + i * 120} className="rounded-3xl border bg-card p-8 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-primary">
                <v.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-foreground">{v.word}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-emerald-800 to-emerald-950 py-16">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <FadeIn>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Kenali Lebih Dekat</h2>
            <p className="mt-3 text-white/80">
              Telusuri susunan pengurus dan komisariat yang bernaung di HMI Cabang Semarang.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/struktur-organisasi"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-white/90"
              >
                Struktur Organisasi <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/komisariat"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Daftar Komisariat
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
