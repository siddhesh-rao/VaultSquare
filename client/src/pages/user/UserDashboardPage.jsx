import { useEffect, useState } from "react";

import api from "../../api/axios";
import Alert from "../../components/ui/Alert";
import Loader from "../../components/ui/Loader";
import useAuth from "../../hooks/useAuth";
import useWallet from "../../hooks/useWallet";
import { formatCurrency, formatDate } from "../../utils/formatters";

const UserDashboardPage = () => {
  const { user, updateProfile } = useAuth();
  const { walletAddress, connectWallet } = useWallet();
  const [orders, setOrders] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    walletAddress: user?.walletAddress || walletAddress || ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setForm((current) => ({
      ...current,
      walletAddress: walletAddress || user?.walletAddress || ""
    }));
  }, [user, walletAddress]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [ordersResponse, rentalsResponse] = await Promise.all([
          api.get("/orders/my-orders"),
          api.get("/rentals/my-rentals")
        ]);

        setOrders(ordersResponse.data.orders);
        setRentals(rentalsResponse.data.rentals);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleWalletLink = async () => {
    try {
      const address = await connectWallet();
      setForm((current) => ({ ...current, walletAddress: address }));
    } catch (err) {
      setError(err.message || "Failed to connect wallet");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      await updateProfile(form);
      setMessage("Profile updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-shell space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-brand-300">User dashboard</p>
        <h1 className="font-display text-4xl text-white">Account overview</h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="card space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl text-white">Profile</h2>
            <button type="button" className="button-secondary !px-4 !py-2" onClick={handleWalletLink}>
              Link wallet
            </button>
          </div>

          <Alert type="success" message={message} />
          <Alert type="error" message={error} />

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              className="input"
              placeholder="Name"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            />
            <input
              className="input"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            />
            <input
              className="input"
              placeholder="Wallet address"
              value={form.walletAddress}
              onChange={(event) => setForm((current) => ({ ...current, walletAddress: event.target.value }))}
            />
            <button type="submit" className="button-primary w-full" disabled={saving}>
              {saving ? "Saving..." : "Save profile"}
            </button>
          </form>
        </section>

        <section className="space-y-6">
          <div className="card p-6">
            <h2 className="font-display text-2xl text-white">Orders</h2>
            {loading ? (
              <div className="mt-4">
                <Loader text="Loading orders..." />
              </div>
            ) : orders.length === 0 ? (
              <p className="mt-4 text-slate-400">No orders yet.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {orders.map((order) => (
                  <div key={order._id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold text-white">{order.orderType.toUpperCase()} order</p>
                      <p className="text-sm text-slate-400">{formatDate(order.createdAt)}</p>
                    </div>
                    <p className="mt-2 text-sm text-slate-300">Status: {order.status}</p>
                    <p className="mt-1 text-sm text-slate-300">Total: {formatCurrency(order.totalAmount)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card p-6">
            <h2 className="font-display text-2xl text-white">Rentals</h2>
            {loading ? (
              <div className="mt-4">
                <Loader text="Loading rentals..." />
              </div>
            ) : rentals.length === 0 ? (
              <p className="mt-4 text-slate-400">No rentals yet.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {rentals.map((rental) => (
                  <div key={rental._id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold text-white">{rental.product?.name}</p>
                      <p className="text-sm text-slate-400">
                        {formatDate(rental.startDate)} to {formatDate(rental.endDate)}
                      </p>
                    </div>
                    <p className="mt-2 text-sm text-slate-300">Status: {rental.status}</p>
                    <p className="mt-1 text-sm text-slate-300">Total: {formatCurrency(rental.totalAmount)}</p>
                    {rental.transactionHash && (
                      <a
                        className="mt-2 inline-flex text-sm text-brand-300"
                        href={`${import.meta.env.VITE_BLOCK_EXPLORER_URL || ""}${rental.transactionHash}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View transaction
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserDashboardPage;
