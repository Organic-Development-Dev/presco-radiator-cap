"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDownIcon } from "./icons";
import type { NavItem } from "./nav-data";

const linkBase = "block rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-surface";

/** Desktop navigation with disclosure dropdowns (click, hover, keyboard, Escape). */
export function DesktopNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  // Remember which path the menu was opened on so navigation closes it without an effect.
  const [open, setOpen] = useState<{ label: string; path: string; viaHover: boolean } | null>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const openLabel = open && open.path === pathname ? open.label : null;

  useEffect(() => {
    if (!openLabel) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [openLabel]);

  const show = (label: string, viaHover = false) => setOpen({ label, path: pathname, viaHover });
  const close = () => setOpen(null);

  return (
    <ul ref={navRef} className="hidden items-center gap-6 lg:flex xl:gap-10">
      {items.map((item) => {
        if (item.kind === "link") {
          const active = pathname === item.href;
          return (
            <li key={item.label}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="text-base font-semibold text-primary underline-offset-8 hover:underline aria-[current=page]:underline"
              >
                {item.label}
              </Link>
            </li>
          );
        }

        const isOpen = openLabel === item.label;
        const panelId = `nav-panel-${item.label.toLowerCase().replace(/[^a-z]+/g, "-")}`;

        return (
          <li
            key={item.label}
            className="relative"
            onPointerEnter={(e) => e.pointerType === "mouse" && !isOpen && show(item.label, true)}
            onPointerLeave={(e) => e.pointerType === "mouse" && close()}
            onKeyDown={(e) => {
              if (e.key === "Escape" && isOpen) {
                close();
                (e.currentTarget.querySelector("button") as HTMLButtonElement | null)?.focus();
              }
            }}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) close();
            }}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              // A click on a hover-opened menu pins it open rather than closing it.
              onClick={() => (isOpen && !open?.viaHover ? close() : show(item.label))}
              className="flex items-center gap-1 text-base font-semibold text-primary"
            >
              {item.label}
              <ChevronDownIcon className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {/* pt-3 bridges the gap so hover isn't lost moving into the panel */}
            <div
              id={panelId}
              hidden={!isOpen}
              className="absolute top-full left-1/2 z-40 -translate-x-1/2 pt-3"
            >
              {item.kind === "products" ? (
                <div className="w-[min(750px,90vw)] rounded-xl border border-gray-100 bg-white px-10 py-6 shadow-lg">
                  <p className="text-center text-lg font-semibold text-primary">{item.label}</p>
                  <div className="mt-4 grid grid-cols-3 gap-6">
                    {item.groups.map((group) => (
                      <div key={group.title}>
                        {group.href ? (
                          <Link
                            href={group.href}
                            onClick={close}
                            className="mb-2 inline-block rounded-lg bg-primary px-2 text-sm font-semibold uppercase text-white hover:bg-primary-dark"
                          >
                            {group.title}
                          </Link>
                        ) : (
                          <p className="mb-2 inline-block rounded-lg bg-primary px-2 text-sm font-semibold uppercase text-white">
                            {group.title}
                          </p>
                        )}
                        <ul>
                          {group.links.map((link) => (
                            <li key={link.href}>
                              <Link href={link.href} onClick={close} className={`${linkBase} text-secondary hover:text-primary`}>
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 border-t border-gray-100 pt-4 text-center">
                    <Link href="/products/" onClick={close} className="text-sm font-semibold text-primary hover:underline">
                      View all products
                    </Link>
                  </div>
                </div>
              ) : (
                <ul className="min-w-52 rounded-xl border border-gray-100 bg-white p-2 shadow-lg">
                  {item.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} onClick={close} className={`${linkBase} font-semibold text-primary`}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
