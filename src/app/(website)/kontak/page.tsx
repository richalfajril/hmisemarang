import Link from "next/link";
import { MapPin, Mail, Phone, Building2 } from "lucide-react";
import { FaInstagram } from "react-icons/fa6";
import { getWebsiteSettings } from "@/features/website-settings/api/queries";
import { DEFAULT_SITE_NAME } from "@/widgets/public-layout/config/site";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/ui/Breadcrumb";
import { SectionHeaderLeft, SectionHeaderCenter } from "@/shared/ui/SectionHeader";
import { Separator } from "@/shared/ui/Separator";
import { FadeIn } from "@/shared/ui/FadeIn";

export const metadata = { title: "Kontak", description: "Hubungi HMI Cabang Semarang (HMI Semarang) — alamat sekretariat, email, dan media sosial." };
export const revalidate = 300;

// Fallback sementara — diisi via CMS bagian kontak nanti.
const FALLBACK = {
  address:
    "Jl. Dewi Sartika Bar. No.78, Sukorejo, Kec. Gn. Pati, Kota Semarang, Jawa Tengah 50221",
  email: "hmisemarang47@gmail.com",
  phone: "-",
  instagram: "https://www.instagram.com/hmi.semarang/",
};

function InfoRow({
  icon: Icon,
  title,
  value,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="font-bold text-white">{title}</p>
        {href ? (
          <a
            href={href}
            className="break-words text-white/80 transition-colors hover:text-white"
          >
            {value}
          </a>
        ) : (
          <p className="break-words text-white/80">{value}</p>
        )}
      </div>
    </div>
  );
}

export default async function Page() {
  const settings = await getWebsiteSettings();
  const siteName = settings?.site_name || DEFAULT_SITE_NAME;
  const address = settings?.address || FALLBACK.address;
  const email = settings?.contact_email || FALLBACK.email;
  const instagram = settings?.instagram_url || FALLBACK.instagram;
  const phone = settings?.contact_phone || FALLBACK.phone;
  const contactImage = settings?.contact_image_url || null;

  const mapsSrc =
    settings?.maps_embed_url ||
    `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=15&output=embed`;

  return (
    <div>
      {/* Section 1 — Kontak (split card di bg putih) */}
      <section className="bg-white pb-16 pt-24 sm:pt-28">
        <div className="mx-auto max-w-7xl px-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Beranda</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium text-primary">Kontak</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mt-8 grid items-stretch gap-8 lg:grid-cols-2">
            {/* Card kiri — info kontak (emerald) */}
            <FadeIn className="relative h-full overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 to-emerald-950 p-8 shadow-xl sm:p-10">
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full text-white opacity-[0.05]"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern id="kontak-geo" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path d="M30 3 L57 30 L30 57 L3 30 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M30 15 L45 30 L30 45 L15 30 Z" fill="none" stroke="currentColor" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#kontak-geo)" />
              </svg>

              <div className="relative z-10">
                <SectionHeaderLeft inverted eyebrow="Kontak Kami" heading={siteName} />

                <Separator className="my-8 bg-white/20" />

                <div className="space-y-6">
                  <InfoRow icon={MapPin} title="Sekretariat" value={address} />
                  <InfoRow
                    icon={Mail}
                    title="Email Support"
                    value={email}
                    href={`mailto:${email}`}
                  />
                  <InfoRow
                    icon={Phone}
                    title="Telepon"
                    value={phone}
                    href={phone !== "-" ? `tel:${phone}` : undefined}
                  />
                </div>

                <Separator className="my-8 bg-white/20" />

                <p className="text-lg text-white/90">Follow our social media</p>
                <div className="mt-4 flex items-center gap-3">
                  <a
                    href={instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition-colors hover:bg-white hover:text-emerald-700"
                  >
                    <FaInstagram className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </FadeIn>

            {/* Card kanan — foto sekretariat (fallback emerald) */}
            <FadeIn
              delay={150}
              className="relative flex h-full min-h-[22rem] items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-800 shadow-xl"
            >
              {contactImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={contactImage}
                  alt="Foto Sekretariat"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-white/50">
                  <Building2 className="h-14 w-14" />
                  <span className="text-sm font-medium">Foto Sekretariat</span>
                </div>
              )}
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Section 2 — Google Maps */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4">
          <FadeIn>
            <SectionHeaderCenter
              eyebrow="Lokasi"
              heading="Temukan Kami di Google Maps"
              subheading="Kunjungi sekretariat HMI Cabang Semarang."
            />
          </FadeIn>
          <FadeIn delay={150} className="mt-12 h-[400px] overflow-hidden rounded-3xl border shadow-sm sm:h-[460px]">
            <iframe
              title={`Lokasi ${siteName}`}
              src={mapsSrc}
              className="h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
