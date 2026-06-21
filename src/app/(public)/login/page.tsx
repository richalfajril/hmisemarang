import { Metadata } from 'next'
import { LoginForm } from '@/features/auth/ui/LoginForm'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Log Masuk - HMI Cabang Semarang',
  description: 'Masuk ke sistem manajemen konten Himpunan Mahasiswa Islam Cabang Semarang.',
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 bg-muted/20">
      <div className="w-full max-w-md space-y-8 rounded-2xl border bg-card p-8 shadow-sm">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-2">
            <span className="text-xl font-bold tracking-tighter">HMI</span>
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
