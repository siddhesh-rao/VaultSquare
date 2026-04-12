import { useEffect, useState } from "react";

import api from "../api/axios";
import ProductGrid from "../components/products/ProductGrid";
import Loader from "../components/ui/Loader";
import Alert from "../components/ui/Alert";

const ProductListingPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/products", {
          params: {
            ...(search ? { search } : {}),
            ...(selectedCategory ? { category: selectedCategory } : {})
          }
        });
        setProducts(data.products);
        setCategories(data.categories || ["All"]);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, selectedCategory]);

  return (
    <div className="page-shell space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-brand-300">Catalog</p>
          <h1 className="font-display text-4xl text-white">Browse products</h1>
        </div>
        <div className="w-full max-w-md">
          <input
            className="input"
            placeholder="Search by name"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={
              selectedCategory === category
                ? "button-primary !px-4 !py-2"
                : "button-secondary !px-4 !py-2"
            }
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <Alert type="error" message={error} />
      {loading ? (
        <Loader text="Loading products..." />
      ) : products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="card p-8 text-center">
          <h2 className="font-display text-2xl text-white">No products found</h2>
          <p className="mt-3 text-slate-400">
            No products match this category or search. Seed the database with sample data or add products from
            the admin dashboard.
          </p>
          <div className="mt-4 rounded-2xl bg-slate-950/60 px-4 py-3 text-sm text-slate-300">
            Run: <code>npm run seed</code>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductListingPage;
