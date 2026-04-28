import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../api/axios";
import Loader from "../components/ui/Loader";
import Alert from "../components/ui/Alert";
import useAuth from "../hooks/useAuth";
import useWallet from "../hooks/useWallet";
import { formatCurrency } from "../utils/formatters";

const today = new Date().toISOString().split("T")[0];

const RentProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, refreshProfile, updateProfile } = useAuth();
  const { walletAddress, connectWallet } = useWallet();
  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({
    startDate: today,
    endDate: today
  });
  const [quote, setQuote] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

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

  useEffect(() => {
    const fetchQuote = async () => {
      if (!form.startDate || !form.endDate || !user) {
        return;
      }

      if (new Date(form.endDate) < new Date(form.startDate)) {
        setQuote(null);
        setAvailability(null);
        setError("End date cannot be earlier than start date");
        return;
      }

      try {
        setError("");
        const [quoteResponse, availabilityResponse] = await Promise.all([
          api.post("/rentals/quote", {
            productId: id,
            startDate: form.startDate,
            endDate: form.endDate
          }),
          api.get(`/products/${id}/availability`, {
            params: {
              startDate: form.startDate,
              endDate: form.endDate
            }
          })
        ]);

        setQuote(quoteResponse.data.quote);
        setAvailability(availabilityResponse.data.available);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch rental quote");
      }
    };

    fetchQuote();
  }, [form.endDate, form.startDate, id, user]);

  const walletReady = useMemo(() => walletAddress || user?.walletAddress, [walletAddress, user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      if (!walletReady) {
        const address = await connectWallet();
        await updateProfile({ walletAddress: address });
        await refreshProfile();
      }

      const rentalResponse = await api.post("/rentals", {
        productId: id,
        startDate: form.startDate,
        endDate: form.endDate
      });

      await api.post("/orders/rent", {
        rentalId: rentalResponse.data.rental._id,
        transactionHash: rentalResponse.data.rental.transactionHash
      });

      setMessage("Rental created successfully. Your blockchain agreement has been recorded if the contract is configured.");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to create rental");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-shell">
        <Loader text="Loading rental page..." />
      </div>
    );
  }

  return (
    <div className="page-shell grid gap-6 lg:grid-cols-[1fr_0.9fr]">
      <section className="card overflow-hidden">
        <img src={product.image} alt={product.name} className="h-72 w-full object-cover" />
        <div className="space-y-3 p-6">
          <h1 className="font-display text-3xl text-white">{product.name}</h1>
          <p className="text-slate-300">{product.description}</p>
        </div>
      </section>

      <section className="card space-y-4 p-6">
        <h2 className="font-display text-2xl text-white">Rent this product</h2>
        <Alert type="error" message={error} />
        <Alert type="success" message={message} />

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-slate-300">Start date</label>
              <input
                type="date"
                className="input"
                value={form.startDate}
                min={today}
                onChange={(event) =>
                  setForm((current) => {
                    const nextStartDate = event.target.value;

                    return {
                      ...current,
                      startDate: nextStartDate,
                      endDate: current.endDate < nextStartDate ? nextStartDate : current.endDate
                    };
                  })
                }
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-300">End date</label>
              <input
                type="date"
                className="input"
                value={form.endDate}
                min={form.startDate}
                onChange={(event) => setForm((current) => ({ ...current, endDate: event.target.value }))}
              />
            </div>
          </div>

          {quote && (
            <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              <div className="flex items-center justify-between">
                <span>Days</span>
                <span className="font-semibold text-white">{quote.totalDays}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Rental amount</span>
                <span className="font-semibold text-white">{formatCurrency(quote.rentalAmount)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Deposit</span>
                <span className="font-semibold text-white">{formatCurrency(quote.depositAmount)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-3 text-base">
                <span>Total</span>
                <span className="font-semibold text-white">{formatCurrency(quote.totalAmount)}</span>
              </div>
              <div className="rounded-2xl bg-slate-950/60 px-3 py-2 text-xs text-slate-400">
                Availability: {availability ? "Available" : "Not Available"}
              </div>
            </div>
          )}

          <button type="submit" className="button-primary w-full" disabled={submitting || !availability}>
            {submitting ? "Creating rental..." : "Confirm rental"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default RentProductPage;
