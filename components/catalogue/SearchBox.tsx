import Form from "next/form";

/** GET search form posting to /search/?q=… (client-side navigation via next/form, works without JS). */
export function SearchBox({ defaultValue = "", autoFocus = false }: { defaultValue?: string; autoFocus?: boolean }) {
  return (
    <Form action="/search/" role="search" className="flex w-full max-w-xl gap-2">
      <label htmlFor="search-q" className="sr-only">
        Search products
      </label>
      <input
        id="search-q"
        name="q"
        type="search"
        defaultValue={defaultValue}
        autoFocus={autoFocus}
        placeholder="Part number, OE number or vehicle make"
        maxLength={100}
        autoComplete="off"
        enterKeyHint="search"
        className="field-input"
      />
      <button type="submit" className="btn-primary shrink-0">
        Search
      </button>
    </Form>
  );
}
