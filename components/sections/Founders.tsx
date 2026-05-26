import { Placeholder } from "@/components/placeholder/Placeholder";

/**
 * Section 8 — Founders. Two large portraits side by side with role blocks.
 * Roles are verbatim from the brief; bio copy is a short placeholder pending
 * Shaiden + Brandon's final words.
 */
const founders = [
  {
    name: "Brandon Buckley",
    role: "Engineering",
    location: "San Diego shop",
    note: "Builds the machine that builds the van.",
  },
  {
    name: "Shaiden Valentine",
    role: "Brand & Design",
    location: "Bali",
    note: "Shapes how the world meets Mothership.",
  },
];

export function Founders() {
  return (
    <section className="bg-ms-black px-6 py-32 lg:px-16">
      <div className="mx-auto max-w-[120rem]">
        <span className="ms-caption">Founders</span>
        <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2">
          {founders.map((founder) => (
            <div key={founder.name}>
              <Placeholder label="PORTRAIT" className="aspect-[4/5] w-full" />
              <div className="mt-6">
                <p className="ms-caption">{founder.role}</p>
                <h3 className="mt-2 font-display text-display-md leading-none text-ms-bone">
                  {founder.name}
                </h3>
                <p className="mt-3 text-body-sm text-ms-fog">{founder.location}</p>
                <p className="mt-2 max-w-sm text-body-sm text-ms-ash">
                  {founder.note}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
