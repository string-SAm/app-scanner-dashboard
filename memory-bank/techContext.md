# Technical Context: App Scanner Dashboard

## Technology Stack

### Core Framework
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Type-safe development with comprehensive type definitions
- **Vite**: Fast build tool and development server

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography
- **Custom Color System**: Severity-based color coding

### Data Visualization
- **Recharts**: React charting library for data visualization
- **Responsive Charts**: Mobile-friendly chart components

### State Management
- **React Context API**: Global state management
- **useReducer**: Complex state logic management
- **Custom Hooks**: Reusable stateful logic

### Performance
- **React Window**: Virtualization for large datasets
- **React Window Infinite Loader**: Infinite scrolling support
- **Memoization**: Performance optimization with useMemo/useCallback

### Development Tools
- **ESLint**: Code linting and quality enforcement
- **TypeScript Compiler**: Type checking and compilation
- **PostCSS**: CSS processing and autoprefixing

## Project Structure
```
app-scanner-dashboard/
├── package.json              # Dependencies and scripts
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── postcss.config.js        # PostCSS configuration
├── index.html               # HTML entry point
├── src/
│   ├── types/index.ts       # TypeScript type definitions
│   ├── lib/parser.ts        # JSON parsing logic
│   ├── context/AppContext.tsx # State management
│   ├── hooks/useAppSelectors.ts # Data selectors
│   ├── components/          # Reusable UI components
│   ├── charts/             # Chart components
│   ├── features/           # Feature pages
│   └── styles/globals.css  # Global styles
└── vulnerability_analysis.json # Sample data file
```

## Dependencies

### Production Dependencies
- `react`: ^18.2.0
- `react-dom`: ^18.2.0
- `react-router-dom`: ^6.8.1
- `recharts`: ^2.8.0
- `react-window`: ^1.8.6
- `react-window-infinite-loader`: ^1.0.7
- `clsx`: ^2.0.0
- `date-fns`: ^2.29.3
- `lucide-react`: ^0.263.1

### Development Dependencies
- `@types/react`: ^18.2.15
- `@types/react-dom`: ^18.2.7
- `@types/react-window`: ^1.8.5
- `@vitejs/plugin-react`: ^4.0.3
- `typescript`: ^5.0.2
- `vite`: ^4.4.5
- `tailwindcss`: ^3.3.3
- `autoprefixer`: ^10.4.14
- `postcss`: ^8.4.27

## Build Configuration

### Vite Configuration
- React plugin for JSX support
- TypeScript support
- Hot module replacement
- Optimized production builds

### TypeScript Configuration
- Strict type checking enabled
- Path mapping for clean imports (@/ alias)
- ES2020 target with modern features

### Tailwind Configuration
- Custom color palette for severity levels
- Responsive breakpoints
- Custom component styles

## Development Workflow
1. `npm run dev`: Start development server
2. `npm run build`: Build for production
3. `npm run preview`: Preview production build
4. `npm run lint`: Run ESLint
5. `npm run type-check`: Run TypeScript compiler

## Performance Considerations
- Virtualized tables for large datasets
- Memoized selectors and computations
- Lazy loading of components
- Optimized bundle splitting
- Efficient re-rendering strategies

## Browser Support
- Modern browsers with ES2020 support
- Chrome 80+, Firefox 72+, Safari 13+
- Mobile responsive design
- Touch-friendly interface
