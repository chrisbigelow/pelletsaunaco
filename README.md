# The Pellet Sauna Co. - P1 Landing Page

A modern, sophisticated landing page for the P1 pellet sauna stove, built with Astro.js.

## Design Features

- **Modern & Sophisticated**: Clean design with smooth animations and gradients
- **Product-Centric**: P1 stove front and center in the hero section
- **Color Palette**: Wood tones (browns, warm neutrals) combined with green mossy nature colors
- **Responsive**: Fully responsive design that works on all devices

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

## Customization

### Adding Your Product Images

Replace the placeholder images in the following locations:

1. **Hero Product Image**: The main P1 stove rendering
   - Located in the `.product-image` section
   - Replace the `.image-placeholder` div with your image
   - Recommended size: 600x600px minimum

2. **Product Card Image**: Smaller thumbnail
   - Located in the `.product-card-image` section
   - Replace the `.small-placeholder` div
   - Recommended size: 400x225px (16:9 aspect ratio)

3. **About Section Image**: Nature/lifestyle imagery
   - Located in the `.about-image` section
   - Replace the `.image-placeholder-large` div
   - Recommended size: 800x600px

### Color Customization

All colors are defined as CSS variables in `src/layouts/BaseLayout.astro`. Modify these to adjust the color scheme:

- Wood tones: `--wood-dark`, `--wood-medium`, `--wood-light`, etc.
- Moss/green tones: `--moss-dark`, `--moss-medium`, `--moss-light`, etc.
- Accent colors: `--gold`, `--copper`

### Content Updates

Edit the content directly in `src/pages/index.astro`:

- Navigation links
- Hero section text
- Features descriptions
- About section content
- Contact form

## Project Structure

```
/
├── public/          # Static assets (add your images here)
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro
│   └── pages/
│       └── index.astro
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## Technology Stack

- **Astro.js**: Fast, modern static site builder
- **Pure CSS**: No external CSS frameworks for better performance
- **Google Fonts**: Inter font family for clean typography

## Performance

This site is built with performance in mind:
- Zero JavaScript by default (Astro islands architecture)
- Optimized CSS
- Fast page loads
- SEO-friendly

## License

Copyright © 2025 The Pellet Sauna Co. All rights reserved.
