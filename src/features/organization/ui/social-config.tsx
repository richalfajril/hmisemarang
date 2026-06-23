import { type IconType } from 'react-icons'
import {
  FaInstagram,
  FaXTwitter,
  FaLinkedin,
  FaFacebook,
  FaYoutube,
  FaTiktok,
  FaGlobe,
} from 'react-icons/fa6'

export type SocialPlatform =
  | 'instagram'
  | 'twitter'
  | 'linkedin'
  | 'facebook'
  | 'youtube'
  | 'tiktok'
  | 'website'

export type SocialLink = { platform: string; url: string }

export const SOCIAL_PLATFORMS: { value: SocialPlatform; label: string }[] = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'twitter', label: 'Twitter / X' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'website', label: 'Website' },
]

const ICONS: Record<string, IconType> = {
  instagram: FaInstagram,
  twitter: FaXTwitter,
  linkedin: FaLinkedin,
  facebook: FaFacebook,
  youtube: FaYoutube,
  tiktok: FaTiktok,
  website: FaGlobe,
}

export function getSocialIcon(platform: string): IconType {
  return ICONS[platform] ?? FaGlobe
}
