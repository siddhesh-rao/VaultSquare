import { Link } from "react-router-dom";

const HomePage = () => (
  <div className="page-shell space-y-10">
    <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
      <div className="space-y-6">
        <div className="inline-flex rounded-full border border-brand-400/30 bg-brand-400/10 px-4 py-2 text-sm text-brand-200">
          Blockchain-backed rentals for premium gear
        </div>
        <h1 className="max-w-3xl font-display text-5xl font-bold tracking-tight text-white sm:text-6xl">
          Buy products instantly or rent them with on-chain agreements.
        </h1>
        <p className="max-w-2xl text-lg text-slate-300">
          Modern e-commerce for electronics, creator gear, and premium devices. Rent with deposits, wallet
          linking, and transparent order tracking from a single dashboard.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link to="/products" className="button-primary">
            Explore products
          </Link>
          <Link to="/register" className="button-secondary">
            Create account
          </Link>
        </div>
      </div>

      <div className="card overflow-hidden p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl bg-gradient-to-br from-brand-400/25 to-sky-400/10 p-5">
            <p className="text-sm text-slate-300">Wallet linked rentals</p>
            <h3 className="mt-3 font-display text-2xl text-white">MetaMask checkout</h3>
          </div>
          <div className="rounded-3xl bg-white/5 p-5">
            <p className="text-sm text-slate-400">Deposit protected</p>
            <h3 className="mt-3 font-display text-2xl text-white">On-chain agreements</h3>
          </div>
          <div className="rounded-3xl bg-white/5 p-5">
            <p className="text-sm text-slate-400">Flexible durations</p>
            <h3 className="mt-3 font-display text-2xl text-white">Daily rental pricing</h3>
          </div>
          <div className="rounded-3xl bg-gradient-to-br from-amber-400/20 to-rose-400/10 p-5">
            <p className="text-sm text-slate-300">Admin ready</p>
            <h3 className="mt-3 font-display text-2xl text-white">Products and orders</h3>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default HomePage;
