import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FormWidgetConfig {
  id: string;
  type: string;
  label: string;
  field: string;
  props: Record<string, any>;
  rules?: any[];
}

interface FormDesignerState {
  widgets: FormWidgetConfig[];
  selectedId: string | null;
  history: {
    past: FormWidgetConfig[][];
    future: FormWidgetConfig[][];
  };
}

const initialState: FormDesignerState = {
  widgets: [],
  selectedId: null,
  history: {
    past: [],
    future: []
  }
};

export const formDesignerSlice = createSlice({
  name: 'formDesigner',
  initialState,
  reducers: {
    addWidget: (state, action: PayloadAction<FormWidgetConfig>) => {
      state.widgets.push(action.payload);
    },
    updateWidget: (state, action: PayloadAction<FormWidgetConfig>) => {
      const index = state.widgets.findIndex(w => w.id === action.payload.id);
      if (index !== -1) {
        state.widgets[index] = action.payload;
      }
    },
    removeWidget: (state, action: PayloadAction<string>) => {
      state.widgets = state.widgets.filter(w => w.id !== action.payload);
    },
    setSelectedId: (state, action: PayloadAction<string | null>) => {
      state.selectedId = action.payload;
    },
    moveWidget: (state, action: PayloadAction<{ sourceIndex: number; destinationIndex: number }>) => {
      const { sourceIndex, destinationIndex } = action.payload;
      const [removed] = state.widgets.splice(sourceIndex, 1);
      state.widgets.splice(destinationIndex, 0, removed);
    },
    clearWidgets: (state) => {
      state.widgets = [];
      state.selectedId = null;
    },
    undo: (state) => {
      if (state.history.past.length > 0) {
        const previous = state.history.past[state.history.past.length - 1];
        state.history.past = state.history.past.slice(0, -1);
        state.history.future = [state.widgets, ...state.history.future];
        state.widgets = previous;
      }
    },
    redo: (state) => {
      if (state.history.future.length > 0) {
        const next = state.history.future[0];
        state.history.future = state.history.future.slice(1);
        state.history.past = [...state.history.past, state.widgets];
        state.widgets = next;
      }
    }
  }
});

export const { addWidget, updateWidget, removeWidget, setSelectedId, moveWidget } = formDesignerSlice.actions;

export default formDesignerSlice.reducer;