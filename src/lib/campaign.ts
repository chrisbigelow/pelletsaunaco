// Founders' pre-order offer, shared by the product page and the nav.
export const campaign = {
  /** Regular price after the founders' batch, shown struck through next to the founders' price. */
  fullPrice: 3995,
  /** Founders' price for early reservations. */
  price: 3250,
  /** Refundable amount charged today. */
  deposit: 100,
  /** When the remaining balance is charged. */
  productionMonth: 'June',
};

export const savings = campaign.fullPrice - campaign.price;
export const balance = campaign.price - campaign.deposit;

export const usd = (n: number) => `$${n.toLocaleString('en-US')}`;
// Swap for the Stripe Payment Link once deposits are taken online.
export const reserveHref = `/?subject=${encodeURIComponent('P1 pre-order reservation')}#contact`;
