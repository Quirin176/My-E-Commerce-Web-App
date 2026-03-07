'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useCartStore } from '@/lib/store';

export default function Header() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { getTotalItems } = useCartStore();

  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Ecommerce
        </Link>

        <div className="flex gap-6">
          <Link href="/products" className="hover:text-blue-600">
            Products
          </Link>
          {isAdmin && (
            <Link href="/admin/dashboard" className="hover:text-blue-600">
              Admin
            </Link>
          )}
        </div>

        <div className="flex gap-4 items-center">
          <Link href="/cart" className="relative">
            🛒
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
      </nav>
    </header>
  );
}
