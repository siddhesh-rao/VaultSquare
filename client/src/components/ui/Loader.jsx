const Loader = ({ text = "Loading..." }) => (
  <div className="flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-6 text-sm text-slate-300">
    <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-400 border-t-transparent" />
    <span>{text}</span>
  </div>
);

export default Loader;
