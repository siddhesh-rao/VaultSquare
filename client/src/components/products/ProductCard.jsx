import { Link } from "react-router-dom";

import useCart from "../../hooks/useCart";
import { formatCurrency } from "../../utils/formatters";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <article className="card group overflow-hidden">
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="space-y-3 p-4">
        <div>
          <div className="mb-2 inline-flex rounded-full border border-brand-400/30 bg-brand-400/10 px-2.5 py-1 text-[11px] text-brand-200">
            {product.category}
          </div>
          <h3 className="font-display text-lg text-white">{product.name}</h3>
          <p className="mt-2 line-clamp-3 text-sm text-slate-400">{product.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-2xl bg-white/5 p-2.5">
            <p className="text-xs text-slate-400">Buy</p>
            <p className="mt-1 text-sm font-semibold text-white">{formatCurrency(product.buyPrice)}</p>
          </div>
          <div className="rounded-2xl bg-white/5 p-2.5">
            <p className="text-xs text-slate-400">Rent / day</p>
            <p className="mt-1 text-sm font-semibold text-white">{formatCurrency(product.rentPricePerDay)}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Link to={`/products/${product._id}`} className="button-secondary w-full !px-4 !py-2.5">
            View details
          </Link>
          <button type="button" className="button-primary w-full !px-4 !py-2.5" onClick={() => addToCart(product)}>
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
