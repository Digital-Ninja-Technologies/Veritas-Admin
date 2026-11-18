/**
 * Split out from `session.ts` so client components (e.g. the site header,
 * which displays the admin's name/email) can import this constant without
 * pulling in `next/headers`.
 */
export const MOCK_ADMIN = {
  email: "admin@useveritasapp.com",
  password: "veritas-admin-2026",
  full_name: "Veritas Admin",
};
