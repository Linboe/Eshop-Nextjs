import { sql } from "@/lib/db";

type Product = {
  name: string;
  category: string;
};

export default async function DatabaseCheckPage() {
  const products = await sql<Product[]>`
    select name, category
    from public.products
    order by name
  `;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-serif text-3xl">Database check</h1>
      <p className="mt-3">{products.length} products found.</p>
      <ul className="mt-6 space-y-2">
        {products.map((product) => (
          <li key={`${product.category}-${product.name}`}>
            {product.name} <span className="text-[#34251b]/60">({product.category})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
