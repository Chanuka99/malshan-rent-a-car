'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Car, Menu, X, User, LogOut, Settings, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { logoutAction } from '@/app/actions/auth'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import type { Profile } from '@/types/supabase'

interface NavbarProps {
  user: SupabaseUser | null
  profile: Pick<Profile, 'full_name' | 'role'> | null
}

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/cars', label: 'Our Fleet' },
]

export function Navbar({ user, profile }: NavbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const initials = profile?.full_name
    ? profile.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U'

  async function handleLogout() {
    await logoutAction()
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/logo.webp"
              alt="Malshan Rent A Car Logo"
              width={240}
              height={80}
              className="h-12 md:h-16 w-auto object-contain transition-all"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-brand ${
                  pathname === link.href
                    ? 'text-brand'
                    : 'text-gray-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {user && profile ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button className="flex items-center gap-2 hover:opacity-80 transition-opacity outline-none">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-brand text-white text-xs font-bold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-gray-700">
                        {profile.full_name.split(' ')[0]}
                      </span>
                    </button>
                  }
                />
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    render={
                      <Link href="/dashboard" className="flex items-center gap-2">
                        <LayoutDashboard size={16} />
                        My Bookings
                      </Link>
                    }
                  />
                  <DropdownMenuItem
                    render={
                      <Link href="/dashboard/settings" className="flex items-center gap-2">
                        <User size={16} />
                        Account Settings
                      </Link>
                    }
                  />
                  {profile.role === 'admin' && (
                    <DropdownMenuItem
                      render={
                        <Link href="/admin" className="flex items-center gap-2">
                          <Settings size={16} />
                          Admin Panel
                        </Link>
                      }
                    />
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-600 flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  render={
                    <Link href="/auth/login">Sign In</Link>
                  }
                />
                <Button
                  size="sm"
                  className="bg-brand hover:bg-brand-dark text-white"
                  render={
                    <Link href="/auth/register">Get Started</Link>
                  }
                />
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-brand hover:bg-gray-50 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  pathname === link.href
                    ? 'text-brand bg-brand-light'
                    : 'text-gray-600 hover:text-brand hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-gray-100 mt-2">
              {user && profile ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-brand hover:bg-gray-50 rounded-md"
                  >
                    <LayoutDashboard size={16} />
                    My Bookings
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-brand hover:bg-gray-50 rounded-md"
                  >
                    <User size={16} />
                    Account Settings
                  </Link>
                  {profile.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-brand hover:bg-gray-50 rounded-md"
                    >
                      <Settings size={16} />
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md w-full"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 px-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    render={
                      <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                        Sign In
                      </Link>
                    }
                  />
                  <Button
                    size="sm"
                    className="bg-brand hover:bg-brand-dark text-white"
                    render={
                      <Link href="/auth/register" onClick={() => setMobileOpen(false)}>
                        Get Started
                      </Link>
                    }
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
