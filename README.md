# Senior Developer Portfolio

A modern, stunning portfolio website built with React, TypeScript, Tailwind CSS, and Framer Motion. Designed to showcase your skills, experience, projects, and insights as a senior software engineer.

## ✨ Features

### 🎨 Design
- **Light/Dark Mode Toggle** - Seamless theme switching with persistent storage
- **Vibrant Gradient Aesthetic** - Purple, Pink, and Cyan color scheme with glassmorphic effects
- **Responsive Design** - Fully optimized for mobile, tablet, and desktop
- **Modern Typography** - Creative use of varied font weights and sizes with Space Grotesk display font

### 🚀 Sections
1. **Navigation** - Sticky navbar with smooth scroll navigation and theme toggle
2. **Hero** - Full-viewport hero section with animated gradients, particles, and CTAs
3. **Skills** - Interactive skill showcase with category tabs and proficiency levels
4. **Experience** - Professional timeline with expandable career details and achievements
5. **Projects** - Feature-rich project gallery with filtering and tech stack display
6. **Blog** - Blog section with search, category filtering, and read time estimates
7. **Contact** - Contact form with social links and footer

### 🎭 Animations
- Smooth fade-in and slide animations with Framer Motion
- Animated gradient backgrounds and orbs
- Hover effects and micro-interactions throughout
- Scroll-triggered animations
- Glassmorphic card effects

### 🛠️ Tech Stack
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite with @tailwindcss/vite plugin
- **Styling**: Tailwind CSS with custom theme
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Theme Management**: Custom React Context Hook

## 📋 Project Structure

```
src/
├── components/          # Reusable components
│   ├── Navigation.tsx   # Top navbar with theme toggle
│   ├── Hero.tsx        # Landing section
│   ├── Skills.tsx      # Technical skills showcase
│   ├── Experience.tsx  # Career timeline
│   ├── Projects.tsx    # Project gallery
│   ├── Blog.tsx        # Blog section
│   └── Contact.tsx     # Contact form & footer
├── hooks/              # Custom React hooks
│   └── useTheme.tsx    # Dark mode theme management
├── data/              # Data files (expandable for dynamic content)
├── utils/             # Utility functions
├── App.tsx            # Main app component
├── main.tsx           # Entry point
└── index.css          # Global styles with Tailwind
```

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
The app will be available at `http://localhost:5174`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Lint Code
```bash
npm run lint
```

## 📝 Customization

### Update Your Information
- **Skills**: Edit `src/components/Skills.tsx` - Update skill names, proficiency levels, and categories
- **Experience**: Edit `src/components/Experience.tsx` - Add your career history
- **Projects**: Edit `src/components/Projects.tsx` - Showcase your work with images and links
- **Blog**: Edit `src/components/Blog.tsx` - Add your blog posts and articles
- **Contact**: Edit `src/components/Contact.tsx` - Update contact information and social links

### Customize Colors
The theme uses a vibrant gradient aesthetic with standard Tailwind colors:
- **Purple** (`purple-*`): Primary accent color (purple-400)
- **Pink** (`pink-*`): Secondary accent color (pink-500)
- **Cyan** (`cyan-*`): Tertiary accent color (cyan-300)

To change colors, edit `tailwind.config.js` and the color definitions in components.

### Add Blog Posts
Blog posts are currently configured as static data. To expand:
1. Create a `data/blog.ts` file with blog post data
2. Update `src/components/Blog.tsx` to import from the data file
3. Add Markdown support if needed

### Customize Fonts
Fonts are configured in `tailwind.config.js`:
- **Display Font**: Space Grotesk (headings)
- **Sans Font**: Inter (body text)

Update the `@import` URL in `src/index.css` to use different fonts.

## 🎯 Next Steps

1. **Personalize Content**
   - Update all component data with your actual information
   - Add your real projects and achievements
   - Include your contact information and social links

2. **Add Images**
   - Replace placeholder image URLs with your own
   - Add project screenshots
   - Include profile photos

3. **Deploy**
   - Build the project: `npm run build`
   - Deploy to Vercel, Netlify, or GitHub Pages

4. **Optional Enhancements**
   - Add real blog post management (Markdown support)
   - Integrate with GitHub API for live project data
   - Add form submission handling (email service)
   - Implement analytics tracking
   - Add SEO optimization

## 📱 Responsive Design

The portfolio is fully responsive with breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🎨 Dark Mode

Dark mode is implemented using Tailwind's `dark:` variant. The `useTheme` hook manages theme persistence and system preference detection.

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Deploy dist/ folder to Netlify
```

### GitHub Pages
Update `vite.config.ts` with your repository name as the base path.

## 📦 Key Dependencies

- `react` & `react-dom` - UI library
- `framer-motion` - Animations
- `lucide-react` - Icons
- `tailwindcss` - Styling
- `@tailwindcss/vite` - Tailwind Vite integration
- `typescript` - Type safety
- `vite` - Build tool

## 💡 Tips for Success

- Keep content concise and impactful
- Use quantifiable achievements in experience
- Regularly update with new projects
- Maintain consistent visual design
- Test across different devices
- Optimize images for web
- Keep animations performant

## 📄 License

MIT - Feel free to use this template for your portfolio!

---

**Built with ❤️ using React, Tailwind CSS, and Framer Motion**

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
