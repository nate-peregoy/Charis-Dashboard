# Charis Foundation Board Dashboard

A modern, responsive dashboard application built specifically for the Charis Foundation Board of Directors. Built with Astro, React, ShadCN UI, and TailwindCSS, featuring Charis Foundation's brand colors and mission-focused content.

## About Charis Foundation

The mission of the Charis Foundation is to participate in God's work in the world by offering financial, strategic and operational support in collaboration with Christian organizations and their leaders.

## Dashboard Features

- **Grantmaking Overview** - Track total grants, active partners, applications, and foundation assets
- **Recent Activity Feed** - Monitor ministry leadership development, faith & work initiatives, and international missions
- **Strategic Programs** - View grant distribution across key focus areas
- **Geographic Reach** - Track partner organizations by region (Nashville, US, International)
- **Mission Integration** - Dashboard reflects Charis Foundation's commitment to gospel-driven work

## Tech Stack

- **Astro 4.x** - Modern web framework
- **React 18** - UI library for interactive components
- **TailwindCSS 3.x** - Utility-first CSS framework
- **ShadCN UI** - Re-usable component library
- **TypeScript** - Type-safe development

## Project Structure

```
nonprofit-board-dashboard/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # ShadCN UI components
│   │   │   ├── card.tsx
│   │   │   ├── button.tsx
│   │   │   └── badge.tsx
│   │   ├── DashboardHeader.tsx
│   │   ├── StatCard.tsx
│   │   └── RecentActivity.tsx
│   ├── layouts/            # Astro layouts
│   │   └── Layout.astro
│   ├── lib/                # Utility functions
│   │   └── utils.ts
│   ├── pages/              # Astro pages (routes)
│   │   └── index.astro
│   └── styles/             # Global styles
│       └── globals.css
├── public/                 # Static assets
├── astro.config.mjs        # Astro configuration
├── tailwind.config.mjs     # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies

```

## Features

- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Key Metrics Display** - Shows important statistics like donations, programs, and volunteers
- **Recent Activity Feed** - Tracks latest initiatives and their status
- **Program Impact Overview** - Displays the reach and impact of nonprofit programs
- **Quick Links** - Easy access to important documents and resources

## Installation

1. Install dependencies:
```bash
npm install
```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:4321`

## Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Components

### UI Components (ShadCN)
- **Card** - Flexible container with header, content, and footer
- **Button** - Multiple variants (default, outline, ghost, etc.)
- **Badge** - Status indicators with color variants

### Dashboard Components
- **DashboardHeader** - Top navigation with title and action buttons
- **StatCard** - Displays key metrics with change indicators
- **RecentActivity** - Shows recent initiatives with status badges

## Customization

### Theme Colors
Edit `src/styles/globals.css` to customize the color scheme. The theme uses CSS variables that can be easily modified.

### Adding New Components
1. Create component in `src/components/`
2. Import in your page/layout
3. Add `client:load` directive for React components in Astro files

### Adding New Pages
Create new `.astro` files in `src/pages/` directory. The file structure becomes the URL structure.

## Future Enhancements

- Add authentication and user management
- Integrate with a backend API for real data
- Add data visualization with charts and graphs
- Implement filtering and sorting for activity feed
- Add export functionality for reports
- Create additional pages for detailed views (financials, programs, volunteers)

## License

MIT
