"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronDownIcon, CloseIcon, MenuIcon } from "./icons";
import type { NavItem, NavLink } from "./nav-data";

const topLinkClass = "block px-4 py-3 text-lg font-semibold uppercase text-accent";
const summaryClass =
  "flex cursor-pointer list-none items-center justify-between px-4 py-3 font-semibold uppercase text-accent [&::-webkit-details-marker]:hidden";

function SubList({ links }: { links: NavLink[] }) {
  return (
    <ul className="list-disc pb-2 pl-10 marker:text-accent">
      {links.map((link) => (
        <li key={link.label}>
          <Link href={link.href} className="block px-2 py-3 text-accent">
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Off-canvas mobile navigation using a native modal <dialog> (focus trap + Escape for free). */
export function MobileMenu({ items }: { items: NavItem[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const close = () => dialogRef.current?.close();

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        aria-haspopup="dialog"
        onClick={() => dialogRef.current?.showModal()}
        className="flex items-center px-3 py-2 text-accent"
      >
        <MenuIcon className="h-6 w-6" />
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Site menu"
        onClick={(e) => {
          // Close on backdrop click or after following any link.
          const target = e.target as HTMLElement;
          if (target === e.currentTarget || target.closest("a")) close();
        }}
        className="m-0 h-dvh max-h-none w-[85%] max-w-sm bg-page p-0 shadow-xl backdrop:bg-black/50"
      >
        <div className="flex justify-end p-3">
          <button
            type="button"
            aria-label="Close menu"
            onClick={close}
            className="rounded-lg bg-primary p-2 text-white"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
        <nav aria-label="Mobile">
          <ul className="pb-6">
            <li>
              <Link href="/" className={topLinkClass}>
                Home
              </Link>
            </li>
            {items.map((item) => (
              <li key={item.label}>
                {item.kind === "link" ? (
                  <Link href={item.href} className={topLinkClass}>
                    {item.label}
                  </Link>
                ) : (
                  <details className="group">
                    <summary className={`${summaryClass} text-lg`}>
                      {item.label}
                      <ChevronDownIcon className="h-5 w-5 transition-transform group-open:rotate-180" />
                    </summary>
                    {item.kind === "menu" ? (
                      <SubList links={item.links} />
                    ) : (
                      <div className="pl-4">
                        {item.groups.map((group) => (
                          <details key={group.title} className="group/sub">
                            <summary className={`${summaryClass} text-base`}>
                              {group.title}
                              <span aria-hidden="true" className="text-xl leading-none">
                                <span className="group-open/sub:hidden">+</span>
                                <span className="hidden group-open/sub:inline">−</span>
                              </span>
                            </summary>
                            <SubList
                              links={group.href ? [{ label: `All ${group.title}`, href: group.href }, ...group.links] : group.links}
                            />
                          </details>
                        ))}
                        <Link href="/products/" className="block px-4 py-3 font-semibold uppercase text-accent">
                          All products
                        </Link>
                      </div>
                    )}
                  </details>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </dialog>
    </>
  );
}
