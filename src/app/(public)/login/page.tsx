import { Metadata } from 'next'
import { LoginForm } from '@/features/auth/ui/LoginForm'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Log Masuk - HMI Cabang Semarang',
  description: 'Masuk ke sistem manajemen konten Himpunan Mahasiswa Islam Cabang Semarang.',
}

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center p-4">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://res.cloudinary.com/dbndgotx4/image/upload/q_auto/f_auto/v1782096956/Semarang_4K_lefmvp.png"
          alt="Semarang Background"
          fill
          className="object-cover object-center brightness-[0.3]"
          priority
        />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-8 rounded-2xl border border-white/10 bg-background/60 backdrop-blur-xl p-8 shadow-2xl dark:bg-card/40">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="relative h-24 w-24 mb-4">
            <Image
              src="https://res.cloudinary.com/dbndgotx4/image/upload/v1782097476/Logo_Dark_Theme_q1sfhq.png"
              alt="HMI Semarang Logo"
              fill
              className="object-contain dark:hidden"
              priority
            />
            <Image
              src="https://res.cloudinary.com/dbndgotx4/image/upload/v1782097475/Logo_White_Theme_dieii8.png"
              alt="HMI Semarang Logo"
              fill
              className="object-contain hidden dark:block"
              priority
            />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Selamat Datang Kembali</h1>
          <p className="text-sm text-muted-foreground">
            Masukkan kredensial Anda untuk mengakses dasbor.
          </p>
        </div>

        <LoginForm />

        <div className="text-center text-xs text-muted-foreground mt-8">
          &copy; {new Date().getFullYear()} HMI Cabang Semarang. Hak Cipta Dilindungi.
        </div>
      </div>
    </div>
  )
}
