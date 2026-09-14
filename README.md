# Red Bull — Official Experience Platform

A premium interactive website inspired by Oracle Red Bull Racing and the World of Red Bull, featuring Formula 1 (RB21), energy drinks, athletes, featured stories, events, culture, and interactive galleries.

## Features

- **Hero Formula 1 Experience**:
  - Interactive Oracle Red Bull Racing RB21 showcase
  - Locked studio spotlight and luxury F1 advertisement lighting
  - Live telemetry HUD, circuit schematics, and CAD blueprint design elements
  - Dynamic Golden Hour race mode toggle
- **Unified Red Bull Energy Trail**:
  - Gold, orange, and white glowing particle trail on cursor movement and page scroll
- **Full Product & Brand Showcase**:
  - Complete Energy Drinks line-up with vibrant interactive can stages
  - World of Red Bull featured stories
  - Official Red Bull events and athlete roster
  - Curated high-octane media gallery
- **Fluid Micro-Interactions**:
  - Smooth section transitions with deep navy and racing orange gradients
  - Staggered scroll reveal animations
  - Magnetic buttons with speed-line trails

## Tech Stack

- **HTML5**: Semantic, accessible structure
- **CSS3**: Modern CSS variables, glassmorphism, responsive flexbox & grid
- **JavaScript**: Pure Vanilla JS for 60fps animations and interactions

## Project Structure

`	ext
redbull/
├── assets/                  # Images, athletes, cans, vehicles, and icons
├── index.html               # Main landing page entry point
├── style.css                # Master styling and animations
├── script.js                # Interactions, particle engine, and theme toggles
├── .gitignore               # Ignored dependencies and cache files
├── LICENSE                  # MIT License
└── README.md                # Project documentation
`

## Getting Started

Open index.html directly in any modern web browser, or serve it locally using any static file server:

`ash
# Using Python
python -m http.server 3000

# Using Node.js (npx)
npx serve .
`

## Deployment

This website is a zero-config static site. It can be deployed instantly to:

- **Vercel**: Import repository and deploy with default settings (Root directory: ./).
- **Netlify**: Connect repository and set publish directory to . or root.
- **GitHub Pages**: Enable Pages under repository settings pointing to main branch root.

## License

This project is available under the MIT License. See [LICENSE](LICENSE) for details.
