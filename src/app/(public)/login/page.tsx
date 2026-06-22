import { Metadata } from 'next'
import { LoginForm } from '@/features/auth/ui/LoginForm'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Log Masuk - HMI Cabang Semarang',
  description: 'Masuk ke sistem manajemen konten Himpunan Mahasiswa Islam Cabang Semarang.',
}

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <div className="flex items-center gap-2 font-medium">
            <div className="relative h-8 w-8 flex-shrink-0">
              <Image
                src="https://res.cloudinary.com/dbndgotx4/image/upload/v1782097476/Logo_Dark_Theme_q1sfhq.png"
                alt="Logo"
                fill
                className="object-contain dark:hidden"
                priority
              />
              <Image
                src="https://res.cloudinary.com/dbndgotx4/image/upload/v1782097475/Logo_White_Theme_dieii8.png"
                alt="Logo"
                fill
                className="object-contain hidden dark:block"
                priority
              />
            </div>
            <span className="text-xl font-bold tracking-tight">HMI Semarang</span>
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
          priority
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.4]"
        />
      </div>
    </div>
  )
}
