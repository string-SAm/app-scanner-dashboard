# System Patterns: App Scanner Dashboard

## Architecture Overview
The application follows a clean, modular React architecture with clear separation of concerns:

```
src/
├── types/           # Domain models and TypeScript definitions
├── lib/            # Business logic (JSON parser)
├── context/        # State management (React Context + reducers)
├── hooks/          # Custom hooks for data selection
├── components/     # Reusable UI components
├── charts/         # Chart components (Recharts)
├── features/       # Feature-specific pages
└── styles/         # Global styles and Tailwind configuration
```

## Key Design Patterns

### 1. Domain-Driven Design
- **Types**: Comprehensive TypeScript definitions for all domain entities
- **Parser**: Converts raw JSON to normalized domain objects
- **Selectors**: Custom hooks for data access and filtering

### 2. State Management Pattern
- **Context API**: Global state management with React Context
- **Reducer Pattern**: Immutable state updates with useReducer
- **Action Creators**: Centralized action creation functions

### 3. Component Architecture
- **Composition over Inheritance**: Small, focused components
- **Props Interface**: Clear TypeScript interfaces for all props
- **Custom Hooks**: Reusable logic extraction

### 4. Data Flow Pattern
```
JSON Upload → Parser → Context Store → Selectors → Components
```

## Core Components

### Parser (`lib/parser.ts`)
- Converts raw vulnerability analysis JSON to normalized domain objects
- Handles complex nested structures and dynamic rule-based findings
- Generates unique IDs and maps data to consistent types

### Context (`context/AppContext.tsx`)
- Manages global application state
- Handles app data, filters, and UI state
- Provides action creators for state updates

### Selectors (`hooks/useAppSelectors.ts`)
- Custom hook for data access and filtering
- Memoized computations for performance
- Provides filtered data to components

### Components
- **Card**: Reusable container component
- **DataTable**: Virtualized table for large datasets
- **SecurityScore**: Circular progress gauge
- **SeverityBadge**: Color-coded severity indicators
- **Charts**: Recharts-based visualization components

## Data Structures

### Core Entities
- **AppData**: Complete app analysis data
- **Finding**: Individual security finding
- **AppMeta**: App metadata and basic info
- **AppSummary**: Aggregated statistics and metrics

### State Management
- **AppState**: Global application state
- **FilterState**: Current filter configuration
- **UIState**: UI-specific state (theme, sidebar, etc.)

## Performance Considerations
- **Virtualization**: React Window for large tables
- **Memoization**: useMemo for expensive computations
- **Lazy Loading**: Components loaded on demand
- **Efficient Filtering**: Optimized filter functions

## Styling Approach
- **Tailwind CSS**: Utility-first CSS framework
- **Custom Color System**: Severity-based color coding
- **Responsive Design**: Mobile-first approach
- **Component Variants**: Consistent styling patterns
