# The Pellet Sauna Co. - P1 Landing Page

A modern, sophisticated landing page for the P1 pellet sauna stove, built with Astro.js. Features a clean, minimalist design with light blue-gray tones, natural wood colors, and a product-centric layout.

## Design Features

- **Modern & Clean**: Minimal design with light, airy aesthetics
- **Product-Centric**: P1 stove prominently featured in the hero section
- **Color Palette**:
  - Light blue-gray atmospheric tones (inspired by the stove rendering background)
  - Natural wood tones (warm, light woods)
  - Charcoal stove colors
  - Fire glow accents (orange/red)
- **Responsive**: Fully responsive design that works on all devices
- **Performance-Focused**: Zero JavaScript by default, fast loading

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Adding Your P1 Stove Image

### Main Product Image (Hero Section)

1. Save your P1 stove rendering as `p1-stove.png` in the `/public` folder
2. The image will automatically display in the hero section
3. Recommended format: PNG with transparent background
4. Recommended size: At least 1200px wide for best quality

**Note**: The page includes a placeholder that will show until you add your image to `/public/p1-stove.png`

### Additional Images

You can replace other placeholder images throughout the page:

1. **Sauna Interior View** (Product Highlight section)
   - Shows the P1 in a sauna setting
   - Recommended size: 800x600px

2. **Technical Drawing** (Specifications section)
   - Detail shot or technical illustration
   - Recommended size: 800x600px

3. **Nature Scene** (About section)
   - Nature-inspired imagery, wood textures, or lifestyle shots
   - Recommended size: 800x600px

To add these images, edit `/src/pages/index.astro` and replace the `.placeholder-box` divs with `<img>` tags.

## Color Customization

All colors are defined as CSS variables in `src/layouts/BaseLayout.astro`:

```css
--wood-natural: #d4a574;    /* Natural wood color */
--sky-light: #a8b8c4;       /* Light blue-gray */
--stove-dark: #3a4145;      /* Charcoal stove */
--fire-glow: #ff6b4a;       /* Orange fire glow */
/* ...and more */
```

Simply modify these values to adjust the entire site's color scheme.

## Content Updates

Edit the content directly in `src/pages/index.astro`:

- **Navigation**: Update links in the `<nav>` section
- **Hero Text**: Modify the P1 description and philosophy
- **Stats**: Update ratings, review counts, etc.
- **Features**: Add or modify feature cards
- **Specifications**: Update technical specs in the table
- **About**: Edit company story and mission
- **Contact**: Customize form fields

## Project Structure

```
/
├── public/              # Static assets
│   └── p1-stove.png    # Add your main product image here
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro  # Base layout with color variables
│   └── pages/
│       └── index.astro       # Main landing page
├── astro.config.mjs
├── package.json
└── README.md
```

## Technology Stack

- **Astro.js 4.0**: Modern static site builder
- **Pure CSS**: No external frameworks for better performance
- **Google Fonts (Inter)**: Clean, professional typography
- **Zero JavaScript**: Fast, accessible by default

## Sections

The landing page includes:

1. **Hero Section** - Large P1 title with product image and CTA buttons
2. **Product Highlight** - Feature list with detailed benefits
3. **Features Grid** - Four key features with icons
4. **Specifications** - Technical details in a clean table
5. **About Section** - Company story and mission
6. **Contact Form** - Professional contact form with validation
7. **Footer** - Links and copyright information

## Performance

- ⚡ Zero JavaScript by default
- 🎨 Optimized CSS
- 📱 Mobile-first responsive design
- ♿ Accessible markup
- 🔍 SEO-friendly

## Email (Resend)

The email list, welcome email, and contact form run on [Resend](https://resend.com) through two Vercel Functions in `/api` (the Astro site itself stays fully static):

| Endpoint | Used by | What it does |
| --- | --- | --- |
| `POST /api/subscribe` | Footer signup form | Adds the email to Resend Contacts + the list segment, sends the welcome email (first signup only) |
| `POST /api/contact` | Contact form | Emails the message to every address in `CONTACT_INBOX` (comma-separated) (reply goes to the sender); if "Add me to the email list" is checked, also subscribes them |

Shared code lives in `src/lib/email/` (`subscribers.ts`, `send.ts`). The only email built in code is the internal contact-form notification (`templates/contact-notification.ts`).

### Setup

1. In Resend, verify the `pelletsauna.com` domain (Domains → add DNS records).
2. Create a segment for the list (e.g. "Newsletter") and copy its ID.
3. Create an API key with full access (contacts + sending).
4. Add the variables from `.env.example` to the Vercel project (Settings → Environment Variables), then redeploy.

**Email templates (in Resend):**
- **Campaigns:** Broadcasts → "★ TEMPLATE — Campaign (duplicate me)". Duplicate it for each campaign, edit the text in the visual editor, and send to the newsletter segment.
- **Welcome email:** Templates → "Welcome — new email list signup" (alias `welcome-email`). `/api/subscribe` sends it with a `NAME` variable. Its wording lives only in Resend: edit it there and re-publish. It must be published or no welcome email is sent.
- Brand images for emails live in `public/email/` (header lockup rendered from the site logo in Instrument Serif, and the footer landscape).

Campaigns are sent from Resend → Broadcasts to the list segment; Resend adds the unsubscribe link and keeps contacts' unsubscribe status in sync.

### Local testing

`npm run dev` serves pages only. To exercise `/api/*` locally, use the Vercel CLI with a `.env.local` file:

```bash
npm i -g vercel && vercel link && vercel dev
```

## Deployment

This Astro site can be deployed to:

- **Netlify**: `npm run build` → Deploy `dist/` folder
- **Vercel**: Connect repo and auto-deploy
- **GitHub Pages**: Use Astro's GitHub Pages adapter
- **Any static host**: Upload the `dist/` folder after building

## Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

Copyright © 2025 The Pellet Sauna Co. All rights reserved.
