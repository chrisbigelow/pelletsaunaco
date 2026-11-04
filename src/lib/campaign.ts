// Pre-order campaign, shared by the product page and the site-wide campaign bar.
// Update `reserved` as deposits come in, and set `endsAt` (e.g. '2027-01-15')
// when the 60-day campaign starts to show a live countdown.
export const campaign = {
  goal: 100,
  reserved: 0,
  /** Regular price after the founders' run, shown struck through next to tier prices. */
  fullPrice: 3995,
  lengthDays: 60,
  endsAt: null as string | null,
  /** When the remaining balance is charged. */
  productionMonth: 'June',
};

export const tiers = [
  { name: 'Tier 1', first: 1, last: 20, price: 3250, deposit: 100 },
  { name: 'Tier 2', first: 21, last: 50, price: 3500, deposit: 100 },
  { name: 'Tier 3', first: 51, last: 100, price: 3750, deposit: 100 },
].map((tier) => {
  const size = tier.last - tier.first + 1;
  const claimed = Math.min(Math.max(campaign.reserved - (tier.first - 1), 0), size);
  return { ...tier, size, claimed, left: size - claimed };
});

export const currentTier = tiers.find((tier) => tier.left > 0);
/** Amount down today: the current tier's deposit, or the last tier's once the founders' run is full. */
export const deposit = (currentTier ?? tiers[tiers.length - 1]).deposit;

export const usd = (n: number) => `$${n.toLocaleString('en-US')}`;
export const reserveHref = `/?subject=${encodeURIComponent('P1 pre-order reservation')}#contact`;
