"use client";

import Link from "next/link";
import { PROFILE_STORAGE_KEY, PROFILES } from "@/lib/profiles";

export default function ProfilePicker() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 py-12">
      <h1 className="mb-10 text-4xl font-bold tracking-tight text-notflix-red sm:mb-16 sm:text-6xl">
        Notflix
      </h1>

      <p className="mb-8 text-center text-lg text-gray-300 sm:mb-12 sm:text-2xl">
        Quem está assistindo?
      </p>

      <div className="grid w-full max-w-lg grid-cols-2 justify-items-center gap-6 sm:flex sm:max-w-none sm:justify-center sm:gap-8">
        {PROFILES.map((profile) => (
          <Link
            key={profile.id}
            href="/browse"
            className="group flex flex-col items-center gap-3 transition-transform hover:scale-105"
            onClick={() => {
              localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
            }}
          >
            <div
              className={`flex h-20 w-20 items-center justify-center rounded-md text-3xl sm:h-28 sm:w-28 sm:text-5xl ${profile.color} ring-2 ring-transparent transition group-hover:ring-white`}
            >
              {profile.emoji}
            </div>
            <span className="text-sm text-gray-400 transition group-hover:text-white sm:text-base">
              {profile.name}
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
