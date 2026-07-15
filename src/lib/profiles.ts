export type ProfileId = "voce" | "kids" | "convidado" | "pet";

export interface Profile {
  id: ProfileId;
  name: string;
  emoji: string;
  color: string;
}

export const PROFILE_STORAGE_KEY = "notflix-profile";

export const PROFILES: Profile[] = [
  { id: "voce", name: "Você", emoji: "😎", color: "bg-blue-600" },
  { id: "kids", name: "Crianças", emoji: "🧒", color: "bg-yellow-500" },
  { id: "convidado", name: "Convidado", emoji: "👤", color: "bg-green-600" },
  { id: "pet", name: "Pet", emoji: "🐶", color: "bg-purple-600" },
];

export function getProfileById(id: string | null | undefined): Profile | null {
  if (!id) return null;
  return PROFILES.find((profile) => profile.id === id) ?? null;
}

export function parseStoredProfile(raw: string | null): Profile | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { id?: string };
    return getProfileById(parsed.id);
  } catch {
    return null;
  }
}

export function isKidsProfile(profile: Profile | null | undefined): boolean {
  return profile?.id === "kids";
}
