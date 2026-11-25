# Galaxy Real Estate — Premium Homepage (GitHub Pages Ready)

A custom, mobile-first homepage redesign demo for **Galaxy Real Estate** (West London estate agents), built as a plain static site for GitHub Pages. No build step, no backend.

## Live preview
Open `index.html` locally, or deploy this repository with GitHub Pages (Settings → Pages → Deploy from branch → `main` / root). The homepage loads from `index.html` with relative paths throughout.

## Project structure
```
index.html
css/style.css
js/script.js
assets/
  images/   hero, property & lifestyle photography (optimised JPG)
  logo/     logo.svg, logo-light.svg, favicon.svg (+ original-reference.jpg)
  icons/    inline SVG icons used in markup
.nojekyll
```

## Business details used (from galaxyrealestate.co.uk + public listings)
- **Name:** Galaxy Real Estate — independently owned, West London (founded 2016)
- **Head office:** 1-3 Uxbridge Road, Hayes UB4 0JN · Southall UB2 · Finsbury Park N4 · Slough SL1
- **Phone:** 020 8004 1111 · **Email:** info@galaxyrealestate.co.uk
- **Hours:** Mon–Fri 9:30am–6:30pm, Sat 10am–5pm
- **Services:** Residential sales, lettings & management, commercial (leasehold/freehold/rentals), investment, mortgage & finance, interior design
- **Brand:** Orange `#F26522` + charcoal `#1E2A30` from the original Galaxy logo (orange “G” + house + orbit ring), recreated as a crisp transparent SVG. Fonts: Manrope (headings) + Inter (body).
- **Featured listings & reviews** use real Galaxy instructions and client words from the archived site (Jan 2025). Property photographs are representative West London stock imagery — full photo sets available on request.
- The live site was under construction at research time; archived homepage content was used for services, areas, listings and testimonials. No contact details were invented.

## Features
- Sticky header + full-screen mobile menu, hero property search (Buy / Rent / Commercial) with live filtering
- Property filter tabs, testimonial slider (touch + auto), FAQ accordion
- Valuation form hands off via `mailto:` with pre-filled details (no backend on a static demo — no fake success message)
- Floating call button, back-to-top, and a mobile bottom action bar (Call / Valuation / Homes)
- Mobile-first responsive: tested layouts at 360 / 390 / 430 / 768 / 1024 / 1280 / 1440px, no horizontal overflow, 48px+ touch targets, safe-area padding

## SEO / demo note
`noindex, nofollow` is set so this demo does not compete with the live galaxyrealestate.co.uk in search results. Remove it when this becomes the production site.
