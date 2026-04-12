import { useEffect, useState } from "react";

import api from "../../api/axios";
import Alert from "../../components/ui/Alert";
import Loader from "../../components/ui/Loader";
import { formatCurrency, formatDate } from "../../utils/formatters";

const defaultProduct = {
  name: "",
  description: "",
  image: "",
  category: "",
  buyPrice: "",
  rentPricePerDay: "",
  depositAmount: "",
  stock: ""
};

const categoryOptions = [
  "Electronics",
  "Computers",
  "Photography",
  "Tools",
  "Outdoor",
  "Entertainment",
  "General"
];

const AdminDashboardPage = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(defaultProduct);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [customCategory, setCustomCategory] = useState("");

  const isCustomCategorySelected =
    form.category === "Custom" || (!!form.category && !categoryOptions.includes(form.category));

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [productsResponse, ordersResponse] = await Promise.all([
        api.get("/products/admin/all"),
        api.get("/orders")
      ]);
      setProducts(productsResponse.data.products);
      setOrders(ordersResponse.data.orders);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load admin dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const resetForm = () => {
    setForm(defaultProduct);
    setEditingId("");
    setCustomCategory("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      if (isCustomCategorySelected && !customCategory.trim()) {
        throw new Error("Please enter a custom category name");
      }

      const payload = {
        ...form,
        category: isCustomCategorySelected ? customCategory.trim() : form.category,
        buyPrice: Number(form.buyPrice),
        rentPricePerDay: Number(form.rentPricePerDay),
        depositAmount: Number(form.depositAmount),
        stock: Number(form.stock)
      };

      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        setMessage("Product updated successfully");
      } else {
        await api.post("/products", payload);
        setMessage("Product created successfully");
      }

      resetForm();
      await fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    const usePresetCategory = categoryOptions.includes(product.category);

    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      image: product.image,
      category: usePresetCategory ? product.category : "Custom",
      buyPrice: product.buyPrice,
      rentPricePerDay: product.rentPricePerDay,
      depositAmount: product.depositAmount,
      stock: product.stock
    });
    setCustomCategory(usePresetCategory ? "" : product.category);
  };

  const handleDelete = async (productId) => {
    try {
      await api.delete(`/products/${productId}`);
      setMessage("Product archived successfully");
      await fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to archive product");
    }
  };

  return (
    <div className="page-shell space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-brand-300">Admin dashboard</p>
        <h1 className="font-display text-4xl text-white">Manage catalog and orders</h1>
      </div>

      <Alert type="success" message={message} />
      <Alert type="error" message={error} />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="card p-6">
          <h2 className="font-display text-2xl text-white">{editingId ? "Edit product" : "Add product"}</h2>
          <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
            <input
              className="input"
              placeholder="Product name"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            />
            <textarea
              rows="4"
              className="input"
              placeholder="Description"
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            />
            <input
              className="input"
              placeholder="Image URL"
              value={form.image}
              onChange={(event) => setForm((current) => ({ ...current, image: event.target.value }))}
            />
            <select
              className="input"
              value={isCustomCategorySelected ? "Custom" : form.category}
              onChange={(event) => {
                const value = event.target.value;
                setForm((current) => ({ ...current, category: value }));

                if (value !== "Custom") {
                  setCustomCategory("");
                }
              }}
            >
              <option value="">Select category</option>
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
              <option value="Custom">Custom category</option>
            </select>
            {isCustomCategorySelected && (
              <input
                className="input"
                placeholder="Enter custom category"
                value={customCategory}
                onChange={(event) => setCustomCategory(event.target.value)}
              />
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                className="input"
                type="number"
                placeholder="Buy price"
                value={form.buyPrice}
                onChange={(event) => setForm((current) => ({ ...current, buyPrice: event.target.value }))}
              />
              <input
                className="input"
                type="number"
                placeholder="Rent price / day"
                value={form.rentPricePerDay}
                onChange={(event) => setForm((current) => ({ ...current, rentPricePerDay: event.target.value }))}
              />
              <input
                className="input"
                type="number"
                placeholder="Deposit amount"
                value={form.depositAmount}
                onChange={(event) => setForm((current) => ({ ...current, depositAmount: event.target.value }))}
              />
              <input
                className="input"
                type="number"
                placeholder="Stock"
                value={form.stock}
                onChange={(event) => setForm((current) => ({ ...current, stock: event.target.value }))}
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="button-primary flex-1" disabled={saving}>
                {saving ? "Saving..." : editingId ? "Update product" : "Add product"}
              </button>
              {editingId && (
                <button type="button" className="button-secondary flex-1" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="space-y-6">
          <div className="card p-6">
            <h2 className="font-display text-2xl text-white">Products</h2>
            {loading ? (
              <div className="mt-4">
                <Loader text="Loading products..." />
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {products.map((product) => (
                  <div key={product._id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-white">{product.name}</h3>
                        <p className="text-sm text-slate-400">
                          {formatCurrency(product.buyPrice)} buy / {formatCurrency(product.rentPricePerDay)} rent per day
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button type="button" className="button-secondary !px-4 !py-2" onClick={() => handleEdit(product)}>
                          Edit
                        </button>
                        <button
                          type="button"
                          className="button-primary !bg-rose-500 !px-4 !py-2 hover:!bg-rose-400"
                          onClick={() => handleDelete(product._id)}
                        >
                          Archive
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card p-6">
            <h2 className="font-display text-2xl text-white">Orders</h2>
            {loading ? (
              <div className="mt-4">
                <Loader text="Loading orders..." />
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {orders.map((order) => (
                  <div key={order._id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold text-white">
                        {order.user?.name || "Unknown user"} • {order.orderType.toUpperCase()}
                      </p>
                      <p className="text-sm text-slate-400">{formatDate(order.createdAt)}</p>
                    </div>
                    <p className="mt-2 text-sm text-slate-300">Status: {order.status}</p>
                    <p className="mt-1 text-sm text-slate-300">Total: {formatCurrency(order.totalAmount)}</p>
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

export default AdminDashboardPage;
