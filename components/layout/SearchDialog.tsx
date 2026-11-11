"use client";

import { useRef } from "react";
import Form from "next/form";
import { CloseIcon, SearchIcon } from "./icons";

/**
 * Search button + modal. next/form does a client-side GET to /search/?q=… and
 * degrades to a normal form submission without JS.
 */
export function SearchDialog({ variant }: { variant: "desktop" | "mobile" }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputId = `site-search-${variant}`;

  return (
    <>
      <button
        type="button"
        aria-label="Search products"
        aria-haspopup="dialog"
        onClick={() => dialogRef.current?.showModal()}
        className={
          variant === "desktop"
            ? "rounded-full bg-primary p-2 text-white transition-opacity hover:opacity-80"
            : "-m-2 flex items-center justify-center p-2 text-primary"
        }
      >
        <SearchIcon className={variant === "desktop" ? "h-4 w-4" : "h-6 w-6"} />
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={`${inputId}-label`}
        // Clicking the backdrop (the dialog element itself) closes it.
        onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
        className="m-auto mt-[15vh] w-[calc(100%-2rem)] max-w-xl rounded-xl bg-white p-0 shadow-xl backdrop:bg-black/50"
      >
        <Form action="/search/" role="search" onSubmit={() => dialogRef.current?.close()} className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <label id={`${inputId}-label`} htmlFor={inputId} className="text-lg font-semibold text-primary">
              Search products
            </label>
            <button
              type="button"
              aria-label="Close search"
              onClick={() => dialogRef.current?.close()}
              className="rounded-lg p-1 text-secondary hover:bg-surface"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="flex gap-2">
            <input
              id={inputId}
              name="q"
              type="search"
              required
              autoFocus
              autoComplete="off"
              placeholder="Part number, OE number or vehicle…"
              className="field-input"
            />
            <button type="submit" className="btn-primary shrink-0">
              <SearchIcon className="h-4 w-4" />
              <span>Search</span>
            </button>
          </div>
        </Form>
      </dialog>
    </>
  );
}
