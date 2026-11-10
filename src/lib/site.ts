export const productPath = '/p1-pellet-sauna-stove';
export const aboutPath = '/about';

/** Long-form guides, linked from the footer, the home page, and each other. */
export const guides = [
  { href: '/how-pellet-sauna-stoves-work', title: 'How pellet sauna stoves work', footerLabel: 'How Pellet Stoves Work' },
  { href: '/pellet-sauna-stove-vs-electric', title: 'Pellet sauna stove vs electric heater', footerLabel: 'Pellet vs Electric' },
  { href: '/no-electrician-sauna-heater', title: 'P1 installation and electrical requirements', footerLabel: 'Installation & Electrical' },
] as const;

export const logoPaths = [
  'M428 322 A90 90 0 0 1 518 232 L628 232 L628 920 A100 100 0 0 1 528 1020 L428 1020 Z',
  'M655 232 L743 232 A115 115 0 0 1 858 347 L858 622 A115 115 0 0 1 743 737 L655 737 Z',
];

export const socialLinks = {
  instagram: 'https://www.instagram.com/pelletsaunaco/',
  facebook: 'https://www.facebook.com/people/Pellet-Sauna-Co/61596284911496/',
} as const;
