# Contributing to Charis Foundation Board Portal

Thank you for your interest in contributing to this project!

## Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dashboard-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env`
   - Add your Clerk API keys from https://dashboard.clerk.com

4. **Start development server**
   ```bash
   npm run dev
   ```

## Project Structure

```
dashboard-app/
├── src/
│   ├── pages/           # Route pages
│   ├── components/      # Reusable components
│   ├── layouts/         # Layout templates
│   └── middleware.ts    # Auth middleware
├── docs/                # Additional documentation
├── public/              # Static assets
└── README.md            # Main documentation
```

## Making Changes

1. Create a new branch for your feature
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes

3. Test your changes
   ```bash
   npm run dev
   npm run build
   ```

4. Commit with clear messages
   ```bash
   git add .
   git commit -m "Add: brief description of changes"
   ```

5. Push and create a pull request
   ```bash
   git push origin feature/your-feature-name
   ```

## Code Standards

- Use TypeScript for type safety
- Follow existing code formatting
- Keep components focused and reusable
- Add comments for complex logic
- Test authentication flows

## Documentation

- Update README.md for major changes
- Add comments to complex functions
- Update relevant documentation in /docs

## Questions?

Contact the Charis Foundation team for questions about requirements or features.
