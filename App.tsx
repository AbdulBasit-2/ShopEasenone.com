import { useMemo, useRef, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductCard from "./components/ProductCard";
import CartDrawer from "./components/CartDrawer";
import Footer from "./components/Footer";
import { categories, products, type Category, type Product } from "./data/products";
import type { CartItem } from "./types";

type Sort = "featured" | "price-asc" | "price-desc" | "rating";

export default function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"All" | Category>("All");
  const [sort, setSort] = useState<Sort>("featured");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wish, setWish] = useState<number[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const shopRef = useRef<HTMLElement>(null);

  const visible = useMemo(() => {
    let list = products.filter(
      (p) =>
        (category === "All" || p.category === category) &&
        p.name.toLowerCase().includes(query.trim().toLowerCase())
    );
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [query, category, sort]);

  const addToCart = (p: Product) => {
    setCart((c) =>
      c.some((i) => i.id === p.id)
        ? c.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i))
        : [...c, { ...p, qty: 1 }]
    );
    setCartOpen(true);
  };

  const changeQty = (id: number, delta: number) =>
    setCart((c) => c.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)));

  const removeItem = (id: number) => setCart((c) => c.filter((i) => i.id !== id));
  const toggleWish = (id: number) => setWish((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]));

  return (
    <>
      <Navbar
        query={query}
        onQuery={setQuery}
        cartCount={cart.reduce((s, i) => s + i.qty, 0)}
        wishCount={wish.length}
        onOpenCart={() => setCartOpen(true)}
      />
      <main>
        <Hero onShop={() => shopRef.current?.scrollIntoView({ behavior: "smooth" })} />

        <section ref={shopRef} className="mx-auto max-w-7xl scroll-mt-28 px-4 pt-12 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Popular right now</h2>
            <label className="flex items-center gap-2 text-sm">
              <span className="text-ink/60">Sort by</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="rounded-full border border-ink/10 bg-white px-4 py-2 font-medium outline-none focus:border-teal"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="rating">Top rated</option>
              </select>
            </label>
          </div>

          <div className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0" role="tablist" aria-label="Categories">
            {categories.map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={category === c}
                onClick={() => setCategory(c)}
                className={`shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition ${
                  category === c ? "bg-teal text-white" : "bg-white text-ink hover:bg-teal-soft"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <div className="mt-10 rounded-2xl bg-white p-10 text-center">
              <p className="font-display text-lg font-bold">No products match "{query}"</p>
              <p className="mt-1 text-sm text-ink/60">Try a different word or pick another category.</p>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
              {visible.map((p) => (
                <ProductCard key={p.id} product={p} wished={wish.includes(p.id)} onWish={toggleWish} onAdd={addToCart} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
      <CartDrawer open={cartOpen} items={cart} onClose={() => setCartOpen(false)} onQty={changeQty} onRemove={removeItem} />
    </>
  );
}
