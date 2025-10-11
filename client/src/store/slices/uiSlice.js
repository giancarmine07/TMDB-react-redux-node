/**
 * Slice UI
 * Slice Redux per lo stato dell'interfaccia utente (tema, modali, toast, sidebar)
 */

import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS, THEMES } from '../../constants';

// Ottieni il tema iniziale dal localStorage o dalle preferenze di sistema
const getInitialTheme = () => {
  const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
  if (savedTheme) {
    return savedTheme;
  }

  // Controlla le preferenze di sistema
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return THEMES.DARK;
  }

  return THEMES.LIGHT;
};

// Stato iniziale
const initialState = {
  theme: getInitialTheme(),
  sidebarOpen: false,
  modal: {
    isOpen: false,
    type: null,
    data: null,
  },
  toast: {
    show: false,
    message: '',
    type: 'info', // 'success', 'error', 'warning', 'info'
    duration: 3000,
    id: null,
  },
  loading: {
    global: false,
    message: '',
  },
};

// Slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Tema
    toggleTheme: (state) => {
      state.theme = state.theme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
      localStorage.setItem(STORAGE_KEYS.THEME, state.theme);

      // Applica il tema al documento
      if (state.theme === THEMES.DARK) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem(STORAGE_KEYS.THEME, action.payload);

      // Applica il tema al documento
      if (action.payload === THEMES.DARK) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },

    // Sidebar
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    openSidebar: (state) => {
      state.sidebarOpen = true;
    },
    closeSidebar: (state) => {
      state.sidebarOpen = false;
    },

    // Modale
    openModal: (state, action) => {
      state.modal = {
        isOpen: true,
        type: action.payload.type,
        data: action.payload.data || null,
      };
    },
    closeModal: (state) => {
      state.modal = {
        isOpen: false,
        type: null,
        data: null,
      };
    },
    setModalData: (state, action) => {
      state.modal.data = action.payload;
    },

    // Toast
    showToast: (state, action) => {
      state.toast = {
        show: true,
        message: action.payload.message,
        type: action.payload.type || 'info',
        duration: action.payload.duration || 3000,
        id: Date.now(),
      };
    },
    hideToast: (state) => {
      state.toast.show = false;
    },
    clearToast: (state) => {
      state.toast = {
        show: false,
        message: '',
        type: 'info',
        duration: 3000,
        id: null,
      };
    },

    // Caricamento globale
    setGlobalLoading: (state, action) => {
      state.loading.global = true;
      state.loading.message = action.payload || '';
    },
    clearGlobalLoading: (state) => {
      state.loading.global = false;
      state.loading.message = '';
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  toggleSidebar,
  openSidebar,
  closeSidebar,
  openModal,
  closeModal,
  setModalData,
  showToast,
  hideToast,
  clearToast,
  setGlobalLoading,
  clearGlobalLoading,
} = uiSlice.actions;

// Selettori
export const selectUI = (state) => state.ui;
export const selectTheme = (state) => state.ui.theme;
export const selectIsDarkMode = (state) => state.ui.theme === THEMES.DARK;
export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectModal = (state) => state.ui.modal;
export const selectModalIsOpen = (state) => state.ui.modal.isOpen;
export const selectModalType = (state) => state.ui.modal.type;
export const selectModalData = (state) => state.ui.modal.data;
export const selectToast = (state) => state.ui.toast;
export const selectToastShow = (state) => state.ui.toast.show;
export const selectGlobalLoading = (state) => state.ui.loading;

export default uiSlice.reducer;
