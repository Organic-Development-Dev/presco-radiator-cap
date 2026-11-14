"use client";

import { useId, useRef, useState } from "react";
import { EnquiryForm } from "@/components/forms/EnquiryForm";

type Kind = "enquiry" | "order";

const TITLES: Record<Kind, string> = { enquiry: "Enquire Now", order: "Order Now" };

/** "Enquire Now" / "Order Now" buttons opening a native modal <dialog> with the enquiry form. */
export function ProductEnquiryButtons({ productId, productTitle }: { productId: string; productTitle: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [kind, setKind] = useState<Kind>("enquiry");
  // Bumped on every open so the form starts fresh each time.
  const [session, setSession] = useState(0);
  const titleId = useId();

  const open = (next: Kind) => {
    setKind(next);
    setSession((s) => s + 1);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <button type="button" className="btn-primary" aria-haspopup="dialog" onClick={() => open("enquiry")}>
          Enquire Now
        </button>
        <button type="button" className="btn-primary" aria-haspopup="dialog" onClick={() => open("order")}>
          Order Now
        </button>
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        // Close when the backdrop (the dialog element itself) is clicked.
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-xl p-0 shadow-xl backdrop:bg-black/50"
      >
        <div className="p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 id={titleId} className="text-lg font-semibold text-accent">
                {TITLES[kind]}
              </h2>
              <p className="text-sm text-gray-500">{productTitle}</p>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="rounded-lg bg-primary p-1.5 text-white transition-colors hover:bg-primary-dark"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-none stroke-current stroke-2">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <EnquiryForm
            key={`${kind}-${session}`}
            kind={kind}
            productId={productId}
            productTitle={productTitle}
            submitLabel={kind === "order" ? "Send order request" : "Send enquiry"}
          />
        </div>
      </dialog>
    </>
  );
}
