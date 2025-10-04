import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, AppData, FilterState, UIState } from '@/types';

// Action types
type AppAction =
  | { type: 'ADD_APP'; payload: AppData }
  | { type: 'SET_ACTIVE_APP'; payload: string }
  | { type: 'REMOVE_APP'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<FilterState> }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'SET_UI_STATE'; payload: Partial<UIState> }
  | { type: 'TOGGLE_THEME' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SELECTED_FINDING'; payload: string | undefined };

// Initial state
const initialState: AppState = {
  apps: {},
  activeAppId: undefined,
  filters: {
    severity: [],
    section: [],
    labels: [],
    search: '',
    filePath: undefined,
  },
  ui: {
    theme: 'light',
    sidebarOpen: true,
    selectedFindingId: undefined,
  },
};

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'ADD_APP':
      return {
        ...state,
        apps: {
          ...state.apps,
          [action.payload.meta.id]: action.payload,
        },
        activeAppId: action.payload.meta.id,
      };

    case 'SET_ACTIVE_APP':
      return {
        ...state,
        activeAppId: action.payload,
      };

    case 'REMOVE_APP':
      const newApps = { ...state.apps };
      delete newApps[action.payload];
      
      return {
        ...state,
        apps: newApps,
        activeAppId: state.activeAppId === action.payload ? undefined : state.activeAppId,
      };

    case 'SET_FILTERS':
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };

    case 'CLEAR_FILTERS':
      return {
        ...state,
        filters: {
          severity: [],
          section: [],
          labels: [],
          search: '',
          filePath: undefined,
        },
      };

    case 'SET_UI_STATE':
      return {
        ...state,
        ui: {
          ...state.ui,
          ...action.payload,
        },
      };

    case 'TOGGLE_THEME':
      return {
        ...state,
        ui: {
          ...state.ui,
          theme: state.ui.theme === 'light' ? 'dark' : 'light',
        },
      };

    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        ui: {
          ...state.ui,
          sidebarOpen: !state.ui.sidebarOpen,
        },
      };

    case 'SET_SELECTED_FINDING':
      return {
        ...state,
        ui: {
          ...state.ui,
          selectedFindingId: action.payload,
        },
      };

    default:
      return state;
  }
};

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

