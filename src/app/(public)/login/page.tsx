import { Metadata } from 'next'
import { LoginForm } from '@/features/auth/ui/LoginForm'
import Image from 'next/image'
import { prisma } from '@/shared/api/prisma/client'

export const metadata: Metadata = {
  title: 'Log Masuk - HMI Cabang Semarang',
  description: 'Masuk ke sistem manajemen konten Himpunan Mahasiswa Islam Cabang Semarang.',
}

const DEFAULT_LIGHT_LOGO = 'https://res.cloudinary.com/dbndgotx4/image/upload/v1782097475/Logo_White_Theme_dieii8.png'

async function getDashboardLogo(): Promise<string | null> {
  try {
    const setting = await prisma.websiteSetting.findFirst({ select: { dashboard_logo_url: true } })
    return setting?.dashboard_logo_url ?? null
  } catch {
    return null // kolom belum ada / DB tak terjangkau → pakai default
  }
}

export default async function LoginPage() {
  const logoSrc = (await getDashboardLogo()) || DEFAULT_LIGHT_LOGO

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center md:justify-start">
          <div className="relative h-14 w-48 flex-shrink-0">
            <Image
              src={logoSrc}
              alt="Logo HMI Cabang Semarang"
              fill
              sizes="200px"
              className="object-contain object-left"
              priority
            />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>
        <div className="text-center md:text-left text-xs text-muted-foreground mt-auto">
          &copy; {new Date().getFullYear()} HMI Cabang Semarang. Hak Cipta Dilindungi.
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          src="https://res.cloudinary.com/dbndgotx4/image/upload/q_auto/f_auto/v1782096956/Semarang_4K_lefmvp.png"
          alt="Semarang Background"
          fill
          sizes="50vw"
          priority
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Dark overlay layer */}
        <div className="absolute inset-0 bg-black/50 z-10" />
        
        {/* Quote text */}
        <div className="absolute inset-0 z-20 flex flex-col items-end justify-end p-10 pb-12 text-right">
          <div className="max-w-md lg:max-w-xl">
            <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-white text-balance leading-snug drop-shadow-xl mb-4">
              &ldquo;Membangun Kader Umat<br />dan Bangsa dari Semarang&rdquo;
            </h2>
            <p className="text-base lg:text-lg text-white/80 font-normal text-balance leading-relaxed drop-shadow-md">
              HMI Cabang Semarang menjadi ruang kaderisasi, gagasan, dan pengabdian bagi mahasiswa Islam untuk berkontribusi nyata bagi agama dan negara.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
