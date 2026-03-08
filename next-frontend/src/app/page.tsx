"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { siteConfig } from "@/src/lib/siteConfig";

export default function Home() {
  const { theme } = useTheme();
  const colors = siteConfig.colors;

  return (
    <div
    className="flex flex-col min-h-screen items-center p-8 dark:bg-black"
    style={{ backgroundColor: theme === "dark" ? colors.backgroundcolorDark : colors.backgroundcolor }}
  >
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
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
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
            className="flex h-12 w-full items-center justify-center rounded-full border border-black/8 dark:border-white/[.145] px-5 transition-colors hover:bg-black/4 dark:hover:bg-[#1a1a1a]"
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
    </div>
  );
}
