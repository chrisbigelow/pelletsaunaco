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
// Every Reserve button goes to the order page.
export const reserveHref = '/reserve';

/** What founders get with their reservation; shown on the product and order pages. */
export const founderPerks = [
  { icon: 'medal', title: 'Numbered founders’ medallion', body: 'A medallion stamped with your stove’s build number, mounted on the body of your stove.' },
  { icon: 'gift', title: 'Founders’ sauna hat', body: 'A wool sauna hat to keep your head cool on the top bench.' },
  { icon: 'users', title: 'Founders’ community', body: 'A private email list plus forum and chat with our team and fellow first-run owners.' },
] as const;
