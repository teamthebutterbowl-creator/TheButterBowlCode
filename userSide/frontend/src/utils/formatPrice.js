/** Shared INR price formatting across cart, checkout, and confirmation */
export function formatPrice(amount) {
  return `₹${Number(amount).toLocaleString('en-IN')}`;
}
