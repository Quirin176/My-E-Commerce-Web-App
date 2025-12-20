"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { siteConfig } from "@/lib/config";

export default function Home() {
  const colors = siteConfig.colors;
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black font-sans">
      <main className="relative flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-zinc-950">

        {/* THEME SELECTOR */}
        <div className="absolute top-6 right-6">
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-800 dark:text-zinc-100 focus:outline-none"
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        {/* WARNING */}
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1
            className="max-w-xs text-3xl font-semibold leading-10 tracking-tight dark:text-zinc-50"
            style={{ color: colors.primarycolor }}
          >
            ⚠️ This is a demo store for testing purposes only.
            <br />
            No real orders will be processed. ⚠️
          </h1>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>

          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-black/8 dark:border-white/[.145] px-5 transition-colors hover:bg-black/4 dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
