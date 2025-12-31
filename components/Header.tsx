"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function NavLink({ children, href, active }: Readonly<{ children: React.ReactNode; href?: string; active?: boolean }>) {
  return (
    <Link
      href={href ?? '#'}
      aria-current={active ? 'page' : undefined}
      className={`px-3 py-2 rounded-md text-sm font-medium transition ${
        active ? 'text-pink-400 font-semibold' : 'text-zinc-200 hover:bg-white/10'
      }`}
    >
      {children}
    </Link>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  // undefined -> still loading (hydration), null -> loaded (no user), object -> loaded (user present)
  const [user, setUser] = useState<undefined | null | { id?: number; name?: string; email?: string }>(undefined);
  const pathname = usePathname() ?? '/';

  useEffect(() => {
    function syncUserFromStorage() {
      try {
        const raw = localStorage.getItem('user');
        if (raw) setUser(JSON.parse(raw));
        else setUser(null);
      } catch (e) {
        // log parsing error and continue with no user
        // eslint-disable-next-line no-console
        console.error('Failed parsing user from localStorage', e);
        setUser(null);
      }
    }

    // initial sync
    syncUserFromStorage();

    // listen for cross-tab storage changes and an app-level custom event
    window.addEventListener('storage', syncUserFromStorage);
    window.addEventListener('auth-change', syncUserFromStorage as EventListener);

    return () => {
      window.removeEventListener('storage', syncUserFromStorage);
      window.removeEventListener('auth-change', syncUserFromStorage as EventListener);
    };
  }, []);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    location.href = '/';
  }

  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === '/') return pathname === '/';
  };

  // avoid nested ternaries in JSX (and prevent flashes during hydration)
  const desktopAuthControls = (() => {
    if (user === undefined) return null;
    if (user) {
      return (
        <div className="relative">
          <ProfileMenu user={user} onLogout={handleLogout} pathname={pathname} />
        </div>
      );
    }
    return (
      <>
        <Link href="/login" className="rounded-md px-3 py-1.5 bg-white/10 hover:bg-white/20">Login</Link>
        <Link href="/register" className="rounded-md px-3 py-1.5 bg-gradient-to-r from-pink-500 to-violet-500 font-semibold">Register</Link>
      </>
    );
  })();

  const mobileAuthControls = (() => {
    if (user === undefined) return null;
    if (user) {
      return (
        <>
          <div className="flex-1 rounded-md px-3 py-2 bg-white/5 text-center">{user.name}</div>
          <button onClick={handleLogout} className="flex-1 rounded-md px-3 py-2 bg-white/10">Logout</button>
        </>
      );
    }
    return (
      <>
        <Link href="/login" className="flex-1 rounded-md px-3 py-2 bg-white/10 text-center">Login</Link>
        <Link href="/register" className="flex-1 rounded-md px-3 py-2 bg-gradient-to-r from-pink-500 to-violet-500 text-center">Register</Link>
      </>
    );
  })();

  return (
    <header className="backdrop-blur sticky top-0 z-40 border-b border-white/5 bg-black/20">
      <nav className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-extrabold tracking-tight">🎧 House Party</div>
          <div className="hidden md:flex items-center ml-6 space-x-1">
            <NavLink href="/" active={isActive('/')}>Main</NavLink>
            <NavLink href="/events" active={isActive('/events')}>Events</NavLink>
            <NavLink href="/about" active={isActive('/about')}>About Us</NavLink>
            <NavLink href="/contacts" active={isActive('/contacts')}>Contacts</NavLink>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex gap-2 items-center">
            {desktopAuthControls}
          </div>
          <button className="md:hidden p-2 rounded-md" onClick={() => setMobileOpen(v => !v)} aria-label="Toggle menu">
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>
      {mobileOpen && (
        <div className="md:hidden px-6 pb-4">
          <div className="flex flex-col gap-2">
            <NavLink href="/" active={isActive('/')}>Main</NavLink>
            <NavLink href="/events" active={isActive('/events')}>Events</NavLink>
            <NavLink href="/about" active={isActive('/about')}>About Us</NavLink>
            <NavLink href="/contacts" active={isActive('/contacts')}>Contacts</NavLink>
            <div className="flex gap-2 mt-2">{mobileAuthControls}</div>
          </div>
        </div>
      )}
    </header>
  );
}

function ProfileMenu({ user, onLogout, pathname }: Readonly<{ user: { name?: string; email?: string }; onLogout: () => void; pathname?: string }>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (e.target instanceof Node && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('click', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    if (pathname === '/profile') setOpen(false);
  }, [pathname]);

  const initials = (user.name || 'U').split(' ').map(s => s[0]).slice(0,2).join('').toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 rounded-md px-3 py-1.5 hover:bg-white/5"
      >
        <div className="h-8 w-8 rounded-full bg-pink-500 flex items-center justify-center text-sm font-semibold">{initials}</div>
        <div className="text-sm text-zinc-100">{user.name}</div>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-md bg-zinc-900/80 border border-white/5 shadow-lg py-2 z-50">
          <div className="px-3 py-2 border-b border-white/5">
            <div className="font-semibold text-sm">{user.name}</div>
            {user.email && <div className="text-xs text-zinc-300">{user.email}</div>}
          </div>
          <div className="flex flex-col">
            <Link href="/profile" className="px-3 py-2 text-sm hover:bg-white/5">Profile</Link>
            <button onClick={() => { setOpen(false); onLogout(); }} className="text-left px-3 py-2 text-sm hover:bg-white/5">Logout</button>
          </div>
        </div>
      )}
    </div>
  );
}
