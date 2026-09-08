'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Menu, X } from 'lucide-react';

import { BrandLogo } from './ui/BrandLogo';

interface LandingNavbarProps {
  token?: string | null;
}

export function LandingNavbar({ token }: LandingNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-2xl transition-colors">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-xl p-1">
          <BrandLogo size="md" badgeText="UMKM AI" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#fitur" className="hover:text-amber-400 transition-colors focus:outline-none focus-visible:text-amber-400">
            Fitur Unggulan
          </a>
          <a href="#showcase" className="hover:text-amber-400 transition-colors focus:outline-none focus-visible:text-amber-400">
            Tampilan Sistem
          </a>
          <a href="#dampak" className="hover:text-amber-400 transition-colors focus:outline-none focus-visible:text-amber-400">
            Dampak Bisnis
          </a>
          <a href="#testimoni" className="hover:text-amber-400 transition-colors focus:outline-none focus-visible:text-amber-400">
            Kisah Sukses
          </a>
        </nav>

        {/* Desktop Action Buttons: Visually secondary/outline CTA */}
        <div className="hidden sm:flex items-center gap-3">
          {token ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/5 px-4 py-2 text-xs sm:text-sm font-semibold text-amber-300 hover:bg-amber-500/15 hover:border-amber-400 transition-all active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 motion-reduce:transition-none"
            >
              Buka Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-xl px-4 py-2 text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl border border-amber-500/50 bg-amber-500/10 px-4 py-2 text-xs sm:text-sm font-semibold text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 transition-all active:scale-95 shadow-sm shadow-amber-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 motion-reduce:transition-none"
              >
                Daftar Toko <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? 'Tutup navigasi' : 'Buka navigasi'}
          className="flex sm:hidden p-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Collapsible Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-slate-800 bg-slate-950/95 px-6 py-6 space-y-4 backdrop-blur-2xl animate-fade-in-up">
          <nav className="flex flex-col space-y-3 text-sm font-medium text-slate-300">
            <a
              href="#fitur"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-amber-400 transition-colors"
            >
              Fitur Unggulan
            </a>
            <a
              href="#showcase"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-amber-400 transition-colors"
            >
              Tampilan Sistem
            </a>
            <a
              href="#dampak"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-amber-400 transition-colors"
            >
              Dampak Bisnis
            </a>
            <a
              href="#testimoni"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-amber-400 transition-colors"
            >
              Kisah Sukses
            </a>
          </nav>

          <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-2.5">
            {token ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2.5 text-sm font-semibold text-amber-300 hover:bg-amber-500/20"
              >
                Buka Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-medium text-slate-300 hover:text-white rounded-xl bg-slate-900 border border-slate-800"
                >
                  Masuk ke Akun
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-amber-500/50 bg-amber-500/10 px-4 py-2.5 text-sm font-semibold text-amber-300 hover:bg-amber-500/20"
                >
                  Daftar Toko Gratis <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
