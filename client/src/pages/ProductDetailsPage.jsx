import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import api from "../api/axios";
import Loader from "../components/ui/Loader";
import Alert from "../components/ui/Alert";
import useCart from "../hooks/useCart";
import { formatCurrency } from "../utils/formatters";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data.product);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="page-shell">
        <Loader text="Loading product..." />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page-shell">
        <Alert type="error" message={error || "Product not found"} />
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="card overflow-hidden">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        </div>
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="inline-flex rounded-full border border-brand-400/30 bg-brand-400/10 px-3 py-1 text-xs text-brand-200">
              {product.category}
            </div>
            <h1 className="font-display text-4xl text-white">{product.name}</h1>
            <p className="text-slate-300">{product.description}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="card p-4">
              <p className="text-sm text-slate-400">Buy price</p>
              <p className="mt-2 text-xl font-semibold text-white">{formatCurrency(product.buyPrice)}</p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-slate-400">Rent per day</p>
              <p className="mt-2 text-xl font-semibold text-white">{formatCurrency(product.rentPricePerDay)}</p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-slate-400">Deposit</p>
              <p className="mt-2 text-xl font-semibold text-white">{formatCurrency(product.depositAmount)}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <button type="button" className="button-primary flex-1" onClick={() => addToCart(product)}>
              Add to cart
            </button>
            <Link to={`/rent/${product._id}`} className="button-secondary flex-1">
              Rent this item
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
