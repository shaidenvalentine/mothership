import { Placeholder } from "@/components/placeholder/Placeholder";

/**
 * Section 8 — The maker. Built by Brandon Buckley in San Diego. Portrait is a
 * placeholder pending a real photo of Brandon / the shop.
 */
export function Founders() {
  return (
    <section className="bg-ms-black px-6 py-32 lg:px-16">
      <div className="mx-auto grid max-w-[120rem] grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <Placeholder label="BRANDON BUCKLEY · SAN DIEGO" className="aspect-[4/5] w-full" />
        <div>
          <span className="ms-caption">The maker</span>
          <h2 className="mt-6 max-w-xl text-balance font-display text-display-lg leading-[1.05] text-ms-bone">
            Built by hand by Brandon Buckley.
          </h2>
          <p className="mt-6 max-w-md text-body-lg text-ms-fog">
            Every Mothership is built in San Diego and perfected over years of
            real-world experience — one design, obsessed over down to the last
            detail.
          </p>
          <p className="mt-4 max-w-md text-body-sm text-ms-ash">
            Owner &amp; builder &middot; brandon@bucksd.com
          </p>
        </div>
      </div>
    </section>
  );
}
