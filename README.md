# Cecil Sithole — Developer Portfolio

A modern portfolio website built with React, TypeScript, Tailwind CSS, and Framer Motion. Live at **[https://cecil-41.github.io/portfolio](https://cecil-41.github.io/portfolio)**.

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Routing | React Router v7 (HashRouter) |
| Icons | Lucide React |
| Markdown | ReactMarkdown + rehype-highlight |
| Deployment | GitHub Pages via gh-pages |

## 🚀 Getting Started

### Install dependencies
```bash
npm install
```

### Start development server
```bash
npm run dev
```
App runs at `http://localhost:5174`

### Build for production
```bash
npm run build
```

### Preview production build locally
```bash
npm run preview
```

### Lint
```bash
npm run lint
```

## 🌐 Deployment

This project is deployed to **GitHub Pages** using the `gh-pages` package.

### Deploy to GitHub Pages
```bash
npm run deploy
```

This command:
1. Runs `npm run build` automatically (via `predeploy` script)
2. Publishes the `dist/` folder to the `gh-pages` branch
3. GitHub Pages serves from that branch

### Routing Note
The app uses **HashRouter** (not BrowserRouter) to ensure all routes work correctly on GitHub Pages without requiring server-side configuration. URLs look like:
- `https://cecil-41.github.io/portfolio/#/blog`
- `https://cecil-41.github.io/portfolio/#/blog/vibe-coding`

### Vite Base Path
`vite.config.ts` is configured with `base: '/portfolio/'` to match the GitHub Pages repository path.

## 📋 Project Structure

```
src/
├── components/
│   ├── Navigation.tsx      # Sticky navbar with theme toggle & routing
│   ├── Hero.tsx            # Landing section
│   ├── Skills.tsx          # Technical skills with proficiency levels
│   ├── Experience.tsx      # Career timeline
│   ├── Projects.tsx        # Project gallery
│   ├── Qualifications.tsx  # Certifications & education
│   ├── Testimonials.tsx    # Recommendations
│   ├── Stats.tsx           # Key stats/numbers
│   ├── Blog.tsx            # Homepage blog section (6 recent posts)
│   ├── BlogList.tsx        # All articles page (/blog)
│   ├── BlogPost.tsx        # Individual article page (/blog/:slug)
│   ├── Contact.tsx         # Contact form & footer
│   ├── SEO.tsx             # Dynamic meta tags for social sharing
│   ├── ScrollProgress.tsx  # Reading progress bar
│   ├── BackToTop.tsx       # Back to top button
│   └── SkeletonLoader.tsx  # Loading states
├── data/
│   ├── blogs.json          # Blog posts (Markdown content)
│   ├── experiences.json    # Work experience
│   ├── projects.json       # Portfolio projects
│   ├── qualifications.json # Certifications & education
│   ├── skills.json         # Technical skills
│   └── testimonials.json   # Recommendations
├── hooks/
│   └── useTheme.tsx        # Dark/light mode management
├── App.tsx                 # Root routing (HashRouter)
├── main.tsx                # Entry point
└── index.css               # Global styles
```

## ✨ Features

- **Light/Dark Mode** — Persistent theme toggle
- **Blog with Routing** — Slug-based URLs, Markdown rendering, syntax highlighting
- **Breadcrumb Navigation** — Home / All Articles / Article (hidden on mobile)
- **Reading Progress Bar** — Fixed bar at top of blog posts
- **SEO & Open Graph** — Dynamic meta tags per blog post for social sharing
- **Share Button** — Native share API with clipboard fallback
- **Responsive Design** — Mobile, tablet, and desktop optimized
- **Animations** — Framer Motion throughout

## 📝 Adding Blog Posts

Blog posts live in `src/data/blogs.json`. Each post supports full Markdown with code blocks.

```json
{
  "id": 6,
  "title": "Your Post Title",
  "excerpt": "Short description shown on cards.",
  "date": "2026-03-17",
  "author": "Cecil",
  "readTime": 5,
  "category": "AI",
  "image": "https://...",
  "slug": "your-post-slug",
  "content": "# Heading\n\nYour markdown content here.",
  "references": [
    { "title": "Link Title", "url": "https://...", "description": "Description" }
  ]
}
```

After adding, run `npm run deploy` to publish.

## 🎨 Theme Colors

- **Purple** `purple-400` — Primary accent
- **Pink** `pink-500` — Secondary accent
- **Cyan** `cyan-300` — Tertiary accent

## 📦 Key Dependencies

```json
"dependencies": {
  "react": "^19.2.0",
  "react-router-dom": "^7.11.0",
  "react-markdown": "^10.1.0",
  "rehype-highlight": "^7.0.2",
  "highlight.js": "^11.11.1",
  "react-icons": "^5.5.0"
},
"devDependencies": {
  "framer-motion": "^12.x",
  "lucide-react": "^0.562.0",
  "tailwindcss": "^4.x",
  "vite": "^7.x",
  "gh-pages": "^6.3.0",
  "typescript": "~5.9.3"
}
```

## 📄 License

MIT

---

**Built with React, Tailwind CSS, Framer Motion, and deployed on GitHub Pages.**
