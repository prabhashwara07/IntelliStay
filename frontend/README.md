# IntelliStay - AI-Powered Hotel Booking Platform

A modern hotel booking platform with AI-integrated search, similar to Booking.com but with intelligent natural language processing.

## Features

- 🤖 **AI-Powered Search**: Search for hotels using natural language instead of complex filters
- 🏨 **Beautiful UI**: Modern, responsive design with Tailwind CSS and shadcn/ui
- 🔐 **Authentication**: Secure user authentication with Clerk
- 📱 **Responsive**: Works perfectly on desktop and mobile devices
- 🎠 **Interactive Carousel**: Beautiful hotel image showcase
- 🌍 **Global Hotels**: Recommendations organized by country/region

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Authentication**: Clerk
- **Carousel**: Swiper.js
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Clerk Authentication:
   - Go to [Clerk Dashboard](https://dashboard.clerk.com/)
   - Create a new application
   - Copy your publishable key
   - Update `.env.local` file:
     ```
     VITE_CLERK_PUBLISHABLE_KEY=your_actual_publishable_key_here
     ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Project Structure

```
src/
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── Header.jsx        # Navigation header with auth
│   ├── HomeHero.jsx      # Hero section with AI search
│   ├── HotelRecommendations.jsx  # Hotel cards by country
│   └── Footer.jsx        # Site footer
├── App.jsx              # Main app component
├── main.jsx             # App entry point
└── index.css            # Global styles
```

## Key Components

### HomeHero
- Centered AI search input with natural language processing
- Interactive hotel image carousel
- Gradient background with decorative elements

### HotelRecommendations  
- Hotel cards organized by country
- Star ratings, amenities, and pricing
- Responsive grid layout

### Header
- IntelliStay branding
- Navigation links (About Us, Contact)
- Clerk authentication buttons/user menu

## Customization

### Adding Hotel Data
Update the `recommendations` array in `HotelRecommendations.jsx` with your hotel data.

### Styling
- Modify Tailwind classes for quick style changes
- Update `App.css` for custom component styles
- Customize the color scheme by updating the blue color variants

### AI Search Integration
The search input in `HomeHero.jsx` is ready for AI integration. Connect it to your preferred AI service (OpenAI, Anthropic, etc.) for natural language processing.

## Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your preferred hosting service (Vercel, Netlify, etc.)

## Next Steps

- [ ] Integrate AI search API (OpenAI/Anthropic)
- [ ] Connect to hotel booking backend (MERN stack)
- [ ] Add hotel detail pages
- [ ] Implement booking functionality
- [ ] Add user profiles and booking history
- [ ] Set up payment processing

## License

MIT License - feel free to use this for your own projects!+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
