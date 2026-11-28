import Link from "next/link";

const categories = [
  ["Lighting", "lighting", "#efe8dd"],
  ["Furniture", "furniture", "#e3edcf"],
  ["Textiles", "textiles", "#d9dad1"],
  ["Decor", "decor", "#c4a87c"],
  ["Tableware", "tableware", "#e7dfd2"],
] as const;

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <section className="grid min-h-[360px] overflow-hidden rounded-xl border border-[#34251b]/10 bg-[#5e4a37] text-white md:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col items-start justify-center px-8 py-12 md:px-12">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.25em] text-[#e8c9a8]">
            New season
          </p>
          <h1 className="max-w-md font-serif text-5xl leading-[0.98] md:text-6xl">
            Rooms worth coming home to
          </h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-white/75">
            Lighting, furniture and textile pieces for calm, comfortable homes.
          </p>
          <Link
            href="/products"
            className="mt-7 rounded-full bg-[#f07f9d] px-6 py-3 text-sm font-semibold text-[#34251b]"
          >
            Shop the collection
          </Link>
        </div>
        <div className="m-6 rounded-xl bg-[#efb1ca] md:m-5">
          <div className="flex h-full items-end justify-center pb-10">
            <div className="h-52 w-2 rounded-full bg-[#34251b]/80" />
            <div className="-ml-1 h-5 w-20 rounded-t-full bg-[#34251b]/80" />
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-serif text-3xl">Shop by category</h2>
          <Link href="/products" className="text-sm">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {categories.map(([name, slug, color]) => (
            <Link
              key={slug}
              href={`/products?category=${slug}`}
              className="flex aspect-[4/5] flex-col items-center justify-end rounded-xl pb-5 text-sm"
              style={{ backgroundColor: color }}
            >
              {name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
