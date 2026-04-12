export const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(amount || 0);

export const formatDate = (value) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium"
  }).format(new Date(value));
