'use client';

import Link from 'next/link';
import { useTheme } from "next-themes";
import { ShoppingBag } from 'lucide-react';
import { useAuth } from '@/src/hooks/useAuth';
import { useCartStore } from '@/src/lib/store';
import { siteConfig } from '@/src/lib/siteConfig';

export default function Header() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { getTotalItems } = useCartStore();
  const { theme, setTheme } = useTheme();

  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">

        {/* LOGO - Home Page Link */}
        <Link href="/"
          className="text-2xl font-bold"
          style={{ color: siteConfig.colors.primarycolor }}>
          Ecommerce
        </Link>

        <div className="flex gap-6">
          <Link href="/products" className="text-lg font-medium" style={{ color: siteConfig.colors.primarycolor }}>
            Products
          </Link>
          {isAdmin && (
            <Link href="/admin/dashboard" className="text-lg font-medium" style={{ color: siteConfig.colors.primarycolor }}>
              Admin
            </Link>
          )}
        </div>

        <div className="flex gap-4 items-center">
          <Link href="/cart" className="relative">
            <ShoppingBag className="text-black dark:text-white" size={24} />
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {getTotalItems()}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <>
              <span className="text-sm">{user?.username}</span>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Signup
              </Link>
            </>
          )}
        </div>

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
      </nav>
    </header>
  );
}
