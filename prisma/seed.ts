import { PrismaClient, UserRole } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // 1. Create Root Commissariat (if needed for relations)
  // Although SYSTEM_ADMIN might not need a commissariat, we create a default "Cabang" one.
  const cabang = await prisma.commissariat.upsert({
    where: { slug: 'cabang-semarang' },
    update: {},
    create: {
      name: 'HMI Cabang Semarang',
      slug: 'cabang-semarang',
      about: 'Pusat Koordinasi Himpunan Mahasiswa Islam Cabang Semarang',
      is_active: true,
      cadre_count: 0,
    },
  })

  console.log('✅ Upserted Commissariat:', cabang.name)

  // 2. Create SYSTEM_ADMIN User
  // Note: password_hash is null for now. Auth is handled by Supabase.
  const admin = await prisma.user.upsert({
    where: { email: 'admin@hmisemarang.com' },
    update: {},
    create: {
      email: 'admin@hmisemarang.com',
      role: UserRole.SYSTEM_ADMIN,
      commissariat_id: cabang.id,
    },
  })

  console.log('✅ Upserted SYSTEM_ADMIN:', admin.email)
}

main()
  .then(async () => {
    console.log('🏁 Seeding completed successfully.')
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
