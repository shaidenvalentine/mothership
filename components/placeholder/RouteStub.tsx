import type { ReactNode } from "react";

interface RouteStubProps {
  eyebrow: string;
  title: string;
  /** Optional footnote (e.g. a contact line or "full page coming soon"). */
  note?: string;
  children?: ReactNode;
}

/**
 * Placeholder shell for routes whose full build comes later. Renders a titled
 * <main> with consistent rhythm under the global nav/footer.
 */
export function RouteStub({ eyebrow, title, note, children }: RouteStubProps) {
  return (
    <main className="flex min-h-screen flex-col justify-center px-6 py-32 lg:px-16">
      <div className="mx-auto w-full max-w-[120rem]">
        <span className="ms-caption">{eyebrow}</span>
        <h1 className="mt-6 max-w-4xl text-balance font-display text-display-xl leading-[1.02] text-ms-bone">
          {title}
        </h1>
        {children}
        {note ? <p className="ms-caption mt-12 text-ms-ash">{note}</p> : null}
      </div>
    </main>
  );
}
