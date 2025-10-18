"use client";

import Link from "next/link";
import { memo, useMemo } from "react";

function NavbarImpl() {
  const items = useMemo(
    () => [
      { href: "/", label: "Home" },
      { href: "/collections", label: "Collections" },
      { href: "/cart", label: "Cart" },
      { href: "/account", label: "Account" },
    ],
    []
  );

  return (
    <header className="sticky top-0 z-40 glass">
      <nav className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-wide">Parfum</Link>
        <ul className="flex items-center gap-6 text-sm">
          {items.map((it) => (
            <li key={it.href}>
              <Link href={it.href} className="hover:opacity-80">
                {it.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export const Navbar = memo(NavbarImpl);


