# The Gesit Companies - Official Website

This repository contains the source code for the official website of The Gesit Companies, built with a focus on premium editorial design, high performance, and modern web standards.

## 🚀 Tech Stack

- **Core**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **CMS/Database**: [Supabase](https://supabase.com/) (for news and contact submissions)
- **Email**: [Resend](https://resend.com/) (for contact forms)

## ✨ Core Features

- **Dynamic News Room**: Integrated news system with categorized feeds and high-fidelity detail pages.
- **Career Management**: Centralized job listings portal for the entire Group.
- **Premium Business Segments**: Dedicated, highly-styled pages for Property, Trading & Services, Manufacturing, and Natural Resources.
- **Professional Philosophy Section**: A beautifully crafted section detailing the corporate origin and the "Yi Cheng" philosophy with custom calligraphic styling.
- **Interactive Image Gallery**: Smooth, animated galleries showcasing the Group's portfolio with optimized performance.
- **Secure Contact System**: Validated contact form with automatic database logging and email notifications.
- **Content Protection**: Custom-built image protection mechanisms (disabled context menus and drag-and-drop) to safeguard corporate assets.
- **SEO & Meta Management**: Automated dynamic title and meta tag updates for social sharing and search engine optimization on every route.
- **Smart UX**: Seamless "scroll-to-top" navigation and a responsive mobile-first experience.

## 📁 Project Structure

```text
src/
├── components/     # Reusable UI components (Navbar, Footer, etc.)
├── context/        # React Context for global state (News, Career)
├── lib/            # External service configurations (Supabase, Email)
├── pages/          # Individual page components
├── types/          # TypeScript definitions
├── App.tsx         # Main application component & routes
└── main.tsx        # Application entry point
```

## 🛠️ Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the root directory and add your keys (Supabase, Resend, etc.).

### Local Development

To start the development server:
```bash
npm run dev
```

To enable access from other devices on the same network:
```bash
npm run dev -- --host
```

### Production Build

To create an optimized production build:
```bash
npm run build
```

## ✨ Design Principles

- **Premium & Minimalist**: High use of whitespace and elegant typography.
- **Responsive**: Fully optimized for mobile, tablet, and desktop.
- **Dynamic**: Smooth entrance animations and micro-interactions.
- **Accessible**: Semantic HTML and clear navigation structures.

---

© 2026 The Gesit Companies. All rights reserved.
