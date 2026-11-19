/**
 * Pre-made avatar catalog for the customer-care onboarding flow. Backed by
 * DiceBear's open "avataaars" set (human-style illustrated avatars) via a
 * stable seed per option, so there's no upload pipeline to build for this
 * mock phase — swapping to self-hosted assets later only means changing
 * `avatarUrl`.
 */
export const AVATAR_SEEDS = [
  "Amara",
  "Chidi",
  "Zainab",
  "Kwame",
  "Fatima",
  "Tunde",
  "Ngozi",
  "Emeka",
  "Aisha",
  "Obinna",
  "Yetunde",
  "Segun",
  "Halima",
  "Chinedu",
  "Folake",
  "Bashir",
  "Adaeze",
  "Ikenna",
  "Rahma",
  "Damilola",
  "Uche",
  "Khadija",
  "Femi",
  "Blessing",
] as const;

export function avatarUrl(seed: string): string {
  return `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(seed)}&radius=50`;
}
