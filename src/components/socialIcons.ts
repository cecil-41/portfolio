import type { ComponentType } from 'react';
import { Mail } from 'lucide-react';
import { FaGithub, FaLinkedinIn, FaYoutube } from 'react-icons/fa6';

type IconType = ComponentType<{ size?: number; className?: string; 'aria-hidden'?: boolean }>;

/** Icons for the `id`s used in profile.json `socials`. */
export const SOCIAL_ICONS: Record<string, IconType> = {
  github: FaGithub,
  linkedin: FaLinkedinIn,
  youtube: FaYoutube,
  email: Mail,
};
