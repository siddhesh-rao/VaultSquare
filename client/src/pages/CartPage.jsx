import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import Alert from "../components/ui/Alert";
import useCart from "../hooks/useCart";
import useAuth from "../hooks/useAuth";
import { formatCurrency } from "../utils/formatters";

const CartPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, updateQuantity, removeFromCart, clearCart, totalAmount } = useCart();
  const [shippingAddress, setShippingAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const { data } = await api.post("/orders/buy", {
        items,
        shippingAddress
      });
      clearCart();
      setMessage(`Order created successfully. Order ID: ${data.order._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <section className="space-y-4">
        <h1 className="font-display text-4xl text-white">Your cart</h1>
        {items.length === 0 ? (
          <div className="card p-6 text-slate-300">Your cart is empty.</div>
        ) : (
          items.map((item) => (
            <div key={item.productId} className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
              <img src={item.image} alt={item.name} className="h-24 w-full rounded-2xl object-cover sm:w-24" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                <p className="text-sm text-slate-400">{formatCurrency(item.price)} each</p>
              </div>
              <input
                type="number"
                min="1"
                className="input max-w-24"
                value={item.quantity}
                onChange={(event) => updateQuantity(item.productId, Number(event.target.value))}
              />
              <button type="button" className="button-secondary" onClick={() => removeFromCart(item.productId)}>
                Remove
              </button>
            </div>
          ))
        )}
      </section>

      <aside className="card h-fit space-y-4 p-6">
        <h2 className="font-display text-2xl text-white">Order summary</h2>
        <Alert type="success" message={message} />
        <Alert type="error" message={error} />
        <div className="rounded-2xl bg-white/5 p-4 text-sm text-slate-300">
          <div className="flex items-center justify-between">
            <span>Total</span>
            <span className="font-semibold text-white">{formatCurrency(totalAmount)}</span>
          </div>
        </div>
        <textarea
          rows="4"
          className="input"
          placeholder="Shipping address"
          value={shippingAddress}
          onChange={(event) => setShippingAddress(event.target.value)}
        />
        <button
          type="button"
          className="button-primary w-full"
          onClick={handleCheckout}
          disabled={loading || items.length === 0}
        >
          {loading ? "Processing..." : "Checkout"}
        </button>
      </aside>
    </div>
  );
};

export default CartPage;
