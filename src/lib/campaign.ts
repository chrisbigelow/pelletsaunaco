// Founders' pre-order offer, shared by the product page and the nav.
export const campaign = {
  /** Regular price after the founders' batch, shown struck through next to the founders' price. */
  fullPrice: 3995,
  /** Founders' price for early reservations. */
  price: 3250,
  /** Refundable amount charged today. */
  deposit: 100,
  /** Stoves in the first batch at the founders' price. */
  batchSize: 100,
  /** Deposits received so far. Update as reservations come in; it drives the progress bars. */
  reserved: 0,
  /** When the remaining balance is charged. */
  productionMonth: 'June',
};

export const savings = campaign.fullPrice - campaign.price;
export const balance = campaign.price - campaign.deposit;

export const usd = (n: number) => `$${n.toLocaleString('en-US')}`;
// No-JS fallback for Reserve links; with JS, [data-preorder] links open the Stripe deposit pop-up (PreorderModal).
export const reserveHref = `/?subject=${encodeURIComponent('P1 pre-order reservation')}#contact`;
