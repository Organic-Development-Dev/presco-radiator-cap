"use client";

import Form from "next/form";
import Link from "next/link";
import { useId, useSyncExternalStore } from "react";
import { FILTER_PARAMS, type CatalogueFilters } from "./params";

type Props = {
  /** Listing path the form submits to, e.g. "/products/". */
  action: string;
  applications: string[];
  partTypes: string[];
  selected: CatalogueFilters;
};

const subscribe = () => () => {};

/**
 * GET form so filters live in the URL. Works without JS via the Apply button;
 * with JS it re-submits (client-side navigation) whenever a checkbox changes.
 */
export function FilterForm({ action, applications, partTypes, selected }: Props) {
  const id = useId();
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const hasFilters = selected.applications.length > 0 || selected.types.length > 0;

  return (
    <Form
      action={action}
      scroll={false}
      onChange={(e) => e.currentTarget.requestSubmit()}
      className="space-y-6"
      aria-label="Filter products"
    >
      <CheckboxGroup
        legend="Application"
        name={FILTER_PARAMS.application}
        options={applications}
        selected={selected.applications}
        idPrefix={`${id}-app`}
      />
      <CheckboxGroup
        legend="Part type"
        name={FILTER_PARAMS.type}
        options={partTypes}
        selected={selected.types}
        idPrefix={`${id}-type`}
      />
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className={hydrated ? "sr-only" : "btn-primary"}>
          Apply filters
        </button>
        {hasFilters && (
          <Link href={action} scroll={false} className="text-sm font-medium text-accent underline underline-offset-2">
            Clear filters
          </Link>
        )}
      </div>
    </Form>
  );
}

function CheckboxGroup({
  legend,
  name,
  options,
  selected,
  idPrefix,
}: {
  legend: string;
  name: string;
  options: string[];
  selected: string[];
  idPrefix: string;
}) {
  if (!options.length) return null;
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold uppercase tracking-wide text-accent">{legend}</legend>
      <ul className="max-h-64 space-y-1 overflow-y-auto pr-2">
        {options.map((option, i) => {
          const inputId = `${idPrefix}-${i}`;
          return (
            <li key={option}>
              <label htmlFor={inputId} className="flex cursor-pointer items-start gap-2 py-0.5 text-sm">
                <input
                  id={inputId}
                  type="checkbox"
                  name={name}
                  value={option}
                  defaultChecked={selected.includes(option)}
                  className="mt-0.5 size-4 shrink-0 accent-primary"
                />
                <span>{option}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}
