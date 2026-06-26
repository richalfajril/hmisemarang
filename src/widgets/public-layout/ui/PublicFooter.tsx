import { Mail, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaInstagram } from "react-icons/fa6";
import {
  DEFAULT_LOGO_URL,
  DEFAULT_SITE_NAME,
  PUBLIC_NAV_LINKS,
} from "../config/site";

type Props = {
  siteName?: string | null;
  logoUrl?: string | null;
  contactEmail?: string | null;
  address?: string | null;
  instagramUrl?: string | null;
  footerText?: string | null;
};

export function PublicFooter({
  siteName,
  logoUrl,
  contactEmail,
  address,
  instagramUrl,
  footerText,
}: Props) {
  const name = siteName || DEFAULT_SITE_NAME;
  const logo = logoUrl || DEFAULT_LOGO_URL;
  const year = new Date().getFullYear();
  const quickLinks = PUBLIC_NAV_LINKS.filter((l) => l.href !== "/");

  return (
    <footer className="mt-auto bg-primary text-primary-foreground">
      <div className="container mx-auto grid grid-cols-1 gap-10 px-4 py-12 md:grid-cols-3">
        {/* Brand */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src={logo}
              alt={name}
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
            />
            <span className="text-base font-bold tracking-tight">{name}</span>
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-primary-foreground/80">
            Ruang kaderisasi, gagasan, dan pengabdian bagi mahasiswa Islam untuk
            berkontribusi nyata bagi agama dan negara.
          </p>
          {instagramUrl && (
            <div className="flex items-center gap-3">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-primary-foreground/20"
              >
                <FaInstagram className="h-4 w-4" />
              </a>
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-foreground/90">
            Tautan
          </h3>
          <ul className="grid grid-cols-3 gap-x-4 gap-y-2">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-foreground/90">
            Kontak
          </h3>
          <ul className="space-y-3 text-sm text-primary-foreground/80">
            {contactEmail && (
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                <a
                  href={`mailto:${contactEmail}`}
                  className="hover:text-primary-foreground"
                >
                  {contactEmail}
                </a>
              </li>
            )}
            {address && (
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{address}</span>
              </li>
            )}
            {!contactEmail && !address && (
              <li className="text-primary-foreground/60">
                Informasi kontak belum tersedia.
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/15">
        <div className="container mx-auto px-4 py-5">
          <p className="text-center text-xs text-primary-foreground/70">
            {footerText ||
              `© ${year} ${name}. Dibuat oleh Bidang Komunikasi & Digital 2026-2027`}
          </p>
        </div>
      </div>
    </footer>
  );
}
